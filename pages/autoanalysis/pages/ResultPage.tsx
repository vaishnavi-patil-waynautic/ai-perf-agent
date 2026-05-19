import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert, TableCell, TableHead, Table, TableRow, TableBody, TableContainer, Chip, Collapse, IconButton } from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { fetchBuildReport } from '../services/mockService';
import { BuildReport } from '../types';
import { useLocation } from 'react-router-dom';
import { BarChart3, Boxes, ChevronDown, ChevronUp, Clock, Folder } from 'lucide-react';
import html2pdf from "html2pdf.js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import rehypeRaw from 'rehype-raw';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface InfoCardProps {
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  const [expanded, setExpanded] = useState(false);

  const hasData = value && value.trim().length > 0;

  const cleanValue = React.useMemo(() => {
    if (!value) return '';

    let result = value.trim();

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const normalizedTitle = escapeRegex(title.trim());

    const patterns = [
      new RegExp(`^${normalizedTitle}\\s*[:\\-]*\\s*`, 'i'),
      /^(observations|ado defects|datadog remarks)\s*[:\-]*\s*/i
    ];

    patterns.forEach((pattern) => {
      result = result.replace(pattern, '');
    });

    return result.trim();
  }, [value, title]);

  return (
    <Paper
      data-infocard
      onClick={() => setExpanded(!expanded)}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        cursor: 'pointer'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          py: 2,
          px: 2
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            component="div"
            sx={{
              fontSize: '0.85rem',
              lineHeight: 1.6
            }}
          >
            {/* TITLE */}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                color: !hasData
                  ? '#94a3b8' // gray if no data
                  : '#2563eb',
                transition: 'color 0.25s ease',

              }}
            >
              {title}
            </Box>{' '}
            -{' '}

            {/* VALUE WRAPPER (animation container) */}
            <Box
              data-content
              sx={{
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
                maxHeight: expanded ? '500px' : '6em',// ~2 lines
                py: 1
              }}
            >
              {/* INNER CONTENT */}
              <Box
                data-inner
                sx={
                  !expanded
                    ? {
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }
                    : {}
                }
              >
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {hasData ? cleanValue : 'No data available'}
                </ReactMarkdown>
              </Box>
            </Box>
          </Typography>
        </Box>

        {/* ARROW */}
        <Box
          sx={{
            transition: 'transform 0.25s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <ChevronDown />
        </Box>
      </Box>
    </Paper>
  );
};

