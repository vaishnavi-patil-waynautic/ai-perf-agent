import React, { useEffect, useRef } from 'react';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import FAQSection from '../components/chat/FAQSection';
import ChatHistory from '../components/chat/ChatHistory';
import { useAppSelector } from '../store/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleScreenView } from '../store/slices/chat.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { measureMemory } from 'vm';
import { ChatMessage } from '../types/chat.types';

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

  // const firstMessage = 
  //   {
  //     id: '1',
  //     sender: "bot" as const,
  //     type: 'text',
  //     content:
  //       "Hello! I'm your Performance Engineering Assistant.\n\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",
  //     timestamp: new Date(),
  //   };


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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    console.log("ChatPanelUseeffect : ", messages)
  }, [messages.length]);
// useEffect(() => {
//   const el = scrollRef.current;
//   if (!el) return;

//   requestAnimationFrame(() => {
//     el.scrollTo({
//       top: el.scrollHeight,
//       behavior: "auto",
//     });
//   });
// }, [messages, chatLoading]);

  useEffect(() => {
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
    const params = new URLSearchParams(location.search);
    const chatParam = params.get('chat');

    // If URL no longer has chat=1 but Redux says fullscreen is open
    if (!chatParam && isFullScreen) {
      dispatch(toggleScreenView());
    }

    // If URL has chat=1 but Redux says it's closed
    if (chatParam && !isFullScreen) {
      dispatch(toggleScreenView());
    }

  }, [location.pathname, location.search, chatId]);

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

        {/* <FAQSection /> */}

        {/* <div
          className={`
            flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar
            ${isFullScreen ? 'py-6 px-[200px]' : 'p-4'}
          `}
          ref={scrollRef}
        > */}

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