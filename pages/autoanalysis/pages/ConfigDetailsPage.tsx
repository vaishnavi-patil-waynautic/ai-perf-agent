import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Paper, Typography, Button, IconButton,
    List, ListItem, ListItemText, TextField, Divider,
    ListItemButton,
    Collapse,
    Tooltip
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack, Delete, ExpandMore, ExpandLess, Add } from '@mui/icons-material';
import { fetchConfig, updateRecipientsLocal } from '../store/autoAnalysisSlice';
import { updateEmailRecipients, downloadScript } from '../services/mockService';
import Grid from "@mui/material/Grid";
import Close from '@mui/icons-material/Close';
import { RootState } from '@/store/store';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';
import { showSnackbar } from '@/store/snackbarStore';

const IntegrationTile = ({
    title,
    active,
    link,
    onClick,
}: {
    title: string;
    active: boolean;
    link?: string | null;
    onClick?: () => void;
}) => {

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!active) return;

        if (onClick) {
            onClick();
            return;
        }

        if (link) {
            window.open(link, "_blank");
        }
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer h-full"
        >
            <div
                className={`
                h-full
                p-4 rounded-2xl shadow-xl
                transition-transform transition-shadow duration-300 ease-out
                hover:scale-[1.03]
                flex flex-col justify-between

                ${active
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                        : "bg-white text-gray-800 border-2 border-yellow-400"
                    }
            `}
            >
                <div className="flex items-start justify-between">

                    <div className="flex flex-col">
                        <p className={`text-sm mb-2 font-medium ${active ? "text-white" : "text-gray-600"}`}>
                            {title}
                        </p>

                        <span
                            className={`
    inline-flex items-center justify-center
    px-2 py-1 rounded-full text-[11px] font-medium w-fit
    ${active
                                    ? "bg-white/20 text-white"
                                    : "bg-yellow-100 text-yellow-800"}
  `}
                        >
                            {active ? "Configured" : "Not Configured"}
                        </span>
                    </div>

                    {active ? (
                        <CheckCircle className="text-green-200" fontSize="small" />
                    ) : (
                        <Cancel className="text-yellow-500" fontSize="small" />
                    )}

                </div>
            </div>
        </div>
    );
};

