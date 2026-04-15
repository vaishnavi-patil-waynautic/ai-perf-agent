import React from 'react';
import { GlobalFilters } from '../../types';
import { WidgetConfig } from '../../types/widget';
import { KPIWidget } from '../widgets/KPIWidget';
import { LineChartWidget } from '../widgets/LineChartWidget';
import TableWidget from '../widgets/TableWidget';
import { mockWidgetData } from '../../data/mockDashboard';
import { Box, Typography } from '@mui/material';

const Registry: Record<string, React.FC<any>> = {
  KPI: KPIWidget,
  CHART_LINE: LineChartWidget,
  TABLE: TableWidget,
};

export const renderWidget = (config: WidgetConfig, filters: GlobalFilters) => {
  const Component = Registry[config.type];
  if (!Component) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
        <Typography variant="caption">Widget type "{config.type}" not registered</Typography>
      </Box>
    );
  }

  // Use mock data keyed by widget id; fall back to config for API-driven widgets
  const data = mockWidgetData[config.id];

  return <Component config={config} filters={filters} data={data} />;
};
