import React, { useEffect, useRef, useState } from "react";
import { UploadSection } from "../components/UploadSelection";
import { HistoryTable } from "../components/HistoryTable";
import { autoScriptService } from "../services/service";
import { JMXRecord } from "../types/type";
import ApplicationSelect from "@/components/ApplicationSelect";
import { Console } from "console";
import { Alert, Snackbar } from "@mui/material";
import { Activity, CheckCircle } from "lucide-react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';

const AutoScriptPage: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [history, setHistory] = useState<JMXRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedProject } = useSelector((state: RootState) => state.project);

  console.log("SELECTED PROJECT IN AUTOSCRIPT : ",selectedProject);


  const applicationId = useSelector(
    (state: RootState) => state.project.selectedApp
  );


  console.log("APPLICATION ID IN AUTOSCRIPT : ",applicationId);

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const [polling, setPolling] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: SnackbarType;
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  const handleDelete = async (id: number) => {
    try {
      const res = await autoScriptService.deleteJmx(id);

      console.log(res);

      setHistory(h => h.filter(x => x.id !== id));

      setSnackbar({
        open: true,
        message: "Script deleted successfully",
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } const handleDelete = async (id: number) => {
      try {
        await autoScriptService.deleteJmx(id);

        setHistory(h => h.filter(x => x.id !== id));

        // ✅ Success snackbar
        setSnackbar({
          open: true,
          message: 'Script deleted successfully',
          type: 'success',
        });

      } catch (err) {
        console.error(err);

        // ❌ Error snackbar
        setSnackbar({
          open: true,
          message: 'Failed to delete script',
          type: 'error',
        });
      }
    };

  };


  const handleDownload = async (id: number, script_name: string) => {
    try {
      const blob = await autoScriptService.downloadJmx(id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Script-${script_name}.jmx`; // filename
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Download started",
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Download failed",
        type: 'error',
      });
    }
  };

  // useEffect(() => {
  //   let cancelled = false;
  //   let timeoutId: ReturnType<typeof setTimeout>;

  //   const fetchHistory = async () => {
  //     try {
  //       const data = await autoScriptService.getHistory(selectedProject.id);

  //       if (cancelled) return;

  //       setHistory(data);

  //       const stillRunning = data.some(
  //         s => s.status === 'IN_PROGRESS' || s.status === 'PROCESSING'
  //       );

  //       // Stop polling if no running scripts
  //       if (!stillRunning) {
  //         if (polling) {
  //           setSnackbar({
  //             open: true,
  //             message: "Script generation completed",
  //             type: "success",
  //           });
  //         }

  //         setPolling(false);
  //         return;
  //       }

  //       // Schedule next poll
  //       timeoutId = setTimeout(fetchHistory, 5000);

  //     } catch (error) {
  //       console.error("Polling failed:", error);

  //       // Stop polling on error
  //       setPolling(false);
  //     }
  //   };

  //   // Always load history once
  //   fetchHistory();

  //   return () => {
  //     cancelled = true;
  //     if (timeoutId) clearTimeout(timeoutId);
  //   };

  // }, [polling]);

  useEffect(() => {

  if (!selectedProject?.id) return;

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const fetchHistory = async () => {

    try {
      const data = await autoScriptService.getHistory(selectedProject.id);

      if (cancelled) return;

      setHistory(data);

      const stillRunning = data.some(
        s => s.status === 'IN_PROGRESS' || s.status === 'PROCESSING'
      );

      if (stillRunning) {

        timeoutId = setTimeout(fetchHistory, 5000);

      } else {

        // Only show message if polling was ACTIVE
        if (polling) {
          setSnackbar({
            open: true,
            message: "Script generation completed",
            type: "success",
          });
        }

        const data = await autoScriptService.getHistory(selectedProject.id);
        setHistory(data);

        setPolling(false);
      }

    } catch (error) {

      console.error("Polling failed:", error);
      setPolling(false);
    }
  };

  fetchHistory();

  return () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
  };

}, [selectedProject?.id, polling]);


  const generate = async () => {
    if (!file1 || !file2) return;

    try {
      setIsGenerating(true);

      console.log("Project : ", selectedProject.id, " application id : ", applicationId?.id);

      await autoScriptService.generate(
        file1,
        file2,
        selectedProject.id,
        applicationId?.id ?? undefined 
      );

      setSnackbar({
        open: true,
        message: "Script generation started",
        type: "success",
      });

      setPolling(true);

      // Reset only after success
      setFile1(null);
      setFile2(null);

      if (fileRef1.current) fileRef1.current.value = '';
      if (fileRef2.current) fileRef2.current.value = '';

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };




  // useEffect(() => {
  //   autoScriptService.getHistory().then(setHistory);
  // }, []);

  // useEffect(() => {

  //   autoScriptService.getHistory()
  //     .then(setHistory)
  //     .catch(console.error);

  //   if (!polling) return;

  //   let interval: ReturnType<typeof setInterval>;

  //   const startPolling = async () => {
  //     const scripts = await autoScriptService.getHistory();
  //     setHistory(scripts);

  //     const hasRunning = scripts.some(
  //       s => s.status === 'IN_PROGRESS' || s.status === 'PROCESSING'
  //     );

  //     if (!hasRunning) {
  //       setPolling(false);
  //       return;
  //     }

  //     interval = setInterval(async () => {
  //       const updated = await autoScriptService.getHistory();
  //       setHistory(updated);

  //       const stillRunning = updated.some(
  //         s => s.status === 'IN_PROGRESS' || s.status === 'PROCESSING'
  //       );

  //       if (!stillRunning) {
  //         setSnackbar({
  //           open: true,
  //           message: "Script generation completed",
  //           type: 'success',
  //         });

  //         setPolling(false);
  //         clearInterval(interval);
  //       }
  //     }, 5000);
  //   };

  //   startPolling();

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [polling]);



  // const generate = async () => {
  //   if (!file1 || !file2) return;

  //   try {
  //     setIsGenerating(true);

  //     console.log("Generating script for project:", selectedProject.id, "application:", applicationId);

  //     const message = await autoScriptService.generate(file1, file2, selectedProject.id, applicationId.id);
  //     // assuming generate() returns a message string

  //     setHistory(await autoScriptService.getHistory());

  //     setSnackbar({
  //       open: true,
  //       message: "Script generation started",
  //       type: 'success',
  //     });


  //     setPolling(true);

  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsGenerating(false);

  //     // ✅ Reset React state
  //     setFile1(null);
  //     setFile2(null);

  //     // ✅ Reset DOM inputs (THIS IS THE KEY)
  //     if (fileRef1.current) fileRef1.current.value = '';
  //     if (fileRef2.current) fileRef2.current.value = '';
  //   }
  // };


  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Project Selected</h2>
        <p>Please select a project from the top navigation bar to get started.</p>
      </div>
    );
  }


  return (

    <div className="m-auto max-w-6xl p-10 pl-12">
      {/* <Toolbar className="flex justify-between mb-6 px-4 py-2"> */}


      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">
          AutoScript Generator
        </h1>
        <p className="text-gray-500 mt-1">Upload HAR files to generate JMX performance scripts automatically.</p>
      </div>
      {/* <div className="max-w-6xl mx-auto p-10 space-y-8">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          AutoScript Generator
        </h1>
        <p className="text-gray-500 mt-1">Upload HAR files to generate JMX performance scripts automatically.</p>
      </div> */}


      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />





      <UploadSection
        file1={file1}
        file2={file2}
        onFile1={() => fileRef1.current?.click()}
        onFile2={() => fileRef2.current?.click()}
        onGenerate={generate}
        isGenerating={isGenerating}
      // applicationId={applicationId}
      // changeApplicationId={setApplicationId}
      />



      <HistoryTable
        history={history}
        onDelete={(id) => handleDelete(id)}
        onDownload={(id, script_name:string) => { handleDownload(id, script_name) }}
      />

      <input hidden ref={fileRef1} type="file" accept=".har" onChange={e => setFile1(e.target.files?.[0] || null)} />
      <input hidden ref={fileRef2} type="file" accept=".har" onChange={e => setFile2(e.target.files?.[0] || null)} />
    </div>
  );
};

export default AutoScriptPage;
