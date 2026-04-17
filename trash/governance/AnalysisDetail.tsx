import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Button, Chip } from '@mui/material';
import { ExpandMore, Download, WarningAmber, Assessment } from '@mui/icons-material';

const AnalysisDetail = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Build #BUILD_20260407_123640</Typography>
        <Button variant="contained" startIcon={<Download />} sx={{ borderRadius: 2 }}>
          Download Report
        </Button>
      </Box>

      {/* Stats Overview Grid */}
      <Paper sx={{ p: 3, mb: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
        <StatItem label="Project" value="Waynautic-1" icon={<Assessment color="primary" />} />
        <StatItem label="Application" value="Atlas" icon={<Box sx={{ bgcolor: 'blue.100', p: 0.5, borderRadius: 1 }} />} />
        <StatItem label="Test Time" value="7/4/2026, 6:06:45 pm" />
        <StatItem label="Transactions" value="13" />
      </Paper>

      {/* AI Observations Accordion */}
      <Accordion defaultExpanded sx={{ mb: 2, border: '1px solid #f0f0f0', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>OBSERVATIONS -</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            The average response time for the 'Login' endpoint is significantly high at 
            <Box component="span" sx={{ fontWeight: 'bold' }}> 1.506 seconds</Box>, 
            indicating a potential <Box component="span" sx={{ color: 'error.main' }}>performance degradation</Box>...
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Datadog Integration */}
      <Accordion sx={{ border: '1px solid #f0f0f0', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>DATADOG REMARKS -</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary">No critical anomalies detected in infrastructure metrics.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const StatItem = ({ label, value, icon }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="textSecondary">{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  </Box>
);