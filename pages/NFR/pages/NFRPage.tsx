import { useEffect, useRef, useState } from "react";

function useContainerWidth() {
  const ref = useRef(null);
  const [isCompressed, setIsCompressed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      console.log("Container width:", width);

      setIsCompressed(width < 900);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref.current]); // <-- IMPORTANT

  return { ref, isCompressed };
}

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { AppDispatch, RootState } from '../../../store/store';
import { deleteNfrById, fetchNfrReport, getNfrById, fetchNfrList } from '../slices/nfr.thunks'
import { resetWizard } from '../slices/nfrWizardSlice';
import { StatusBadge } from '@/components/StatusBadge';
import PrimaryButton from '@/pages/autoanalysis/components/PrimaryButton';
import { Activity, Box, Download, EditIcon, Search, Trash2, TrashIcon } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { nfrService } from '../services/nfrService';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';
import { get } from 'http';
import SearchBar from '@/components/SearchBar';
import { showSnackbar } from '@/store/snackbarStore';

const NFRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { ref, isCompressed } = useContainerWidth();

  const { selectedProject } = useSelector((state: RootState) => state.project);
  // const [polling, setPolling] = useState(false);
  let count = 0;
  const pollingRef = useRef(null);

  console.log("SELECTED PROJECT IN NFR : ", selectedProject);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { strategies } = useSelector((state: RootState) => state.nfrList);
  const nfrInProgressRef = useRef<Map<string, string>>(new Map());


  useEffect(() => {

    if (!selectedProject?.id) return;

    setSearch("");

    const isPending = (status: string) =>
      status === "in_process" || status === "draft" || status === "pending";

    dispatch(resetWizard());
    localStorage.removeItem("NFR_Wizard_Files");

    console.log("Fetching NFR by project id in useEffect");

    const startPolling = async () => {
      try {

        const strategies = await dispatch(
          getNfrById(selectedProject.id)
        ).unwrap();

        // Track pending strategies
        const pendingStrategies = strategies?.filter((s: any) =>
          isPending(s.status)
        );

        pendingStrategies?.forEach((s: any) => {
          nfrInProgressRef.current.set(s.id, s.display_name);
        });

        if (pendingStrategies.length === 0) return;

        console.log("Some strategies pending → start polling");

        // Prevent duplicate polling
        if (pollingRef.current) return;

        pollingRef.current = setInterval(async () => {

          try {

            const updated = await dispatch(
              getNfrById(selectedProject.id)
            ).unwrap();

            updated.forEach((strategy: any) => {

              const trackedName = nfrInProgressRef.current.get(strategy.id);

              if (trackedName && !isPending(strategy.status)) {

                console.log("Strategy status updated:", trackedName);

                if (strategy.status === "completed") {

                  dispatch(
                    showSnackbar({
                      message: `${trackedName} generated successfully`,
                      type: "success",
                    })
                  );

                } else {

                  dispatch(
                    showSnackbar({
                      message: `${trackedName} generation failed`,
                      type: "error",
                    })
                  );

                }

                nfrInProgressRef.current.delete(strategy.id);
              }

            });

            // Stop polling when everything finished
            if (nfrInProgressRef.current.size === 0) {

              console.log("All strategies finished → stop polling");

              clearInterval(pollingRef.current!);
              pollingRef.current = null;

            }

          } catch (err) {

            console.error("Polling failed", err);

            dispatch(
              showSnackbar({
                message: "Polling failed",
                type: "error",
              })
            );

          }

        }, 5000);

      } catch (err) {

        console.error("Initial fetch failed", err);

        dispatch(
          showSnackbar({
            message: "Failed to fetch NFR data",
            type: "error",
          })
        );

      }
    };

    startPolling();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

  }, [dispatch, selectedProject]);

  const filteredStrategies = strategies?.filter((strategy) =>
    (strategy.display_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Project Selected</h2>
        <p>Please select a project from the top navigation bar to get started.</p>
      </div>
    );
  }


  const handleDownload = async (id: number) => {
    try {
      const blob = await nfrService.downloadById(id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `nfr-${id}.txt`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      dispatch(
        showSnackbar({
          message: "NFR downloaded successfully",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "Failed to download NFR",
          type: "error",
        })
      );
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteNfrById(id)).unwrap();

      dispatch(
        showSnackbar({
          message: "NFR deleted successfully",
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "Failed to delete NFR",
          type: "error",
        })
      );
    }
  };


  return (
    <div
      className="m-auto max-w-6xl p-10"
    // sx={{background: ''}}
    >




      <div ref={ref} className="mb-8 flex items-center justify-between w-full">

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">
            Performance Strategy Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Generate Performance Test Strategy using AI
          </p>
        </div>

        <div className="flex items-center gap-3 ml-auto">


          <div className="flex items-center gap-3 ml-auto">

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search strategies..." onSearch={undefined} />



            <Tooltip title="Generate Performance Test Strategy" arrow>
              <button
                onClick={() => navigate("/nfr/wizard")}
                className="
      px-4 py-2 rounded-md text-white bg-blue-600
      hover:bg-blue-700 transition
      flex items-center gap-2
    "
              >
                <AddIcon style={{ fontSize: 18 }} />

                {!isCompressed ? (
                  <span>Generate Performance Test Strategy</span>
                ) : (
                  <span>Generate Test Strategy</span>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full mx-auto">
        {(filteredStrategies?.length ?? 0) > 0 ? (

          filteredStrategies?.map((strategy) => (
            <InfoCard key={strategy.id}
              name={strategy.display_name == 'N/A' ? "Default Application" : strategy.display_name}
              createdOn={strategy.created_on && strategy.created_on.replace("Z", "") || "N/A"}
              createdBy={strategy.created_by_name || "N/A"}
              status={strategy.status}
              onDownload={() => handleDownload(strategy.id)}
              onDelete={() => handleDelete(strategy.id)}
              onView={() => navigate(`/nfr/result/${strategy.id}`)}
            />

          ))) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 p-10">
            <Activity size={64} className="mb-4 text-gray-300" />
            <h2 className="text-xl font-medium mb-2">No NFR Generated</h2>
            <p>Please generate the NFR document.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFRPage;