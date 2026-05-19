// import React, { useEffect, useState } from 'react';
// import { Box, Container, Typography, Skeleton, Tab, Tabs, Chip } from '@mui/material';
// import { useQuery } from '@tanstack/react-query';
// import { renderWidget } from '../components/dashboard/WidgetRegistry';
// import { useSelector } from 'react-redux';
// import { WidgetConfig } from '../types/widget';
// import { WidgetBoundary } from '../components/dashboard/WidgetBoundary';
// import { mockWidgets } from '../data/mockDashboard';
// import {
//   Dashboard as DashboardIcon,
//   Code as CodeIcon,
//   Description as DescriptionIcon,
//   Analytics as AnalyticsIcon,
//   TrendingUp as TrendingUpIcon,
// } from '@mui/icons-material';
// import { fetchRoiOverview } from '../store/dashboard.thunks';
// import { RootState } from '@/store/store';
// import { fetchModels } from "../../settings/store/aiModel.thunk";
// import { useAppDispatch } from '@/pages/settings/store/hooks';
// import { setSelectedModel } from '../features/dashboardSlice';


// /* -------------------------------------------------------------------------- */
// /*                            Dashboard Sections                              */
// /* -------------------------------------------------------------------------- */

// const dashboardSections = [
//   {
//     id: 'executive',
//     title: 'Executive Overview',
//     icon: <DashboardIcon />,
//     description: 'Quick snapshot of performance, reliability, and testing maturity',
//     widgetIds: [
//       'exec-kpi-1',
//       'exec-kpi-2',
//       'exec-kpi-3',
//       'exec-kpi-4',
//       'exec-kpi-5',
//       'exec-kpi-6',
//       'exec-kpi-7',
//       'exec-line-1',
//       'exec-table-1',
//     ],
//   },
//   {
//     id: 'autoscript',
//     title: 'Autoscript Insights',
//     icon: <CodeIcon />,
//     description: 'Tracks automation efficiency in generating JMeter scripts',
//     widgetIds: [
//       'autoscript-kpi-1',
//       'autoscript-kpi-2',
//       'autoscript-kpi-3',
//       'autoscript-kpi-4',
//       'autoscript-line-1',
//       'autoscript-table-1',
//     ],
//   },
//   {
//     id: 'autonfr',
//     title: 'AutoNFR Insights',
//     icon: <DescriptionIcon />,
//     description: 'Measures the effectiveness of automated NFR generation',
//     widgetIds: [
//       'autonfr-kpi-1',
//       'autonfr-kpi-2',
//       'autonfr-kpi-3',
//       'autonfr-kpi-4',
//       'autonfr-bar-1',
//       'autonfr-line-1',
//     ],
//   },
//   {
//     id: 'autoanalysis',
//     title: 'AutoAnalysis Integrations',
//     icon: <AnalyticsIcon />,
//     description: 'Provides visibility into integrated tools and automated builds',
//     widgetIds: [
//       'autoanalysis-kpi-1',
//       'autoanalysis-kpi-2',
//       'autoanalysis-kpi-3',
//       'autoanalysis-kpi-4',
//       'autoanalysis-bar-1',
//       'autoanalysis-line-1',
//       'autoanalysis-table-1',
//     ],
//   },
//   {
//     id: 'roi',
//     title: 'ROI & Productivity',
//     icon: <TrendingUpIcon />,
//     description: 'Demonstrates the measurable impact of your platform',
//     widgetIds: ['roi-kpi-1', 'roi-kpi-2', 'roi-kpi-3', 'roi-kpi-4', 'roi-kpi-5', 'roi-kpi-6', 'roi-line-1', 'roi-line-2', 'roi-kpi-7', 'roi-kpi-8'],
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /*                          Main Dashboard Component                          */
// /* -------------------------------------------------------------------------- */

// const GovernanceDashboard: React.FC = () => {
//   const dispatch = useAppDispatch();
//   // const selectedProject = useSelector((state: RootState) => state.project);

//   // const [activeTab, setActiveTab] = useState(0);
//   const [activeTab] = useState(4); // ROI index
//   const filters = useSelector((state: any) => state.dashboard?.filters ?? {});

//   const models = useSelector((state: RootState) => state.aiModel.models);

//   const { data, isLoading } = useQuery({
//     queryKey: ['dashboard', 'governance-main'],
//     queryFn: async () => ({ widgets: mockWidgets }),
//     initialData: { widgets: mockWidgets },
//   });

//   const { selectedModel = null, kpis = {}, charts = {} } = useSelector(
//   (state: any) => state.dashboard?.roi || {}
// );

//   const widgets: WidgetConfig[] = Array.isArray(data?.widgets) ? data.widgets : [];

//   if (isLoading) {
//     return <Skeleton variant="rectangular" height="80vh" sx={{ borderRadius: 4 }} />;
//   }

//   const currentSection = dashboardSections[activeTab];
//   const sectionWidgets = widgets.filter((w: WidgetConfig) => currentSection.widgetIds.includes(w.id));



//   const DEFAULT_ROW_HEIGHT = 100;
//   const KPI_ROW_HEIGHT = 60; // Compact height for KPI cards

