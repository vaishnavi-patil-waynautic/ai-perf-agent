import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ErrorIcon from '@mui/icons-material/Error';
import { on } from 'events';

export type SnackbarType = 'success' | 'error';

type AppSnackbarProps = {
  open: boolean;
  message: string;
  type: SnackbarType;
  onClose: () => void;
  autoHideDuration?: number;
};

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={onClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity={type}
    icon={
      type === 'success'
        ? <CheckCircleIcon />
        : <ErrorIcon />
    }
    onClose={onClose}
    sx={{
      alignItems: 'center',
      
      color: '#1f2937',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',

      ...(type === 'success' && {
        backgroundColor: '#e9f9e8ff',
        '& .MuiAlert-icon': {
          color: '#22c55e',
        },
      }),

      ...(type === 'error' && {
        backgroundColor: '#fbececff',
        '& .MuiAlert-icon': {
          color: '#ef4444',
        },
      }),
    }}
  >
    {message}
  </Alert>
</Snackbar>
  );
};

export default AppSnackbar;
