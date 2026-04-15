

import React, { useCallback, useEffect, useRef, useState } from "react";
import { UploadSection } from "../components/UploadSelection";
import { HistoryTable } from "../components/HistoryTable";
import { autoScriptService, extractScriptId } from "../services/service";
import { JMXRecord } from "../types/type";
import { Activity } from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AppSnackbar, { SnackbarType } from "@/components/AppSnackbar";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store/snackbarStore"; // adjust path


const POLLING_CONFIG = {
  INITIAL_INTERVAL: 1000,      // Start with 1s for quick feedback
  MAX_INTERVAL: 5000,          // Cap at 5s to balance freshness vs load
  BACKOFF_MULTIPLIER: 1.5,     // Increase by 50% each time
  MAX_DURATION: 300000,        // Stop after 5 minutes (safety timeout)
};

const calculateNextInterval = (currentInterval: number): number => {
  const next = currentInterval * POLLING_CONFIG.BACKOFF_MULTIPLIER;
  return Math.min(next, POLLING_CONFIG.MAX_INTERVAL);
};

const isRunningStatus = (status: string): boolean => {
  const running = ['pending', 'in_progress', 'processing', 'queued'];
  return running.includes(status.toLowerCase());
};

const isTerminalStatus = (status: string): boolean => {
  const terminal = ['completed', 'success', 'failed', 'error', 'cancelled'];
  return terminal.includes(status.toLowerCase());
};


export interface StoredFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

// Convert File → Base64
const fileToBase64 = (file: File): Promise<StoredFile> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error("Invalid file type"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result as string,
      });

    reader.onerror = reject;
  });
};

// Convert Base64 → File
const base64ToFile = (storedFile: StoredFile): File => {
  const byteString = atob(storedFile.data.split(",")[1]);
  const mimeString = storedFile.data.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], storedFile.name, {
    type: mimeString || storedFile.type,
  });
};

// Save files to localStorage
const saveFilesToLocalStorage = async (
  key: string,
  files: File[]
) => {
  if (!files || files.length === 0) {
    localStorage.removeItem(key);
    return;
  }

  const validFiles = files.filter(
    (file): file is File => file instanceof File
  );

  const storedFiles = await Promise.all(
    validFiles.map(fileToBase64)
  );

  localStorage.setItem(key, JSON.stringify(storedFiles));
};

// Load files from localStorage
const loadFilesFromLocalStorage = (key: string): File[] => {
  const storedFiles = localStorage.getItem(key);
  if (!storedFiles) return [];

  try {
    const parsedFiles: StoredFile[] = JSON.parse(storedFiles);
    return parsedFiles
      .filter(file => file?.data && file?.name)
      .map(base64ToFile);
  } catch (error) {
    console.error("Error restoring files:", error);
    localStorage.removeItem(key);
    return [];
  }
};

const FILE1_STORAGE_KEY = "AUTOSCRIPT_FILE_1";
const FILE2_STORAGE_KEY = "AUTOSCRIPT_FILE_2";

