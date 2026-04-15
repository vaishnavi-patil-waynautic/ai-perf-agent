// src/components/dashboard/WidgetBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface Props { children: ReactNode; title: string; }
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
    return this.props.children;
  }
}