import React, { useState } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Fetch & Select', 'Add Documents', 'Questionnaire', 'Generate'];

interface Props {
  onStepChange?: (stepIndex: number) => void; // optional callback for parent
}

const NFRStepper: React.FC<Props> = ({ onStepChange }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (onStepChange) onStepChange(index);
  };

  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label} onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
          <StepLabel
            StepIconProps={{
              style: {
                color: index <= activeStep ? '#2563eb' : '#cbd5e1', // blue for completed/active, gray otherwise
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default NFRStepper;
