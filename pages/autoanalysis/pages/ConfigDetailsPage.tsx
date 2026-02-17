// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   Box, Paper, Typography, Button, IconButton, 
//   List, ListItem, ListItemText, TextField, Divider 
// } from '@mui/material';
// import { CheckCircle, Cancel, ArrowBack, Delete } from '@mui/icons-material';
// import { fetchConfig } from '../store/autoAnalysisSlice';
// import { updateEmailRecipients } from '../services/mockService';
// import Grid from "@mui/material/Grid";


// const IntegrationTile = ({ title, active }: { title: string, active: boolean }) => (
//   <Paper 
//     elevation={0} 
//     className={`p-4 border-l-4 ${active ? 'border-green-500' : 'border-amber-400'} border border-slate-200 rounded-lg`}
//   >
//     <div className="flex justify-between items-center">
//       <Typography variant="subtitle2" className="text-slate-700">{title}</Typography>
//       {active ? <CheckCircle className="text-green-500" fontSize="small" /> : <Cancel className="text-amber-400" fontSize="small" />}
//     </div>
//     <Typography variant="caption" className="text-slate-500">
//       {active ? 'Configured' : 'Not Configured'}
//     </Typography>
//   </Paper>
// );

// export const ConfigDetailsPage: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<any>();
//   // @ts-ignore
//   const { currentApp } = useSelector((state) => state.autoAnalysis);
//   const [emailInput, setEmailInput] = useState('');

//   useEffect(() => {
//     if (id) dispatch(fetchConfig(id));
//   }, [id, dispatch]);

//   if (!currentApp) return <Box p={4}>Loading Configuration...</Box>;

//   const handleAddEmail = () => {
//     if (emailInput) {
//       const newEmails = [...currentApp.emailRecipients, emailInput];
//       updateEmailRecipients(newEmails); // Mock API
//       // In real app, dispatch update action to store
//       setEmailInput('');
//     }
//   };

//   return (
//     <Box className="p-6 bg-slate-50 min-h-screen">
//       <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>

//       <Typography variant="h5" className="font-bold text-slate-800 mb-6">
//         Configuration: App ID {currentApp.id}
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Left Col: Integrations */}
//         <Grid item xs={12} md={8}>
//           <Paper className="p-6 mb-6" elevation={0} variant="outlined">
//             <Typography variant="h6" gutterBottom>Integrations Overview</Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={6} sm={4}><IntegrationTile title="GitHub" active={currentApp.integrations.github} /></Grid>
//               <Grid item xs={6} sm={4}><IntegrationTile title="BlazeMeter" active={currentApp.integrations.blazemeter} /></Grid>
//               <Grid item xs={6} sm={4}><IntegrationTile title="CI/CD" active={currentApp.integrations.cicd} /></Grid>
//               <Grid item xs={6} sm={4}><IntegrationTile title="Load Gen" active={currentApp.integrations.loadGenerator} /></Grid>
//               <Grid item xs={6} sm={4}><IntegrationTile title="Azure DevOps" active={currentApp.integrations.ado} /></Grid>
//               <Grid item xs={6} sm={4}><IntegrationTile title="Datadog" active={currentApp.integrations.datadog} /></Grid>
//             </Grid>
//           </Paper>

//           <Paper className="p-6" elevation={0} variant="outlined">
//              <Typography variant="h6" gutterBottom>Build History</Typography>
//              <List>
//                {currentApp.builds.map((build: any) => (
//                  <ListItem 
//                     key={build.id} 
//                     button 
//                     divider
//                     onClick={() => navigate(`result/${build.id}`)}
//                     className="hover:bg-slate-50"
//                   >
//                    <ListItemText 
//                      primary={build.name} 
//                      secondary={build.date} 
//                    />
//                    <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${
//                      build.status === 'pass' ? 'bg-green-100 text-green-700' : 
//                      build.status === 'fail' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
//                    }`}>
//                      {build.status}
//                    </Box>
//                  </ListItem>
//                ))}
//              </List>
//           </Paper>
//         </Grid>

