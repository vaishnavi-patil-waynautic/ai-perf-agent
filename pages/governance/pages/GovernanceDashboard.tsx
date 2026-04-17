import React, { useState } from 'react';
import { Box, Container, Typography, Skeleton, Tab, Tabs, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { renderWidget } from '../components/dashboard/WidgetRegistry';
import { useSelector } from 'react-redux';
import { WidgetConfig } from '../types/widget';
import { WidgetBoundary } from '../components/dashboard/WidgetBoundary';
import { mockWidgets } from '../data/mockDashboard';
import {
  Dashboard as DashboardIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

/* -------------------------------------------------------------------------- */
/*                            Dashboard Sections                              */
/* -------------------------------------------------------------------------- */

const dashboardSections = [
  {
    id: 'executive',
    title: 'Executive Overview',
    icon: <DashboardIcon />,
    description: 'Quick snapshot of performance, reliability, and testing maturity',
    widgetIds: [
      'exec-kpi-1',
      'exec-kpi-2',
      'exec-kpi-3',
      'exec-kpi-4',
      'exec-kpi-5',
      'exec-kpi-6',
      'exec-kpi-7',
      'exec-line-1',
      'exec-table-1',
    ],
  },
  {
    id: 'autoscript',
    title: 'Autoscript Insights',
    icon: <CodeIcon />,
    description: 'Tracks automation efficiency in generating JMeter scripts',
    widgetIds: [
      'autoscript-kpi-1',
      'autoscript-kpi-2',
      'autoscript-kpi-3',
      'autoscript-kpi-4',
      'autoscript-line-1',
      'autoscript-table-1',
    ],
  },
  {
    id: 'autonfr',
    title: 'AutoNFR Insights',
    icon: <DescriptionIcon />,
    description: 'Measures the effectiveness of automated NFR generation',
    widgetIds: [
      'autonfr-kpi-1',
      'autonfr-kpi-2',
      'autonfr-kpi-3',
      'autonfr-kpi-4',
      'autonfr-bar-1',
      'autonfr-line-1',
    ],
  },
  {
    id: 'autoanalysis',
    title: 'AutoAnalysis Integrations',
    icon: <AnalyticsIcon />,
    description: 'Provides visibility into integrated tools and automated builds',
    widgetIds: [
      'autoanalysis-kpi-1',
      'autoanalysis-kpi-2',
      'autoanalysis-kpi-3',
      'autoanalysis-kpi-4',
      'autoanalysis-bar-1',
      'autoanalysis-line-1',
      'autoanalysis-table-1',
    ],
  },
  {
    id: 'roi',
    title: 'ROI & Productivity',
    icon: <TrendingUpIcon />,
    description: 'Demonstrates the measurable impact of your platform',
    widgetIds: ['roi-kpi-1', 'roi-kpi-2', 'roi-kpi-3', 'roi-kpi-4', 'roi-kpi-5', 'roi-kpi-6', 'roi-line-1', 'roi-line-2'],
  },
];

/* -------------------------------------------------------------------------- */
/*                          Main Dashboard Component                          */
/* -------------------------------------------------------------------------- */

const GovernanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const filters = useSelector((state: any) => state.dashboard?.filters ?? {});

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'governance-main'],
    queryFn: async () => ({ widgets: mockWidgets }),
    initialData: { widgets: mockWidgets },
  });

  const widgets: WidgetConfig[] = Array.isArray(data?.widgets) ? data.widgets : [];

  if (isLoading) {
    return <Skeleton variant="rectangular" height="80vh" sx={{ borderRadius: 4 }} />;
  }

  const currentSection = dashboardSections[activeTab];
  const sectionWidgets = widgets.filter((w: WidgetConfig) => currentSection.widgetIds.includes(w.id));



  const DEFAULT_ROW_HEIGHT = 100;
  const KPI_ROW_HEIGHT = 60; // Compact height for KPI cards

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // background: 'linear-gradient(135deg, #ffffffff 0%, #f1f5f9 100%)',
        
        py: 1,
      }}

      className='bg-gray-50'
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              Performance Governance Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              Monitor and analyze platform performance in real-time
            </Typography>
          </Box> */}

          {/* Tabs at Top Right */}
          {/* <Box
            sx={{
              // backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              // border: '1px solid rgba(226, 232, 240, 0.8)',
              // boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              p: 1,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  // fontWeight: 300,
                  color: '#64748b',
                  px: 2.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  },
                  '&.Mui-selected': {
                    color: '#3b82f6',
                  },
                },
              }}
            >
              {dashboardSections.map((section, index) => (
                <Tab
                  key={section.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ fontSize: 1, display: 'flex', alignItems: 'center' }}>{section.icon}</Box>
                      {section.title}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box> */}


          <Box
            sx={{
              backdropFilter: 'blur(12px)',
              borderRadius: '14px',
              px: 0.5,
              py: 0.25,
              width: 'fit-content',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 34,
                marginBottom: 1,

                '& .MuiTabs-flexContainer': {
                  gap: 0.5,
                },

                '& .MuiTabs-indicator': {
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: '#3b82f6',
                },

                '& .MuiTab-root': {
                  minHeight: 34,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#454a50ff',
                  transition: 'all 0.2s ease',
                },

                '& .MuiTab-root:hover': {
                  color: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.06)',
                },

                '& .Mui-selected': {
                  color: '#0959d9ff',
                  backgroundColor: 'white'
                  // 'rgba(59, 130, 246, 0.10)',
                },
              }}
            >
              {dashboardSections.map((section) => (
                <Tab
                  key={section.id}
                  disableRipple
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': {
                            fontSize: 16,
                          },
                        }}
                      >
                        {section.icon}
                      </Box>
                      {section.title}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Section Header */}
        {/* <Box
          sx={{
            mb: 3,
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
                mb: 0.5,
              }}
            >
              {currentSection.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {currentSection.description}
            </Typography>
          </Box>

          <Chip
            label={`${sectionWidgets.length} Widget${sectionWidgets.length !== 1 ? 's' : ''}`}
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: '28px',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          />
        </Box> */}

        {/* Widgets Grid */}
        {sectionWidgets.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
              px: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '24px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#334155',
                fontWeight: 700,
                mb: 1,
              }}
            >
              No Widgets Configured
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              Connect your backend services to start visualizing your dashboard data
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 2.5,
            }}
          >
            {/* {sectionWidgets.map((widget: WidgetConfig) => (
              <Box
                key={widget.id}
                sx={{
                  gridColumn: `span ${widget.layout?.w ?? 4}`,
                  minHeight: (widget.layout?.h ?? 2) * 100,
                }}
              >
                <WidgetBoundary title={widget.title}>{renderWidget(widget, filters)}</WidgetBoundary>
              </Box>
            ))} */}


            {sectionWidgets.map((widget: WidgetConfig) => {
              const isKPI = widget.type === 'KPI';
              const rowHeight = isKPI ? KPI_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;

              return (
                <Box
                  key={widget.id}
                  sx={{
                    gridColumn: `span ${widget.layout?.w ?? 4}`,
                    minHeight: (widget.layout?.h ?? (isKPI ? 1 : 2)) * rowHeight,
                  }}
                >
                  <WidgetBoundary title={widget.title} type={widget.type}>
                    {renderWidget(widget, filters)}
                  </WidgetBoundary>
                </Box>
              );
            })}

          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GovernanceDashboard;