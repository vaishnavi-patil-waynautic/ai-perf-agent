import React, { useEffect, useRef } from 'react';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import FAQSection from '../components/chat/FAQSection';
import ChatHistory from '../components/chat/ChatHistory';
import { useAppSelector } from '../store/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentChat, toggleScreenView } from '../store/slices/chat.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { measureMemory } from 'vm';
import { ChatMessage } from '../types/chat.types';
import { fetchChatMessages } from '../services/chat.service';

interface ChatPanelProps {
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose,
}) => {

  const dispatch = useDispatch<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useSelector(
    (state: RootState) => state.chat?.messages ?? []
  )
  const chatId = useSelector(
    (state: RootState) => state.chat?.currentChatId ?? 0
  )
  const isFullScreen = useSelector(
    (state: RootState) => state.chat?.isFullScreen
  )
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);
  const isInitializedRef = useRef(false);


  const firstMessage: ChatMessage = {
    id: null,
    sender: 'bot',
    type: 'text',
    content:
      "**Hello! I'm your Performance Engineering Assistant.**\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",
    timestamp: new Date(),
  };


  console.log("Current Chat id : ", chatId)
  // console.log("Messages : ", messages)
  console.log("ChatPanel : ", messages)


  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const chatParam = params.get('chat');

  if (chatParam) {
    const id = chatParam;

    // ✅ set chatId FIRST
    if (String(chatId) !== id) {
      dispatch(setCurrentChat(id));
    }

    // ✅ ensure fullscreen
    if (!isFullScreen) {
      dispatch(toggleScreenView());
    } 
  }

  // ✅ mark initialization complete
  isInitializedRef.current = true;
}, []);


  useEffect(() => {
  localStorage.setItem('chat_fullscreen', JSON.stringify(isFullScreen));
}, [isFullScreen]);

useEffect(() => {
  localStorage.setItem('chat_id', String(chatId));
}, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    console.log("ChatPanelUseeffect : ", messages)
  }, [messages.length]);

  useEffect(() => {
  if (!isInitializedRef.current) return; // 🚨 prevent early override

  const params = new URLSearchParams(location.search);

  if (isFullScreen) {
    params.set('chat', String(chatId ?? 0));
  } else {
    params.delete('chat');
  }

  navigate(
    {
      pathname: location.pathname,
      search: params.toString(),
    },
    { replace: true }
  );
}, [isFullScreen, chatId]);

  useEffect(() => {
  if (!isInitializedRef.current) return; // 🚨 critical

  const params = new URLSearchParams(location.search);
  const chatParam = params.get('chat');

  if (!chatParam && isFullScreen) {
    dispatch(toggleScreenView());
  }

  if (chatParam && !isFullScreen) {
    dispatch(toggleScreenView());
  }
}, [location.search]);

  
  const handleToggle = () => {
    dispatch(toggleScreenView());
  }

  const BotTyping = () => (
    <div className="flex items-center gap-1 px-2 py-1 ml-9">
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
    </div>
  );

  return (
    <div className="flex h-full bg-white">
      {isFullScreen && <ChatHistory />}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <ChatHeader
          onClose={onClose}
          toggleFullScreen={handleToggle}
        />

        <div
          id="chat-scroll-container"
          className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar h-0"
          ref={scrollRef}
        >
          <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6 md:px-3 py-6">
            {messages.length > 0 ? messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            )) :
              (<MessageBubble key={firstMessage.id} message={firstMessage} />)
            }


            {chatLoading && (
              <BotTyping />
            )}
          </div>
        </div>



        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPanel;