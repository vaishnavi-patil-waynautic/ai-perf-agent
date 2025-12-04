import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Paper, Typography, Divider, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { RootState } from '../../../store/store'; 

const NFRResultPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const strategy = useSelector((state: RootState) => state.nfrList.strategies.find(s => s.id === id));
  const [toastOpen, setToastOpen] = React.useState(false);

  if (!strategy) {
      return <div className="p-10 text-center">Strategy not found</div>;
  }

  const handleCopy = () => {
      if (strategy.resultContent) {
          navigator.clipboard.writeText(strategy.resultContent);
          setToastOpen(true);
      }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/nfr')} className="mb-4">
          Back
      </Button>

      <Paper className="p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <Typography variant="h4" className="font-bold text-gray-800">{strategy.appName}</Typography>
                  <Typography variant="subtitle1" className="text-gray-500">ID: {strategy.id} | Generated on: {strategy.createdOn}</Typography>
              </div>
              <div className="flex gap-2">
                  <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopy}>Copy</Button>
                  <Button variant="contained" startIcon={<DownloadIcon />} className="bg-blue-600">Download PDF</Button>
              </div>
          </div>

          <Divider className="mb-6" />

          <div className="bg-gray-50 p-6 rounded border border-gray-200 font-mono text-sm whitespace-pre-wrap">
              {strategy.resultContent || "No content available."}
          </div>
      </Paper>
      
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={() => setToastOpen(false)}
        message="Content copied to clipboard!"
      />
    </div>
  );
};

export default NFRResultPage;