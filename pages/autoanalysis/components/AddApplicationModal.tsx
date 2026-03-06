// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, Button,
//   TextField, MenuItem, LinearProgress, Box, Typography, Alert
// } from '@mui/material';
// import { AppDispatch } from '../../../store/store'; // Assume global store type location
// import { fetchJmx } from '../store/autoAnalysisSlice';
// import { configureApplication } from '../services/mockService';

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   selectedApplicationId: string | null;
//   selectedApplicationName: string | null;
// }

// const addApp = async (data: any) => {
//   return {
//     id: Math.random().toString(36).substr(2, 9),
//     name: data.appName,
//     status: 'configured',
//     lastReportName: null,
//     lastRunDate: new Date().toISOString().split('T')[0],
//   };
// };


// export const AddApplicationModal: React.FC<Props> = ({ open, onClose, selectedApplicationId, selectedApplicationName }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   // @ts-ignore
//   const jmxOptions = useSelector((state) => state.autoAnalysis.jmxOptions);

//   const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
//   const [progress, setProgress] = useState(0);
//   const [formData, setFormData] = useState({
//     appName: selectedApplicationName,
//     jmxSource: 'auto', // 'file' or 'auto'
//     jmxFile: null as File | null,
//     jmxScriptId: '',
//     users: 10,
//     duration: 30,
//     throughput: 100,
//     githubRepo: ''
//   });

//   useEffect(() => {
//     if (open) {
//       // fetchjmx
//       dispatch(fetchJmx(Number(selectedApplicationId)));
//     }
//   }, [open, dispatch]);
//   const progressRef = useRef(null);

//  const handleStart = async () => {
//   try {
//     setStep('processing');
//     setProgress(20);

//     const payload = new FormData();

//     // REQUIRED
//     payload.append('users', String(formData.users));
//     payload.append('duration', String(formData.duration));
//     payload.append('ramp_up', '1');
//     payload.append('auto_execute', 'false');

//     if (formData.githubRepo) {
//       payload.append('github_repo_url', formData.githubRepo);
//     }

//     // Either script_id OR script_file
//     if (formData.jmxSource === 'auto' && formData.jmxScriptId) {
//       payload.append('script_id', formData.jmxScriptId);
//     } else if (formData.jmxSource === 'file' && formData.jmxFile) {
//       payload.append('script_file', formData.jmxFile);
//     } else {
//       throw new Error('Provide script_id or upload JMX file');
//     }

//     setProgress(50);

//     await configureApplication(
//       Number(1),                      // project id (replace if dynamic)
//       Number(selectedApplicationId),  // application id
//       payload
//     );

//     setProgress(100);
//     setStep('success');

//   } catch (err: any) {
//     console.error(err);
//     setStep('form');
//     alert(err.message || 'Configuration failed');
//   }
// };


//   const handleClose = () => {
//     setStep('form');
//     setProgress(0);
//     setFormData({ ...formData, appName: '' });
//     onClose();
//   };

//   // return (
//   //   <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//   //     <DialogTitle>Add New Application</DialogTitle>

//   //     <DialogContent>
//   //       {step === 'form' && (
//   //         <Box className="flex flex-col gap-4 mt-2">
//   //           <TextField
//   //             label="Application Name"
//   //             fullWidth
//   //             size="small"
//   //             value={formData.appName}
//   //             onChange={(e) => setFormData({...formData, appName: e.target.value})}
//   //           />

//   //           <TextField
//   //             select
//   //             label="JMX Source"
//   //             size="small"
//   //             value={formData.jmxSource}
//   //             onChange={(e) => setFormData({...formData, jmxSource: e.target.value})}
//   //           >
//   //             <MenuItem value="file">Upload JMX File</MenuItem>
//   //             <MenuItem value="auto">Select from Autoscripting</MenuItem>
//   //           </TextField>

//   //           {formData.jmxSource === 'auto' ? (
//   //             <TextField
//   //               select
//   //               label="Select Script"
//   //               size="small"
//   //               fullWidth
//   //               value={formData.jmxScriptId}
//   //               onChange={(e) => setFormData({...formData, jmxScriptId: e.target.value})}
//   //             >
//   //               {jmxOptions.map((opt: any) => (
//   //                 <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
//   //               ))}
//   //             </TextField>
//   //           ) : (
//   //             <Button variant="outlined" component="label">
//   //               Upload JMX
//   //               <input type="file" hidden onChange={(e) => setFormData({...formData, jmxFile: e.target.files?.[0] || null})} />
//   //             </Button>
//   //           )}

