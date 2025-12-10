import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Box, Typography, Divider
} from '@mui/material';
import { saveSettings } from '../services/mockService';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    blazemeterToken: '',
    cicdTool: 'jenkins',
    cicdToken: '',
    apmTool: 'datadog',
    apmToken: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await saveSettings(formData);
    onClose();
  };

  return (


    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
  PaperProps={{ sx: { borderRadius: 3, boxShadow: 4 } }}
>
  <DialogTitle 
    sx={{ 
      fontWeight: 'bold', 
      fontSize: '1.25rem', 
      pb: 2 ,
      pt: 4,
      pl: 4
    }}
  >
    Global Configuration
  </DialogTitle>

  <DialogContent sx={{ px: 4 }}>
    <Box component="form" className="flex flex-col gap-6 mt-4">
      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: '600', letterSpacing: 0.5 }}>
        BlazeMeter Integration
      </Typography>
      <TextField
        label="API Token"
        name="blazemeterToken"
        type="password"
        fullWidth
        size="small"
        value={formData.blazemeterToken}
        onChange={handleChange}
        sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
      />

      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: '600', letterSpacing: 0.5 }}>
        CI/CD Integration
      </Typography>
      <Box className="flex gap-4" sx={{ flexWrap: 'wrap', gap: 2 }}>
        <TextField
          select
          label="Tool"
          name="cicdTool"
          fullWidth
          size="small"
          value={formData.cicdTool}
          onChange={handleChange}
          sx={{ flex: 1, minWidth: 140, bgcolor: 'background.paper', borderRadius: 1 }}
        >
          <MenuItem value="jenkins">Jenkins</MenuItem>
          <MenuItem value="gitlab">GitLab CI</MenuItem>
          <MenuItem value="ado">Azure DevOps</MenuItem>
        </TextField>
        <TextField
          label="Token"
          name="cicdToken"
          type="password"
          fullWidth
          size="small"
          value={formData.cicdToken}
          onChange={handleChange}
          sx={{ flex: 1, minWidth: 140, bgcolor: 'background.paper', borderRadius: 1 }}
        />
      </Box>

      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: '600', letterSpacing: 0.5 }}>
        APM Integration
      </Typography>
      <Box className="flex gap-4" sx={{ flexWrap: 'wrap', gap: 2 }}>
        <TextField
          select
          label="Tool"
          name="apmTool"
          fullWidth
          size="small"
          value={formData.apmTool}
          onChange={handleChange}
          sx={{ flex: 1, minWidth: 140, bgcolor: 'background.paper', borderRadius: 1 }}
        >
          <MenuItem value="datadog">Datadog</MenuItem>
          <MenuItem value="dynatrace">Dynatrace</MenuItem>
          <MenuItem value="newrelic">New Relic</MenuItem>
        </TextField>
        <TextField
          label="Token"
          name="apmToken"
          type="password"
          fullWidth
          size="small"
          value={formData.apmToken}
          onChange={handleChange}
          sx={{ flex: 1, minWidth: 140, bgcolor: 'background.paper', borderRadius: 1 }}
        />
      </Box>
    </Box>
  </DialogContent>

  <DialogActions sx={{ p:4 , justifyContent: 'space-between' }}>
    <Button onClick={onClose} color="inherit" sx={{ color: 'grey.700', fontWeight: '600' }}>
      Cancel
    </Button>
    <Button onClick={handleSubmit} variant="contained" disableElevation sx={{ px: 4, py: 1.2 }}>
      Save Settings
    </Button>
  </DialogActions>
</Dialog>



    // <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    //   <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>Global Configuration</DialogTitle>
    //   <DialogContent sx={{ pt: 3 }}>
    //     <Box component="form" className="flex flex-col gap-4 mt-4">
    //       <Typography variant="subtitle2" color="primary">BlazeMeter Integration</Typography>
    //       <TextField
    //         label="API Token"
    //         name="blazemeterToken"
    //         type="password"
    //         fullWidth
    //         size="small"
    //         value={formData.blazemeterToken}
    //         onChange={handleChange}
    //       />

    //       <Divider />
    //       <Typography variant="subtitle2" color="primary">CI/CD Integration</Typography>
    //       <div className="flex gap-4">
    //         <TextField
    //           select
    //           label="Tool"
    //           name="cicdTool"
    //           fullWidth
    //           size="small"
    //           value={formData.cicdTool}
    //           onChange={handleChange}
    //         >
    //           <MenuItem value="jenkins">Jenkins</MenuItem>
    //           <MenuItem value="gitlab">GitLab CI</MenuItem>
    //           <MenuItem value="ado">Azure DevOps</MenuItem>
    //         </TextField>
    //         <TextField
    //           label="Token"
    //           name="cicdToken"
    //           type="password"
    //           fullWidth
    //           size="small"
    //           value={formData.cicdToken}
    //           onChange={handleChange}
    //         />
    //       </div>

    //       <Divider />
    //       <Typography variant="subtitle2" color="primary">APM Integration</Typography>
    //       <div className="flex gap-4">
    //         <TextField
    //           select
    //           label="Tool"
    //           name="apmTool"
    //           fullWidth
    //           size="small"
    //           value={formData.apmTool}
    //           onChange={handleChange}
    //         >
    //           <MenuItem value="datadog">Datadog</MenuItem>
    //           <MenuItem value="dynatrace">Dynatrace</MenuItem>
    //           <MenuItem value="newrelic">New Relic</MenuItem>
    //         </TextField>
    //         <TextField
    //           label="Token"
    //           name="apmToken"
    //           type="password"
    //           fullWidth
    //           size="small"
    //           value={formData.apmToken}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </Box>
    //   </DialogContent>
    //   <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
    //     <Button onClick={onClose} color="inherit">Cancel</Button>
    //     <Button onClick={handleSubmit} variant="contained" disableElevation>Save Settings</Button>
    //   </DialogActions>
    // </Dialog>
  );
};