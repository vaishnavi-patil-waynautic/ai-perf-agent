import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchemaIcon from '@mui/icons-material/Schema';

import { ChatMessage } from './chatTypes';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';


/* ---------------- TYPES ---------------- */

export interface AIModel {
  id: string;
  name: string;
  icon: React.ReactNode;
}

/* ---------------- CHAT HEADER ---------------- */

interface HeaderProps {
  onClose: () => void;
}

export const ChatHeader: React.FC<HeaderProps> = ({ onClose }) => {
  const [faqOpen, setFaqOpen] = useState(false);

  const faqs = [
    'How do I generate a performance strategy?',
    'Where can I find the NFR reports?',
    'How do I switch AI models?',
  ];

  return (
    <div className="bg-blue-600 text-white rounded-t-xl shadow-md">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <Avatar sx={{ bgcolor: 'white', color: '#2563eb' }}>
            <SmartToyIcon />
          </Avatar>
          <div>
            <Typography variant="subtitle1" className="font-bold">
              EXG Assistant
            </Typography>
            <div
              className="flex items-center gap-1 text-xs text-blue-100 cursor-pointer hover:text-white"
              onClick={() => setFaqOpen(!faqOpen)}
            >
              View FAQ
              <ExpandMoreIcon
                fontSize="small"
                className={`transition-transform ${faqOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        <IconButton size="small" onClick={onClose} className="text-white">
          <CloseIcon />
        </IconButton>
      </div>

      <Collapse in={faqOpen}>
        <div className="bg-blue-700 px-4 pb-4 text-sm">
          <Divider className="border-blue-500 mb-2" />
          {faqs.map((q, i) => (
            <div
              key={i}
              className="p-2 rounded bg-blue-800 hover:bg-blue-900 cursor-pointer mb-1"
            >
              ? {q}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

/* ---------------- MESSAGE BUBBLE ---------------- */

export const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white border rounded-tl-none'
        }`}
      >
        {message.type === 'text' && <p>{message.content}</p>}

        {message.type === 'diagram' && (
          <div className="bg-gray-100 p-3 rounded border border-dashed text-gray-500 flex flex-col items-center">
            <SchemaIcon />
            <span className="text-xs mt-1">Rendering diagram…</span>
          </div>
        )}

        <span className="block text-[10px] text-right opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

/* ---------------- CHAT INPUT ---------------- */

interface InputProps {
  onSend: (text: string, model: string) => void;
  // isFullScreen: boolean;
}

export const ChatInput: React.FC<InputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const isFullScreen = useSelector((state: RootState) => state.chat.isFullScreen)

  const models: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      icon: <SmartToyIcon fontSize="small" />,
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Opus',
      icon: <PsychologyIcon fontSize="small" />,
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      icon: <AutoAwesomeIcon fontSize="small" />,
    },
  ];

  const [selectedModel, setSelectedModel] = useState<AIModel>(models[0]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text, selectedModel.id);
    setText('');
  };

  return (
    <div
      className={`bg-white border-t ${
        isFullScreen ? 'py-4' : 'py-3'
      }`}
    >
      <div
        className={`mx-auto flex items-end gap-2 ${
          isFullScreen ? 'max-w-4xl px-4' : 'max-w-xl px-3'
        }`}
      >
        {/* MODEL SELECTOR (ICON ONLY) */}
        {/* MODEL SELECTOR */}
<Tooltip title="Change AI model" placement="top">
  <IconButton
    size="small"
    onClick={(e) => setAnchorEl(e.currentTarget)}
    sx={{
      display: 'flex',
      gap: '2px',
      border: '1px solid #bfdbfe',
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      px: 1,
      height: 40,
      borderRadius: '10px',
      '&:hover': {
        backgroundColor: '#dbeafe',
      },
    }}
  >
    {/* Model Icon */}
    <span className="text-blue-600">
      {selectedModel.icon}
    </span>

    {/* Dropdown Arrow */}
    <KeyboardArrowDownIcon
      fontSize="small"
      className="text-blue-500"
    />
  </IconButton>
</Tooltip>



        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {models.map((m) => (
            <MenuItem
              key={m.id}
              onClick={() => {
                setSelectedModel(m);
                setAnchorEl(null);
              }}
              dense
            >
              <div className="flex items-center gap-2">
                {m.icon}
                <Typography variant="body2">{m.name}</Typography>
              </div>
            </MenuItem>
          ))}
        </Menu>

        {/* INPUT */}
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Ask me anything…"
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="bg-gray-50"
          InputProps={{
            style: {
              fontSize: '0.9rem',
              padding: '8px 12px',
              borderRadius: '12px',
            },
          }}
        />

        {/* SEND */}
        <IconButton
          onClick={handleSend}
          className="bg-blue-600 text-white hover:bg-blue-700 w-10 h-10"
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="text-[10px] text-gray-400 text-center mt-2">
        AI can make mistakes. Check important info.
      </div>
    </div>
  );
};