//   const { selectedProject } = useSelector((state: RootState) => state.project);

//   useEffect(() => {
//     if (selectedProject?.id) {
//       console.log("Calling governance api_____________________________________1")
//       dispatch(fetchRoiOverview({ project_id: selectedProject?.id }));
//       console.log("Calling governance api_____________________________________")
//       dispatch(fetchModels(selectedProject?.id));
//     }

//   }, [dispatch, selectedProject]);


//   useEffect(() => {
//     if (models.length && !selectedModel) {
//       dispatch(setSelectedModel(models[0].id));
//     }
//   }, [models]);


//   console.log("model : ", models, " |||| data : ", data, " ||||| filters : ", filters);



//   // useEffect(() => {
//   //   if (selectedProject?.id) {
//   //     dispatch(fetchRoiOverview({ project_id: selectedProject?.id }));
//   //     dispatch(fetchModels(selectedProject?.id));
//   //   }
//   // }, [selectedProject]);

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         // background: 'linear-gradient(135deg, #ffffffff 0%, #f1f5f9 100%)',

//         py: 1,
//       }}

//       className='bg-gray-50'
//     >
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Box
//           sx={{
//             mb: 4,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'flex-start',
//             flexWrap: 'wrap',
//             gap: 2,
//           }}
//         >
//           {/* <Box sx={{ flex: 1 }}>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 color: '#0f172a',
//                 letterSpacing: '-0.02em',
//                 mb: 0.5,
//               }}
//             >
//               Performance Governance Dashboard
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: '#64748b',
//                 fontWeight: 500,
//               }}
//             >
//               Monitor and analyze platform performance in real-time
//             </Typography>
//           </Box> */}

//           {/* <Box
//             sx={{
//               backdropFilter: 'blur(12px)',
//               borderRadius: '14px',
//               px: 0.5,
//               py: 0.25,
//               width: 'fit-content',
//             }}
//           >
//             <Tabs
//               value={activeTab}
//               onChange={(_, newValue) => setActiveTab(newValue)}
//               variant="scrollable"
//               scrollButtons="auto"
//               allowScrollButtonsMobile
//               sx={{
//                 minHeight: 34,
//                 marginBottom: 1,

//                 '& .MuiTabs-flexContainer': {
//                   gap: 0.5,
//                 },

//                 '& .MuiTabs-indicator': {
//                   height: 2,
//                   borderRadius: 2,
//                   backgroundColor: '#3b82f6',
//                 },

//                 '& .MuiTab-root': {
//                   minHeight: 34,
//                   px: 1.25,
//                   py: 0.5,
//                   borderRadius: '10px',
//                   textTransform: 'none',
//                   fontSize: '0.8rem',
//                   fontWeight: 500,
//                   color: '#454a50ff',
//                   transition: 'all 0.2s ease',
//                 },

//                 '& .MuiTab-root:hover': {
//                   color: '#3b82f6',
//                   backgroundColor: 'rgba(59, 130, 246, 0.06)',
//                 },

