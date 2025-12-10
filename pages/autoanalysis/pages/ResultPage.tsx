import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { fetchBuildReport } from '../services/mockService';

export const ResultPage: React.FC = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    if (buildId) {
      fetchBuildReport(buildId).then(setReport);
    }
  }, [buildId]);

  return (
    <Box className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Back to Config</Button>
        <Button variant="contained" startIcon={<Download />} disableElevation>Download Report</Button>
      </div>

      <Paper className="max-w-6xl mx-auto p-8 min-h-[500px]" elevation={0} variant="outlined">
        {!report ? (
          <Box className="flex justify-center items-center h-40">
            <CircularProgress />
          </Box>
        ) : (
          <div className="prose prose-slate max-w-none">
            {/* Using a wrapper div with 'prose' (Tailwind Typography plugin recommended) */}
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        )}
      </Paper>
    </Box>
  );
};