import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, LinearProgress, Box, Typography, Alert
} from '@mui/material';
import { fetchJmx, addApp } from '../store/autoAnalysisSlice';
import { AppDispatch } from '../../../store/store'; // Assume global store type location

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddApplicationModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  // @ts-ignore
  const jmxOptions = useSelector((state) => state.autoAnalysis.jmxOptions);

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    appName: '',
    jmxSource: 'auto', // 'file' or 'auto'
    jmxFile: null as File | null,
    jmxScriptId: '',
    users: 10,
    duration: 30,
    throughput: 100
  });

  useEffect(() => {
    if (open) dispatch(fetchJmx());
  }, [open, dispatch]);

  const handleStart = async () => {
    setStep('processing');

    // Simulate Progress Steps
    const stages = [10, 30, 60, 80, 100];
    for (const p of stages) {
      await new Promise(r => setTimeout(r, 600)); // Simulate API polling
      setProgress(p);
    }

    await dispatch(addApp({ appName: formData.appName }));
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setProgress(0);
    setFormData({ ...formData, appName: '' });
    onClose();
  };

  // return (
  //   <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  //     <DialogTitle>Add New Application</DialogTitle>

  //     <DialogContent>
  //       {step === 'form' && (
  //         <Box className="flex flex-col gap-4 mt-2">
  //           <TextField
  //             label="Application Name"
  //             fullWidth
  //             size="small"
  //             value={formData.appName}
  //             onChange={(e) => setFormData({...formData, appName: e.target.value})}
  //           />

  //           <TextField
  //             select
  //             label="JMX Source"
  //             size="small"
  //             value={formData.jmxSource}
  //             onChange={(e) => setFormData({...formData, jmxSource: e.target.value})}
  //           >
  //             <MenuItem value="file">Upload JMX File</MenuItem>
  //             <MenuItem value="auto">Select from Autoscripting</MenuItem>
  //           </TextField>

  //           {formData.jmxSource === 'auto' ? (
  //             <TextField
  //               select
  //               label="Select Script"
  //               size="small"
  //               fullWidth
  //               value={formData.jmxScriptId}
  //               onChange={(e) => setFormData({...formData, jmxScriptId: e.target.value})}
  //             >
  //               {jmxOptions.map((opt: any) => (
  //                 <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
  //               ))}
  //             </TextField>
  //           ) : (
  //             <Button variant="outlined" component="label">
  //               Upload JMX
  //               <input type="file" hidden onChange={(e) => setFormData({...formData, jmxFile: e.target.files?.[0] || null})} />
  //             </Button>
  //           )}

  //           <div className="grid grid-cols-3 gap-4">
  //             <TextField label="Concurrent Users" type="number" size="small" value={formData.users} />
  //             <TextField label="Duration (min)" type="number" size="small" value={formData.duration} />
  //             <TextField label="Throughput (hits/s)" type="number" size="small" value={formData.throughput} />
  //           </div>
  //         </Box>
  //       )}

  //       {step === 'processing' && (
  //         <Box className="text-center py-8">
  //           <Typography variant="body1" className="mb-4">Configuring Integrations & Generating CI/CD Pipelines...</Typography>
  //           <LinearProgress variant="determinate" value={progress} />
  //           <Typography variant="caption" className="mt-2 block text-gray-500">{progress}% Complete</Typography>
  //         </Box>
  //       )}

  //       {step === 'success' && (
  //         <Alert severity="success" sx={{ mt: 2 }}>
  //           Service configured successfully. Test scenario and CI/CD integration generated.
  //         </Alert>
  //       )}
  //     </DialogContent>

  //     <DialogActions>
  //       {step === 'form' && (
  //         <>
  //           <Button onClick={handleClose}>Cancel</Button>
  //           <Button variant="contained" onClick={handleStart} disabled={!formData.appName}>Start Configuration</Button>
  //         </>
  //       )}
  //       {step === 'success' && (
  //         <Button variant="contained" onClick={handleClose}>Done</Button>
  //       )}
  //     </DialogActions>
  //   </Dialog>
  // );

  return (

//     <Dialog
//   open={open}
//   onClose={handleClose}
//   maxWidth={step === 'form' ? 'xs' : 'md'} // wider while loading
//   fullWidth
//   PaperProps={{
//     sx: {
//       borderRadius: 3,
//       px: 3,
//       py: 3,
//       minHeight: step === 'form' ? 500 : 200,
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: step === 'processing' ? 'center' : 'flex-start',
//       alignItems: step === 'processing' ? 'center' : 'stretch',
//     },
//   }}

//   scroll="paper" 
// >
//   {/* <DialogTitle
//     sx={{
//       pt: 2.5,
//       pb: 1,
//       fontWeight: 700,
//       fontSize: '1.5rem', // bigger title
//       color: 'text.primary',
//       textAlign: step === 'success' ? 'center' : 'left', // center on success
//     }}
//   >
//     Add New Application
//   </DialogTitle> */}

//   <DialogTitle
//   sx={{
//     pt: 2.5,
//     fontWeight: 700,
//     fontSize: '1.5rem',
//     color: 'text.primary',
//     textAlign: step === 'success' ? 'center' : 'left',
//   }}
// >
//   {step === 'success' ? 'Application Configured Successfully!' : 'Add New Application'}
// </DialogTitle>


//   <DialogContent sx={{  pt: 1, display: 'flex', flexDirection: 'column', alignItems: step === 'form' ? 'stretch' : 'center' }}>
//     {step === 'form' && (
//       <Box className="flex flex-col gap-6 mt-1">
//         {/* <TextField
//           label="Application Name"
//           fullWidth
//           size="small"
//           value={formData.appName}
//           onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
//           sx={{
//             '& .MuiOutlinedInput-root': { borderRadius: 2, boxShadow: 1 },
//           }}
//         /> */}

//         <TextField
//   label="Application Name"
//   fullWidth
//   size="small"
//   margin="normal"  // add this line for correct spacing
//   value={formData.appName}
//   onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
// />


//         <TextField
//           select
//           label="JMX Source"
//           fullWidth
//           size="small"
//           value={formData.jmxSource}
//           onChange={(e) => setFormData({ ...formData, jmxSource: e.target.value })}
//           sx={{ borderRadius: 2, boxShadow: 1 }}
//         >
//           <MenuItem value="file">Upload JMX File</MenuItem>
//           <MenuItem value="auto">Select from Autoscripting</MenuItem>
//         </TextField>

//         {formData.jmxSource === 'auto' ? (
//           <TextField
//             select
//             label="Select Script"
//             fullWidth
//             size="small"
//             value={formData.jmxScriptId}
//             onChange={(e) => setFormData({ ...formData, jmxScriptId: e.target.value })}
//             sx={{ borderRadius: 2, boxShadow: 1 }}
//           >
//             {jmxOptions.map((opt: any) => (
//               <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
//             ))}
//           </TextField>
//         ) : (
//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{
//               borderRadius: 2,
//               textTransform: 'none',
//               boxShadow: 1,
//               py: 1.5,
//               bgcolor: 'background.paper',
//               '&:hover': { bgcolor: 'primary.light' },
//             }}
//           >
//             Upload JMX
//             <input
//               type="file"
//               hidden
//               onChange={(e) => setFormData({ ...formData, jmxFile: e.target.files?.[0] || null })}
//             />
//           </Button>
//         )}

//         <TextField label="Concurrent Users" type="number" size="small" fullWidth value={formData.users} />
//         <TextField label="Duration (min)" type="number" size="small" fullWidth value={formData.duration} />
//         <TextField label="Throughput (hits/s)" type="number" size="small" fullWidth value={formData.throughput} />
//       </Box>
//     )}

//     {step === 'processing' && (
//       <Box className="text-center w-full">
//         <Typography variant="h6" className="mb-4 text-gray-700 text-center">
//           Configuring Integrations & Generating CI/CD Pipelines...
//         </Typography>
//         <LinearProgress
//           variant="determinate"
//           value={progress}
//           sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
//         />
//         <Typography variant="caption" className="mt-2 block text-gray-500 text-center">{progress}% Complete</Typography>
//       </Box>
//     )}

//     {step === 'success' && (
//       <Alert severity="success" sx={{ mt: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
//         Service configured successfully. Test scenario and CI/CD integration generated.
//       </Alert>
//     )}
//   </DialogContent>

//   <DialogActions
//     sx={{
//       px: 3,
//       pb: 2,
//       justifyContent: step === 'success' ? 'center' : 'space-between', // center Done button
//     }}
//   >
//     {step === 'form' && (
//       <>
//         <Button
//           onClick={handleClose}
//           variant="outlined"
//           sx={{
//             textTransform: 'none',
//             borderColor: '#c1c1c1',
//             color: '#6b6b6b',
//             '&:hover': { borderColor: '#a0a0a0', bgcolor: '#f5f5f5' },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleStart}
//           disabled={!formData.appName}
//           sx={{ textTransform: 'none' }}
//         >
//           Start Configuration
//         </Button>
//       </>
//     )}
//     {step === 'success' && (
//       <Button variant="contained" onClick={handleClose} sx={{ textTransform: 'none' }}>
//         Done
//       </Button>
//     )}
//   </DialogActions>
// </Dialog>



<Dialog
  open={open}
  onClose={onClose}
  maxWidth={step === 'form' ? 'sm' : 'md'} // Wider during the loading state
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
  scroll="paper"
>
  <DialogTitle
    sx={{
      pt: 2.5,
      fontWeight: 700,
      fontSize: '1.5rem',
      color: 'blue',
      textAlign: step === 'success' ? 'center' : 'left',
    }}
  >
    {step === 'success' ? 'Application Configured Successfully!' : 'Add New Application'}
  </DialogTitle>

  <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', alignItems: step === 'form' ? 'stretch' : 'center' }}>
    {step === 'form' && (
      <Box className="flex flex-col gap-6 mt-1">

        <TextField
          label="Application Name"
          fullWidth
          size="small"
          margin="normal"
          value={formData.appName}
          onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
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
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 1,
              py: 1.5,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'primary.light' },
            }}
          >
            Upload JMX
            <input
              type="file"
              hidden
              onChange={(e) => setFormData({ ...formData, jmxFile: e.target.files?.[0] || null })}
            />
          </Button>
        )}

        <TextField label="Concurrent Users" type="number" size="small" fullWidth value={formData.users} />
        <TextField label="Duration (min)" type="number" size="small" fullWidth value={formData.duration} />
        <TextField label="Throughput (hits/s)" type="number" size="small" fullWidth value={formData.throughput} />
      </Box>
    )}

    {step === 'processing' && (
      <Box className="text-center w-full">
        <Typography variant="h6" className="mb-4 text-gray-700 text-center">
          Configuring Integrations & Generating CI/CD Pipelines...
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
        />
        <Typography variant="caption" className="mt-2 block text-gray-500 text-center">{progress}% Complete</Typography>
      </Box>
    )}

    {step === 'success' && (
      <Alert severity="success" sx={{ mt: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
        Service configured successfully. Test scenario and CI/CD integration generated.
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
        <Button onClick={onClose} color="inherit" sx={{ color: 'grey.700', fontWeight: '600' }}>
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
  disabled={!formData.appName}
  disableElevation
  sx={{ px: 4, py: 1.2, textTransform: 'none' }}
>
  Start Configuration
</Button>
      </>
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