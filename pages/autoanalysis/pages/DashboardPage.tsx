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
  const pollingUrlRef = useRef<string | null>(null);
  const inProgressAppsRef = useRef<Map<string, string>>(new Map());

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: ""
  });

  const appsPollingRef = useRef<NodeJS.Timeout | null>(null);


  const stopAppsPolling = () => {
    if (appsPollingRef.current) {
      clearInterval(appsPollingRef.current);
      appsPollingRef.current = null;
      console.log("Stopeed Polling !!! ");
    }
  };


  const hasInProgress = (result) => {
    return result?.some(
      (app: any) =>
        app.config_status === "in_progress"
    );
  };

  const startAppsPolling = async () => {
    if (!selectedProject?.id) return;

    if (appsPollingRef.current) return;

    console.log("Starting apps polling...");

    pollingUrlRef.current = window.location.pathname;

    console.log("Current Autoanalysis URL:", pollingUrlRef.current);

    appsPollingRef.current = setInterval(async () => {
      try {

        // Stop polling if URL changed
        if (window.location.pathname !== pollingUrlRef.current) {
          console.log("URL changed → stopping polling");

          clearInterval(appsPollingRef.current!);
          appsPollingRef.current = null;
          pollingUrlRef.current = null;

          return;
        }

        console.log("Polling apps for project:", selectedProject.id);

        const result = await dispatch(fetchApps(selectedProject.id)).unwrap();

        result.forEach((app: any) => {

          const trackedAppName = inProgressAppsRef.current.get(app.id);

          // If app was previously in progress and now finished
          if (trackedAppName && app.config_status !== "in_progress") {

            console.log("Status updated for:", trackedAppName, app.config_status);

            if (app.config_status === "completed" || app.config_status === "configured") {
              dispatch(
                showSnackbar({
                  message: `${trackedAppName} configured successfully`,
                  type: "success",
                })
              );
            } else if (app.config_status === "failed") {
              dispatch(
                showSnackbar({
                  message: `${trackedAppName} configuration failed`,
                  type: "error",
                })
              );
            }

            // Remove from tracking
            inProgressAppsRef.current.delete(app.id);
          }
        });

        // Stop polling when no apps left
        if (inProgressAppsRef.current.size === 0) {
          console.log("All apps finished → stop polling");

          clearInterval(appsPollingRef.current!);
          appsPollingRef.current = null;
        }

      } catch (err) {
        console.error("Apps polling error:", err);
      }
    }, 5000);
  };


  const fetchApplications = async () => {

    const result = await dispatch(fetchApps(selectedProject.id)).unwrap();

    stopAppsPolling();

    console.log("application in useeffect ", result)

    const inProgressApps = result?.filter(
      (app: any) => app.config_status === "in_progress"
    );

    if (inProgressApps?.length) {

      inProgressApps.forEach((app: any) => {
        inProgressAppsRef.current.set(app.id, app.name);
      });

      startAppsPolling();
    }

  }

  useEffect(() => {
    if (!selectedProject?.id) return;

    console.log("SELECTED PROJECT IN Useeffect : ", selectedProject);

    fetchApplications();
    setSearch("");

  }, [dispatch, selectedProject]);


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

      const result = await dispatch(fetchApps(selectedProject.id)).unwrap();

      // Check if any apps are in progress and start polling
      const inProgressApps = result?.filter(
        (app: any) => app.config_status === "in_progress"
      );

      if (inProgressApps?.length) {
        inProgressApps.forEach((app: any) => {
          inProgressAppsRef.current.set(app.id, app.name);
        });
        startAppsPolling();
      }

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


  const handleClose = async () => {
    setOpenAdd(false);

    try {
      const result = await dispatch(fetchApps(selectedProject?.id)).unwrap();

      const inProgressApps = result?.filter(
        (app: any) => app.config_status === "in_progress"
      );

      console.log("Checked status after close................", result)

      if (inProgressApps?.length) {
        // Add all in-progress apps to tracking map
        inProgressApps.forEach((app: any) => {
          inProgressAppsRef.current.set(app.id, app.name);
        });

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


  const handleDelete = async (id: string) => {
    try {

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