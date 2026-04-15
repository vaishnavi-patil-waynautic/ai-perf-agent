import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Button,
  Paper,
  Box,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import WizardStep1_Fetch from '../components/WizardStep1_Fetch';
import WizardStep2_Docs from '../components/WizardStep2_Docs';
import WizardStep3_Questionnaire from '../components/WizardStep3_Questionnaire';
import WizardStep4_Generate from '../components/WizardStep4_Generate';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from '@/pages/settings/store/hooks';
import { resetWizard } from '../slices/nfrWizardSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const NFRWizardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isStep3Valid, setIsStep3Valid] = useState(true);
  const { selectedProject } = useSelector((state: RootState) => state.project);

  const previousProjectIdRef = useRef<Number | null>(null);

useEffect(() => {
  if (!selectedProject?.id) return;

  // Skip reset on first render (after persistence rehydration)
  if (previousProjectIdRef.current === null) {
    previousProjectIdRef.current = selectedProject.id;
    return;
  }

  // Reset only when the project actually changes
  if (previousProjectIdRef.current !== selectedProject.id) {
    console.log("Project changed. Resetting wizard state...");
    dispatch(resetWizard());
     localStorage.removeItem("NFR_Wizard_Files");

  }

  previousProjectIdRef.current = selectedProject.id;
}, [selectedProject?.id, dispatch]);

    // useEffect(() => {

    //   if (!selectedProject?.id) return;


    //   console.log("Refreshing the state**********************************************************")

    //   dispatch(resetWizard());
    // }, [selectedProject?.id]);

  const steps = [
    { label: 'Fetch & Select', component: <WizardStep1_Fetch /> },
    { label: 'Add Documents', component: <WizardStep2_Docs /> },
    {
      label: 'Questionnaire',
      component: (
        <WizardStep3_Questionnaire
          onValidationChange={setIsStep3Valid}
        />
      ),
    },
    { label: 'Generate', component: <WizardStep4_Generate /> },
  ];

  const handleNext = () => {
    if (activeTab < steps.length - 1) setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    if (activeTab > 0) setActiveTab(activeTab - 1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        p: 4,
        maxHeight: "100vh",
      }}
      className="text-xs font-medium"
    >
      <Box className="max-w-5xl mx-auto">

        {/* Back to Dashboard */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/nfr')}
          sx={{
            mb: 1,
            color: "#5c5f66",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Back to Dashboard
        </Button>

        {/* Main Card */}


        {/* Tabs styled LIKE a corporate stepper */}
        <Box
          sx={{
            mt: 1,
            borderBottom: "1px solid #e4e6eb",
          }}
        >


          <Stepper
            activeStep={activeTab}
            alternativeLabel
            nonLinear
            sx={{
              mt: 1,
              mb: 1,
              p: 0,
              '& .MuiStepLabel-label': { fontSize: '0.7rem', fontWeight: 500 },
            }}
          >
            {steps.map((s, index) => (
              <Step key={s.label}>
                <StepButton
                  onClick={() => setActiveTab(index)}
                  sx={{ fontSize: '0.7rem' }}
                >
                  {s.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>


        </Box>

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
          <Box
            sx={{
              mt: 1,
              background: "#ffffff",
              borderRadius: "8px",
              minHeight: "350px",
            }}
          >
            {steps[activeTab].component}
          </Box>

          <Divider sx={{ mt: 1 }} />

          {/* Bottom Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Button
              disabled={activeTab === 0}
              startIcon={<ChevronLeftIcon />}
              onClick={handleBack}
              sx={{
                textTransform: "none",
                color: "#6b6f76",
              }}
            >
              Previous
            </Button>

            {activeTab < steps.length - 1 && (
              <Button
                endIcon={<ChevronRightIcon />}
                variant="contained"
                onClick={handleNext}
                disabled={activeTab === 2 && !isStep3Valid}
                className="bg-blue-600 hover:bg-blue-700"
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                Next
              </Button>

            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default NFRWizardPage;