//         {/* Right Col: Strategy & Emails */}
//         <Grid item xs={12} md={4}>
//           <Paper className="p-6 mb-6" elevation={0} variant="outlined">
//             <Typography variant="h6" gutterBottom>Execution Strategy</Typography>
//             <Typography variant="body2" color="textSecondary" className="mb-4">
//               Current Mode: <strong>{currentApp.executionStrategy.toUpperCase()}</strong>
//             </Typography>
//             <Typography variant="caption" display="block" className="mb-4">
//               {currentApp.executionStrategy === 'automated' 
//                 ? 'Tests run automatically after every deployment to the staging environment.'
//                 : 'Tests must be triggered manually via CI/CD or this dashboard.'}
//             </Typography>
//             <Button variant="contained" fullWidth disableElevation color="primary">
//               Run Now
//             </Button>
//           </Paper>

//           <Paper className="p-6" elevation={0} variant="outlined">
//             <Typography variant="h6" gutterBottom>Email Recipients</Typography>
//             <Box className="flex gap-2 mb-4">
//               <TextField 
//                 size="small" 
//                 fullWidth 
//                 placeholder="email@example.com" 
//                 value={emailInput}
//                 onChange={(e) => setEmailInput(e.target.value)}
//               />
//               <Button variant="outlined" onClick={handleAddEmail}>Add</Button>
//             </Box>
//             <List dense>
//               {currentApp.emailRecipients.map((email: string) => (
//                 <ListItem key={email}>
//                   <ListItemText primary={email} />
//                   <IconButton size="small"><Delete fontSize="small" /></IconButton>
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Paper, Typography, Button, IconButton,
    List, ListItem, ListItemText, TextField, Divider,
    ListItemButton,
    Collapse
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack, Delete, ExpandMore, ExpandLess, Add } from '@mui/icons-material';
import { fetchConfig } from '../store/autoAnalysisSlice';
import { updateEmailRecipients, downloadScript } from '../services/mockService';
import Grid from "@mui/material/Grid";
import Close from '@mui/icons-material/Close';
import { RootState } from '@/store/store';
import AppSnackbar, { SnackbarType } from '@/components/AppSnackbar';

// ✅ FIX: Use MUI Grid v2


// const IntegrationTile = ({ title, active, link }: { title: string, active: boolean, link: string }) => (
//     <Paper
//         elevation={0}
//         onClick={() => window.location.href = link}
//         className={`p-4 border-l-4 ${active ? 'border-green-500' : 'border-amber-400'} border border-slate-200 rounded-lg`}
//     >
//         <div className="flex justify-between items-center">
//             <Typography variant="subtitle2" className="text-slate-700">{title}</Typography>
//             {active ? <CheckCircle className="text-green-500" fontSize="small" /> : <Cancel className="text-amber-400" fontSize="small" />}
//         </div>
//         <Typography variant="caption" className="text-slate-500">
//             {active ? 'Configured' : 'Not Configured'}
//         </Typography>
//     </Paper>
// );

// const IntegrationTile = ({
//     title,
//     active,
//     link,
// }: {
//     title: string;
//     active: boolean;
//     link: string;
//     onClick?: () => void;
// }) => (
//     <>

//         <a
//             href={link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block cursor-pointer"
//         >
//             <div className="max-w-xl">

//                 <div
//                     className={`
//     p-4 rounded-2xl shadow-xl
//     transition-transform transition-shadow duration-300 ease-out
//     hover:scale-[1.03] 

//     ${active
//                             ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border border-transparent"
//                             : "bg-white text-gray-800 border-2 border-yellow-400"
//                         }
//   `}
//                 >
//                     <div className="flex items-start justify-between">
//                         <div>
//                             <p
//                                 className={`text-sm mb-2 ${active ? "text-white font-medium" : "text-gray-600"
//                                     }`}
//                             >
//                                 {title}
//                             </p>

//                             <span
//                                 className={`px-2 py-1 rounded-full text-[11px] font-medium ${active
//                                     ? "bg-white/20 text-white"
//                                     : "bg-yellow-100 text-yellow-800"
//                                     }`}
//                             >
//                                 {active ? "Configured" : "Not Configured"}
//                             </span>
//                         </div>