export const ConfigDetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const prevProjectId = useRef<number | null>(null);

    const { currentApp } = useSelector((state: RootState) => state.autoAnalysis);
    const { selectedProject } = useSelector((state: RootState) => state.project);

    const [emailInput, setEmailInput] = useState('');
    const [collapsed, setCollapsed] = useState(true);
    const [showEmailInput, setShowEmailInput] = useState(false);

    // Section collapse states
    const [openIntegrations, setOpenIntegrations] = useState(false);
    const [openBuilds, setOpenBuilds] = useState(false);
    const [openExecution, setOpenExecution] = useState(false);
    const [openPerf, setOpenPerf] = useState(false);
    const [openEmails, setOpenEmails] = useState(false);

    const prevAppRef = useRef<typeof currentApp | null>(null);


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'success' as SnackbarType,
    });




    useEffect(() => {
        if (!selectedProject?.id || !id) return;

        // Navigate if project changes
        if (prevProjectId.current && prevProjectId.current !== selectedProject.id) {
            navigate("/autoanalysis");
        }

        prevProjectId.current = selectedProject.id;

        dispatch(fetchConfig({
            projectId: selectedProject.id,
            appId: Number(id)
        }));

    }, [id, selectedProject?.id]);


    useEffect(() => {
        if (!currentApp) return;

        const prev = prevAppRef.current;

        if (prev?.config?.recipient_list !== currentApp.config.recipient_list) {
            console.log("Email list changed");
        }

        if (prev?.builds?.[0]?.build_number !== currentApp.builds?.[0]?.build_number) {
            console.log("New build arrived");
        }

        prevAppRef.current = currentApp;

    }, [currentApp]);



    if (!currentApp || !currentApp.config) {
        return <Box p={4}>Loading Configuration...</Box>;
    }

    const handleDownloadScript = async () => {
        try {
            if (!selectedProject?.id || !currentApp?.config?.application_id) return;

            const blob = await downloadScript(
                selectedProject.id,
                currentApp.config.application_id
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `script-${currentApp.config.application_name}.jmx`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            dispatch(
                showSnackbar({
                    message: "Script downloaded successfully",
                    type: "success",
                })
            );
        } catch (err: any) {
            console.error(err);

            dispatch(
                showSnackbar({
                    message: err?.message || "Download failed",
                    type: "error",
                })
            );
        }
    };


    const handleAddEmail = async () => {
        if (!emailInput.trim()) return;
        if (!selectedProject?.id || !currentApp?.config?.application_id) return;

        const existingEmails =
            currentApp.config?.recipient_list
                ?.split(",")
                .map(e => e.trim())
                .filter(Boolean) ?? [];

        const newEmails = [...existingEmails, emailInput.trim()];

        try {
            await updateEmailRecipients(
                selectedProject.id,
                currentApp.config.application_id,
                newEmails
            );

            dispatch(updateRecipientsLocal(newEmails));

            dispatch(
                showSnackbar({
                    message: "Recipients updated successfully",
                    type: "success",
                })
            );
        } catch (err: any) {
            const msg =
                err?.data?.error?.recipient_list?.[0] ||
                err?.message ||
                "Failed to update recipients";

            dispatch(
                showSnackbar({
                    message: msg,
                    type: "error",
                })
            );
        }

        setEmailInput("");
    };

    const handleRemoveEmail = async (email: string) => {
        if (!selectedProject?.id || !currentApp?.config?.application_id) return;

        const existingEmails =
            currentApp.config?.recipient_list
                ?.split(",")
                .map(e => e.trim())
                .filter(Boolean) ?? [];

        const updatedEmails = existingEmails.filter(e => e !== email);

        try {
            await updateEmailRecipients(
                selectedProject.id,
                currentApp.config.application_id,
                updatedEmails
            );

            dispatch(
                fetchConfig({
                    projectId: selectedProject.id,
                    appId: Number(id),
                })
            );

            dispatch(
                showSnackbar({
                    message: "Recipient removed successfully",
                    type: "success",
                })
            );
        } catch (err: any) {
            const msg =
                err?.data?.error?.recipient_list?.[0] ||
                err?.message ||
                "Failed to update recipients";

            dispatch(
                showSnackbar({
                    message: msg,
                    type: "error",
                })
            );
        }
    };






    const SectionHeader = ({
        title,
        open,
        toggle
    }: {
        title: string;
        open: boolean;
        toggle: () => void;
    }) => (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ cursor: "pointer", mb: 1 }}
            onClick={toggle}
        >
            <Typography variant="h6">{title}</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
    );


    // console.log("Failuers and warnings : ", currentApp?.failures, currentApp?.warnings, (currentApp?.failures?.length || currentApp?.warnings?.length))


    return (
        <Box className="bg-slate-50 min-h-screen m-auto max-w-6xl p-10">

            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/autoanalysis')}
                sx={{
                    mb: 2,
                    color: "#5c5f66",
                    textTransform: "none",
                    fontWeight: 500,
                    paddingBottom: 1,
                }}
            >
                Back to Dashboard
            </Button>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            />

            <Paper sx={{ p: 6, borderRadius: 4 }}>

                {/* <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 5 }}>
                    Configuration: {currentApp.config.application_name}
                </Typography> */}
                {/* 
                <Typography
  variant="h5"
  sx={{
    fontWeight: 700,
    mb: 3,
    color: "primary.main",
    letterSpacing: 0.5,
  }}
>
  Configuration: {currentApp.config.application_name}
</Typography> */}



                <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
                    Configuration:{" "}
                    <span style={{ color: "#0a5de2ff" }}>
                        {currentApp.config.application_name}
                    </span>
                </Typography>

                {/* ================= Integrations ================= */}
                <div className='border-b pb-6 text-gray-800'>
                    <SectionHeader
                        title="Integrations Overview"
                        open={openIntegrations}
                        toggle={() => setOpenIntegrations(!openIntegrations)}
                    />

                    <Collapse in={openIntegrations}>


                        {/* ================= Compact Status Messages ================= */}
                        {(currentApp?.failures?.length > 0 || currentApp?.warnings?.length > 0) && (
                            <div className="mt-5 space-y-2 mb-5">

                                {currentApp.failures?.map((f, idx) => (
                                    <div
                                        key={`fail-${idx}`}
                                        className="
                                            w-full
                                            bg-red-50/70 border border-red-200
                                            rounded-lg px-3 py-1
                                            text-xs
                                            flex items-start gap-2
                                            "
                                    >
                                        <div className="w-1.5 rounded bg-red-500 mt-0.5" />

                                        <div className="leading-snug">
                                            <span className="font-semibold text-red-700">
                                                Failure • {f.field}
                                            </span>
                                            <span className="text-red-600 ml-2">
                                                {f.message}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {currentApp?.warnings?.map((w, idx) => (
                                    <div
                                        key={`warn-${idx}`}
                                        className="
                                            w-full
                                            bg-yellow-50/70 border border-yellow-200
                                            rounded-lg px-3 py-1
                                            text-xs
                                            flex items-start gap-2
                                            "
                                    >
                                        <div className="w-1.5 rounded bg-yellow-500 mt-0.5" />

                                        <div className="leading-snug">
                                            <span className="font-semibold text-yellow-700">
                                                Warning • {w.field}
                                            </span>
                                            <span className="text-yellow-700 ml-2">
                                                {w.message}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mt-4 items-stretch">

                            <Tooltip title={currentApp.config.script_file_name || "No script available"}>
                                <span>
                                    <IntegrationTile
                                        title="Script"
                                        active={
                                            currentApp.config.script_id !== null ||
                                            currentApp.config.script_file_configured === true
                                        }
                                        onClick={handleDownloadScript}
                                    />
                                </span>
                            </Tooltip>

                            <IntegrationTile
                                title="GitHub"
                                active={currentApp.config.github_configured == true}
                                link={currentApp.config.gha_repo_url}
                            />

                            <IntegrationTile
                                title="BlazeMeter"
                                active={currentApp.config.blazemeter_configured == true}
                                link={currentApp.config.blazemeter_url}
                            />

                            <IntegrationTile
                                title="Azure DevOps"
                                active={currentApp.config.ado_configured == true}
                                link={currentApp.config.ado_url}
                            />

                            <IntegrationTile
                                title="Datadog"
                                active={currentApp.config.datadog_configured == true}
                                link={currentApp.config.datadog_url}
                            />

                        </div>
                    </Collapse>

                </div>

                {/* ================= Build History ================= */}
                <div className='border-b py-6  text-gray-800'>
                    <SectionHeader
                        title="Build History"
                        open={openBuilds}
                        toggle={() => setOpenBuilds(!openBuilds)}
                    />

                    <Collapse in={openBuilds}>

                        <List>
                            {currentApp?.builds?.length > 0 ? (
                                <>
                                    {/* Recent Build */}
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() =>
                                                navigate(
                                                    `/autoanalysis/projects/${currentApp.config.project_id}/apps/${currentApp.config.application_id}/result/${currentApp.builds[0].build_number}`,
                                                    {
                                                        state: {
                                                            projectName: selectedProject?.name,
                                                            appName: currentApp.config.application_name
                                                        }
                                                    }
                                                )
                                            }

                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1.5,
                                                cursor: "pointer",
                                                bgcolor: "background.paper",
                                                boxShadow: 1,
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    bgcolor: "#edf0f3ff", // light blue hover
                                                    color: "#111827",   // dark blue text
                                                    boxShadow: 4,
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={currentApp.builds[0].build_number}
                                                secondary={currentApp.builds[0].test_timing}
                                            />
                                            {/* <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentApp.builds[0].status === 'pass' ? 'bg-green-100 text-green-700' :
                                                    currentApp.builds[0].status === 'fail' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {currentApp.builds[0].status}
                                                </Box> */}
                                        </ListItemButton>
                                    </ListItem>

                                    {/* Older builds collapsible */}
                                    {currentApp?.builds?.length > 1 && (
                                        <>

                                            <div className='mt-8'>
                                                <ListItemButton sx={{ color: "primary.dark", }} onClick={() => setCollapsed(!collapsed)}>
                                                    <ListItemText primary="Older Builds" primaryTypographyProps={{ fontWeight: "bold" }} />
                                                    {collapsed ? <ExpandMore /> : <ExpandLess />}
                                                </ListItemButton>
                                            </div>

                                            <Collapse in={!collapsed} timeout="auto" unmountOnExit>
                                                {currentApp.builds.slice(1).map((build) => (
                                                    <ListItemButton
                                                        key={build.build_number}
                                                        sx={{
                                                            marginY: 1,
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            borderRadius: 2,
                                                            px: 2,
                                                            py: 1.5,
                                                            cursor: "pointer",
                                                            bgcolor: "background.paper",
                                                            boxShadow: 1,
                                                            transition: "all 0.2s",
                                                            "&:hover": {
                                                                bgcolor: "#edf0f3ff", // light grey that keeps text readable
                                                                color: "#111827",
                                                                transform: "scale(1.02)",
                                                            },

                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/autoanalysis/projects/${currentApp.config.project_id}/apps/${currentApp.config.application_id}/result/${build.build_number}`,
                                                                {
                                                                    state: {
                                                                        projectName: selectedProject?.name,
                                                                        appName: currentApp.config.application_name
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={build.build_number}
                                                            secondary={build.test_timing}
                                                        />
                                                        {/* <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${build.status === 'pass' ? 'bg-green-100 text-green-700' :
                                                                build.status === 'fail' ? 'bg-red-100 text-red-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                {build.status}
                                                            </Box> */}
                                                    </ListItemButton>
                                                ))}
                                            </Collapse>
                                        </>
                                    )}
                                </>
                            ) : (

                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.disabled", pl: 2, pt: 1 }}
                                >
                                    No build found
                                </Typography>

                            )

                            }
                        </List>


                    </Collapse>
                </div>

                <div className='border-b py-6  text-gray-800'>
                    <SectionHeader
                        title="Execution Strategy"
                        open={openExecution}
                        toggle={() => setOpenExecution(!openExecution)}
                    />

                    <Collapse in={openExecution}>
                        <Box display="flex" justifyContent="space-between" mt={2}>

                            <Typography>
                                Current Mode: <b>{currentApp.config.run_schedule ?? "NOT SET"}</b>
                            </Typography>

                            <Button
                                variant="contained"
                                disabled={!currentApp.config.gha_workflow || !currentApp.config.github_configured}
                                onClick={() => {
                                    if (!currentApp.config.gha_workflow) return;

                                    window.open(currentApp.config.gha_workflow, "_blank", "noopener,noreferrer");
                                }}
                            >
                                Run Now
                            </Button>

                        </Box>
                    </Collapse>

                </div>

                {currentApp.config.nfrLink && (
                    <div className='border-b py-6 text-gray-800'>
                        <SectionHeader
                            title="Performance Test Strategy"
                            open={openPerf}
                            toggle={() => setOpenPerf(!openPerf)}
                        />

                        <Collapse in={openPerf}>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button variant="contained">View</Button>
                            </Box>
                        </Collapse>
                    </div>
                )}

                <div className='py-6  text-gray-800'>
                    <SectionHeader
                        title="Email Recipients"
                        open={openEmails}
                        toggle={() => setOpenEmails(!openEmails)}
                    />

                    <Collapse in={openEmails}>

                        {(
                            <Box className="flex gap-2 mb-4 mt-4 px-3">
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="email@example.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        handleAddEmail();
                                        setEmailInput(""); // optional: clear input after adding
                                    }}
                                >
                                    Add
                                </Button>
                            </Box>
                        )}

                        {currentApp.config?.recipient_list ? (

                            <List dense>
                                {currentApp.config.recipient_list.split(",").map((email: string) => (
                                    <ListItem key={email}>
                                        <ListItemText primary={email} />
                                        <IconButton size="small" onClick={() => handleRemoveEmail(email)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>

                        ) : (

                            <Typography
                                variant="body2"
                                sx={{ color: "text.disabled", pl: 1 }}
                            >
                                No email recipient configured for this application
                            </Typography>

                        )}

                    </Collapse>
                </div>

            </Paper>
        </Box>
    );
};
