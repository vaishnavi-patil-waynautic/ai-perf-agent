// src/components/dashboard/WidgetBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface Props { children: ReactNode; title: string; type: string }
interface State { hasError: boolean; }

export class WidgetBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Widget Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Widget "{this.props.title}" failed to load.
          </Alert>
        </Box>
      );
    }
    return (
      <Box
  sx={{
    ...(this.props.type !== 'KPI' && {
      bgcolor: 'white',
      borderRadius: 3,
      border: '1px solid #f1f5f9',
      p: 2.5,
      height: '100%',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }),
  }}
>
        {this.props.type != "KPI" && 
        ( <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#55585dff', mb: 1.5, fontSize: '0.95rem' }}>
          {this.props.title}
        </Typography>)
        }
       
        {this.props.children}
      </Box>
    );
  }
}