//   //           <div className="grid grid-cols-3 gap-4">
//   //             <TextField label="Concurrent Users" type="number" size="small" value={formData.users} />
//   //             <TextField label="Duration (min)" type="number" size="small" value={formData.duration} />
//   //             <TextField label="Throughput (hits/s)" type="number" size="small" value={formData.throughput} />
//   //           </div>
//   //         </Box>
//   //       )}

//   //       {step === 'processing' && (
//   //         <Box className="text-center py-8">
//   //           <Typography variant="body1" className="mb-4">Configuring Integrations & Generating CI/CD Pipelines...</Typography>
//   //           <LinearProgress variant="determinate" value={progress} />
//   //           <Typography variant="caption" className="mt-2 block text-gray-500">{progress}% Complete</Typography>
//   //         </Box>
//   //       )}

//   //       {step === 'success' && (
//   //         <Alert severity="success" sx={{ mt: 2 }}>
//   //           Service configured successfully. Test scenario and CI/CD integration generated.
//   //         </Alert>
//   //       )}
//   //     </DialogContent>

//   //     <DialogActions>
//   //       {step === 'form' && (
//   //         <>
//   //           <Button onClick={handleClose}>Cancel</Button>
//   //           <Button variant="contained" onClick={handleStart} disabled={!formData.appName}>Start Configuration</Button>
//   //         </>
//   //       )}
//   //       {step === 'success' && (
//   //         <Button variant="contained" onClick={handleClose}>Done</Button>
//   //       )}
//   //     </DialogActions>
//   //   </Dialog>
//   // );

//   return (

//     //     <Dialog
//     //   open={open}
//     //   onClose={handleClose}
//     //   maxWidth={step === 'form' ? 'xs' : 'md'} // wider while loading
//     //   fullWidth
//     //   PaperProps={{
//     //     sx: {
//     //       borderRadius: 3,
//     //       px: 3,
//     //       py: 3,
//     //       minHeight: step === 'form' ? 500 : 200,
//     //       display: 'flex',
//     //       flexDirection: 'column',
//     //       justifyContent: step === 'processing' ? 'center' : 'flex-start',
//     //       alignItems: step === 'processing' ? 'center' : 'stretch',
//     //     },
//     //   }}

//     //   scroll="paper" 
//     // >
//     //   {/* <DialogTitle
//     //     sx={{
//     //       pt: 2.5,
//     //       pb: 1,
//     //       fontWeight: 700,
//     //       fontSize: '1.5rem', // bigger title
//     //       color: 'text.primary',
//     //       textAlign: step === 'success' ? 'center' : 'left', // center on success
//     //     }}
//     //   >
//     //     Add New Application
//     //   </DialogTitle> */}

//     //   <DialogTitle
//     //   sx={{
//     //     pt: 2.5,
//     //     fontWeight: 700,
//     //     fontSize: '1.5rem',
//     //     color: 'text.primary',
//     //     textAlign: step === 'success' ? 'center' : 'left',
//     //   }}
//     // >
//     //   {step === 'success' ? 'Application Configured Successfully!' : 'Add New Application'}
//     // </DialogTitle>


//     //   <DialogContent sx={{  pt: 1, display: 'flex', flexDirection: 'column', alignItems: step === 'form' ? 'stretch' : 'center' }}>
//     //     {step === 'form' && (
//     //       <Box className="flex flex-col gap-6 mt-1">
//     //         {/* <TextField
//     //           label="Application Name"
//     //           fullWidth
//     //           size="small"
//     //           value={formData.appName}
//     //           onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
//     //           sx={{
//     //             '& .MuiOutlinedInput-root': { borderRadius: 2, boxShadow: 1 },
//     //           }}
//     //         /> */}

//     //         <TextField
//     //   label="Application Name"
//     //   fullWidth
//     //   size="small"
//     //   margin="normal"  // add this line for correct spacing
//     //   value={formData.appName}
//     //   onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
//     // />


