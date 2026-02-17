import React, { useEffect, useRef } from 'react';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import FAQSection from '../components/chat/FAQSection';
import ChatHistory from '../components/chat/ChatHistory';
import { useAppSelector } from '../store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ChatPanelProps {
  onClose: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose,
  isFullScreen,
  toggleFullScreen,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useSelector(
  (state: RootState) => state.chat?.messages ?? []
)


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Chat History (Only in Full Screen) */}
      {isFullScreen && <ChatHistory />}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <ChatHeader
          onClose={onClose}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />

        {/* FAQ Section */}
        <FAQSection />

        {/* Messages Area */}
        <div
          className={`
            flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar
            ${isFullScreen ? 'py-6 px-[280px]' : 'p-4'}
          `}
          ref={scrollRef}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input Area */}
        <ChatInput isFullScreen={isFullScreen} />
      </div>
    </div>
  );
};

export default ChatPanel;