//                         {active ? (
//                             <CheckCircle className="text-green-300" fontSize="small" />
//                         ) : (
//                             <Cancel className="text-yellow-500" fontSize="small" />
//                         )}
//                     </div>
//                 </div>

//             </div>
//         </a>

//     </>
// );

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
            onClick(); // Script download
            return;
        }

        if (link) {
            window.open(link, "_blank"); // Open external link
        }
    };

    return (
        <div onClick={handleClick} className="block cursor-pointer">
            <div className="max-w-xl">
                <div
                    className={`
            p-4 rounded-2xl shadow-xl
            transition-transform transition-shadow duration-300 ease-out
            hover:scale-[1.03]

            ${active
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                            : "bg-white text-gray-800 border-2 border-yellow-400"
                        }
          `}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className={`text-sm mb-2 ${active ? "text-white font-medium" : "text-gray-600"}`}>
                                {title}
                            </p>

                            <span
                                className={`px-2 py-1 rounded-full text-[11px] font-medium ${active ? "bg-white/20 text-white" : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {active ? "Configured" : "Not Configured"}
                            </span>
                        </div>

                        {active ? (
                            <CheckCircle className="text-green-300" fontSize="small" />
                        ) : (
                            <Cancel className="text-yellow-500" fontSize="small" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



// export const ConfigDetailsPage: React.FC = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch<any>();
//     // @ts-ignore
//     const { currentApp } = useSelector(
//         (state: RootState) => state.autoAnalysis
//     );

//     const [emailInput, setEmailInput] = useState('');
//     const [collapsed, setCollapsed] = React.useState(true);
//     const [showEmailInput, setShowEmailInput] = useState(false);

//     const { selectedProject } = useSelector((state: RootState) => state.project);

//     const [snackbar, setSnackbar] = useState<{
//         open: boolean;
//         message: string;
//         type: SnackbarType;
//     }>({
//         open: false,
//         message: '',
//         type: 'success',
//     });


//     useEffect(() => {
//         if (!selectedProject?.id || !id) return;

//         console.log("Before fetching autoanalysis : ", currentApp);

//         dispatch(fetchConfig({
//             projectId: selectedProject.id,
//             appId: Number(id)
//         }));

//         console.log("After fetching autoanalysis : ", currentApp);
//     }, [id, selectedProject?.id]);


//     useEffect(() => {
//         if (!currentApp) return;

//         console.log("currentApp changed → update UI / derived state");

//     }, [currentApp]);   // ✔ allowed here (NO dispatch inside)


//     if (!currentApp || !currentApp.config) {
//         return <Box p={4}>Loading Configuration...</Box>;
//     }


//     const handleAddEmail = () => {
//         if (!emailInput.trim()) return;

//         console.log("Update Recipient Before:", currentApp.config.recipient_list);

//         const existingEmails =
//             currentApp.config?.recipient_list
//                 ?.split(",")
//                 .map(e => e.trim())
//                 .filter(Boolean) ?? [];

//         const newEmails = [...existingEmails, emailInput.trim()];

//         console.log("Update Recipient After:", newEmails);



//         try {
//             updateEmailRecipients(
//                 selectedProject.id,
//                 currentApp.config.application_id,
//                 newEmails
//             );

//             setSnackbar({
//                 open: true,
//                 message: "Recipients updated successfully",
//                 type: "success"
//             });

//         } catch (err: any) {


//             console.log("Entered Catch ", err?.data?.error?.recipient_list?.[0], " ||| ", err?.message  )

//             // 🔥 Extract backend error safely
//             const msg =
//                 err?.data?.error?.recipient_list?.[0] ||
//                 err?.message ||
//                 "Failed to update recipients";

//             setSnackbar({
//                 open: true,
//                 message: msg,
//                 type: "error"
//             });
//         }


//         setEmailInput("");
//     };


//     function handleRemoveEmail(email: string): void {
//         throw new Error('Function not implemented.');
//     }

//     return (
//         <Box className="bg-slate-50 min-h-screen m-auto max-w-6xl p-10">


//             <Button
//                 startIcon={<ArrowBack />}
//                 onClick={() => navigate('/autoanalysis')}
//                 sx={{
//                     mb: 1,
//                     color: "#5c5f66",
//                     textTransform: "none",
//                     fontWeight: 500,
//                 }}
//             >
//                 Back to Dashboard
//             </Button>


//             <Paper
//                 elevation={0}
//                 sx={{
//                     borderRadius: "12px",
//                     background: "#ffffff",
//                     border: "1px solid #e4e6eb",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//                     p: 3,
//                     mt: 1,
//                 }}
//             >

//                 <Typography
//                     variant="h5"
//                     className="pt-6 pl-6"
//                     sx={{ fontWeight: 'bold', color: 'text.primary' }}
//                 >
//                     Configuration: {currentApp.config?.application_name}
//                 </Typography>


//                 <Grid container spacing={4}>

//                     <div className="w-full p-6">


//                         <div className='mt-6 border-b pb-6'>


//                             <Typography variant="h6" gutterBottom>
//                                 Integrations Overview
//                             </Typography>


//                             <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
//                                 <IntegrationTile title="Script" active={currentApp.config.script_id !== null} link={String(currentApp.config.script_id)} />
//                                 <IntegrationTile title="GitHub" active={currentApp.config.gha_repo_url !== null} link={currentApp.config.gha_repo_url} />
//                                 <IntegrationTile title="BlazeMeter" active={currentApp.config.blazemeter_url !== null} link={currentApp.config.blazemeter_url} />
//                                 {/* <IntegrationTile title="CI/CD" active={currentApp.integrations.cicd} link={"https://github.com/"} /> */}
//                                 <IntegrationTile title="Azure DevOps" active={currentApp.config.ado_url !== null} link={currentApp.config.ado_url} />
//                                 <IntegrationTile title="Datadog" active={currentApp.config.datadog_url !== null} link={currentApp.config.datadog_url} />
//                             </div>

//                         </div>

//                         <div className='mt-6 border-b pb-6'>

//                             <Typography variant="h6" gutterBottom>Build History</Typography>

//                             <List>
//                                 {/* Most recent build */}
//                                 {currentApp?.builds?.length > 0 ? (
//                                     <>
//                                         {/* Recent Build */}
//                                         <ListItem disablePadding>
//                                             <ListItemButton
//                                                 onClick={() =>
//                                                     navigate(
//                                                         `/autoanalysis/projects/${currentApp.config.project_id}/apps/${currentApp.config.application_id}/result/${currentApp.builds[0].build_number}`,
//                                                         {
//                                                             state: {
//                                                                 projectName: selectedProject.name,
//                                                                 appName: currentApp.config.application_name
//                                                             }
//                                                         }
//                                                     )

//                                                 }

//                                                 sx={{
//                                                     display: "flex",
//                                                     justifyContent: "space-between",
//                                                     alignItems: "center",
//                                                     borderRadius: 2,
//                                                     px: 2,
//                                                     py: 1.5,
//                                                     cursor: "pointer",
//                                                     bgcolor: "background.paper",
//                                                     boxShadow: 1,
//                                                     transition: "all 0.2s",
//                                                     "&:hover": {
//                                                         bgcolor: "#edf0f3ff", // light blue hover
//                                                         color: "#111827",   // dark blue text
//                                                         boxShadow: 4,
//                                                         transform: "scale(1.02)",
//                                                     },
//                                                 }}
//                                             >
//                                                 <ListItemText
//                                                     primary={currentApp.builds[0].build_number}
//                                                     secondary={currentApp.builds[0].test_timing}
//                                                 />
//                                                 {/* <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentApp.builds[0].status === 'pass' ? 'bg-green-100 text-green-700' :
//                                                     currentApp.builds[0].status === 'fail' ? 'bg-red-100 text-red-700' :
//                                                         'bg-orange-100 text-orange-700'
//                                                     }`}>
//                                                     {currentApp.builds[0].status}
//                                                 </Box> */}
//                                             </ListItemButton>
//                                         </ListItem>

//                                         {/* Older builds collapsible */}
//                                         {currentApp?.builds?.length > 1 && (
//                                             <>

//                                                 <div className='mt-8'>
//                                                     <ListItemButton sx={{ color: "primary.dark", }} onClick={() => setCollapsed(!collapsed)}>
//                                                         <ListItemText primary="Older Builds" primaryTypographyProps={{ fontWeight: "bold" }} />
//                                                         {collapsed ? <ExpandMore /> : <ExpandLess />}
//                                                     </ListItemButton>
//                                                 </div>

//                                                 <Collapse in={!collapsed} timeout="auto" unmountOnExit>
//                                                     {currentApp.builds.slice(1).map((build) => (
//                                                         <ListItemButton
//                                                             key={build.build_number}
//                                                             sx={{
//                                                                 marginY: 1,
//                                                                 display: "flex",
//                                                                 justifyContent: "space-between",
//                                                                 alignItems: "center",
//                                                                 borderRadius: 2,
//                                                                 px: 2,
//                                                                 py: 1.5,
//                                                                 cursor: "pointer",
//                                                                 bgcolor: "background.paper",
//                                                                 boxShadow: 1,
//                                                                 transition: "all 0.2s",
//                                                                 "&:hover": {
//                                                                     bgcolor: "#edf0f3ff", // light grey that keeps text readable
//                                                                     color: "#111827",
//                                                                     transform: "scale(1.02)",
//                                                                 },

//                                                             }}
//                                                             onClick={() =>
//                                                                 navigate(
//                                                                     `/autoanalysis/projects/${currentApp.config.project_id}/apps/${currentApp.config.application_id}/result/${build.build_number}`,
//                                                                     {
//                                                                         state: {
//                                                                             projectName: selectedProject.name,
//                                                                             appName: currentApp.config.application_name
//                                                                         }
//                                                                     }
//                                                                 )
//                                                             }
//                                                         >
//                                                             <ListItemText
//                                                                 primary={build.build_number}
//                                                                 secondary={build.test_timing}
//                                                             />
//                                                             {/* <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${build.status === 'pass' ? 'bg-green-100 text-green-700' :
//                                                                 build.status === 'fail' ? 'bg-red-100 text-red-700' :
//                                                                     'bg-orange-100 text-orange-700'
//                                                                 }`}>
//                                                                 {build.status}
//                                                             </Box> */}
//                                                         </ListItemButton>
//                                                     ))}
//                                                 </Collapse>
//                                             </>
//                                         )}
//                                     </>
//                                 ) : (

//                                     <Typography
//                                         variant="body2"
//                                         sx={{ color: "text.disabled", pl: 2, pt: 1 }}
//                                     >
//                                         No build found
//                                     </Typography>

//                                 )

//                                 }
//                             </List>

//                         </div>




//                         <div className="w-full py-8 border-b">

//                             <Typography variant="h6" gutterBottom>Execution Strategy</Typography>

//                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                                 <Box>
//                                     <Typography variant="body2" color="textSecondary">
//                                         Current Mode: <strong>
//                                             {currentApp.config?.run_schedule
//                                                 ? currentApp.config.run_schedule.toUpperCase()
//                                                 : "NO MODE CONFIGURED"}
//                                         </strong>

//                                     </Typography>

//                                     <Typography variant="caption" display="block">
//                                         {currentApp.config?.run_schedule === 'automated'
//                                             ? 'Tests run automatically after every deployment to the staging environment.'
//                                             : currentApp.config?.run_schedule === 'manual'
//                                                 ? 'Tests must be triggered manually via CI/CD or this dashboard.'
//                                                 : 'Execution mode has not been configured yet.'
//                                         }

//                                     </Typography>
//                                 </Box>

//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     disableElevation
//                                     sx={{ ml: 2 }} // optional margin-left for spacing
//                                 >
//                                     Run Now
//                                 </Button>
//                             </Box>

//                         </div>

//                         {/* <div className='pt-6'>

//                             <Typography variant="h6" gutterBottom>Email Recipients</Typography>

//                             <Box className="flex gap-2 mb-4">
//                                 <TextField
//                                     size="small"
//                                     fullWidth
//                                     placeholder="email@example.com"
//                                     value={emailInput}
//                                     onChange={(e) => setEmailInput(e.target.value)}
//                                 />
//                                 <Button variant="outlined" onClick={handleAddEmail}>
//                                     Add
//                                 </Button>
//                             </Box>

//                             <List dense>
//                                 {currentApp.emailRecipients.map((email: string) => (
//                                     <ListItem key={email}>
//                                         <ListItemText primary={email} />
//                                         <IconButton size="small">
//                                             <Delete fontSize="small" />
//                                         </IconButton>
//                                     </ListItem>
//                                 ))}
//                             </List>

//                         </div> */}


//                         {currentApp.config.nfrLink && (
//                             <div className="flex items-center justify-between mt-2  border-b py-8">
//                                 <Typography variant="h6" gutterBottom>
//                                     Performance Test Strategy
//                                 </Typography>



//                                 <Button
//                                     component="a"
//                                     // href={currentApp.nfrLink}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     variant="contained"
//                                     color="primary"
//                                     disableElevation
//                                     sx={{
//                                         ml: 2,
//                                         textDecoration: 'none',
//                                     }}
//                                 >
//                                     View
//                                 </Button>

//                             </div>
//                         )}



//                         <div className="pt-6 mt-2">
//                             <Box className="flex items-center justify-between mb-2">
//                                 <Typography variant="h6" gutterBottom>Email Recipients</Typography>

//                                 {/* Add icon on the right */}
//                                 {!showEmailInput && (
//                                     <IconButton
//                                         onClick={() => setShowEmailInput(true)}
//                                         sx={{
//                                             // bgcolor: "primary.main",
//                                             marginRight: 2,
//                                             color: "black",
//                                             p: 1.2, // slightly bigger padding
//                                             "&:hover": {
//                                                 bgcolor: "primary.dark",
//                                             },
//                                             // boxShadow: 1, 
//                                             borderRadius: "50%",
//                                             transition: "all 0.2s",
//                                         }}
//                                     >
//                                         <Add sx={{ fontSize: 21 }} /> {/* slightly bigger than default */}
//                                     </IconButton>

//                                 )}
//                             </Box>

//                             {/* Show input + add button when toggled */}
//                             {showEmailInput && (
//                                 <Box className="flex gap-2 mb-4 mt-4">
//                                     <TextField
//                                         size="small"
//                                         fullWidth
//                                         placeholder="email@example.com"
//                                         value={emailInput}
//                                         onChange={(e) => setEmailInput(e.target.value)}
//                                     />
//                                     <Button
//                                         variant="outlined"
//                                         onClick={() => {
//                                             handleAddEmail();
//                                             setEmailInput(""); // optional: clear input after adding
//                                             setShowEmailInput(false); // hide input after adding
//                                         }}
//                                     >
//                                         Add
//                                     </Button>
//                                     <IconButton onClick={() => setShowEmailInput(false)} size="small">
//                                         <Close fontSize="small" />
//                                     </IconButton>
//                                 </Box>
//                             )}

//                             {currentApp.config?.recipient_list ? (

//                                 <List dense>
//                                     {currentApp.config.recipient_list.split(",").map((email: string) => (
//                                         <ListItem key={email}>
//                                             <ListItemText primary={email} />
//                                             <IconButton size="small" onClick={() => handleRemoveEmail(email)}>
//                                                 <Delete fontSize="small" />
//                                             </IconButton>
//                                         </ListItem>
//                                     ))}
//                                 </List>

//                             ) : (

//                                 <Typography
//                                     variant="body2"
//                                     sx={{ color: "text.disabled", pl: 1 }}
//                                 >
//                                     No email recipient configured for this application
//                                 </Typography>

//                             )}

//                         </div>



//                     </div>

//                 </Grid>
//             </Paper>
//         </Box >
//     );
// };


export const ConfigDetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

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


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'success' as SnackbarType,
    });

    useEffect(() => {
        if (!selectedProject?.id || !id) return;

        dispatch(fetchConfig({
            projectId: selectedProject.id,
            appId: Number(id)
        }));
    }, [id, selectedProject?.id]);

    if (!currentApp || !currentApp.config) {
        return <Box p={4}>Loading Configuration...</Box>;
    }


    useEffect(() => {
        if (!currentApp) return;

        console.log("currentApp changed → update UI / derived state");

    }, [currentApp]);   // ✔ allowed here (NO dispatch inside)



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

            setSnackbar({
                open: true,
                message: "Script downloaded successfully",
                type: "success",
            });
        } catch (err: any) {
            console.error(err);
            setSnackbar({
                open: true,
                message: err.message || "Download failed",
                type: "error"
            });
        }
    };

    const handleAddEmail = () => {
        if (!emailInput.trim()) return;

        console.log("Update Recipient Before:", currentApp.config.recipient_list);

        const existingEmails =
            currentApp.config?.recipient_list
                ?.split(",")
                .map(e => e.trim())
                .filter(Boolean) ?? [];

        const newEmails = [...existingEmails, emailInput.trim()];

        console.log("Update Recipient After:", newEmails);



        try {
            updateEmailRecipients(
                selectedProject.id,
                currentApp.config.application_id,
                newEmails
            );

            setSnackbar({
                open: true,
                message: "Recipients updated successfully",
                type: "success"
            });

            dispatch(fetchConfig({
            projectId: selectedProject.id,
            appId: Number(id)
        }));

        } catch (err: any) {


            console.log("Entered Catch ", err?.data?.error?.recipient_list?.[0], " ||| ", err?.message  )

            // 🔥 Extract backend error safely
            const msg =
                err?.data?.error?.recipient_list?.[0] ||
                err?.message ||
                "Failed to update recipients";

            setSnackbar({
                open: true,
                message: msg,
                type: "error"
            });
        }


        setEmailInput("");
    };



    const handleRemoveEmail = async (email: string) => {
  if (!selectedProject?.id || !currentApp?.config?.application_id) return;

  console.log("Update Recipient Before:", currentApp.config.recipient_list);

  const existingEmails =
    currentApp.config?.recipient_list
      ?.split(",")
      .map(e => e.trim())
      .filter(Boolean) ?? [];

  // remove selected email
  const updatedEmails = existingEmails.filter(e => e !== email);

  console.log("Update Recipient After:", updatedEmails);

  try {
    await updateEmailRecipients(
      selectedProject.id,
      currentApp.config.application_id,
      updatedEmails
    );

    setSnackbar({
      open: true,
      message: "Recipient removed successfully",
      type: "success",
    });

    // refresh config
    dispatch(
      fetchConfig({
        projectId: selectedProject.id,
        appId: Number(id),
      })
    );
  } catch (err: any) {
    console.log(
      "Entered Catch ",
      err?.data?.error?.recipient_list?.[0],
      " ||| ",
      err?.message
    );

    const msg =
      err?.data?.error?.recipient_list?.[0] ||
      err?.message ||
      "Failed to update recipients";

    setSnackbar({
      open: true,
      message: msg,
      type: "error",
    });
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

    return (
        <Box className="bg-slate-50 min-h-screen m-auto max-w-6xl p-10">

            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/autoanalysis')}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

              <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />

            <Paper sx={{ p: 6 }}>

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 5 }}>
                    Configuration: {currentApp.config.application_name}
                </Typography>

                {/* ================= Integrations ================= */}
                <div className='border-b pb-6'>
                    <SectionHeader
                        title="Integrations Overview"
                        open={openIntegrations}
                        toggle={() => setOpenIntegrations(!openIntegrations)}
                    />

                    <Collapse in={openIntegrations}>


                        {/* ================= Compact Status Messages ================= */}
                        {(currentApp?.failures?.length || currentApp?.warnings?.length) && (
                            <div className="mt-5 space-y-2 mb-5">

                                {/* Failures */}
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

                                {/* Warnings */}
                                {currentApp.warnings?.map((w, idx) => (
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




                        {/* <Collapse in={openIntegrations}>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mt-4">
                            <IntegrationTile title="Script" active={currentApp.config.script_id !== null} link={String(currentApp.config.script_id)} onClick={handleDownloadScript} />
                            <IntegrationTile title="GitHub" active={currentApp.config.gha_repo_url !== null} link={currentApp.config.gha_repo_url} />
                            <IntegrationTile title="BlazeMeter" active={currentApp.config.blazemeter_url !== null} link={currentApp.config.blazemeter_url} />
                            <IntegrationTile title="Azure DevOps" active={currentApp.config.ado_url !== null} link={currentApp.config.ado_url} />
                            <IntegrationTile title="Datadog" active={currentApp.config.datadog_url !== null} link={currentApp.config.datadog_url} />
                        </div>
                    </Collapse> */}


                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mt-4">

                            {/* Script → download */}
                            <IntegrationTile
                                title="Script"
                                active={currentApp.config.script_id !== null}
                                onClick={handleDownloadScript}
                            />

                            {/* Normal links */}
                            <IntegrationTile
                                title="GitHub"
                                active={currentApp.config.gha_repo_url !== null}
                                link={currentApp.config.gha_repo_url}
                            />

                            <IntegrationTile
                                title="BlazeMeter"
                                active={currentApp.config.blazemeter_url !== null}
                                link={currentApp.config.blazemeter_url}
                            />

                            <IntegrationTile
                                title="Azure DevOps"
                                active={currentApp.config.ado_url !== null}
                                link={currentApp.config.ado_url}
                            />

                            <IntegrationTile
                                title="Datadog"
                                active={currentApp.config.datadog_url !== null}
                                link={currentApp.config.datadog_url}
                            />
                        </div>
                    </Collapse>

                </div>

                {/* ================= Build History ================= */}
                <div className='border-b py-6'>
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
                                                            projectName: selectedProject.name,
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
                                                                        projectName: selectedProject.name,
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


                        {/* // <List>
                        //     {currentApp.builds?.length > 0 ? (
                        //         <>
                        //             <ListItemButton>
                        //                 <ListItemText
                        //                     primary={currentApp.builds[0].build_number}
                        //                     secondary={currentApp.builds[0].test_timing}
                        //                 />
                        //             </ListItemButton>

                        //             {currentApp.builds.length > 1 && (
                        //                 <>
                        //                     <ListItemButton onClick={() => setCollapsed(!collapsed)}>
                        //                         <ListItemText primary="Older Builds" />
                        //                         {collapsed ? <ExpandMore /> : <ExpandLess />}
                        //                     </ListItemButton>

                        //                     <Collapse in={!collapsed}>
                        //                         {currentApp.builds.slice(1).map((b) => (
                        //                             <ListItemButton key={b.build_number}>
                        //                                 <ListItemText
                        //                                     primary={b.build_number}
                        //                                     secondary={b.test_timing}
                        //                                 />
                        //                             </ListItemButton>
                        //                         ))}
                        //                     </Collapse>
                        //                 </>
                        //             )}
                        //         </>
                        //     ) : (
                        //         <Typography>No build found</Typography>
                        //     )}
                        // </List> */}


                    </Collapse>
                </div>

                {/* ================= Execution Strategy ================= */}
                <div className='border-b py-6'>
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
                                disabled={!currentApp.config.gha_workflow}
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

                {/* ================= Performance Strategy ================= */}
                {currentApp.config.nfrLink && (
                    <div className='border-b py-6'>
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

                {/* ================= Email Recipients ================= */}
                <div className='py-6'>
                    <SectionHeader
                        title="Email Recipients"
                        open={openEmails}
                        toggle={() => setOpenEmails(!openEmails)}
                    />

                    <Collapse in={openEmails}>

                    {/* Show input + add button when toggled */}
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

                        {/* <Box display="flex" gap={2} mt={2}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="email@example.com"
                                value={emailInput}
                                onClick={() => {
                                            handleAddEmail();
                                            setEmailInput(""); // optional: clear input after adding
                                            setShowEmailInput(false); // hide input after adding
                                        }}
                            />
                            <Button variant="outlined">Add</Button>
                        </Box> */}

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