//     //         <TextField
//     //           select
//     //           label="JMX Source"
//     //           fullWidth
//     //           size="small"
//     //           value={formData.jmxSource}
//     //           onChange={(e) => setFormData({ ...formData, jmxSource: e.target.value })}
//     //           sx={{ borderRadius: 2, boxShadow: 1 }}
//     //         >
//     //           <MenuItem value="file">Upload JMX File</MenuItem>
//     //           <MenuItem value="auto">Select from Autoscripting</MenuItem>
//     //         </TextField>

//     //         {formData.jmxSource === 'auto' ? (
//     //           <TextField
//     //             select
//     //             label="Select Script"
//     //             fullWidth
//     //             size="small"
//     //             value={formData.jmxScriptId}
//     //             onChange={(e) => setFormData({ ...formData, jmxScriptId: e.target.value })}
//     //             sx={{ borderRadius: 2, boxShadow: 1 }}
//     //           >
//     //             {jmxOptions.map((opt: any) => (
//     //               <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
//     //             ))}
//     //           </TextField>
//     //         ) : (
//     //           <Button
//     //             variant="outlined"
//     //             component="label"
//     //             fullWidth
//     //             sx={{
//     //               borderRadius: 2,
//     //               textTransform: 'none',
//     //               boxShadow: 1,
//     //               py: 1.5,
//     //               bgcolor: 'background.paper',
//     //               '&:hover': { bgcolor: 'primary.light' },
//     //             }}
//     //           >
//     //             Upload JMX
//     //             <input
//     //               type="file"
//     //               hidden
//     //               onChange={(e) => setFormData({ ...formData, jmxFile: e.target.files?.[0] || null })}
//     //             />
//     //           </Button>
//     //         )}

//     //         <TextField label="Concurrent Users" type="number" size="small" fullWidth value={formData.users} />
//     //         <TextField label="Duration (min)" type="number" size="small" fullWidth value={formData.duration} />
//     //         <TextField label="Throughput (hits/s)" type="number" size="small" fullWidth value={formData.throughput} />
//     //       </Box>
//     //     )}

//     //     {step === 'processing' && (
//     //       <Box className="text-center w-full">
//     //         <Typography variant="h6" className="mb-4 text-gray-700 text-center">
//     //           Configuring Integrations & Generating CI/CD Pipelines...
//     //         </Typography>
//     //         <LinearProgress
//     //           variant="determinate"
//     //           value={progress}
//     //           sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
//     //         />
//     //         <Typography variant="caption" className="mt-2 block text-gray-500 text-center">{progress}% Complete</Typography>
//     //       </Box>
//     //     )}

//     //     {step === 'success' && (
//     //       <Alert severity="success" sx={{ mt: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
//     //         Service configured successfully. Test scenario and CI/CD integration generated.
//     //       </Alert>
//     //     )}
//     //   </DialogContent>

//     //   <DialogActions
//     //     sx={{
//     //       px: 3,
//     //       pb: 2,
//     //       justifyContent: step === 'success' ? 'center' : 'space-between', // center Done button
//     //     }}
//     //   >
//     //     {step === 'form' && (
//     //       <>
//     //         <Button
//     //           onClick={handleClose}
//     //           variant="outlined"
//     //           sx={{
//     //             textTransform: 'none',
//     //             borderColor: '#c1c1c1',
//     //             color: '#6b6b6b',
//     //             '&:hover': { borderColor: '#a0a0a0', bgcolor: '#f5f5f5' },
//     //           }}
//     //         >
//     //           Cancel
//     //         </Button>
//     //         <Button
//     //           variant="contained"
//     //           onClick={handleStart}
//     //           disabled={!formData.appName}
//     //           sx={{ textTransform: 'none' }}
//     //         >
//     //           Start Configuration
//     //         </Button>
//     //       </>
//     //     )}
//     //     {step === 'success' && (
//     //       <Button variant="contained" onClick={handleClose} sx={{ textTransform: 'none' }}>
//     //         Done
//     //       </Button>
//     //     )}
//     //   </DialogActions>
//     // </Dialog>



