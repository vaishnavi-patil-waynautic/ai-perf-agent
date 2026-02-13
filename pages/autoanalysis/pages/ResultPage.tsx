// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Paper, Typography, Button, CircularProgress, Alert, TableCell, TableHead, Table, TableRow, TableBody, TableContainer, Chip } from '@mui/material';
// import { ArrowBack, Download } from '@mui/icons-material';
// import ReactMarkdown from 'react-markdown';
// import { fetchBuildReport } from '../services/mockService';
// import { BuildReport } from '../types';
// import { useLocation } from 'react-router-dom';
// import { BarChart3, Boxes, Clock, Folder } from 'lucide-react';


// interface InfoCardProps {
//   title: string;
//   value: string;
// }

// const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {

//   const hasData = value && value.trim().length > 0;

//   return (
//     <Paper
//       variant="outlined"
//       className="p-4"
//       sx={{
//         borderLeft: "4px solid",
//         borderColor: hasData ? "primary.main" : "grey.300",
//         backgroundColor: hasData ? "#ffffff" : "#fafafa"
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         color="text.secondary"
//         gutterBottom
//       >
//         {title}
//       </Typography>

//       <Typography
//         variant="body2"
//         sx={{
//           whiteSpace: "pre-line",
//           color: hasData ? "text.primary" : "text.disabled"
//         }}
//       >
//         {hasData ? value : "No data available"}
//       </Typography>
//     </Paper>
//   );
// };


// export const ResultPage: React.FC = () => {

//   const location = useLocation();

//   const { projectName, appName } = location.state || {};


//   const { projectId, appId, buildId } = useParams();
//   const navigate = useNavigate();

//   const [report, setReport] = useState<BuildReport | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {

//     if (!projectId || !appId || !buildId) return;

//     const controller = new AbortController();

//     const loadReport = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchBuildReport(projectId, appId, buildId);
//         setReport(data);
//       } catch (err: any) {
//         if (err.name !== "AbortError") {
//           setError(err.message || "Failed to load report");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadReport();

//     return () => controller.abort();

//   }, [projectId, appId, buildId]);

//   // ---------- UI STATES ----------

//   if (loading) {
//     return (
//       <Box className="flex justify-center items-center h-screen">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   if (!report) return null;

//   const formatDate = (date: string) =>
//     new Date(date).toLocaleString();

//   const formatTPS = (value: number) => value.toFixed(2);

//   const formatRT = (value: number) => value.toFixed(2);

//   const exportToCSV = (report: BuildReport) => {

//     const metaSection = [
//       ["Build Number", report.build_number],
//       ["Project", projectName || report.project_id],
//       ["Application", appName || report.application_id],
//       ["Test Time", formatDate(report.test_timing)],
//       ["Transactions", report.result_data.length],
//       [],
//     ];

//     const notesSection = [
//       ["Observations", report.observations || "N/A"],
//       ["Datadog Remarks", report.datadog_remarks || "N/A"],
//       ["ADO Defects", report.ado_defects || "N/A"],
//       [],
//     ];

//     const tableHeader = [
//       "Transaction",
//       "Total Hits",
//       "TPS (req/s)",
//       "Avg RT (ms)",
//       "P90 RT (ms)",
//       "P95 RT (ms)",
//       "Max RT (ms)",
//       "Error Rate (%)"
//     ];

//     const tableRows = report.result_data.map(r => [
//       r.transaction_name,
//       r.total_hits,
//       formatTPS(r.tps),
//       formatRT(r.avg_rt),
//       formatRT(r.rt_90th),
//       formatRT(r.rt_95th),
//       formatRT(r.max_rt),
//       r.error_rate
//     ]);

//     const csvContent = [
//       ...metaSection,
//       ...notesSection,
//       tableHeader,
//       ...tableRows
//     ]
//       .map(row => row.map(String).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Build_${report.build_number}_Full_Report.csv`;
//     link.click();
//   };

//   return (
//     <Box className="bg-slate-50 min-h-screen">

//       {/* Centered Content Wrapper */}
//       <Box
//         sx={{
//           maxWidth: "1200px",
//           mx: "auto",
//           px: 3,
//           py: 3
//         }}
//       >

//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 3
//           }}
//         >
//           <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
//             Back
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<Download />}
//             onClick={() => exportToCSV(report)}
//           >
//             Download Report
//           </Button>
//         </Box>

