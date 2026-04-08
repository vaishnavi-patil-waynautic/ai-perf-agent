import React, { useEffect, useRef, useState } from 'react';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import FAQSection from '../components/chat/FAQSection';
import ChatHistory from '../components/chat/ChatHistory';
import { useAppSelector } from '../store/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentChat, toggleScreenView, clearMessages, resetChatState } from '../store/slices/chat.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { measureMemory } from 'vm';
import { ChatMessage } from '../types/chat.types';
import { fetchChatMessages } from '../services/chat.service';
import { loadChatHistories, loadChatMessages } from '../store/slices/chat.thunk';
import { Bot } from 'lucide-react';

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
    (state: RootState) => {
      const cid = state.chat.currentChatId;
      const key = (!cid || cid === '0') ? 'new' : cid;
      return state.chat.chatMap[key]?.messages ?? [];
    }
  )
  const chatId = useSelector(
    (state: RootState) => state.chat?.currentChatId ?? 0
  )
  const isFullScreen = useSelector(
    (state: RootState) => state.chat?.isFullScreen
  )
  const { selectedProject } = useSelector((state: RootState) => state.project);
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);
  const isInitializedRef = useRef(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // When project changes, wipe all chat state and start fresh
  useEffect(() => {
    // if (!isInitializedRef.current) return;
    dispatch(resetChatState());
    setChatInput('');
    localStorage.removeItem('last_chat_id');
  }, [selectedProject?.id]);

  // Clear input when switching chats
  useEffect(() => {
    if (!isInitializedRef.current) return;
    setChatInput('');
  }, [chatId]);



  const firstMessage: ChatMessage = {
    id: null,
    sender: 'bot',
    type: 'text',
    content:
      "**Hello! I'm your Performance Engineering Assistant.**\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",
    timestamp: new Date().toISOString(),
  };


  console.log("Current Chat id : ", chatId)
  // console.log("Messages : ", messages)
  console.log("ChatPanel : ", messages)


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatParam = params.get('chat');
    // Also check localStorage for last active chat (works in collapsed mode too)

    console.log("Restoring chatpanel chatparam : ", chatParam)
    const storedChatId = localStorage.getItem('last_chat_id');
    const targetChatId = chatParam || storedChatId;


    console.log("Restoring chatpanel stored : ", storedChatId)

    if (targetChatId && targetChatId !== '0') {
      if (isFullScreen) dispatch(toggleScreenView());
      dispatch(setCurrentChat(targetChatId));
      dispatch(loadChatHistories(selectedProject?.id));
      dispatch(loadChatMessages(targetChatId));
    }

    isInitializedRef.current = true;
  }, []);


  useEffect(() => {
    localStorage.setItem('chat_fullscreen', JSON.stringify(isFullScreen));
  }, [isFullScreen]);

  useEffect(() => {
    if (chatId && chatId !== '0') {
      localStorage.setItem('last_chat_id', String(chatId));
    }
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

  const closeChat = () => {

    dispatch(resetChatState());
    dispatch(clearMessages());
    setChatInput('');
    localStorage.removeItem('last_chat_id');

      const params = new URLSearchParams(location.search);
  params.delete('chat');

  navigate({
    pathname: location.pathname,
    search: params.toString(),
  }, { replace: true });

        console.log("Resetting the chat ------------------------", messages);
    onClose();
  }


  const BotTyping = () => (
    <div className="flex items-center gap-1 px-2 py-1 ml-9">
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
    </div>
  );

  return (
    <div
      className="flex h-full bg-white"
      style={{
        animation: isFullScreen ? 'chatExpand 280ms cubic-bezier(0.4,0,0.2,1)' : undefined,
      }}
    >
      <style>{`
        @keyframes chatExpand {
          from { opacity: 0.7; transform: scale(0.98); }
          to   { opacity: 1;   transform: scale(1); }
        }
      `}</style>
      {isFullScreen && (
        <ChatHistory
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        {/* Floating header — absolute, takes no layout space */}
        <ChatHeader
          onClose={closeChat}
          toggleFullScreen={handleToggle}
          sidebarCollapsed={isFullScreen && sidebarCollapsed}
          onExpandSidebar={() => setSidebarCollapsed(false)}
        />

        <div
          id="chat-scroll-container"
          className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar h-0"
          ref={scrollRef}
        >
          <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6 md:px-3 pt-12 pb-6">
            {messages.length > 0 ? messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            )) :
              // (<MessageBubble key={firstMessage.id} message={firstMessage} />)
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-10">
                <div className="w-20 h-20 bg-blue-100 rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10">
                  <Bot size={40} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Waynautic AI</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Hello! I'm your Performance Engineering Assistant. I can help you analyze NFRs, debug JMX scripts, or explain error logs.
                </p>
              </div>
            }


            {/* {chatLoading && (
              <BotTyping />
            )} */}
          </div>
        </div>



        <ChatInput inputValue={chatInput} onInputChange={setChatInput} />
      </div>
    </div>
  );
};

export default ChatPanel;