//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth={step === 'form' ? 'sm' : 'md'} // Wider during the loading state
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           px: 3,
//           py: 3,
//           minHeight: step === 'form' ? 500 : 200,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: step === 'processing' ? 'center' : 'flex-start',
//           alignItems: step === 'processing' ? 'center' : 'stretch',
//         },
//       }}
//       scroll="paper"
//     >
//       <DialogTitle
//         sx={{
//           pt: 2.5,
//           fontWeight: 700,
//           fontSize: '1.5rem',
//           color: '#1d4ed8',
//           textAlign: step === 'success' ? 'center' : 'left',
//         }}
//       >
//         {step === 'success' ? 'Application Configured Successfully!' : 'Configure Application'}
//       </DialogTitle>

//       <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', alignItems: step === 'form' ? 'stretch' : 'center' }}>
//         {step === 'form' && (
//           <Box className="flex flex-col gap-6 mt-1">

//             <TextField
//               label="Application Name"
//               fullWidth
//               size="small"
//               margin="normal"
//               value={selectedApplicationName}
//               disabled
//               sx={{
//                 '& .MuiOutlinedInput-root': { borderRadius: 2, boxShadow: 1 },
//               }}
//             />

//             <TextField
//               select
//               label="JMX Source"
//               fullWidth
//               size="small"
//               value={formData.jmxSource}
//               onChange={(e) => setFormData({ ...formData, jmxSource: e.target.value })}
//               sx={{ borderRadius: 2, boxShadow: 1 }}
//             >
//               <MenuItem value="file">Upload JMX File</MenuItem>
//               <MenuItem value="auto">Select from Autoscripting</MenuItem>
//             </TextField>

//             {formData.jmxSource === 'auto' ? (
//               <TextField
//                 select
//                 label="Select Script"
//                 fullWidth
//                 size="small"
//                 value={formData.jmxScriptId}
//                 onChange={(e) => setFormData({ ...formData, jmxScriptId: e.target.value })}
//                 sx={{ borderRadius: 2, boxShadow: 1 }}
//               >
//                 {jmxOptions.map((opt: any) => (
//                   <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
//                 ))}
//               </TextField>
//             ) : (
//               <Button
//                 variant="outlined"
//                 component="label"
//                 fullWidth
//                 sx={{
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   boxShadow: 1,
//                   py: 1.5,
//                   bgcolor: 'background.paper',
//                   '&:hover': { bgcolor: 'primary.light' },
//                 }}
//               >
//                 Upload JMX
//                 <input
//                   type="file"
//                   hidden
//                   onChange={(e) => setFormData({ ...formData, jmxFile: e.target.files?.[0] || null })}
//                 />
//               </Button>
//             )}

//             <TextField
//               label="GitHub Repository URL"
//               fullWidth
//               size="small"
//               value={formData.githubRepo || ''}
//               onChange={(e) =>
//                 setFormData({ ...formData, githubRepo: e.target.value })
//               }
//               sx={{ borderRadius: 2, boxShadow: 1 }}
//             />


//             <TextField
//   label="Concurrent Users"
//   type="number"
//   size="small"
//   fullWidth
//   value={formData.users}
//   onChange={(e) =>
//     setFormData({ ...formData, users: Number(e.target.value) })
//   }
// />

// <TextField
//   label="Duration (min)"
//   type="number"
//   size="small"
//   fullWidth
//   value={formData.duration}
//   onChange={(e) =>
//     setFormData({ ...formData, duration: Number(e.target.value) })
//   }
// />

// <TextField
//   label="Throughput (hits/s)"
//   type="number"
//   size="small"
//   fullWidth
//   value={formData.throughput}
//   onChange={(e) =>
//     setFormData({ ...formData, throughput: Number(e.target.value) })
//   }
// />

//           </Box>
//         )}

//         {step === 'processing' && (
//           <Box className="text-center w-full">
//             <Typography variant="h6" className="mb-4 text-gray-700 text-center">
//               Configuring Integrations & Generating CI/CD Pipelines...
//             </Typography>
//             <LinearProgress
//               variant="determinate"
//               value={progress}
//               sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
//             />
//             <Typography variant="caption" className="mt-2 block text-gray-500 text-center">{progress}% Complete</Typography>
//           </Box>
//         )}

