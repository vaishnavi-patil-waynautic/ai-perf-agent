import React, { useState } from 'react';
import { Box, Skeleton, IconButton, Tooltip } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { renderWidget } from '../components/dashboard/WidgetRegistry';
import { useSelector } from 'react-redux';
import { WidgetConfig } from '../types/widget';
import { WidgetBoundary } from '../components/dashboard/WidgetBoundary';
import { mockWidgets } from '../data/mockDashboard';

const GovernanceDashboard: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const filters = useSelector((state: any) => state.dashboard?.filters ?? {});

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', 'governance-main'],
    queryFn: async () => {
      // Returns mock data — replace with real API call when backend is ready
      return { widgets: mockWidgets };
    },
  });

  if (isLoading) return <Skeleton variant="rectangular" height="80vh" />;
  if (!dashboard) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title={isEditMode ? 'Save Layout' : 'Edit Layout'}>
          <IconButton onClick={() => setIsEditMode(!isEditMode)} color={isEditMode ? 'primary' : 'default'}>
            {isEditMode ? <Save /> : <Edit />}
          </IconButton>
        </Tooltip>
      </Box>

      {dashboard.widgets.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
          <Box sx={{ fontSize: 48, mb: 2 }}>📊</Box>
          <Box sx={{ fontSize: 20, fontWeight: 600, mb: 1 }}>Governance Dashboard</Box>
          <Box sx={{ fontSize: 14 }}>No widgets configured yet. Connect your backend to load dashboard data.</Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
          {dashboard.widgets.map((widget: WidgetConfig) => (
            <Box
              key={widget.id}
              sx={{ gridColumn: `span ${widget.layout?.w ?? 4}`, minHeight: (widget.layout?.h ?? 2) * 100 }}
            >
              <WidgetBoundary title={widget.title}>
                {renderWidget(widget, filters)}
              </WidgetBoundary>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GovernanceDashboard;