//         {/* Summary Card */}
//         <Paper sx={{ p: 3, mb: 3 }} variant="outlined">

//           <Typography variant="h6" fontWeight={600}>
//             Build #{report.build_number}
//           </Typography>

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 1,
//               mt: 1
//             }}
//           >
//             <Box display="flex" alignItems="center" gap={1}>
//               <Folder size={16} />
//               <Typography variant="body2">
//                 <b>Project:</b> {projectName || `ID ${report.project_id}`}
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center" gap={1}>
//               <Boxes size={16} />
//               <Typography variant="body2">
//                 <b>Application:</b> {appName || `ID ${report.application_id}`}
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center" gap={1}>
//               <Clock size={16} />
//               <Typography variant="body2">
//                 <b>Test Time:</b> {formatDate(report.test_timing)}
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center" gap={1}>
//               <BarChart3 size={16} />
//               <Typography variant="body2">
//                 <b>Transactions:</b> {report.result_data.length}
//               </Typography>
//             </Box>
//           </Box>

//         </Paper>

//         {/* Observation Cards */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(370px, max-content))",
//             gap: 2,
//             justifyContent: "start",
//             mb: 3
//           }}
//         >
//           <InfoCard title="Observations" value={report.observations} />
//           <InfoCard title="Datadog Remarks" value={report.datadog_remarks} />
//           <InfoCard title="ADO Defects" value={report.ado_defects} />
//         </Box>

//         {/* Metrics Table */}
//         <Paper variant="outlined">

//           <TableContainer>

//             <Table stickyHeader>

//               <TableHead>
//                 <TableRow>
//                   <TableCell>Transaction</TableCell>
//                   <TableCell>Total Hits</TableCell>
//                   <TableCell>TPS (req/s)</TableCell>
//                   <TableCell>Avg RT (ms)</TableCell>
//                   <TableCell>P90 RT (ms)</TableCell>
//                   <TableCell>P95 RT (ms)</TableCell>
//                   <TableCell>Max RT (ms)</TableCell>
//                   <TableCell>Error Rate (%)</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {report.result_data.map(row => (
//                   <TableRow key={row.id} hover>

//                     <TableCell>{row.transaction_name}</TableCell>
//                     <TableCell>{row.total_hits}</TableCell>
//                     <TableCell>{formatTPS(row.tps)}</TableCell>
//                     <TableCell>{formatRT(row.avg_rt)}</TableCell>
//                     <TableCell>{formatRT(row.rt_90th)}</TableCell>
//                     <TableCell>{formatRT(row.rt_95th)}</TableCell>
//                     <TableCell>{formatRT(row.max_rt)}</TableCell>

//                     <TableCell>
//                       <Chip
//                         label={`${row.error_rate}%`}
//                         color={row.error_rate === 0 ? "success" : "error"}
//                         size="small"
//                       />
//                     </TableCell>

//                   </TableRow>
//                 ))}
//               </TableBody>

//             </Table>

//           </TableContainer>

//         </Paper>

//       </Box>

//     </Box>
//   );
// };



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert, TableCell, TableHead, Table, TableRow, TableBody, TableContainer, Chip } from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { fetchBuildReport } from '../services/mockService';
import { BuildReport } from '../types';
import { useLocation } from 'react-router-dom';
import { BarChart3, Boxes, Clock, Folder } from 'lucide-react';


interface InfoCardProps {
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  const hasData = value && value.trim().length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: hasData ? 'rgba(59, 130, 246, 0.2)' : 'rgba(226, 232, 240, 1)',
        backgroundColor: hasData ? 'rgba(239, 246, 255, 0.4)' : '#fafafa',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: hasData ? 'rgba(59, 130, 246, 0.4)' : 'rgba(226, 232, 240, 1)',
          backgroundColor: hasData ? 'rgba(239, 246, 255, 0.6)' : '#f5f5f5',
        }
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: hasData ? '#3b82f6' : '#94a3b8',
          mb: 1,
          display: 'block'
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          color: hasData ? '#1e293b' : '#94a3b8',
          fontSize: '0.875rem',
          lineHeight: 1.6
        }}
      >
        {hasData ? value : 'No data available'}
      </Typography>
    </Paper>
  );
};


