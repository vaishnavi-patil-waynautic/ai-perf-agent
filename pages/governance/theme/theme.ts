import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h6: { fontWeight: 600, fontSize: '1.1rem' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0px 2px 4px rgba(31, 41, 55, 0.05)' },
      },
    },
  },
});