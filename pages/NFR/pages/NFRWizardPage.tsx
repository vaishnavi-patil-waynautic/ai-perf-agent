import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button, Paper } from '@mui/material';
import WizardStep1_Fetch from '../components/WizardStep1_Fetch';
import WizardStep2_Docs from '../components/WizardStep2_Docs';
import WizardStep3_Questionnaire from '../components/WizardStep3_Questionnaire';
import WizardStep4_Generate from '../components/WizardStep4_Generate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/nfr')} className="mb-4 text-gray-600">
                Back to Dashboard
            </Button>

            <Paper className="rounded-xl overflow-hidden shadow-md">
                <div className="bg-white border-b">
                    <Tabs 
                        value={activeTab} 
                        onChange={(_, v) => setActiveTab(v)}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {steps.map((step, index) => (
                            <Tab key={index} label={step.label} className="font-semibold py-4" />
                        ))}
                    </Tabs>
                </div>

                <div className="p-8 bg-white min-h-[400px]">
                    {steps[activeTab].component}
                </div>

                <div className="p-4 bg-gray-100 flex justify-between border-t">
                    <Button disabled={activeTab === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeTab < steps.length - 1 && (
                        <Button variant="contained" onClick={handleNext} className="bg-blue-600">
                            Next
                        </Button>
                    )}
                </div>
            </Paper>
        </div>
    </div>
  );
};

export default NFRWizardPage;