import React, { useEffect, useRef, useState } from 'react';
import { Paper } from '@mui/material';
import { ChatHeader, ChatInput, MessageBubble } from './ChatComponents';
import { ChatMessage } from './chatTypes';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Initial Welcome Message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: '1',
        sender: 'bot',
        type: 'text',
        content: "Hello! I'm your Engineering Assistant. I can help you generate strategies, analyze logs, or draw architecture diagrams.",
        timestamp: new Date()
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (text: string, modelId: string) => {
    // 1. Add User Message
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'text',
        content: text,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Simulate Bot Response (Mocking logic)
    setTimeout(() => {
        let botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            type: 'text',
            content: `Response from ${modelId}: I received your query "${text}". Here is a sample response.`,
            timestamp: new Date()
        };

        // Mocking rich media based on keywords
        if (text.toLowerCase().includes('diagram')) {
            botResponse.type = 'diagram';
            botResponse.content = 'Diagram Placeholder';
        } else if (text.toLowerCase().includes('photo') || text.toLowerCase().includes('image')) {
            botResponse.type = 'image';
            botResponse.content = 'https://via.placeholder.com/300x150?text=Architecture+Diagram';
        }

        setMessages(prev => [...prev, botResponse]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Paper 
        elevation={6}
        className={`fixed z-50 flex flex-col bg-gray-50
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

      <ChatInput onSend={handleSend} isFullScreen={false}/>
    </Paper>
  );
};

export default ChatWindow;