// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Tabs, Tab, Button, Paper } from '@mui/material';
// import WizardStep1_Fetch from '../components/WizardStep1_Fetch';
// import WizardStep2_Docs from '../components/WizardStep2_Docs';
// import WizardStep3_Questionnaire from '../components/WizardStep3_Questionnaire';
// import WizardStep4_Generate from '../components/WizardStep4_Generate';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const NFRWizardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(0);

//   const steps = [
//       { label: 'Fetch & Select', component: <WizardStep1_Fetch /> },
//       { label: 'Add Documents', component: <WizardStep2_Docs /> },
//       { label: 'Questionnaire', component: <WizardStep3_Questionnaire /> },
//       { label: 'Generate', component: <WizardStep4_Generate /> },
//   ];

//   const handleNext = () => {
//       if (activeTab < steps.length - 1) setActiveTab(activeTab + 1);
//   };

//   const handleBack = () => {
//       if (activeTab > 0) setActiveTab(activeTab - 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-5xl mx-auto">
//             <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/nfr')} className="mb-4 text-gray-600">
//                 Back to Dashboard
//             </Button>

//             <Paper className="rounded-xl overflow-hidden shadow-md">
//                 <div className="bg-white border-b">
//                     <Tabs 
//                         value={activeTab} 
//                         onChange={(_, v) => setActiveTab(v)}
//                         variant="fullWidth"
//                         indicatorColor="primary"
//                         textColor="primary"
//                     >
//                         {steps.map((step, index) => (
//                             <Tab key={index} label={step.label} className="font-semibold py-4" />
//                         ))}
//                     </Tabs>
//                 </div>

//                 <div className="p-8 bg-white min-h-[400px]">
//                     {steps[activeTab].component}
//                 </div>

//                 <div className="p-4 bg-gray-100 flex justify-between border-t">
//                     <Button disabled={activeTab === 0} onClick={handleBack}>
//                         Back
//                     </Button>
//                     {activeTab < steps.length - 1 && (
//                         <Button variant="contained" onClick={handleNext} className="bg-blue-600">
//                             Next
//                         </Button>
//                     )}
//                 </div>
//             </Paper>
//         </div>
//     </div>
//   );
// };

// export default NFRWizardPage;

import React, { useState } from 'react';
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


const NFRWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    { label: 'Fetch & Select', component: <WizardStep1_Fetch /> },
    { label: 'Add Documents', component: <WizardStep2_Docs /> },
    { label: 'Questionnaire', component: <WizardStep3_Questionnaire /> },
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
      className = "text-xs font-medium"
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

            {/* Stepper */}
            {/* <Stepper activeStep={activeTab} alternativeLabel sx={{ mt: 4, mb: 4 }}>
            {steps.map((s) => (
                <Step key={s.label}>
                <StepLabel>{s.label}</StepLabel>
                </Step>
            ))}
            </Stepper> */}

{/* <Stepper
  activeStep={activeTab}
  alternativeLabel
  nonLinear   // <-- this is the key to making ALL steps clickable
  sx={{ mt: 1, mb: 1, p:0 }}
  className='text-xs font-medium'
>
  {steps.map((s, index) => (
    <Step key={s.label} disabled={false}>   {/* <-- allow clicking 
      <StepButton className='text-xs font-medium' onClick={() => setActiveTab(index)}>
        {s.label}
      </StepButton>
    </Step>
  ))}
</Stepper> */}


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



            {/* <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#7a7f87",
                  py: 2,
                },
                "& .Mui-selected": {
                  color: "#2b2f36",
                },
                "& .MuiTabs-indicator": {
                  height: "3px",
                  backgroundColor: "#5563df",
                }
              }}
            >
              {steps.map((step, index) => (
                <Tab key={index} label={step.label} />
              ))}
            </Tabs> */}
          </Box>

          {/* Step Content in a “card section” */}

          <Paper
          elevation={0}
          sx={{
            borderRadius: "12px",
            background: "#ffffff",
            border: "1px solid #e4e6eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            p: 3,
            mt:1,
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

