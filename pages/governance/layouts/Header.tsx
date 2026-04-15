import { AppBar, Toolbar, Box, Typography, Select, MenuItem, Avatar, IconButton } from '@mui/material';
import { PowerSettingsNew, BusinessCenter } from '@mui/icons-material';

export const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: 'white', color: '#1e293b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, lineHeight: 1 }}>{'< >'}</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Waynautic AI Perf Agent</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 2, px: 1.5, py: 0.5 }}>
            <BusinessCenter sx={{ fontSize: 18, mr: 1, color: '#64748b' }} />
            <Select 
              value="Waynautic-1" 
              variant="standard" 
              disableUnderline 
              sx={{ fontSize: '0.875rem', fontWeight: 500 }}
            >
              <MenuItem value="Waynautic-1">Waynautic-1</MenuItem>
              <MenuItem value="Atlas">Atlas Production</MenuItem>
            </Select>
          </Box>

          <Avatar src="/user-avatar.jpg" sx={{ width: 32, height: 32, border: '1px solid #e2e8f0' }} />
          
          <IconButton size="small" sx={{ color: '#ef4444' }}>
            <PowerSettingsNew fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};