//                 '& .Mui-selected': {
//                   color: '#0959d9ff',
//                   backgroundColor: 'white'
//                   // 'rgba(59, 130, 246, 0.10)',
//                 },
//               }}
//             >
//               {dashboardSections.map((section) => (
//                 <Tab
//                   key={section.id}
//                   disableRipple
//                   label={
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           '& svg': {
//                             fontSize: 16,
//                           },
//                         }}
//                       >
//                         {section.icon}
//                       </Box>
//                       {section.title}
//                     </Box>
//                   }
//                 />
//               ))}
//             </Tabs>
//           </Box> */}
//         </Box>

//         {sectionWidgets.length === 0 ? (
//           <Box
//             sx={{
//               textAlign: 'center',
//               py: 12,
//               px: 4,
//               backgroundColor: 'rgba(255, 255, 255, 0.7)',
//               borderRadius: '24px',
//               border: '1px solid rgba(226, 232, 240, 0.8)',
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 color: '#334155',
//                 fontWeight: 700,
//                 mb: 1,
//               }}
//             >
//               No Widgets Configured
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: '#64748b',
//                 maxWidth: 400,
//                 mx: 'auto',
//               }}
//             >
//               Connect your backend services to start visualizing your dashboard data
//             </Typography>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(12, 1fr)',
//               gap: 2.5,
//             }}
//           >


//             {sectionWidgets.map((widget: WidgetConfig) => {
//               const isKPI = widget.type === 'KPI';
//               const rowHeight = isKPI ? KPI_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;

//               return (
//                 <Box
//                   key={widget.id}
//                   sx={{
//                     gridColumn: `span ${widget.layout?.w ?? 4}`,
//                     minHeight: (widget.layout?.h ?? (isKPI ? 1 : 2)) * rowHeight,
//                   }}
//                 >
//                   <WidgetBoundary title={widget.title} type={widget.type}>
//                     {/* {renderWidget(widget, filters)} */}

//                     {widget.id === 'roi-kpi-7' || widget.id === 'roi-kpi-8' ? (
//                       <Box>
//                         {/* 🔥 Dropdown */}
//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
//                           <select
//                             value={selectedModel || ''}
//                             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
//                           >
//                             {models?.map((m: any) => (
//                               <option key={m.id} value={m.id}>
//   {m.name}
// </option>
//                             ))}
//                           </select>
//                         </Box>

//                         {/* 🔥 KPI DATA (FROM REDUX) */}
//                         {widget.id === 'roi-kpi-7' ? (
//                           <Typography>
//                             {models.find((m: any) => m.id === selectedModel)?.tokens ?? '—'}
//                           </Typography>
//                         ) : (
//                           <Typography>
//                             ₹ {models.find((m: any) => m.id === selectedModel)?.cost ?? '—'}
//                           </Typography>
//                         )}
//                       </Box>
//                     ) : (
//                       renderWidget(
//   widget,
//   filters,
//   kpis?.[widget.id] || charts?.[widget.id]
// )
//                     )}

//                   </WidgetBoundary>
//                 </Box>
//               );
//             })}

//           </Box>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default GovernanceDashboard;

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

        {/* {models.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2,
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#64748b',
              }}
            >
              Model
            </Typography>

            <FormControl size="small" sx={{ minWidth: 180 }}>
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
                {models.map((m: any) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )} */}

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


              //               return (
              //                 <Box
              //                   key={widget.id}
              //                   sx={{
              //                     gridColumn: `span ${widget.layout?.w ?? 4}`,
              //                     minHeight:
              //                       (widget.layout?.h ?? (isKPI ? 1 : 2)) * rowHeight,
              //                   }}
              //                 >
              //                   <WidgetBoundary title={widget.title} type={widget.type}>
              //                     {/* 🔥 LLM KPI WIDGETS */}

              //                     {widget.id === 'roi-kpi-7' || widget.id === 'roi-kpi-8' ? (
              //                       (() => {
              //                         const selected = models.find((m: any) => m.id === selectedModel);

              //                         const value =
              //                           widget.id === 'roi-kpi-7'
              //                             ? selected?.tokens?.toLocaleString() ?? llm?.totalTokens ?? '—'
              //                             : `₹ ${selected?.cost ?? llm?.totalCost ?? '—'}`;

              //                         return (
              //                           <KPIWidget
              //                             config={widget}
              //                             data={{
              //                               value,
              //                               trend: 0,
              //                             }}
              //                           />
              //                         );
              //                       })()
              //                     ) : (
              //                       renderWidget(
              //                         widget,
              //                         filters,
              //                         kpis?.[widget.id] || charts?.[widget.id]
              //                       )
              //                     )}

              //                     {/* {widget.id === 'roi-kpi-7' || widget.id === 'roi-kpi-8' ? (
              //                       <Box> */}
              //                     {/* 🔥 Dropdown */}
              //                     {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>


              //       <FormControl size="small" sx={{ minWidth: 160 }}>
              //   <Select
              //     value={selectedModel || ''}
              //     onChange={(e) => dispatch(setSelectedModel(e.target.value))}
              //     displayEmpty
              //     sx={{
              //       height: 36,
              //       borderRadius: '10px',
              //       fontSize: '0.8rem',
              //       fontWeight: 500,
              //       px: 1,

              //       backgroundColor: '#ffffff',
              //       boxShadow: '0 2px 6px rgba(0,0,0,0.04)',

              //       '& .MuiSelect-select': {
              //         py: 1,
              //         display: 'flex',
              //         alignItems: 'center',
              //       },

              //       '& fieldset': {
              //         borderColor: '#e2e8f0',
              //       },

              //       '&:hover fieldset': {
              //         borderColor: '#cbd5f5',
              //       },

              //       '&.Mui-focused fieldset': {
              //         borderColor: '#6366f1',
              //         boxShadow: '0 0 0 2px rgba(99,102,241,0.15)',
              //       },
              //     }}
              //   >
              //     {models.map((m: any) => (
              //       <MenuItem
              //         key={m.id}
              //         value={m.id}
              //         sx={{
              //           fontSize: '0.8rem',
              //           py: 1.2,
              //           px: 2,
              //         }}
              //       >
              //         {m.label}
              //       </MenuItem>
              //     ))}
              //   </Select>
              // </FormControl>
              //     </Box> */}

              //                     {/* 🔥 SAME KPI DESIGN */}
              //                     {/* {(() => {
              //       const selected = models.find((m: any) => m.id === selectedModel);

              //       const value =
              //         widget.id === 'roi-kpi-7'
              //           ? selected?.tokens?.toLocaleString() ?? llm?.totalTokens ?? '—'
              //           : `₹ ${selected?.cost ?? llm?.totalCost ?? '—'}`;

              //       return (
              //         <KPIWidget
              //           config={widget}
              //           data={{
              //             value,
              //             trend: 0,
              //           }}
              //         />
              //       );
              //     })()}
              //   </Box> */}
              //                     {/* ) : (
              //                       renderWidget(
              //                         widget,
              //                         filters,
              //                         kpis?.[widget.id] || charts?.[widget.id]
              //                       )
              //                     )} */}
              //                   </WidgetBoundary>
              //                 </Box>
              //               );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GovernanceDashboard;
