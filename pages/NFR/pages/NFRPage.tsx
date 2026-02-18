import React, { Dispatch, useEffect, useRef, useState } from 'react';
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
import { Activity, Box, Download, EditIcon, Trash2, TrashIcon } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { nfrService } from '../services/nfrService';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';
import { get } from 'http';
import SearchBar from '@/components/SearchBar';
import { showSnackbar } from '@/store/snackbarStore';

const NFRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProject } = useSelector((state: RootState) => state.project);
  // const [polling, setPolling] = useState(false);
  let count = 0;
  const pollingRef = useRef(null);
  const [search, setSearch] = useState("");

  console.log("SELECTED PROJECT IN NFR : ", selectedProject);


  const { strategies } = useSelector((state: RootState) => state.nfrList);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: SnackbarType;
  }>({
    open: false,
    message: '',
    type: 'success',
  });


  useEffect(() => {

    const hasPending = (list) =>
      list.some(s => s.status === 'in_process' || s.status === 'draft' || s.status === 'pending');

    dispatch(resetWizard());

    console.log("Fetching NFR by project id in Useeffect Before polling")

    const startPolling = async () => {
      try {

        console.log("Fetching NFR by project id in Useeffect")

        // const strategies = await dispatch(getNfrById(selectedProject.id)).unwrap();
        const strategies = await dispatch(getNfrById(selectedProject.id)).unwrap();

        if (!hasPending(strategies)) return;

        // Prevent duplicate intervals
        if (pollingRef.current) return;

        pollingRef.current = setInterval(async () => {

          try {
            const updated = await dispatch(getNfrById(selectedProject.id)).unwrap();

            if (!hasPending(updated)) {

              dispatch(
    showSnackbar({
      message: "NFR generation completed",
      type: "success",
    })
  );

              clearInterval(pollingRef.current);
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




  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Project Selected</h2>
        <p>Please select a project from the top navigation bar to get started.</p>
      </div>
    );
  }



  // const handleDownload = async (id: number) => {
  //   try {
  //     const blob = await nfrService.downloadById(id);

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `nfr-${id}.txt`;
  //     document.body.appendChild(a);
  //     a.click();

  //     a.remove();
  //     window.URL.revokeObjectURL(url);

  //     setSnackbar({
  //       open: true,
  //       message: 'NFR downloaded successfully',
  //       type: 'success',
  //     });
  //   } catch (err) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to download NFR',
  //       type: 'error',
  //     });
  //   }
  // };

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


  // const handleDelete = async (id: number) => {
  //   try {
  //     console.log("Delete called", id);
  //     await dispatch(deleteNfrById(id));
  //     setSnackbar({
  //       open: true,
  //       message: 'NFR deleted successfully',
  //       type: 'success',
  //     });
  //   } catch (err) {
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to delete NFR',
  //       type: 'error',
  //     });
  //   }
  // }




  // useEffect(() => {

  //   const hasPending = (list) =>
  //     list.some(s => s.status === 'pending');

  //   const startPolling = async () => {
  //     try {

  //       const strategies = await dispatch(fetchNfrList()).unwrap();

  //       if (!hasPending(strategies)) return;

  //       // Prevent duplicate intervals
  //       if (pollingRef.current) return;

  //       pollingRef.current = setInterval(async () => {

  //         try {
  //           const updated = await dispatch(fetchNfrList()).unwrap();

  //           if (!hasPending(updated)) {

  //             setSnackbar({
  //               open: true,
  //               message: 'NFR generation completed',
  //               type: 'success',
  //             });

  //             clearInterval(pollingRef.current);
  //             pollingRef.current = null;
  //           }

  //         } catch (err) {
  //           console.error('Polling failed', err);
  //         }

  //       }, 5000);

  //     } catch (err) {
  //       console.error('Initial fetch failed', err);
  //     }
  //   };

  //   startPolling();

  //   return () => {
  //     if (pollingRef.current) {
  //       clearInterval(pollingRef.current);
  //       pollingRef.current = null;
  //     }
  //   };

  // }, [dispatch]);

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
    <div className="m-auto max-w-6xl p-10">
      


<div className="mb-8 flex items-center justify-between w-full">

  {/* LEFT SIDE — TITLE */}
  <div className="flex flex-col">
    <h1 className="text-2xl font-bold text-gray-800">
      Performance Strategy Hub
    </h1>
    <p className="text-gray-500 mt-1">
      Generate Performance Test Strategy using AI
    </p>
  </div>

  {/* RIGHT SIDE — SEARCH + BUTTON */}
  <div className="flex items-center gap-3 ml-auto">

    {/* <Tooltip title="Search applications" arrow>
      <div style={{ width: 240, minWidth: 240 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search applications..."
          onSearch={(value) => console.log("Searching:", value)}                    
        />
      </div>
    </Tooltip> */}

    <Tooltip title="Generate Performance Test Strategy" arrow>
      <button
        onClick={() => navigate("/nfr/wizard")}
        className="flex items-center gap-1 bg-blue-600 text-white text-sm font-medium rounded px-4 py-1.5 hover:bg-blue-700 whitespace-nowrap"
      >
        <AddIcon style={{ fontSize: 18 }} />
        Generate Performance Test Strategy
      </button>
    </Tooltip>

  </div>

</div>


      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />

      <div className="space-y-4 w-full mx-auto">
        {(strategies?.length ?? 0) > 0 ? (

          strategies?.map((strategy) => (
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

      {/* </div> */}

      {/* </Paper> */}
    </div>
  );
};

export default NFRPage;