//         {step === 'success' && (
//           <Alert severity="success" sx={{ mt: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
//             Service configured successfully. Test scenario and CI/CD integration generated.
//           </Alert>
//         )}
//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 2,
//           justifyContent: step === 'success' ? 'center' : 'space-between',
//         }}
//       >
//         {step === 'form' && (
//           <>
//             <Button onClick={onClose} color="inherit" sx={{ color: 'grey.700', fontWeight: '600' }}>
//               Cancel
//             </Button>
//             {/* <Button
//           variant="contained"
//           onClick={handleStart}
//           disabled={!formData.appName}
//           sx={{ textTransform: 'none' }}
//         >
//           Start Configuration
//         </Button> */}
//             <Button
//               variant="contained"
//               onClick={handleStart}
//               disableElevation
//               sx={{
//                 px: 4, py: 1.2, textTransform: 'none', bgcolor: '#1d4ed8',      // blue-700
//                 '&:hover': {
//                   bgcolor: '#1e40af'     // blue-800
//                 }
//               }}
//               className='bg-blue-700'
//             >
//               Start Configuration
//             </Button>
//           </>
//         )}
//         {step === 'processing' && (
//           <Button
//             variant="outlined"
//             color="error"
//             onClick={handleClose}
//             sx={{ textTransform: 'none' }}
//           >
//             Close
//           </Button>
//         )}
//         {step === 'success' && (
//           <Button variant="contained" onClick={handleClose} sx={{ textTransform: 'none' }}>
//             Done
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>


//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, LinearProgress, Box, Typography, Alert,
  IconButton
} from '@mui/material';
import { AppDispatch } from '../../../store/store';
import { fetchJmx } from '../store/autoAnalysisSlice';
import { configureApplication, getApplicationStatus, syncSecretsToGitHub } from '../services/mockService';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedApplicationId: string | null;
  selectedApplicationName: string | null;

  // ADDED
  projectId: number;
  stage: "new" | "in_progress";
}


