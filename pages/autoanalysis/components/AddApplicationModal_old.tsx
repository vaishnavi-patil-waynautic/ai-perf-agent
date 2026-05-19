import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, LinearProgress, Box, Typography, Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { AppDispatch } from '../../../store/store';
import { fetchJmx } from '../store/autoAnalysisSlice';
import { configureApplication, getApplicationStatus, syncSecretsToGitHub } from '../services/mockService';
import { showSnackbar } from '@/store/snackbarStore';
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
      const appStatus = statusData?.status ?? "";

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

      console.log("jmxOptions fetching-----------------------------------");
      dispatch(fetchJmx(Number(selectedApplicationId)));
      console.log("jmxOptions : ", jmxOptions);
    }
  }, [open, dispatch]);

  const completedOptions = jmxOptions?.filter(
    (opt: any) => opt.status === "completed"
  );


  console.log("jmxOptions : ", jmxOptions);
  console.log("completedOptions : ", completedOptions)

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
      dispatch(showSnackbar({ message: err.message || 'Configuration failed', type: 'error' }));
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
                onChange={(e) =>
                  setFormData({ ...formData, jmxScriptId: e.target.value })
                }
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        width: 260,        // 👈 FIX: constrain dropdown width
                      },
                    },
                  },
                }}
              >


                {completedOptions.map((opt: any) => (
                  <MenuItem key={opt.id} value={opt.id} sx={{ maxWidth: 550 }}>
                    <Tooltip title={opt.name} arrow>
                      <span
                        style={{
                          display: "block",
                          width: "100%",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {opt.name}
                      </span>
                    </Tooltip>
                  </MenuItem>
                ))}
              </TextField>
            ) : (

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
                
              </Box>

              {/* Helper hint - updated message */}
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                Secrets will be automatically synced when you click "Start Configuration"
              </Typography>
            </Box>

            <TextField
              label="Concurrent Users"
              type="number"
              size="small"
              fullWidth
              inputProps={{ min: 0 }}
              value={formData.users}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setFormData({ ...formData, users: null });
                  return;
                }

                const num = Math.max(0, Number(val));
                setFormData({ ...formData, users: num });
              }}
            />

            <TextField
              label="Duration (min)"
              type="number"
              size="small"
              fullWidth
              inputProps={{ min: 0 }}
              value={formData.duration}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setFormData({ ...formData, duration: null });
                  return;
                }

                setFormData({
                  ...formData,
                  duration: Math.max(0, Number(val)),
                });
              }}
            />

            <TextField
              label="Throughput (hits/s)"
              type="number"
              size="small"
              fullWidth
              inputProps={{ min: 0 }}
              value={formData.throughput}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setFormData({ ...formData, throughput: null });
                  return;
                }

                setFormData({
                  ...formData,
                  throughput: Math.max(0, Number(val)),
                });
              }}
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

            <Button
              variant="contained"
              onClick={handleStart}
              disabled={formData.githubRepo === '' || (formData.jmxFile === null && formData.jmxScriptId === '')}
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
