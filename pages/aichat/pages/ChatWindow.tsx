import React, { useEffect, useRef } from 'react';
import { Paper } from '@mui/material';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import { useAppSelector } from '../store/hooks';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useAppSelector((state) => state.chat.messages);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <Paper
      elevation={6}
      className={`
        fixed z-50 flex flex-col bg-gray-50
        bottom-20 right-4 sm:right-6 
        w-[calc(100vw-32px)] sm:w-[400px] md:w-1/3 
        h-[600px] max-h-[calc(100vh-120px)]
        rounded-xl overflow-hidden border border-gray-200
        transition-all duration-300 ease-in-out transform origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}
    >
      <ChatHeader onClose={onClose} />

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <ChatInput isFullScreen={false} />
    </Paper>
  );
};

export default ChatWindow;