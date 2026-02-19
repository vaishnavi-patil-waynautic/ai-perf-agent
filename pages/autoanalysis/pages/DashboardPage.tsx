import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Typography, Box, Toolbar,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Settings, Delete, Visibility } from '@mui/icons-material';
import { fetchApps } from '../store/autoAnalysisSlice';
import { StatusBadge } from '../../../components/StatusBadge';
import { SettingsModal } from '../components/SettingsModal';
import PrimaryButton from '../components/PrimaryButton';
import { Activity, CheckCircle, EditIcon, Trash2, TrashIcon } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../../../components/SearchBar';
import InfoCard from '@/components/InfoCard';
import { AppDispatch, RootState } from '@/store/store';
import { AddApplicationModal } from '../components/AddApplicationModal';
import AddApplicationDialog from '@/pages/settings/components/AddApplicationDialog';
import { createApplication, updateApplication } from '@/pages/project/store/project.thunks';
import { Application } from '@/pages/project/types/project.types';
import { showSnackbar } from '@/store/snackbarStore';


export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // @ts-ignore
  const { loading, applications } = useSelector((state) => state.autoAnalysis);

  const { selectedProject } = useSelector((state: RootState) => state.project);

  const [openAdd, setOpenAdd] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationName, setSelectedApplicationName] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.profile);

  const filteredApplications = applications.filter((app: any) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"new" | "in_progress">("new")

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: ""
  });

  const appsPollingRef = useRef<NodeJS.Timeout | null>(null);


  console.log("SELECTED PROJECT IN AUTOSCRIPT : ", selectedProject);

  const stopAppsPolling = () => {
    if (appsPollingRef.current) {
      clearInterval(appsPollingRef.current);
      appsPollingRef.current = null;
    }
  };

  const startAppsPolling = () => {
    if (!selectedProject?.id) return;

    // prevent duplicate polling
    if (appsPollingRef.current) return;

    console.log("Starting apps polling...");

    appsPollingRef.current = setInterval(async () => {
      try {
        const result = await dispatch(fetchApps(selectedProject.id)).unwrap();

        const hasInProgress = result?.some(
          (app: any) =>
            app.config_status === "in_progress"
        );

        console.log("Polling apps... in_progress:", hasInProgress);

        // stop polling when all finished
        if (!hasInProgress) {
          console.log("All apps finished → stop polling");

          dispatch(
            showSnackbar({
              message: "Application configured successfully",
              type: "success",
            })
          );

          if (appsPollingRef.current) {
            clearInterval(appsPollingRef.current);
            appsPollingRef.current = null;
          }
        }
      } catch (err) {
        console.error("Apps polling error:", err);
      }
    }, 5000); // 🔁 every 5 sec
  };

  useEffect(() => {
    if (!selectedProject?.id) return;

    dispatch(fetchApps(selectedProject.id));

  }, [dispatch, selectedProject]);

  //   useEffect(() => {
  //   return () => {
  //     stopAppsPolling();
  //   };
  // }, []);



  // const handleAdd = async (data: { name: string; description: string }) => {
  //   if (!selectedProject?.id) return;

  //   try {
  //     await dispatch(createApplication({
  //       projectId: selectedProject.id,
  //       name: data.name,
  //       description: data.description
  //     })).unwrap();

  //     console.log("[UI] Application created");

  //     dispatch(fetchApps(selectedProject.id));

  //   } catch (err) {
  //     console.error("[UI] Create failed:", err);
  //   }
  // };

  const handleAdd = async (data: { name: string; description: string }) => {
    if (!selectedProject?.id) return;

    try {
      await dispatch(
        createApplication({
          projectId: selectedProject.id,
          name: data.name,
          description: data.description,
        })
      ).unwrap();

      dispatch(fetchApps(selectedProject.id));

      dispatch(
        showSnackbar({
          message: "Application created successfully",
          type: "success",
        })
      );
    } catch (err) {
      console.error("[UI] Create failed:", err);

      dispatch(
        showSnackbar({
          message: "Failed to create application",
          type: "error",
        })
      );
    }
  };

  //   const handleClose = async () => {
  //   setOpenAdd(false)


  //   try {
  //     const result = await dispatch(fetchApps(selectedProject?.id)).unwrap();

  //     const hasInProgress = result?.some(
  //       (app: any) =>
  //         app.status === "in_progress" 
  //     );

  //     if (hasInProgress) {
  //       console.log("Some apps still running → start polling");
  //       startAppsPolling();
  //     } else {
  //       stopAppsPolling();
  //     }

  //   } catch (err) {
  //     console.error("handleClose fetch failed:", err);
  //   }
  // };

  const handleClose = async () => {
    setOpenAdd(false);

    try {
      const result = await dispatch(fetchApps(selectedProject?.id)).unwrap();

      const hasInProgress = result?.some(
        (app: any) => app.config_status === "in_progress"
      );

      console.log("Checked status after close................", result)

      if (hasInProgress) {
        startAppsPolling();
      } else {
        stopAppsPolling();
      }
    } catch (err) {
      console.error("handleClose fetch failed:", err);

      dispatch(
        showSnackbar({
          message: "Failed to refresh applications",
          type: "error",
        })
      );
    }
  };

  // const handleEdit = async (data: { name: string; description: string }) => {
  //   if (!editingApp) return;

  //   try {
  //     await dispatch(updateApplication({
  //       appId: editingApp.id,   // must be NUMBER
  //       name: data.name,
  //       description: data.description
  //     })).unwrap();

  //     console.log("[UI] Application updated");

  //     setEditingApp(null);

  //   } catch (err) {
  //     console.error("[UI] Update failed:", err);
  //   }
  // };

  const handleEdit = async (data: { name: string; description: string }) => {
    if (!editingApp) return;

    try {
      await dispatch(
        updateApplication({
          appId: editingApp.id,
          name: data.name,
          description: data.description,
        })
      ).unwrap();

      setEditingApp(null);

      dispatch(
        showSnackbar({
          message: "Application updated successfully",
          type: "success",
        })
      );
    } catch (err) {
      console.error("[UI] Update failed:", err);

      dispatch(
        showSnackbar({
          message: "Failed to update application",
          type: "error",
        })
      );
    }
  };


  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-10">
        <Activity size={64} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-medium mb-2">No Project Selected</h2>
        <p>Please select a project from the top navigation bar to get started.</p>
      </div>
    );
  }



  // const handleDelete = async (id: string) => {
  //   try {
  //     // dispatch(removeApp(id));  
  //     setSnackbar({
  //       open: true,
  //       message: "Application deleted successfully"
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      // await dispatch(removeApp(id)).unwrap();

      dispatch(
        showSnackbar({
          message: "Application deleted successfully",
          type: "success",
        })
      );
    } catch (err) {
      console.error(err);

      dispatch(
        showSnackbar({
          message: "Failed to delete application",
          type: "error",
        })
      );
    }
  };



  return (
    <Box >


      <AddApplicationDialog
        open={open}
        initialData={editingApp}
        onClose={() => {
          setOpen(false);
          setEditingApp(null);
        }}
        onSubmit={editingApp ? handleEdit : handleAdd}
      />


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          icon={<CheckCircle size={20} />}
          severity="success"
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ alignItems: "center" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="m-auto max-w-6xl p-10 ">
        {/* <Toolbar className="flex justify-between mb-6 px-4 py-2"> */}


        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Auto Analysis Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Configure and run your tests</p>
          </div>


          <Box className="flex items-center gap-2">
            {/* Search tooltip */}
            <Tooltip title="Search applications" arrow>
              <Box>
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search applications..."
                  onSearch={{}}
                />
              </Box>
            </Tooltip>


            {user?.is_staff && (
              <button
                onClick={() => {
                  setEditingApp(null);   // create mode
                  setOpen(true);         // open dialog
                }}
                className="
      px-4 py-2 rounded-md text-white bg-blue-600
      hover:bg-blue-700 transition
      flex items-center gap-2
    "
              >
                + Add Application
              </button>
            )}

          </Box>
        </div>

        {/* </Toolbar> */}

        {/* <TableContainer component={Paper} elevation={0} className="border border-slate-200">
          <Table>
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-bold text-slate-600">Application Name</TableCell>
                <TableCell className="font-bold text-slate-600">Status</TableCell>
                <TableCell className="font-bold text-slate-600">Recent Report</TableCell>
                <TableCell className="font-bold text-slate-600" align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
              ) : applications.map((app: any) => (
                <TableRow key={app.id} hover>
                  <TableCell className="font-medium text-slate-700">{app.name}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  {/* <TableCell>{app.lastReportName || '-'}</TableCell> 

                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/reports/${app.lastReportId}`)}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        minWidth: "unset",
                        fontSize: "0.875rem",
                        color: "primary.main",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                        '&:hover': {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {app.lastReportName || '-'}
                    </Button>
                  </TableCell>



                  <TableCell align="right">

                    <div className="flex justify-end items-center">

                      <PrimaryButton
                        size="small"
                        onClick={() => navigate(`/autoanalysis/${app.id}`)}
                      >
                        View
                      </PrimaryButton>
                      <button
                        onClick={() => dispatch(removeApp(app.id))}
                        className="text-red-600 hover:text-red-800 p-3 pr-4 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}


        {/* <div className="grid gap-4 justify-items-center">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : applications.map((app: any) => (
            <Paper
              key={app.id}
              elevation={1}
              className="w-8/12 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start sm:justify-between"
            >
              {/* Left: Title + Status + Build 
              <div className="flex flex-col sm:flex-1">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-slate-700 text-lg">{app.name}</div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Build / Recent Report below 
                <div className="mt-1">
                  <Button
                    variant="text"
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
                  >
                    {app.lastReportName || "-"}
                  </Button>
                </div>
              </div>

              {/* Right: Action Buttons 
              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                <PrimaryButton
                  size="small"
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                >
                  View
                </PrimaryButton>
                <button
                  onClick={() => dispatch(removeApp(app.id))}
                  className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Paper>
          ))}
        </div> */}



        {/* <div className="space-y-4 w-full mx-auto">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Left section: title and description 
              <div>

                <div className="flex items-center space-x-3 mb-1">
                  <div className="text-base font-semibold text-gray-900">{app.name}</div>
                  <StatusBadge status={app.status} />
                </div> */}

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
                <div className="text-xs text-gray-400 mt-0.5">{app.info}</div> */}


        {/* <div className="mt-2 flex items-center space-x-2">
                  <div className="text-xs text-gray-500">
                    Recent Build:
                  </div>
                  <a
                    href={`/reports/${app.lastReportId}`}
                    onClick={e => {
                      e.preventDefault();
                      navigate(`/reports/${app.lastReportId}`);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
                  >
                    {app.lastReportName || "-"}
                  </a>
                </div>




              </div>

              {/* Right section: icons and button 
              <div className="flex items-center space-x-3">
                {/* Edit icon 
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit"
                >
                  <EditIcon className="w-5 h-5" />
                </button>

                {/* Delete icon 
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>

                {/* View Collection button 
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div> */}

        <div className="space-y-4 w-full mx-auto">
          {filteredApplications.length > 0 ? filteredApplications.map((app) => (
            <InfoCard
              name={app.name}
              // recentBuild={{ id: app.latest_build, name: app.latest_build, link: `/autoanalysis/${app.id}/reports/b1` }}
              recentBuild={{
                id: app.latest_build,
                name: app.latest_build,
                link: `/autoanalysis/projects/${selectedProject.id}/apps/${app.id}/result/${app.latest_build}`,
                state: {
                  projectName: selectedProject.name,
                  appName: app.name
                }
              }}
              status={app.config_status}
              // onDelete={() => handleDelete(app.id)}
              onView={() => navigate(`/autoanalysis/${app.id}`)}
              onUnconfigured={() => {
                setSelectedApplicationId(app.id);
                setSelectedApplicationName(app.name);
                setStage("new");
                setOpenAdd(true);
              }}
              onProgress={() => {
                setSelectedApplicationId(app.id);
                setSelectedApplicationName(app.name);
                setStage("in_progress");
                setOpenAdd(true);
              }}
            />
          )) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 p-10">
              <Activity size={64} className="mb-4 text-gray-300" />
              <h2 className="text-xl font-medium mb-2">No Application Added</h2>
              <p>Please Add an application.</p>
            </div>
          )}
        </div>



        <AddApplicationModal open={openAdd} onClose={handleClose} selectedApplicationId={selectedApplicationId} selectedApplicationName={selectedApplicationName} projectId={selectedProject.id} stage={stage} />
        <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
      </div>

    </Box>
  );
};