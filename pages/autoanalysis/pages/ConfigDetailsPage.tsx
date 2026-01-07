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
import { updateEmailRecipients } from '../services/mockService';
import Grid from "@mui/material/Grid";
import Close from '@mui/icons-material/Close';

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

const IntegrationTile = ({
    title,
    active,
    link,
}: {
    title: string;
    active: boolean;
    link: string;
}) => (
    <>

        {/* <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
    >
    <div className="max-w-xl">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl text-white">
          <div className="flex items-start justify-between">
            
            <div>
              <p className="text-sm opacity-90 mb-2">{title}</p>
              
                <span className="bg-white/20 px-2 py-1 rounded-full text-[11px] font-medium">{active ? 'Configured' : 'Not Configured'}</span>
            </div>
            {active ? (
                    <CheckCircle className="text-green-500" fontSize="small" />
                ) : (
                    <Cancel className="text-amber-400" fontSize="small" />
            )}
            
          </div>
        </div>
      </div>

      </a> */}

        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer"
        >
            <div className="max-w-xl">

                <div
  className={`
    p-4 rounded-2xl shadow-xl
    transition-transform transition-shadow duration-300 ease-out
    hover:scale-[1.03] 

    ${
      active
        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border border-transparent"
        : "bg-white text-gray-800 border-2 border-yellow-400"
    }
  `}
>
  <div className="flex items-start justify-between">
    <div>
      <p
        className={`text-sm mb-2 ${
          active ? "text-white font-medium" : "text-gray-600"
        }`}
      >
        {title}
      </p>

      <span
        className={`px-2 py-1 rounded-full text-[11px] font-medium ${
          active
            ? "bg-white/20 text-white"
            : "bg-yellow-100 text-yellow-800"
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
        </a>

        {/* <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
    >
        <Paper
            elevation={0}
            className={`p-4 border-l-4 transition hover:bg-slate-50
        ${active ? 'border-green-500' : 'border-amber-400'}
        border border-slate-200 rounded-lg`}
        >
            <div className="flex justify-between items-center">
                <Typography variant="subtitle2" className="text-slate-700">
                    {title}
                </Typography>
                {active ? (
                    <CheckCircle className="text-green-500" fontSize="small" />
                ) : (
                    <Cancel className="text-amber-400" fontSize="small" />
                )}
            </div>

            <Typography variant="caption" className="text-slate-500">
                {active ? 'Configured' : 'Not Configured'}
            </Typography>
        </Paper>
    </a> */}
    </>
);



export const ConfigDetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    // @ts-ignore
    const { currentApp } = useSelector((state) => state.autoAnalysis);
    const [emailInput, setEmailInput] = useState('');
    const [collapsed, setCollapsed] = React.useState(true);
    const [showEmailInput, setShowEmailInput] = useState(false);


    useEffect(() => {
        if (id) dispatch(fetchConfig(id));
    }, [id, dispatch]);

    if (!currentApp) return <Box p={4}>Loading Configuration...</Box>;

    const handleAddEmail = () => {
        if (emailInput) {
            const newEmails = [...currentApp.emailRecipients, emailInput];
            updateEmailRecipients(newEmails); // Mock API
            setEmailInput('');
        }
    };

    function handleRemoveEmail(email: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Box className="bg-slate-50 min-h-screen m-auto max-w-6xl p-10">


            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/autoanalysis')}
                sx={{
                    mb: 1,
                    color: "#5c5f66",
                    textTransform: "none",
                    fontWeight: 500,
                }}
            >
                Back to Dashboard
            </Button>


            <Paper
                elevation={0}
                sx={{
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e4e6eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    p: 3,
                    mt: 1,
                }}
            >

                <Typography
                    variant="h5"
                    className="pt-6 pl-6"
                    sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                    Configuration: App ID {currentApp.id}
                </Typography>


                <Grid container spacing={4}>

                    <div className="w-full p-6">


                        <div className='mt-6 border-b pb-6'>


                            <Typography variant="h6" gutterBottom>
                                Integrations Overview
                            </Typography>


                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                                <IntegrationTile title="Script" active={currentApp.integrations.loadGenerator} link={"https://github.com/"} />
                                <IntegrationTile title="GitHub" active={currentApp.integrations.github} link={"https://github.com/"} />
                                <IntegrationTile title="BlazeMeter" active={currentApp.integrations.blazemeter} link={"https://github.com/"} />
                                <IntegrationTile title="CI/CD" active={currentApp.integrations.cicd} link={"https://github.com/"} />
                                <IntegrationTile title="Azure DevOps" active={currentApp.integrations.ado} link={"https://github.com/"} />
                                <IntegrationTile title="Datadog" active={currentApp.integrations.datadog} link={"https://github.com/"} />
                            </div>

                        </div>

                        <div className='mt-6 border-b pb-6'>

                            <Typography variant="h6" gutterBottom>Build History</Typography>

                            <List>
                                {/* Most recent build */}
                                {currentApp.builds.length > 0 && (
                                    <>
                                        {/* Recent Build */}
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => navigate(`result/${currentApp.builds[0].id}`)}
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
                                                    primary={currentApp.builds[0].name}
                                                    secondary={currentApp.builds[0].date}
                                                />
                                                <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentApp.builds[0].status === 'pass' ? 'bg-green-100 text-green-700' :
                                                    currentApp.builds[0].status === 'fail' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {currentApp.builds[0].status}
                                                </Box>
                                            </ListItemButton>
                                        </ListItem>

                                        {/* Older builds collapsible */}
                                        {currentApp.builds.length > 1 && (
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
                                                            key={build.id}
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
                                                            onClick={() => navigate(`result/${build.id}`)}
                                                        >
                                                            <ListItemText
                                                                primary={build.name}
                                                                secondary={build.date}
                                                            />
                                                            <Box className={`px-2 py-1 rounded text-xs font-bold uppercase ${build.status === 'pass' ? 'bg-green-100 text-green-700' :
                                                                build.status === 'fail' ? 'bg-red-100 text-red-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                {build.status}
                                                            </Box>
                                                        </ListItemButton>
                                                    ))}
                                                </Collapse>
                                            </>
                                        )}
                                    </>
                                )}
                            </List>

                        </div>




                        <div className="w-full py-8 border-b">

                            <Typography variant="h6" gutterBottom>Execution Strategy</Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Current Mode: <strong>{currentApp.executionStrategy.toUpperCase()}</strong>
                                    </Typography>

                                    <Typography variant="caption" display="block">
                                        {currentApp.executionStrategy === 'automated'
                                            ? 'Tests run automatically after every deployment to the staging environment.'
                                            : 'Tests must be triggered manually via CI/CD or this dashboard.'}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    sx={{ ml: 2 }} // optional margin-left for spacing
                                >
                                    Run Now
                                </Button>
                            </Box>

                        </div>

                        {/* <div className='pt-6'>

                            <Typography variant="h6" gutterBottom>Email Recipients</Typography>

                            <Box className="flex gap-2 mb-4">
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="email@example.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />
                                <Button variant="outlined" onClick={handleAddEmail}>
                                    Add
                                </Button>
                            </Box>

                            <List dense>
                                {currentApp.emailRecipients.map((email: string) => (
                                    <ListItem key={email}>
                                        <ListItemText primary={email} />
                                        <IconButton size="small">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>

                        </div> */}


                        {currentApp.nfrLink && (
                            <div className="flex items-center justify-between mt-2  border-b py-8">
                                <Typography variant="h6" gutterBottom>
                                    Performance Test Strategy
                                </Typography>



                                <Button
                                    component="a"
                                    href={currentApp.nfrLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    sx={{
                                        ml: 2,
                                        textDecoration: 'none',
                                    }}
                                >
                                    View
                                </Button>

                            </div>
                        )}



                        <div className="pt-6 mt-2">
                            <Box className="flex items-center justify-between mb-2">
                                <Typography variant="h6" gutterBottom>Email Recipients</Typography>

                                {/* Add icon on the right */}
                                {!showEmailInput && (
                                    <IconButton
                                        onClick={() => setShowEmailInput(true)}
                                        sx={{
                                            // bgcolor: "primary.main",
                                            marginRight: 2,
                                            color: "black",
                                            p: 1.2, // slightly bigger padding
                                            "&:hover": {
                                                bgcolor: "primary.dark",
                                            },
                                            // boxShadow: 1, 
                                            borderRadius: "50%",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <Add sx={{ fontSize: 21 }} /> {/* slightly bigger than default */}
                                    </IconButton>

                                )}
                            </Box>

                            {/* Show input + add button when toggled */}
                            {showEmailInput && (
                                <Box className="flex gap-2 mb-4 mt-4">
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
                                            setShowEmailInput(false); // hide input after adding
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <IconButton onClick={() => setShowEmailInput(false)} size="small">
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <List dense>
                                {currentApp.emailRecipients.map((email: string) => (
                                    <ListItem key={email}>
                                        <ListItemText primary={email} />
                                        <IconButton size="small" onClick={() => handleRemoveEmail(email)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </div>



                    </div>

                </Grid>
            </Paper>
        </Box >
    );
};
