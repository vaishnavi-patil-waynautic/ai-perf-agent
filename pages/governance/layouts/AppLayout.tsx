import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Chip } from '@mui/material';
import { Dashboard, Code, Analytics, Gavel, Assignment } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { FilterBar } from '../components/filters/FilterBar';

const drawerWidth = 240;

const menuItems = [
  { text: 'Auto Script', icon: <Code />, path: '/autoscript' },
  { text: 'Auto Analysis', icon: <Analytics />, path: '/analysis' },
  { text: 'NFR', icon: <Assignment />, path: '/nfr' },
  { text: 'Governance', icon: <Gavel />, path: '/governance', isWip: true },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', bgcolor: '#fbfcfd', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 0.5, borderRadius: 1, color: 'white' }}>
              <Code fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Waynautic AI Perf Agent</Typography>
          </Box>
          <FilterBar /> {/* The project/env selector from earlier */}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, mt: 8, border: 'none' } }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              component={Link} 
              to={item.path} 
              key={item.text}
              selected={location.pathname.startsWith(item.path)}
              sx={{ borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' } }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
              {item.isWip && <Chip label="WIP" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#fff3e0', color: '#ef6c00' }} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        {children}
        <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
          <Typography variant="caption">© 2026 Waynautic / EXG. All rights reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
};