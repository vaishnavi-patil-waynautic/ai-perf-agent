import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Typography, Divider, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { AppDispatch, RootState } from '../../../store/store';
import { ArrowBack } from '@mui/icons-material';
import { fetchNfrReport } from '../slices/nfr.thunks';
import { nfrService } from '../services/nfrService';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NFRResultPage: React.FC = () => {
  //   const { id } = useParams();
  //   const navigate = useNavigate();
  //   const strategy = useSelector((state: RootState) => state.nfrList.strategies.find(s => s.id === id));
  //   const [toastOpen, setToastOpen] = React.useState(false);

  //   if (!strategy) {
  //       return <div className="p-10 text-center">Strategy not found</div>;
  //   }

  //   const handleCopy = () => {
  //       if (strategy.resultContent) {
  //           navigator.clipboard.writeText(strategy.resultContent);
  //           setToastOpen(true);
  //       }
  //   };


  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [toastOpen, setToastOpen] = React.useState(false);

  useEffect(() => {
    if (id) {
      console.log("Fetching report for ID:", id);
      dispatch(fetchNfrReport(Number(id)));
    }
  }, [id, dispatch]);


   const { selectedReport, loading } = useSelector(
    (state: RootState) => state.nfrList
  );

  // console.log("RAW NFR CONTENT:", selectedReport.nfr_content);

  if (loading) {
    return <div className="p-10 text-center">Loading report...</div>;
  }

  if (!selectedReport) {
    return <div className="p-10 text-center">Report not found</div>;
  }

  const handleCopy = () => {
    if (selectedReport.nfr_content) {
      navigator.clipboard.writeText(selectedReport.nfr_content);
      setToastOpen(true);
    }
  };

  const handleDownload = async (id) => {
    try {
      const blob = await nfrService.downloadById(id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nfr-${id}.txt`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {

    }
  };


  return (
    <div className="p-10 max-w-6xl mx-auto">

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/nfr')}
        sx={{
          mb: 1,
          color: "#5c5f66",
          textTransform: "none",
          fontWeight: 500,
          paddingBottom: 1,
        }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #e4e6eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          p: 3,
          mt: 1,
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <Typography variant="h4" className="font-bold text-gray-800">{selectedReport.application_name=='N/A' ? 'Default Application' : selectedReport.application_name}</Typography>
            <Typography variant="subtitle1" className="text-gray-500">ID: {selectedReport.id}</Typography>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopy}>Copy</Button>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => handleDownload(id)} className="bg-blue-600">Download PDF</Button>
          </div>
        </div>

        <Divider className="mb-6" />


        {/* 
<div className="bg-gray-50 p-6 rounded border border-gray-200 prose prose-sm max-w-none">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {selectedReport.nfr_content || "No content available."}
  </ReactMarkdown>
</div> */}


        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              table: ({ children }) => (
                <table className="w-full border border-gray-300 my-4 text-sm">
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th className="border px-3 py-2 bg-gray-100 text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border px-3 py-2">{children}</td>
              ),
              hr: () => <hr className="my-6 border-gray-300" />,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            }}
          >
            {selectedReport.nfr_content}
          </ReactMarkdown>
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