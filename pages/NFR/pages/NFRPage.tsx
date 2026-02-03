import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { AppDispatch, RootState } from '../../../store/store';
import { deleteNfrById, fetchNfrReport, fetchNfrList } from '../slices/nfr.thunks'
import {resetWizard} from '../slices/nfrWizardSlice';
import { StatusBadge } from '@/components/StatusBadge';
import PrimaryButton from '@/pages/autoanalysis/components/PrimaryButton';
import { Activity, Download, EditIcon, Trash2, TrashIcon } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { nfrService } from '../services/nfrService';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';

const NFRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProject } = useSelector((state: RootState) => state.project);
  // const [polling, setPolling] = useState(false);
  let count = 0;
  const pollingRef = useRef(null);

    console.log("SELECTED PROJECT IN NFR : ",selectedProject);


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
      list.some(s => s.status === 'pending' || s.status === 'draft');

    dispatch(resetWizard());

    const startPolling = async () => {
      try {

        const strategies = await dispatch(fetchNfrList()).unwrap();

        if (!hasPending(strategies)) return;

        // Prevent duplicate intervals
        if (pollingRef.current) return;

        pollingRef.current = setInterval(async () => {

          try {
            const updated = await dispatch(fetchNfrList()).unwrap();

            if (!hasPending(updated)) {

              setSnackbar({
                open: true,
                message: 'NFR generation completed',
                type: 'success',
              });

              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }

          } catch (err) {
            console.error('Polling failed', err);
          }

        }, 5000);

      } catch (err) {
        console.error('Initial fetch failed', err);
      }
    };

    startPolling();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

  }, [dispatch]);




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

      setSnackbar({
        open: true,
        message: 'NFR downloaded successfully',
        type: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to download NFR',
        type: 'error',
      });
    }
  };


  const handleDelete = async (id: number) => {
    try {
      console.log("Delete called", id);
      await dispatch(deleteNfrById(id));
      setSnackbar({
        open: true,
        message: 'NFR deleted successfully',
        type: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete NFR',
        type: 'error',
      });
    }
  }




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



  return (
    <div className="m-auto max-w-6xl p-10">
      {/* Header Section */}
      {/* <div className="flex flex-col items-center justify-center mb-10 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">Performance Strategy Hub</h1>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/nfr/wizard')}
            className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 py-3 text-lg shadow-lg"
        >
            Generate Performance Test Strategy
        </Button>
      </div> */}

      <div className="mb-8 flex items-center justify-between">

        {/* Left side text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Performance Strategy Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Generate Performance Test Strategy using AI
          </p>
        </div>

        {/* Right side button */}
        {/* <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          className="mt-1 rounded min-w-fit"
          disableElevation
          onClick={() => navigate('/nfr/wizard')}
        >
          Generate Performance Test Strategy
        </Button> */}


        <Tooltip title="Generate Performance Test Strategy" arrow>
          <IconButton
            onClick={() => navigate('/nfr/wizard')}
            sx={{
              borderRadius: 2,
              color: "primary.main",
              bgcolor: "rgba(25, 118, 210, 0.08)",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "rgba(25, 118, 210, 0.15)",
                transform: "translateY(-1px)"
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>


      </div>


      {/* <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          Performance Strategy Hub
        </h1>
        <p className="text-gray-500 mt-1">Generate Performance Test Strategy using AI</p>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 space-y-4">
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/nfr/wizard')}
          sx={{
            textTransform: "none",
            px: 3,            // horizontal padding
            py: 1.5,             // vertical padding
            fontSize: "1.1rem",
            borderRadius: "9px", // fully rounded
            backgroundColor: "#4375e2ff",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
            boxShadow: "0 5px 10px rgba(0,0,0,0.15)", // bigger shadow
          }}
        >
          Generate Performance Test Strategy
        </Button>


      </div> */}

      {/* Table Section */}
      {/* <Paper elevation={0} className="overflow-hidden rounded-lg  "> */}
      {/* <div className="pl-1 pb-4 bg-gray-50 font-semibold text-gray-700">
          Generated Performance Test Strategies
        </div> */}
      {/* 
        <TableContainer component={Paper} elevation={0} className="border border-slate-200">

          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell className="font-bold">APP NAME</TableCell>
                <TableCell className="font-bold">CREATED ON</TableCell>
                <TableCell className="font-bold">STATUS</TableCell>
                <TableCell className="font-bold">CREATED BY</TableCell>
                <TableCell className="font-bold text-center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {strategies.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.appName}</TableCell>
                  <TableCell>{row.createdOn}</TableCell>
                  {/* <TableCell>
                    <Chip label={row.status} color={getStatusColor(row.status) as any} size="small" variant="outlined" />
                  </TableCell> 
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>

                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">


                      <PrimaryButton
                        size="small"
                        onClick={() => navigate(`/nfr/result/${row.id}`)}
                        disabled={row.status != 'Completed'}
                      >
                        View
                      </PrimaryButton>

                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Download"
                        disabled={row.status !== 'Completed'}
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => dispatch(deleteStrategy(row.id))}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {strategies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-10 text-gray-500">
                    No strategies generated yet. Click the button above to start.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer> */}


      {/* <div className="space-y-4 w-full mx-auto bg-transparent">

          {strategies.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No strategies generated yet. Click the button above to start.
            </div>
          )}

          {strategies.map((row) => (
            <div
              key={row.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between 
             p-4 bg-white rounded-lg shadow-sm border border-gray-200 bg-gray-50"
            >

              {/* Left section 
              <div className="flex-1 space-y-1">

                {/* Name + Status on same row 
                <div className="flex items-center space-x-3 mb-1">
                  <div className="text-base font-semibold text-gray-900">
                    {row.appName}
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                {/* Created On 
                <div className="text-xs text-gray-500">
                  Created On: {row.createdOn}
                </div>

                {/* Created By
                <div className="text-xs text-gray-500">
                  Created By: {row.createdBy}
                </div>
              </div>

              {/* Right section: Actions 
              <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                <PrimaryButton
                  size="small"
                  onClick={() => navigate(`/nfr/result/${row.id}`)}
                  disabled={row.status !== "Completed"}
                >
                  View
                </PrimaryButton>

                <button
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                  title="Download"
                  disabled={row.status !== "Completed"}
                >
                  <Download size={18} />
                </button>

                <button
                  onClick={() => dispatch(deleteStrategy(row.id))}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div> 

        <div className="bg-gray-50 ">
          {/* <div className="space-y-4 w-full mx-auto">
            {strategies.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Left section: title and description 
                <div>

                  <div className="flex items-center space-x-3 mb-1">
                    <div className="text-base font-semibold text-gray-900">{app.appName}</div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* <div 
                onClick={() => navigate(`/reports/${app.lastReportId}`)}
                sx={{
                      textTransform: "none",
                      padding: 0,
                      minWidth: "unset",
                      fontSize: "0.875rem",
                      color: "primary.main",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }} 
                    className="text-sm text-gray-500">{app.lastReportName || "-"}</div>
                <div className="text-xs text-gray-400 mt-0.5">{app.info}</div> 


                  {/* Created On 
                  <div className="text-xs text-gray-500 mt-1">
                    Created On: {app.createdOn}
                  </div>

                  {/* Created By 
                  <div className="text-xs text-gray-500 mt-1">
                    Created By: {app.createdBy}
                  </div>




                </div>

                {/* Right section: icons and button
                <div className="flex items-center space-x-3">
                  {/* Edit icon 
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Download"
                    disabled={app.status !== "Completed"}
                  >
                    <Download size={18} />
                  </button>

                  <button
                    onClick={() => dispatch(deleteStrategy(app.id))}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* View Collection button 
                  <button
                    onClick={() => navigate(`/nfr/result/${app.id}`)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div> */}

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />

      <div className="space-y-4 w-full mx-auto">
        {strategies.map((strategy) => (
          <InfoCard key={strategy.id}
            name={strategy.application_name == 'N/A' ? "Default Application" : strategy.application_name}
            createdOn={strategy.created_on && strategy.created_on.replace("Z", "") || "N/A"}
            createdBy={strategy.created_by_name || "N/A"}
            status={strategy.status}
            onDownload={() => handleDownload(strategy.id)}
            onDelete={() => handleDelete(strategy.id)}
            onView={() => navigate(`/nfr/result/${strategy.id}`)}
          />

        ))}
      </div>

      {/* </div> */}

      {/* </Paper> */}
    </div>
  );
};

export default NFRPage;