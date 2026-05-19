import { Paper, Button, Select, MenuItem, Typography, Box } from '@mui/material';
import { UploadFile, PlayArrow } from '@mui/icons-material';

const AutoScriptPage = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {/* Left: Configuration Panel */}
      <Box sx={{ flex: '1 1 58%', minWidth: 280 }}>
        <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed #e0e0e0' }}>
           <Typography variant="subtitle2" color="textSecondary" gutterBottom>Application</Typography>
           <Select fullWidth size="small" value="Atlas" sx={{ mb: 4 }}>
             <MenuItem value="Atlas">Atlas</MenuItem>
           </Select>

           <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              <Paper variant="outlined" sx={{ p: 4, flex: 1 }}>
                <UploadFile color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2">harOne.har</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 4, flex: 1 }}>
                <UploadFile color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2">harTwo.har</Typography>
              </Paper>
           </Box>

           <Button variant="contained" size="large" startIcon={<PlayArrow />} fullWidth>
              Generate JMX
           </Button>
        </Paper>
      </Box>

      {/* Right: History Panel */}
      <Box sx={{ flex: '1 1 38%', minWidth: 240 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Generated JMX Scripts</Typography>
          {/* List of files with success/fail icons from the image */}
        </Paper>
      </Box>
    </Box>
  );
};

export default AutoScriptPage;
