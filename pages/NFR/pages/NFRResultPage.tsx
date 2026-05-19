import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Typography, Divider, Snackbar, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { AppDispatch, RootState } from '../../../store/store';
import { ArrowBack } from '@mui/icons-material';
import { fetchNfrReport } from '../slices/nfr.thunks';
import { nfrService } from '../services/nfrService';
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { showSnackbar } from '@/store/snackbarStore';
import html2pdf from "html2pdf.js";
import { marked } from "marked";
import { handleDownload } from '../services/handleDownload';

const NFRResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prevProjectId = useRef<number | null>(null);
  const { selectedProject } = useSelector((state: RootState) => state.project);

  const dispatch = useDispatch<AppDispatch>();
  const [isDownloading, setIsDownloading] = useState(false);

  const [toastOpen, setToastOpen] = React.useState(false);

  useEffect(() => {
    if (id) {
      console.log("Fetching report for ID:", id);
      dispatch(fetchNfrReport(Number(id)));
    }
  }, [id, dispatch]);



  useEffect(() => {
    if (!selectedProject?.id) return;

    if (
      prevProjectId.current !== null &&
      prevProjectId.current !== selectedProject.id
    ) {
      navigate("/nfr");
    }

    prevProjectId.current = selectedProject.id;
  }, [selectedProject?.id]);


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
    if (!selectedReport?.nfr_content) return;

    try {
      const textarea = document.createElement("textarea");
      textarea.value = selectedReport.nfr_content;

      // Prevent scrolling to bottom
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      dispatch(
        showSnackbar({
          message: success ? "Copied to clipboard" : "Copy failed",
          type: success ? "success" : "error",
        })
      );
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "Copy failed",
          type: "error",
        })
      );
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
          px: 5
        }}
      >
        <div className="flex justify-between items-start mb-6 gap-3">
          <div className="flex-1 min-w-[300px] max-w-full">
            <Typography
              variant="h4"
              className="font-bold text-gray-800"
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: 1.25
              }}
            >
              {selectedReport.display_name == 'N/A' ? 'Default Application' : selectedReport.display_name}</Typography>
            <Typography variant="subtitle1" className="text-gray-500">ID: {selectedReport.id}</Typography>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3,
              boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)',
              '&:hover': {
                // bgcolor: '#cbdafeff',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
              }
            }}
              startIcon={<ContentCopyIcon />} onClick={handleCopy}>
              Copy</Button>


            <Button
              variant="contained"
              startIcon={isDownloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
              disabled={isDownloading}
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
              onClick={() =>
                handleDownload({
                  id: Number(id),
                  applicationName:
                    selectedReport.application_name === "N/A"
                      ? "Default Application"
                      : selectedReport.application_name,
                  onStart: () => setIsDownloading(true),
                  onSuccess: () => setIsDownloading(false),
                  onError: (err) => {
                    setIsDownloading(false);
                    dispatch(
                      showSnackbar({
                        message: "Failed to download report. Please try again.",
                        type: "error",
                      })
                    );
                  },
                })
              }
              className="bg-blue-600"
            >
              {isDownloading ? "Downloading..." : "Download"}
            </Button>

          </div>
        </div>

        <Divider className="mb-6" />


<div className="bg-white p-6">
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
        <table className="w-full border border-gray-300 my-4 text-sm border-collapse">
          {children}
        </table>
      ),
      th: ({ children }) => (
        <th className="border px-3 py-2 bg-gray-100 text-left font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border px-3 py-2 align-top">{children}</td>
      ),
      hr: () => <hr className="my-6 border-gray-300" />,
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),

      // Inline and block code styling
      code: (({
        inline,
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & {
        inline?: boolean;
        children?: React.ReactNode;
      }) =>
        inline ? (
          <code
            className="bg-gray-100 px-1 py-0.5 rounded text-sm"
            {...props}
          >
            {children}
          </code>
        ) : (
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto my-3">
            <code {...props}>{children}</code>
          </pre>
        )) as Components["code"],
    }}
  >
    {(() => {
      const content = selectedReport?.nfr_content || "";

      // Extract content inside ```markdown ... ```
      const match = content.match(/```markdown\s*([\s\S]*?)```/i);

      if (match) {
        const extractedMarkdown = match[1].trim();
        const remainingText = content
          .replace(match[0], "")
          .trim();

        return `${extractedMarkdown}\n\n${remainingText}`;
      }

      // Fallback: remove any generic code fences
      return content
        .replace(/```[a-zA-Z]*\n?/g, "")
        .replace(/```/g, "")
        .trim();
    })()}
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