import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { User, Bot } from 'lucide-react';
import { ChatMessage } from '../../types/chat.types';
import { useAppDispatch } from '../../store/hooks';
import ChatResponseCard from './ChatResponseCard';
import { sendFeedback } from '../../store/slices/chat.thunk';
import MarkdownBlock from './ChatResponse/MarkdownBlock';
import StreamingBubble from './StreamingBubble';

interface Props { message: ChatMessage; }

const MessageBubble: React.FC<Props> = ({ message }) => {
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(message.content);
  //   } catch (err) {
  //     // fallback
  //     const textarea = document.createElement("textarea");
  //     textarea.value = message.content;
  //     textarea.style.position = "fixed"; // avoid scrolling
  //     document.body.appendChild(textarea);
  //     textarea.focus();
  //     textarea.select();

  //     try {
  //       document.execCommand("copy");
  //     } catch (e) {
  //       console.error("Fallback copy failed", e);
  //     }

  //     document.body.removeChild(textarea);
  //   }

  //   setCopied(true);
  // };

const handleCopy = async () => {
  // Helper function to format results
  const formatResults = (results: any): string => {
    if (!results) return "";

    if (typeof results === "string") {
      return results;
    }

    if (Array.isArray(results)) {
      return results
        .map((item, index) => {
          if (typeof item === "object") {
            return `Result ${index + 1}:\n${JSON.stringify(item, null, 2)}`;
          }
          return `Result ${index + 1}: ${item}`;
        })
        .join("\n\n");
    }

    if (typeof results === "object") {
      return JSON.stringify(results, null, 2);
    }

    return String(results);
  };

  // Combine content and results
  const combinedText = [
    message.content,
    message.data.results ? "\n\nResults:\n" + formatResults(message.data.results) : "",
    message.data.bugs ? "\n\nBugs:\n" + formatResults(message.data.bugs) : "",
  ]
    .filter(Boolean)
    .join("");

  try {
    await navigator.clipboard.writeText(combinedText);
  } catch (err) {
    // Fallback for unsupported browsers
    const textarea = document.createElement("textarea");
    textarea.value = combinedText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (e) {
      console.error("Fallback copy failed", e);
    }

    document.body.removeChild(textarea);
  }

  setCopied(true);
};

  const handleReaction = (reaction: 'like' | 'dislike') => {
    dispatch(sendFeedback({ messageId: message.id, reaction }));
  };

  const ActionBar = () => (
    <div className="flex items-center gap-1.5 mt-2 ml-1">
      <Tooltip title="Like" placement="top">
        <IconButton size="small" onClick={() => handleReaction('like')} sx={{
          width: 32, height: 32, borderRadius: '10px',
          background: message.liked
            ? 'linear-gradient(135deg,rgba(59,130,246,.15),rgba(37,99,235,.15))'
            : 'rgba(255,255,255,.5)',
          border: message.liked ? '1.5px solid rgba(59,130,246,.3)' : '1px solid rgba(255,255,255,.4)',
          '&:hover': { boxShadow: '0 4px 16px rgba(59,130,246,.25)' },
        }}>
          {message.liked
            ? <ThumbUpIcon sx={{ fontSize: 16 }} className="text-blue-600" />
            : <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Dislike" placement="top">
        <IconButton size="small" onClick={() => handleReaction('dislike')} sx={{
          width: 32, height: 32, borderRadius: '10px',
          background: message.disliked
            ? 'linear-gradient(135deg,rgba(239,68,68,.15),rgba(220,38,38,.15))'
            : 'rgba(255,255,255,.5)',
          border: message.disliked ? '1.5px solid rgba(239,68,68,.3)' : '1px solid rgba(255,255,255,.4)',
          '&:hover': { boxShadow: '0 4px 16px rgba(239,68,68,.25)' },
        }}>
          {message.disliked
            ? <ThumbDownIcon sx={{ fontSize: 16 }} className="text-red-600" />
            : <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy" placement="top">
        <IconButton size="small" onClick={handleCopy} sx={{
          width: 32, height: 32, borderRadius: '10px',
          background: 'rgba(255,255,255,.5)',
          border: '1px solid rgba(255,255,255,.4)',
          '&:hover': { boxShadow: '0 4px 16px rgba(139,92,246,.25)' },
        }}>
          <ContentCopyIcon sx={{ fontSize: 16 }} className="text-gray-500" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Bot avatar — consistent across all models */}
      {!isUser && (
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-blue-600 text-white shadow-blue-500/20`}>
          <Bot size={18} />
        </div>
      )}

      {/* ── Bubble ──────────────────────────────────────────────────── */}
      <div className={`group px-4 py-2 rounded-2xl overflow-hidden
        ${isUser ? 'bg-gray-100 text-black rounded-tr-sm max-w-[75%]' : 'max-w-[80%]'}`}
      >
        {/* CASE 1: streaming */}
        {message.isStreaming && <StreamingBubble message={message} />}

        {/* CASE 2: finalized text */}
        {!message.isStreaming && message.type === 'text' && (
          <div className="text-sm leading-relaxed">
            <MarkdownBlock content={message.content} />
          </div>
        )}

        {/* CASE 3: visualization */}
        {!message.isStreaming && message.type === 'visualization' && (
          message.data && <ChatResponseCard data={message.data} />
        )}

        {/* CASE 4: image / diagram */}
        {!message.isStreaming && message.type === 'image' && (
          <img src={message.content} alt="Response" className="max-w-full rounded-lg" />
        )}
        {!message.isStreaming && message.type === 'diagram' && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{message.content}</pre>
          </div>
        )}

        {!isUser && !message.isStreaming && message.id && <ActionBar />}

        <span className="text-xs text-gray-400 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* ── User avatar ──────────────────────────────────────────────── */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
          <User size={18} color="white" />
        </div>
      )}


<Snackbar
  open={copied}
  autoHideDuration={2000}
  onClose={() => setCopied(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setCopied(false)}
    sx={{
      borderRadius: 2,
      boxShadow: 3,
      fontWeight: 500,
      alignItems: "center",
    }}
  >
    Copied to clipboard!
  </Alert>
</Snackbar>

    </div>
  );
};

export default React.memo(MessageBubble);