export const AddApplicationModal: React.FC<Props> = ({
  open,
  onClose,
  selectedApplicationId,
  selectedApplicationName,
  projectId,
  stage
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // @ts-ignore
  const jmxOptions = useSelector((state) => state.autoAnalysis.jmxOptions);

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState(""); // ADDED

  const pollingRef = useRef<NodeJS.Timeout | null>(null); // ADDED
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const githubRepoRef = useRef<string>(''); // ← stale closure fix

  // ── SYNC STATE ─────────────────────────────────────────────────────────────
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMsg, setSyncMsg] = useState('');
  const [syncedSecrets, setSyncedSecrets] = useState<string[]>([]);
  const [secretsSynced, setSecretsSynced] = useState(false);
  // ──────────────────────────────────────────────────────────────────────────

  const [formData, setFormData] = useState({
    appName: selectedApplicationName,
    jmxSource: 'auto',
    jmxFile: null as File | null,
    jmxScriptId: '',
    users: 10,
    duration: 30,
    throughput: 100,
    githubRepo: '',
    adoURL: '',
    datadogURL: ''
  });

  /* ================= POLLING (ADDED) ================= */

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const fetchStatus = async () => {
    if (!selectedApplicationId) return;

    try {

      console.log("Polling------------------------------");
      const res = await getApplicationStatus(
        projectId,
        Number(selectedApplicationId)
      );

      console.log("Get status :", res);

      const statusData = res?.data;   // 👈 FIX

      const progressVal = statusData?.progress_percentage ?? 0;
      const appStatus   = statusData?.status ?? "";

      const msgVal =
        statusData?.last_setup_step ||
        "Configuration Processing...";

      setProgress(progressVal);
      setStatusMsg(msgVal);

      console.log("progress :", progressVal, " and msg :", msgVal);

      const isDone =
        progressVal >= 100 ||
        appStatus === "completed" ||
        appStatus === "configured" ||
        appStatus === "partially_configured" ||
        appStatus === "failed";

      if (isDone) {
        // if (data.progress >= 100 || data.status === "completed" || data.status === "partially_configured") {
        setProgress(100);
        setStep("success");
        stopPolling();
      } else {
        setStep("processing");
      }

      console.log("progress : ", progress, " and msg : ", statusMsg)
    } catch (err) {
      console.error("Polling failed:", err);
    }
  };

  const startPolling = () => {
    stopPolling();
    fetchStatus();
    pollingRef.current = setInterval(fetchStatus, 2000);

    timeoutRef.current = setTimeout(() => {
      console.log("Polling timeout reached (2 min)");

      stopPolling();
      setStatusMsg("Setup taking too long. Try again.");

      handleClose();             // 🔥 close popup automatically
    }, 120000);
  };

  /* ================= EXISTING JMX FETCH ================= */

  useEffect(() => {
    if (!open) return;

    resetSyncState();

  }, [open]);

  useEffect(() => {
    if (open) {
      dispatch(fetchJmx(Number(selectedApplicationId)));
    }
  }, [open, dispatch]);

  /* ================= STAGE HANDLER (MODIFIED) ================= */

  useEffect(() => {
    if (!open) {
      stopPolling();
      return;
    }

    if (stage === "new") {
      setStep("form");
      setProgress(0);
      setStatusMsg("");
      stopPolling();
    }

    if (stage === "in_progress") {
      setStep("processing");
      startPolling();
    }

    return () => stopPolling();
  }, [open, stage]);


  /* ================= SYNC SECRETS TO GITHUB ================= */

  const handleSyncSecrets = async () => {
    const repoUrl = githubRepoRef.current.trim(); // ← ref se lo, stale closure nahi
    if (!repoUrl) return;

    setSyncStatus('syncing');
    setSyncMsg('');
    setSecretsSynced(false);

    try {
      const result = await syncSecretsToGitHub(
        projectId,
        Number(selectedApplicationId),
        repoUrl    // ← ref ki fresh value
      );

      const pushed = result?.pushed || [];
      setSyncedSecrets(pushed);
      setSyncStatus('success');
      setSyncMsg(result?.message || `✅ ${pushed.length} secrets synced to GitHub`);
      setSecretsSynced(true);
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMsg(err.message || 'Sync failed. Check GitHub integration in Settings.');
      setSecretsSynced(false);
    }
  };

  /* ================= START CONFIG ================= */

  const handleStart = async () => {
    try {
      setStep('processing');
      setProgress(0);

      const payload = new FormData();
      payload.append('users', String(formData.users));
      payload.append('duration', String(formData.duration));
      payload.append('ramp_up', '1');
      payload.append('auto_execute', 'false');
      payload.append('ado_url', formData.adoURL);
      payload.append('datadog_url', formData.datadogURL);

      if (formData.githubRepo) {
        payload.append('github_repo_url', formData.githubRepo);
      }

      if (formData.jmxSource === 'auto' && formData.jmxScriptId) {
        payload.append('script_id', formData.jmxScriptId);
      } else if (formData.jmxSource === 'file' && formData.jmxFile) {
        payload.append('script_file', formData.jmxFile);
      } else {
        throw new Error('Provide script_id or upload JMX file');
      }

      await configureApplication(
        Number(projectId),
        Number(selectedApplicationId),
        payload
      );

      startPolling(); // ADDED ONLY THIS LINE
    } catch (err: any) {
      console.error(err);
      setStep('form');
      alert(err.message || 'Configuration failed');
    }
  };


  const resetSyncState = () => {
    setSyncStatus('idle');
    setSyncMsg('');
    setSecretsSynced(false);
    setSyncedSecrets([]);   // must be array, not null
  };

  /* ================= CLOSE (MODIFIED) ================= */

  const handleClose = () => {
    stopPolling(); // ADDED
    setFormData({
      appName: selectedApplicationName,
      jmxSource: 'auto',
      jmxFile: null as File | null,
      jmxScriptId: '',
      users: 10,
      duration: 30,
      throughput: 100,
      githubRepo: '',
      datadogURL: '',
      adoURL: ''
    });


    resetSyncState();

    onClose();
  };





  const handleCancel = () => {
    setFormData({
      appName: selectedApplicationName,
      jmxSource: 'auto',
      jmxFile: null as File | null,
      jmxScriptId: '',
      users: 10,
      duration: 30,
      throughput: 100,
      githubRepo: '',
      datadogURL: '',
      adoURL: ''
    });

    resetSyncState();

    onClose();
  }

  /* ================= UI (UNCHANGED except status text) ================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={step === 'form' ? 'sm' : 'xs'} // Wider during the loading state
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: 3,
          py: 3,
          minHeight: step === 'form' ? 500 : 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: step === 'processing' ? 'center' : 'flex-start',
          alignItems: step === 'processing' ? 'center' : 'stretch',
        },
      }}
    >
      <DialogTitle
        sx={{
          pt: 2,
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#2563EB',
          textAlign: step === 'success' ? 'center' : 'left',
        }}
      >
        {step === 'success' ? 'Application Configured Successfully!' : 'Configure Application'}
      </DialogTitle>

      <DialogContent>

        {step === 'form' && (
          <Box className="flex flex-col gap-6 ">

            <TextField
              label="Application Name"
              fullWidth
              size="small"
              margin="normal"
              value={selectedApplicationName}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2, boxShadow: 1 },
              }}
            />

            <TextField
              select
              label="JMX Source"
              fullWidth
              size="small"
              value={formData.jmxSource}
              onChange={(e) => setFormData({ ...formData, jmxSource: e.target.value })}
              sx={{ borderRadius: 2, boxShadow: 1 }}
            >
              <MenuItem value="file">Upload JMX File</MenuItem>
              <MenuItem value="auto">Select from Autoscripting</MenuItem>
            </TextField>

            {formData.jmxSource === 'auto' ? (
              <TextField
                select
                label="Select Script"
                fullWidth
                size="small"
                value={formData.jmxScriptId}
                onChange={(e) => setFormData({ ...formData, jmxScriptId: e.target.value })}
                sx={{ borderRadius: 2, boxShadow: 1 }}
              >
                {jmxOptions.map((opt: any) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                ))}
              </TextField>
            ) : (
              // <Button
              //   variant="outlined"
              //   component="label"
              //   fullWidth
              //   sx={{
              //     borderRadius: 2,
              //     textTransform: 'none',
              //     boxShadow: 1,
              //     py: 1.5,
              //     bgcolor: 'background.paper',
              //     '&:hover': { bgcolor: 'primary.light' },
              //   }}
              // >
              //   {formData.jmxFile ? `Selected: ${formData.jmxFile.name}` : "Upload JMX"}

              //   <input
              //     type="file"
              //     hidden
              //     accept=".jmx"
              //     onChange={(e) => {
              //       const file = e.target.files?.[0] || null;
              //       setFormData({ ...formData, jmxFile: file });
              //     }}
              //   />
              // </Button>

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: 1,
                  // py: 1.5,
                  bgcolor: "background.paper",
                  display: "flex",
                  justifyContent: formData.jmxFile ? "space-between" : "center",
                  alignItems: "center",

                  // ❌ disable hover color change
                  "&:hover": {
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  },
                }}
              >
                {/* Text */}
                <span style={{ pointerEvents: "none" }}>
                  {formData.jmxFile
                    ? `Selected: ${formData.jmxFile.name}`
                    : "Upload JMX"}
                </span>

                {/* Remove icon when file selected */}
                {formData.jmxFile && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData({ ...formData, jmxFile: null });
                    }}
                  >
                    <X size={16} />
                  </IconButton>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  hidden
                  accept=".jmx"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, jmxFile: file });
                  }}
                />
              </Button>



            )}

            {/* <TextField
              label="GitHub Repository URL"
              fullWidth
              size="small"
              value={formData.githubRepo || ''}
              onChange={(e) =>
                setFormData({ ...formData, githubRepo: e.target.value })
              }
              sx={{ borderRadius: 2, boxShadow: 1 }}
            /> 
            
            
            <TextField
              label="Azure Devops URL"
              type="text"
              size="small"
              fullWidth
              value={formData.adoURL}
              onChange={(e) =>
                setFormData({ ...formData, adoURL: e.target.value })
              }
            />

            
            <TextField
              label="Datadog URL"
              type="text"
              size="small"
              fullWidth
              value={formData.datadogURL}
              onChange={(e) =>
                setFormData({ ...formData, datadogURL: e.target.value })
              }
            />
            
            */}


            {/* GitHub Repo URL + Sync Button */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="GitHub Repository URL"
                  fullWidth
                  size="small"
                  value={formData.githubRepo || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, githubRepo: e.target.value });
                    githubRepoRef.current = e.target.value; // ← ref bhi update karo
                    // URL change hone par sync reset karo
                    if (syncStatus === 'success') {
                      setSyncStatus('idle');
                      setSecretsSynced(false);
                      setSyncMsg('');
                    }
                  }}
                  sx={{ borderRadius: 2, boxShadow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleSyncSecrets}
                  disabled={!formData.githubRepo.trim() || syncStatus === 'syncing'}
                  size="small"
                  sx={{
                    whiteSpace: 'nowrap',
                    height: 40,
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    flexShrink: 0,
                    ...(syncStatus === 'success' && {
                      borderColor: '#16a34a',
                      color: '#16a34a',
                      bgcolor: '#f0fdf4',
                      '&:hover': { bgcolor: '#dcfce7', borderColor: '#16a34a' }
                    }),
                    ...(syncStatus === 'error' && {
                      borderColor: '#dc2626',
                      color: '#dc2626',
                      bgcolor: '#fff1f2',
                      '&:hover': { bgcolor: '#fee2e2', borderColor: '#dc2626' }
                    }),
                  }}
                >
                  {syncStatus === 'syncing' ? 'Syncing…' :
                    syncStatus === 'success' ? '✓ Synced' :
                      syncStatus === 'error' ? 'Retry' :
                        'Sync Secrets'}
                </Button>
              </Box>

              {/* Sync feedback message */}
              {syncMsg && (
                <Box sx={{
                  mt: 1, px: 1.5, py: 1, borderRadius: 1, fontSize: '0.75rem',
                  ...(syncStatus === 'success'
                    ? { bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
                    : { bgcolor: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }
                  )
                }}>
                  {syncMsg}
                  {syncStatus === 'success' && syncedSecrets.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {syncedSecrets.map((s) => (
                        <Box key={s} component="span" sx={{
                          bgcolor: '#d1fae5', color: '#065f46',
                          border: '1px solid #a7f3d0',
                          borderRadius: 0.5, px: 0.75, py: 0.25,
                          fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600
                        }}>
                          {s}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Helper hint */}
              {syncStatus === 'idle' && !formData.githubRepo.trim() && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                  Save the repo URL and sync it — then the Start Configuration option will be enabled.
                </Typography>
              )}
            </Box>

            
            


            <TextField
              label="Concurrent Users"
              type="number"
              size="small"
              fullWidth
              value={formData.users}
              onChange={(e) =>
                setFormData({ ...formData, users: Number(e.target.value) })
              }
            />

            <TextField
              label="Duration (min)"
              type="number"
              size="small"
              fullWidth
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
            />

            <TextField
              label="Throughput (hits/s)"
              type="number"
              size="small"
              fullWidth
              value={formData.throughput}
              onChange={(e) =>
                setFormData({ ...formData, throughput: Number(e.target.value) })
              }
            />

          </Box>
        )}

        {step === 'processing' && (
          <Box className="text-center py-6 ">
            <Typography variant="body1" sx={{ mb: 2 }}>
              {statusMsg || "Configuring Integrations & Generating CI/CD Pipelines..."}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}% Complete</Typography>
          </Box>
        )}

        {step === 'success' && (
          <Alert severity="success">
            Service configured successfully.
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          justifyContent: step === 'success' ? 'center' : 'space-between',
        }}
      >
        {step === 'form' && (
          <>
            <Button onClick={handleCancel} color="inherit" sx={{ color: 'grey.700', fontWeight: '600' }}>
              Cancel
            </Button>
            {/* <Button
          variant="contained"
          onClick={handleStart}
          disabled={!formData.appName}
          sx={{ textTransform: 'none' }}
        >
          Start Configuration
        </Button> */}
            <Button
              variant="contained"
              onClick={handleStart}
              disabled={!secretsSynced || formData.githubRepo === '' || (formData.jmxFile === null && formData.jmxScriptId === '')}
              disableElevation
              sx={{
                px: 4, py: 1.2, textTransform: 'none', bgcolor: '#1d4ed8',      // blue-700
                '&:hover': {
                  bgcolor: '#1e40af'     // blue-800
                }
              }}
              className='bg-blue-700'
            >
              Start Configuration
            </Button>
          </>
        )}
        {step === 'processing' && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        )}
        {step === 'success' && (
          <Button variant="contained" onClick={handleClose} sx={{ textTransform: 'none' }}>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
