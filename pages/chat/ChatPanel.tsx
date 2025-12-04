import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Typography, Collapse, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ChatInput, MessageBubble } from './ChatComponents'; // Use previous components
import { ChatMessage } from './chatTypes';
import { Tooltip } from "@mui/material";

interface ChatPanelProps {
  onClose: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose, isFullScreen, toggleFullScreen }) => {
  const [faqOpen, setFaqOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1', sender: 'bot', type: 'text', timestamp: new Date(),
      content: "Hello! I'm your Performance Engineering Assistant.\n\nI can help you analyze NFRs, debug JMX scripts, or explain error logs."
    }
  ]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (text: string, model: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', type: 'text', content: text, timestamp: new Date() }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'bot', type: 'text', content: `[${model}] Analyzing: ${text}...`, timestamp: new Date() }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* --- 1. Top Bar (Collapsible FAQ + Controls) --- */}
      <div className="bg-blue-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center p-3 px-4">
            <div className="flex items-center gap-2">
                <SmartToyIcon className="text-blue-600" />
                <Typography variant="subtitle2" className="font-bold text-gray-800">
                    Waynautic AI Chatbot
                </Typography>
            </div>
            
            <div className="flex items-center gap-1">
                <Tooltip title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                    <IconButton size="small" onClick={toggleFullScreen} className="text-gray-500 hover:text-blue-600">
                        {isFullScreen ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Close Panel">
                    <IconButton size="small" onClick={onClose} className="text-gray-500 hover:text-red-500">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
        </div>

        {/* Collapsible FAQ Header */}
        <div 
            className="px-4 pb-2 text-xs font-semibold text-blue-600 cursor-pointer flex items-center hover:underline"
            onClick={() => setFaqOpen(!faqOpen)}
        >
            <span>Frequently Asked Questions</span>
            <ExpandMoreIcon fontSize="small" className={`transform transition ${faqOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Collapsible Content */}
        <Collapse in={faqOpen}>
            <div className="px-4 pb-3 space-y-2">
                {['How to fix 504 Gateway errors?', 'Generate Load Test Strategy', 'Analyze Report #402'].map(q => (
                    <div key={q} className="p-2 bg-white border border-blue-100 rounded text-xs text-gray-600 cursor-pointer hover:bg-blue-100 transition">
                        {q}
                    </div>
                ))}
            </div>
        </Collapse>
      </div>

      {/* --- 2. Chat Area (Scrollable) --- */}
      <div 
        className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar ${isFullScreen ? p-6 : p-4}"
        
        ref={scrollRef}
      >
        {messages.map((msg) => (
           <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* --- 3. Footer Input --- */}
      <ChatInput onSend={handleSend} isFullScreen={isFullScreen} />
    </div>
  );
};

export default ChatPanel;