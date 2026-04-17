// src/pages/NFRStrategyHub.tsx
import { Box, TextField, Button, Paper, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

const steps = ['Define Scope', 'Identify NFRs', 'Generate AI Strategy'];

const NFRStrategyHub = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>NFR Strategy Hub</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Generate a comprehensive Performance Test Strategy using AI models trained on industry standards.
      </Typography>

      <Stepper activeStep={1} sx={{ mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>Application Context</Typography>
        <TextField 
          fullWidth 
          multiline 
          rows={4} 
          placeholder="Describe your application architecture, user load, and critical business transactions..." 
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Button 
          variant="contained" 
          fullWidth 
          size="large" 
          startIcon={<AutoAwesome />}
          sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
        >
          Generate AI Strategy Document
        </Button>
      </Paper>
    </Box>
  );
};