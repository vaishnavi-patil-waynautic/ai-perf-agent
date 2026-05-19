import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Skeleton, FormControl, Select, MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { renderWidget } from '../components/dashboard/WidgetRegistry';
import { useSelector } from 'react-redux';
import { WidgetConfig } from '../types/widget';
import { WidgetBoundary } from '../components/dashboard/WidgetBoundary';
import { mockWidgets } from '../data/mockDashboard';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { fetchRoiOverview } from '../store/dashboard.thunks';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/pages/settings/store/hooks';
import { setSelectedModel } from '../features/dashboardSlice';
import { KPIWidget } from '../components/widgets/KPIWidget';

/* ----------------------------- ROI SECTION ----------------------------- */

const dashboardSections = [
  {
    id: 'roi',
    title: 'ROI & Productivity',
    icon: <TrendingUpIcon />,
    widgetIds: [
      'roi-kpi-1',
      'roi-kpi-2',
      'roi-kpi-3',
      'roi-kpi-4',
      'roi-kpi-5',
      'roi-kpi-6',
      'roi-line-1',
      'roi-line-2',
      'roi-kpi-7',
      'roi-kpi-8',
    ],
  },
];

/* ------------------------- MAIN COMPONENT ------------------------- */

const GovernanceDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab] = useState(0);

  const filters = useSelector((state: any) => state.dashboard?.filters ?? {});
  const { selectedProject } = useSelector((state: RootState) => state.project);

  // 🔥 CORRECT SOURCE
  const { selectedModel, kpis = {}, charts = {}, llm } = useSelector(
    (state: any) => state.dashboard?.roi || {}
  );

  const models = llm?.byModel || [];

  /* ------------------------- MOCK WIDGET STRUCTURE ------------------------- */

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'governance-main'],
    queryFn: async () => ({ widgets: mockWidgets }),
    initialData: { widgets: mockWidgets },
  });

  const widgets: WidgetConfig[] = Array.isArray(data?.widgets) ? data.widgets : [];

  /* ------------------------- API CALL ------------------------- */

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(fetchRoiOverview({ project_id: selectedProject.id }));
    }
  }, [selectedProject?.id]);

  /* ------------------------- DEFAULT MODEL ------------------------- */

  useEffect(() => {
    if (models.length && !selectedModel) {
      dispatch(setSelectedModel(models[0].id));
    }
  }, [models]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height="80vh" sx={{ borderRadius: 4 }} />;
  }

  const currentSection = dashboardSections[activeTab];
  const sectionWidgets = widgets.filter((w: WidgetConfig) =>
    currentSection.widgetIds.includes(w.id)
  );

  const DEFAULT_ROW_HEIGHT = 100;
  const KPI_ROW_HEIGHT = 60;

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }} className="bg-gray-50">
      <Container maxWidth="xl">

        {sectionWidgets.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography>No Widgets Configured</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 2.5,
            }}
          >
            {sectionWidgets.map((widget: WidgetConfig) => {
              const isKPI = widget.type === 'KPI';
              const rowHeight = isKPI ? KPI_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;





              return (
                <React.Fragment key={widget.id}>
                  {/* 🔥 Inject dropdown BEFORE KPI 7 */}
                  {widget.id === 'roi-kpi-7' && (
                    // <Box
                    //   sx={{
                    //     gridColumn: 'span 12',
                    //     display: 'flex',
                    //     justifyContent: 'flex-end',
                    //     mb: 0.5,
                    //   }}
                    // >

                    <Box
                      sx={{
                        gridColumn: 'span 12',
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                          value={selectedModel || ''}
                          onChange={(e) => dispatch(setSelectedModel(e.target.value))}
                          sx={{
                            height: 38,
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',

                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#cbd5f5' },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              boxShadow: '0 0 0 2px rgba(99,102,241,0.15)',
                            },
                          }}
                        >
                          {models.length === 0 ? (
                            <MenuItem disabled value="">
                              <span
                                style={{
                                  color: '#000000',
                                  fontSize: '0.8rem',
                                  fontStyle: 'italic',
                                }}
                              >
                                No model available
                              </span>
                            </MenuItem>
                          ) : (
                            models.map((m: any) => (
                              <MenuItem key={m.id} value={m.id}>
                                {m.label}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {/* 🔥 ACTUAL WIDGET */}
                  <Box
                    sx={{
                      gridColumn: `span ${widget.layout?.w ?? 4}`,
                      minHeight:
                        (widget.layout?.h ?? (isKPI ? 1 : 2)) * rowHeight,
                    }}
                  >
                    <WidgetBoundary title={widget.title} type={widget.type}>
                      {widget.id === 'roi-kpi-7' || widget.id === 'roi-kpi-8' ? (
                        (() => {
                          const selected = models.find((m: any) => m.id === selectedModel);

                          const value =
                            widget.id === 'roi-kpi-7'
                              ? selected?.tokens?.toLocaleString() ?? llm?.totalTokens ?? '—'
                              : `₹ ${selected?.cost ?? llm?.totalCost ?? '—'}`;

                          return (
                            <KPIWidget
                              config={widget}
                              data={{
                                value,
                                trend: 0,
                              }}
                            />
                          );
                        })()
                      ) : (
                        renderWidget(
                          widget,
                          filters,
                          kpis?.[widget.id] || charts?.[widget.id]
                        )
                      )}
                    </WidgetBoundary>
                  </Box>
                </React.Fragment>
              );

            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GovernanceDashboard;