const AutoScriptPage: React.FC = () => {
  const dispatch = useDispatch();

  // ==================== STATE ====================
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [history, setHistory] = useState<JMXRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullLayout, setShowFullLayout] = useState(false);

  // ==================== REFS ====================
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const previousProjectIdRef = useRef<number | null>(
    Number(localStorage.getItem("PREVIOUS_PROJECT_ID")) || null
  );

  // Polling state refs (persist across renders without triggering re-renders)
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef(POLLING_CONFIG.INITIAL_INTERVAL);
  const pollingStartTimeRef = useRef<number | null>(null);
  const previousHistoryRef = useRef<Map<number, string>>(new Map()); // id -> status
  const trackedScriptIdsRef = useRef<Set<number>>(new Set()); // Scripts we're actively tracking
  const abortControllerRef = useRef<AbortController | null>(null);

  const { selectedProject } = useSelector((state: RootState) => state.project);
  const applicationId = useSelector((state: RootState) => state.project.selectedApp);

  const detectStatusChanges = useCallback((newHistory: JMXRecord[]) => {
    const currentStatuses = new Map<number, string>();

    newHistory.forEach(record => {
      currentStatuses.set(record.id, record.status);

      // Check if this script is being tracked
      if (trackedScriptIdsRef.current.has(record.id)) {
        const previousStatus = previousHistoryRef.current.get(record.id);

        // Status changed for a tracked script
        if (previousStatus && previousStatus !== record.status) {
          handleStatusTransition(record.id, previousStatus, record.status, record.name);
        }
      }
    });

    // Update previous history
    previousHistoryRef.current = currentStatuses;
  }, []);

  const handleStatusTransition = useCallback(
    (id: number, oldStatus: string, newStatus: string, scriptName: string) => {
      console.log(`[Status Change] Script ${id} (${scriptName}): ${oldStatus} → ${newStatus}`);

      // Handle transitions to terminal states
      if (newStatus.toLowerCase() === 'completed' || newStatus.toLowerCase() === 'success') {
        dispatch(
          showSnackbar({
            message: `Script "${scriptName}" generated successfully`,
            type: 'success',
          })
        );
        // Stop tracking this script
        trackedScriptIdsRef.current.delete(id);
      }
      else if (newStatus.toLowerCase() === 'failed' || newStatus.toLowerCase() === 'error') {
        dispatch(
          showSnackbar({
            message: `Script "${scriptName}" generation failed`,
            type: 'error',
          })
        );
        // Stop tracking this script
        trackedScriptIdsRef.current.delete(id);
      }
    },
    [dispatch]
  );




  const fetchHistory = useCallback(async () => {
    if (!selectedProject?.id) return false;


    console.log("FetchHistory ______________________1");

    try {
      // Cancel previous request if still running
      if (pollingStartTimeRef.current && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      console.log("FetchHistory ______________________2");

      abortControllerRef.current = new AbortController();

      console.log("FetchHistory ______________________3");

      const data = await autoScriptService.getHistory(
        selectedProject.id,
        { signal: abortControllerRef.current.signal }
      );

      console.log('[Polling] Fetched history:', data.length, 'records');

      // Detect status changes BEFORE updating state
      detectStatusChanges(data);

      setHistory(data);

      // Check if any scripts are still running
      const hasRunningScripts = data.some(s => isRunningStatus(s.status));

      return hasRunningScripts;

    } catch (error: any) {
      // Ignore abort errors - they're intentional
      if (error?.name === 'AbortError') {
        console.log('[Polling] Request aborted');
        return false;
      }

      console.error('[Polling] Error:', error);

      dispatch(
        showSnackbar({
          message: 'Failed to fetch script history',
          type: 'error',
        })
      );

      return false;
    }
  }, [selectedProject?.id, detectStatusChanges, dispatch]);

  const startPolling = useCallback(() => {
    // Clear any existing timeout
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    // Reset polling state
    pollingIntervalRef.current = POLLING_CONFIG.INITIAL_INTERVAL;
    pollingStartTimeRef.current = Date.now();

    const poll = async () => {
      // Check max duration
      const elapsed = Date.now() - (pollingStartTimeRef.current || 0);
      if (elapsed > POLLING_CONFIG.MAX_DURATION) {
        console.log('[Polling] Max duration reached, stopping');
        dispatch(
          showSnackbar({
            message: 'Polling timeout - please refresh to see latest status',
            type: 'error',
          })
        );
        return;
      }

      const hasRunningScripts = await fetchHistory();

      if (hasRunningScripts) {
        // Schedule next poll with exponential backoff
        pollingIntervalRef.current = calculateNextInterval(pollingIntervalRef.current);

        console.log(`[Polling] Next poll in ${pollingIntervalRef.current}ms`);

        pollingTimeoutRef.current = setTimeout(poll, pollingIntervalRef.current);
      } else {
        console.log('[Polling] No running scripts, stopping');
        pollingStartTimeRef.current = null;
      }
    };

    // Start immediately
    poll();
  }, [fetchHistory, dispatch]);

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    pollingStartTimeRef.current = null;
  }, []);

  useEffect(() => {


    if (!selectedProject?.id || previousProjectIdRef.current === null || previousProjectIdRef.current === selectedProject.id) return;

    previousProjectIdRef.current = selectedProject.id;
    localStorage.setItem(
      "PREVIOUS_PROJECT_ID",
      selectedProject.id.toString()
    );
  }, [selectedProject?.id]);




  useEffect(() => {

    const restoredFile1 = loadFilesFromLocalStorage(FILE1_STORAGE_KEY);
    const restoredFile2 = loadFilesFromLocalStorage(FILE2_STORAGE_KEY);

    console.log("Restoring files from localstorage : ", restoredFile1, restoredFile2)

    if (restoredFile1.length > 0) {
      setFile1(restoredFile1[0]);
    }

    if (restoredFile2.length > 0) {
      setFile2(restoredFile2[0]);
    }
  }, []);

  // useEffect(() => {
  //   if (!selectedProject?.id) return;

  //   if (previousProjectIdRef.current === selectedProject.id) return;

  //   previousProjectIdRef.current = selectedProject.id;

  //   localStorage.removeItem(FILE1_STORAGE_KEY);
  //   localStorage.removeItem(FILE2_STORAGE_KEY);

  //   setFile1(null);
  //   setFile2(null);

  //   console.log('[Effect] Project changed, fetching initial history');

  //   const initialFetch = async () => {
  //     const hasRunning = await fetchHistory();

  //     if (hasRunning) {
  //       console.log('[Effect] Found running scripts, starting poll');
  //       startPolling();
  //     }
  //   };

  //   initialFetch();

  //   return () => {
  //     console.log('[Effect] Cleanup - stopping polling');
  //     stopPolling();
  //   };
  // }, [selectedProject?.id]); // Only re-run when project changes


  // useEffect(() => {

  //   if (!selectedProject?.id) return;

  //   console.log("Useeffect ______________________1");

  //   if (previousProjectIdRef.current === selectedProject.id) return;


  //   console.log("Useeffect Removing files ______________________2 ");

  //   localStorage.removeItem(FILE1_STORAGE_KEY);
  //   localStorage.removeItem(FILE2_STORAGE_KEY);

  //   setFile1(null);
  //   setFile2(null);

  //   console.log('[Effect] Project changed, fetching initial history');

  //   let isMounted = true;

  //   const initialFetch = async () => {

  //     console.log("Useeffect ______________________3");

  //     const hasRunning = await fetchHistory();

  //     if (isMounted && hasRunning) {
  //       console.log('[Effect] Found running scripts, starting poll');
  //       startPolling();
  //     }
  //   };

  //   initialFetch();

  //   return () => {
  //     isMounted = false;
  //     console.log('[Effect] Cleanup - stopping polling');
  //     stopPolling();
  //   };
  // }, [selectedProject?.id, fetchHistory, startPolling, stopPolling]);


  useEffect(() => {
  if (!selectedProject?.id) return;

  const storedProjectId = Number(
    localStorage.getItem("AUTOSCRIPT_PROJECT_ID")
  );

  console.log(
    "[Project Check] Stored:",
    storedProjectId,
    "Current:",
    selectedProject.id
  );

  // First load after refresh – do not clear files
  if (!storedProjectId) {
    localStorage.setItem(
      "AUTOSCRIPT_PROJECT_ID",
      selectedProject.id.toString()
    );
    previousProjectIdRef.current = selectedProject.id;
    return;
  }

  // Clear files only when the project actually changes
  if (storedProjectId !== selectedProject.id) {
    console.log("[Project Change] Clearing stored files");

    localStorage.removeItem(FILE1_STORAGE_KEY);
    localStorage.removeItem(FILE2_STORAGE_KEY);

    setFile1(null);
    setFile2(null);

    localStorage.setItem(
      "AUTOSCRIPT_PROJECT_ID",
      selectedProject.id.toString()
    );
  }

  previousProjectIdRef.current = selectedProject.id;

  console.log('[Effect] Project changed, fetching initial history');

  let isMounted = true;

  const initialFetch = async () => {
    const hasRunning = await fetchHistory();

    if (isMounted && hasRunning) {
      startPolling();
    }
  };

  initialFetch();

  return () => {
    isMounted = false;
    stopPolling();
  };
}, [selectedProject?.id, fetchHistory, startPolling, stopPolling]);

  const generate = async () => {
    if (!file1 || !file2) {
      dispatch(
        showSnackbar({
          message: 'Please select both HAR files',
          type: 'error',
        })
      );
      return;
    }

    if (!selectedProject?.id) {
      dispatch(
        showSnackbar({
          message: 'No project selected',
          type: 'error',
        })
      );
      return;
    }

    if (file1.name == file2.name) {
      dispatch(
        showSnackbar({
          message: 'Please select a different HAR file',
          type: 'error',
        })
      );
      return;
    }

    try {
      setIsGenerating(true);

      // Call API and get response
      const response = await autoScriptService.generate(
        file1,
        file2,
        selectedProject.id,
        applicationId?.id ?? undefined
      );

      console.log('[Generate] Response:', response);

      // Extract script ID from response (handles different formats)
      const newScriptId = extractScriptId(response);

      if (newScriptId) {
        console.log('[Generate] New script ID:', newScriptId);

        // Track this script for status updates
        trackedScriptIdsRef.current.add(newScriptId);

        // Optimistic update: add to history immediately
        const optimisticRecord: JMXRecord = {
          id: newScriptId,
          status: 'pending',
          name: file1.name.replace('.har', ''),
          created_on: new Date().toISOString(),
          application_name: applicationId?.name,
        };

        setHistory(prev => [optimisticRecord, ...prev]);

        // Store initial status
        previousHistoryRef.current.set(newScriptId, 'pending');
      } else {
        console.warn('[Generate] Backend did not return script ID - polling will still work but no optimistic update');
      }

      dispatch(
        showSnackbar({
          message: 'Script generation started',
          type: 'success',
        })
      );

      // Start polling immediately
      startPolling();

      // Reset form
      setFile1(null);
      setFile2(null);
      localStorage.removeItem(FILE1_STORAGE_KEY);
      localStorage.removeItem(FILE2_STORAGE_KEY);
      if (fileRef1.current) fileRef1.current.value = '';
      if (fileRef2.current) fileRef2.current.value = '';

    } catch (err: any) {
      console.error('[Generate] Error:', err);

      dispatch(
        showSnackbar({
          message: err?.message || 'Script generation failed',
          type: 'error',
        })
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await autoScriptService.deleteJmx(id);

      // Remove from tracking
      trackedScriptIdsRef.current.delete(id);
      previousHistoryRef.current.delete(id);

      setHistory(h => h.filter(x => x.id !== id));

      dispatch(
        showSnackbar({
          message: 'Script deleted successfully',
          type: 'success',
        })
      );
    } catch (err) {
      console.error('[Delete] Error:', err);

      dispatch(
        showSnackbar({
          message: 'Failed to delete script',
          type: 'error',
        })
      );
    }
  };

  // ============================================================================
  // DOWNLOAD HANDLER
  // ============================================================================
  const handleDownload = async (id: number, scriptName: string) => {
    try {
      const blob = await autoScriptService.downloadJmx(id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `Script-${scriptName}.jmx`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      dispatch(
        showSnackbar({
          message: 'Download started',
          type: 'success',
        })
      );
    } catch (error: any) {
      console.error('[Download] Error:', error);

      dispatch(
        showSnackbar({
          message: error?.message || 'Download failed',
          type: 'error',
        })
      );
    }
  };

  // ============================================================================
  // FILE CANCEL HANDLERS
  // ============================================================================
  const cancelFile1 = () => {
    setFile1(null);
    localStorage.removeItem(FILE1_STORAGE_KEY);
    if (fileRef1.current) fileRef1.current.value = "";
  };

  const cancelFile2 = () => {
    setFile2(null);
    localStorage.removeItem(FILE2_STORAGE_KEY);
    if (fileRef2.current) fileRef2.current.value = "";
  };

  // ============================================================================
  // SCROLL TO TABLE EFFECT
  // ============================================================================
  useEffect(() => {
    if (!showFullLayout) return;
    if (!tableRef.current) return;

    const findScrollableParent = (el: HTMLElement | null): HTMLElement | Window => {
      let parent = el?.parentElement;

      while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;

        if (overflowY === 'auto' || overflowY === 'scroll') {
          return parent;
        }

        parent = parent.parentElement;
      }

      return window;
    };

    const scrollToTable = () => {
      const table = tableRef.current!;
      const scrollParent = findScrollableParent(table);
      const rect = table.getBoundingClientRect();
      const OFFSET = 100;

      if (scrollParent === window) {
        const absoluteTop = rect.top + window.pageYOffset;
        window.scrollTo({
          top: absoluteTop - OFFSET,
          behavior: 'smooth',
        });

        setTimeout(() => {
          if (window.scrollY === 0) {
            window.scrollBy({ top: 120, behavior: 'smooth' });
          }
        }, 150);
      } else {
        const parentRect = (scrollParent as HTMLElement).getBoundingClientRect();
        const scrollTop =
          rect.top - parentRect.top + (scrollParent as HTMLElement).scrollTop - OFFSET;

        (scrollParent as HTMLElement).scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });

        setTimeout(() => {
          const el = scrollParent as HTMLElement;
          if (el.scrollTop === 0) {
            el.scrollBy({ top: 120, behavior: 'smooth' });
          }
        }, 150);
      }
    };

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTable);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [showFullLayout, history.length]);

  const handleFile1Click = () => {// allow reselect same file
    fileRef1.current.click();
  };

  const handleFile2Click = () => {
    fileRef2.current.click();
  };


  // ============================================================================
  // RENDER: NO PROJECT SELECTED
  // ============================================================================
  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2>No Project Selected</h2>
      </div>
    );
  }

  // ============================================================================
  // RENDER: FULL LAYOUT
  // ============================================================================
  if (showFullLayout) {
    return (
      <div className="max-w-6xl m-auto px-8 py-6">
        <UploadSection
          file1={file1}
          file2={file2}
          onFile1={() => handleFile1Click()}
          onFile2={() => handleFile2Click()}
          onCancelFile1={cancelFile1}
          onCancelFile2={cancelFile2}
          onGenerate={generate}
          isGenerating={isGenerating}
          compact={false}
        />

        <div ref={tableRef}>
          <HistoryTable
            history={history}
            onDelete={handleDelete}
            onDownload={handleDownload}
            compact={false}
          />
        </div>

        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setShowFullLayout(false)}
          >
            Show Less
          </button>
        </div>



        <input
          hidden
          ref={fileRef1}
          type="file"
          accept=".har"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {

              if (!file.name.toLowerCase().endsWith(".har")) {


                dispatch(
                  showSnackbar({
                    message: 'Upload failed ! Please select valid HAR file.',
                    type: 'error',
                  })
                );

                return;
              }

              console.log("Not har File 3 : ", !file.name.toLowerCase().endsWith(".har"))


              setFile1(file);
              await saveFilesToLocalStorage(FILE1_STORAGE_KEY, [file]);
            }
          }}
        />

        <input
          hidden
          ref={fileRef2}
          type="file"
          accept=".har"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {

              if (!file.name.toLowerCase().endsWith(".har")) {
                dispatch(
                  showSnackbar({
                    message: 'Upload failed ! Please select valid HAR file.',
                    type: 'error',
                  })
                );

                return;
              }

              setFile2(file);
              await saveFilesToLocalStorage(FILE2_STORAGE_KEY, [file]);

              console.log("[SAVE] saved file 2 to localstorage : ", localStorage.getItem(FILE2_STORAGE_KEY))
              console.log("[SAVE] REFERENCE FOR PROJECT : ", previousProjectIdRef)
            }
          }}
        />
      </div>
    );
  }

  // ============================================================================
  // RENDER: COMPACT SIDE-BY-SIDE
  // ============================================================================
  return (
    // <div className="max-w-7xl m-auto p-8">
    // <div className="max-w-7xl m-auto p-3 sm:p-4 md:p-6 lg:p-8">
    <div className="max-w-7xl m-auto py-6 px-8">


      <div className="grid grid-cols-12 gap-4 items-stretch min-h-[420px]">
        {/* RIGHT — INPUT */}
        <div className="col-span-7 h-full flex">
          <UploadSection
            file1={file1}
            file2={file2}
            onFile1={() => fileRef1.current?.click()}
            onFile2={() => fileRef2.current?.click()}
            onCancelFile1={cancelFile1}
            onCancelFile2={cancelFile2}
            onGenerate={generate}
            isGenerating={isGenerating}
            compact={true}
          />
        </div>

        {/* LEFT — HISTORY */}
        <div className={`col-span-5`}>
          <HistoryTable
            history={history.slice(0, 10)}
            onDelete={handleDelete}
            onDownload={handleDownload}
            compact={true}
            showViewMore={true}
            onViewMore={() => setShowFullLayout(true)}
          />
        </div>
      </div>

      <input
        hidden
        ref={fileRef1}
        type="file"
        accept=".har"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {

            if (!file.name.toLowerCase().endsWith(".har")) {


              dispatch(
                showSnackbar({
                  message: 'Upload failed ! Please select valid HAR file.',
                  type: 'error',
                })
              );

              return;
            }



            setFile1(file);
            await saveFilesToLocalStorage(FILE1_STORAGE_KEY, [file]);

            console.log("saved file 1 to localstorage : ", localStorage.getItem(FILE1_STORAGE_KEY))
          }
        }}
      />

      <input
        hidden
        ref={fileRef2}
        type="file"
        accept=".har"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {

            if (!file.name.toLowerCase().endsWith(".har")) {
              dispatch(
                showSnackbar({
                  message: 'Upload failed ! Please select valid HAR file.',
                  type: 'error',
                })
              );

              return;
            }

            setFile2(file);
            await saveFilesToLocalStorage(FILE2_STORAGE_KEY, [file]);

            console.log("saved file 2 to localstorage : ", localStorage.getItem(FILE2_STORAGE_KEY))
            console.log(" REFERENCE FOR PROJECT : ", previousProjectIdRef)
          }
        }}
      />
    </div>
  );
};

export default AutoScriptPage;