export const ResultPage: React.FC = () => {
  const location = useLocation();
  const { projectName, appName } = location.state || {};
  const { projectId, appId, buildId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<BuildReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !appId || !buildId) return;

    const controller = new AbortController();

    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchBuildReport(projectId, appId, buildId);
        setReport(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load report');
        }
      } finally {
        setLoading(false);
      }
    };

    loadReport();

    return () => controller.abort();
  }, [projectId, appId, buildId]);

  // ---------- UI STATES ----------

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen" sx={{ bgcolor: '#f8fafc' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!report) return null;

  const formatDate = (date: string) => new Date(date).toLocaleString();
  const formatTPS = (value: number) => value.toFixed(2);
  const formatRT = (value: number) => value.toFixed(2);

  const exportToCSV = (report: BuildReport) => {
    const metaSection = [
      ['Build Number', report.build_number],
      ['Project', projectName || report.project_id],
      ['Application', appName || report.application_id],
      ['Test Time', formatDate(report.test_timing)],
      ['Transactions', report.result_data.length],
      [],
    ];

    const notesSection = [
      ['Observations', report.observations || 'N/A'],
      ['Datadog Remarks', report.datadog_remarks || 'N/A'],
      ['ADO Defects', report.ado_defects || 'N/A'],
      [],
    ];

    const tableHeader = [
      'Transaction',
      'Total Hits',
      'TPS (req/s)',
      'Avg RT (ms)',
      'P90 RT (ms)',
      'P95 RT (ms)',
      'Max RT (ms)',
      'Error Rate (%)'
    ];

    const tableRows = report.result_data.map(r => [
      r.transaction_name,
      r.total_hits,
      formatTPS(r.tps),
      formatRT(r.avg_rt),
      formatRT(r.rt_90th),
      formatRT(r.rt_95th),
      formatRT(r.max_rt),
      r.error_rate
    ]);

    const csvContent = [
      ...metaSection,
      ...notesSection,
      tableHeader,
      ...tableRows
    ]
      .map(row => row.map(String).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Build_${report.build_number}_Full_Report.csv`;
    link.click();
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Centered Content Wrapper */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: 3,
          py: 4
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(100, 116, 139, 0.08)',
                color: '#475569'
              }
            }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => exportToCSV(report)}
            sx={{
              bgcolor: '#3b82f6',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3,
              boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
              }
            }}
          >
            Download Report
          </Button>
        </Box>

        {/* Summary Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 1)',
            bgcolor: '#ffffff'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              mb: 3,
              fontSize: '1.5rem'
            }}
          >
            Build #{report.build_number}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <Folder size={18} color="#3b82f6" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  Project
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {projectName || `ID ${report.project_id}`}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <Boxes size={18} color="#3b82f6" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  Application
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {appName || `ID ${report.application_id}`}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <Clock size={18} color="#3b82f6" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  Test Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {formatDate(report.test_timing)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <BarChart3 size={18} color="#3b82f6" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  Transactions
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {report.result_data.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Observation Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 2.5,
            mb: 3
          }}
        >
          <InfoCard title="Observations" value={report.observations} />
          <InfoCard title="Datadog Remarks" value={report.datadog_remarks} />
          <InfoCard title="ADO Defects" value={report.ado_defects} />
        </Box>

        {/* Metrics Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 1)',
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    Transaction
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    Total Hits
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    TPS (req/s)
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    Avg RT (ms)
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    P90 RT (ms)
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    P95 RT (ms)
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    Max RT (ms)
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#d5e3f2ff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b',
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    Error Rate
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {report.result_data.map((row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      bgcolor: index % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",

                      '&:hover': {
                        bgcolor: 'rgba(59, 130, 246, 0.04)'
                      },
                      '&:last-child td': {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#1e293b', fontSize: '0.875rem' }}>
                      {row.transaction_name}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {row.total_hits}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {formatTPS(row.tps)}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {formatRT(row.avg_rt)}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {formatRT(row.rt_90th)}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {formatRT(row.rt_95th)}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {formatRT(row.max_rt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${row.error_rate}%`}
                        size="small"
                        sx={{
                          bgcolor: row.error_rate === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: row.error_rate === 0 ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          borderRadius: 1.5,
                          border: row.error_rate === 0 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};