export const ResultPage: React.FC = () => {


  const pageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { projectName, appName } = location.state || {};
  const { projectId, appId, buildId } = useParams();
  const navigate = useNavigate();
  const prevProjectId = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { selectedProject } = useSelector((state: RootState) => state.project);

  const [report, setReport] = useState<BuildReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!selectedProject?.id) return;

    if (
      prevProjectId.current !== null &&
      prevProjectId.current !== selectedProject.id
    ) {
      navigate("/autoanalysis");
    }

    prevProjectId.current = selectedProject.id;
  }, [selectedProject?.id]);

  const copyTableAsCSV = async () => {
    const header = [
      'Transaction',
      'Total Hits',
      'TPS (req/s)',
      'Avg RT (ms)',
      'P90 RT (ms)',
      'P95 RT (ms)',
      'Max RT (ms)',
      'Error Rate (%)'
    ];

    const rows = report.result_data.map(r => [
      r.transaction_name,
      r.total_hits,
      formatTPS(r.tps),
      formatRT(r.avg_rt),
      formatRT(r.rt_90th),
      formatRT(r.rt_95th),
      formatRT(r.max_rt),
      r.error_rate
    ]);

    // ✅ Proper CSV escaping (handles commas, quotes, newlines)
    const escapeCSV = (value) => {
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csv = [header, ...rows]
      .map(row => row.map(escapeCSV).join(','))
      .join('\n');

    try {
      // ✅ Modern API
      await navigator.clipboard.writeText(csv);
    } catch (err) {
      console.warn("Clipboard API failed, using fallback...", err);

      // ✅ Fallback for HTTP / unsupported browsers
      try {
        const textarea = document.createElement("textarea");
        textarea.value = csv;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand("copy");
        if (!success) throw new Error("execCommand failed");

        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.error("Copy failed completely:", fallbackErr);
        alert("Failed to copy CSV. Please copy manually.");
        return;
      }
    }

    // ✅ Success UI
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


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

  const handleDownloadHTML = () => {
    if (!pageRef.current) return;

    const cloned = pageRef.current.cloneNode(true) as HTMLElement;

    // ✅ FORCE FULL EXPANSION (NO HEIGHT LIMITS AT ALL)
    cloned.querySelectorAll('[data-infocard]').forEach((card) => {
      const content = card.querySelector('[data-content]') as HTMLElement;
      const inner = card.querySelector('[data-inner]') as HTMLElement;

      if (content) {
        content.style.maxHeight = 'none';
        content.style.height = 'auto';
        content.style.overflow = 'visible';
        content.style.transition = 'none';
      }

      if (inner) {
        inner.style.display = 'block';
        inner.style.overflow = 'visible';

        // Remove line clamp completely
        inner.style.webkitLineClamp = 'unset';
        inner.style.webkitBoxOrient = 'unset';
      }
    });
    // Remove back/download nav buttons only
    cloned.querySelectorAll(".no-export").forEach(el => el.remove());

    // ✅ Replace MUI copy button with a self-contained vanilla HTML button
    const wrapperEl = cloned.querySelector('#copy-btn-wrapper');
    if (wrapperEl) {
      const vanillaBtn = document.createElement('button');
      vanillaBtn.id = 'copy-csv-btn';
      vanillaBtn.textContent = '⎘ Copy CSV';
      vanillaBtn.setAttribute('style', `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 0.8rem;
      font-weight: 500;
      font-family: Roboto, Arial, sans-serif;
      color: #64748b;
      background-color: rgba(100, 116, 139, 0.08);
      border: 1px solid rgba(226, 232, 240, 1);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    `);

      // Replace whatever MUI rendered inside the wrapper
      const existingBtn = wrapperEl.querySelector('button');
      if (existingBtn) existingBtn.replaceWith(vanillaBtn);
    }

    // Extract all live MUI/app styles
    let allStyles = '';
    try {
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            allStyles += rule.cssText + '\n';
          });
        } catch {
          // Skip cross-origin sheets (e.g. Google Fonts CDN)
        }
      });
    } catch {
      // Silently ignore
    }

    // ✅ Self-contained copy script for the downloaded file
    const copyScript = `
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('copy-csv-btn');
        if (!btn) return;

        btn.addEventListener('click', function () {
          var table = document.querySelector('table');
          if (!table) return;

          var rows = Array.from(table.querySelectorAll('tr'));
          var csv = rows.map(function (row) {
            var cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(function (cell) {
              // Strip inner html noise, trim whitespace, escape commas
              var text = cell.innerText.trim().replace(/\\n/g, ' ');
              return text.includes(',') ? '"' + text + '"' : text;
            }).join(',');
          }).join('\\n');

          navigator.clipboard.writeText(csv).then(function () {
            btn.textContent = '✓ Copied!';
            btn.style.color = '#16a34a';
            btn.style.backgroundColor = 'rgba(34, 197, 94, 0.08)';
            btn.style.borderColor = 'rgba(34, 197, 94, 0.3)';

            setTimeout(function () {
              btn.textContent = '⎘ Copy CSV';
              btn.style.color = '#64748b';
              btn.style.backgroundColor = 'rgba(100, 116, 139, 0.08)';
              btn.style.borderColor = 'rgba(226, 232, 240, 1)';
            }, 2000);
          }).catch(function () {
            alert('Copy failed. Your browser may not support clipboard access.');
          });
        });
      });
    </script>
  `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Build Report - #${report?.build_number}</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          body {
            font-family: Roboto, Arial, sans-serif;
            background: #f8fafc;
            margin: 0;
            padding: 0;
          }
          ${allStyles}
        </style>
      </head>
      <body>
        ${cloned.outerHTML}
        ${copyScript}
      </body>
    </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Build_${report?.build_number}_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box ref={pageRef} sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }} className=" max-w-6xl m-auto p-10">
      {/* Centered Content Wrapper */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto'
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
            className="no-export"
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
            className="no-export"
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadHTML}
            sx={{
              bgcolor: '#0b62eeff',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3,
              boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                bgcolor: '#0549deff',
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


        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',   // 🔥 KEY CHANGE
            gap: 2,
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
          <Box
            id="copy-btn-wrapper"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 1.5,
              borderBottom: '1px solid rgba(226, 232, 240, 1)',
              bgcolor: '#ffffff'
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}
            >
              Transaction Metrics
            </Typography>

            <Button
              id="copy-csv-btn"
              size="small"
              startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              onClick={copyTableAsCSV}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8rem',
                color: copied ? '#16a34a' : '#64748b',
                bgcolor: copied ? 'rgba(34, 197, 94, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                border: '1px solid',
                borderColor: copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(226, 232, 240, 1)',
                borderRadius: 1.5,
                px: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: copied ? 'rgba(34, 197, 94, 0.12)' : 'rgba(100, 116, 139, 0.14)',
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy CSV'}
            </Button>
          </Box>


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
