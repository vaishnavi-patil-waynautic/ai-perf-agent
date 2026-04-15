import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import { Speed, Assessment, AttachMoney } from '@mui/icons-material';

const AVAILABLE_WIDGETS = [
  { type: 'KPI', title: 'Total JMX Generated', icon: <Speed /> },
  { type: 'LINE_CHART', title: 'SLA Compliance %', icon: <Assessment /> },
  { type: 'KPI', title: 'Cost Savings ($)', icon: <AttachMoney /> },
];

export const WidgetLibrary = ({ open, onClose, onAdd }: any) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <Box sx={{ width: 300, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Widget Library</Typography>
      <List>
        {AVAILABLE_WIDGETS.map((w) => (
          <ListItem key={w.title} disablePadding>
            <ListItemButton onClick={() => onAdd(w)}>
              <Box sx={{ mr: 2, color: 'primary.main' }}>{w.icon}</Box>
              <ListItemText primary={w.title} secondary={w.type} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);