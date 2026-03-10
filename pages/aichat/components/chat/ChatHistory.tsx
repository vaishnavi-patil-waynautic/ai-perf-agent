// import React, { useEffect } from 'react';
// import {
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Typography,
//   IconButton,
//   Divider,
//   Tooltip,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import {
//   loadChatHistories,
//   loadChatMessages,
//   createChat, 
// } from '../../store/slices/chat.thunk';
// import { setCurrentChat, clearMessages } from '../../store/slices/chat.slice';

// const ChatHistory: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const chatHistories = useAppSelector((state) => state.chat.chatHistories);
//   const currentChatId = useAppSelector((state) => state.chat.currentChatId);

//   useEffect(() => {
//     dispatch(loadChatHistories());
//   }, [dispatch]);

//   const handleChatSelect = (chatId: string) => {
//     dispatch(setCurrentChat(chatId));
//      dispatch(clearMessages());  
//     dispatch(loadChatMessages(chatId));
//   };

// const handleNewChat = () => {
//   dispatch(setCurrentChat("0"));   // temporary empty chat
//   dispatch(clearMessages())
// };

//   const formatTimestamp = (date: Date) => {
//     const now = new Date();
//     const diff = now.getTime() - new Date(date).getTime();
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const days = Math.floor(hours / 24);

//     if (hours < 1) return 'Just now';
//     if (hours < 24) return `${hours}h ago`;
//     if (days < 7) return `${days}d ago`;
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 bg-white">
//         <div className="flex items-center justify-between mb-3">
//           <Typography variant="h6" className="font-bold text-gray-800">
//             Chat History
//           </Typography>
//           <Tooltip title="New Chat">
//             <IconButton
//               size="small"
//               onClick={handleNewChat}
//               className="bg-blue-600 text-white hover:bg-blue-700"
//             >
//               <AddIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </div>
//       </div>

//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto custom-scrollbar">
//         {chatHistories.length === 0 ? (
//           <div className="p-4 text-center text-gray-400">
//             <ChatBubbleOutlineIcon className="mb-2 text-4xl" />
//             <Typography variant="body2">No chat history yet</Typography>
//           </div>
//         ) : (
//           <List className="p-2">
//             {chatHistories.map((chat) => (
//               <React.Fragment key={chat.id}>
//                 <ListItem disablePadding className="mb-1">
//                   <ListItemButton
//                     selected={currentChatId === chat.id}
//                     onClick={() => handleChatSelect(chat.id)}
//                     className={`rounded-lg ${
//                       currentChatId === chat.id
//                         ? 'bg-blue-100 border-l-4 border-blue-600'
//                         : 'hover:bg-gray-100'
//                     }`}
//                   >
//                     <ListItemText
//                       primary={
//                         <Typography
//                           variant="body2"
//                           className="font-semibold text-gray-800 truncate"
//                         >
//                           {chat.title}
//                         </Typography>
//                       }
//                       secondary={
//                         <div className="flex flex-col">
//                           <Typography
//                             variant="caption"
//                             className="text-gray-500 truncate"
//                           >
//                             {chat.lastMessage}
//                           </Typography>
//                           <div className="flex justify-between items-center mt-1">
//                             <Typography variant="caption" className="text-gray-400">
//                               {formatTimestamp(chat.timestamp)}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               className="text-gray-400 bg-gray-200 px-2 py-0.5 rounded"
//                             >
//                               {chat.messageCount} msgs
//                             </Typography>
//                           </div>
//                         </div>
//                       }
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               </React.Fragment>
//             ))}
//           </List>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatHistory;


import React, { useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadChatHistories,
  loadChatMessages,
  createChat,
} from '../../store/slices/chat.thunk';
import { setCurrentChat, clearMessages } from '../../store/slices/chat.slice';

const ChatHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatHistories = useAppSelector((state) => state.chat.chatHistories);
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    dispatch(loadChatHistories());
  }, [dispatch]);

  const handleChatSelect = (chatId: string) => {
    dispatch(setCurrentChat(chatId));
    // dispatch(clearMessages());
    dispatch(loadChatMessages(chatId));
  };

  const handleNewChat = () => {
    dispatch(setCurrentChat('0')); // temporary empty chat
    dispatch(clearMessages());
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative w-64 h-full flex flex-col overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 opacity-80"></div>
      
      {/* Glassmorphic Container */}
      <div className="relative h-full flex flex-col backdrop-blur-xl bg-white/40 border-r border-white/60 shadow-xl">
        {/* Header with Glass Effect */}
        <div className="relative p-4 border-b border-white/40">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                <AutoAwesomeIcon className="text-white text-sm" />
              </div>
              <Typography
                variant="h6"
                className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                Chats
              </Typography>
            </div>
            
            <Tooltip title="New Chat" placement="bottom">
              <IconButton
                size="small"
                onClick={handleNewChat}
                className="glass-button group relative overflow-hidden"
                sx={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25))',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <AddIcon 
                  fontSize="small" 
                  className="text-purple-600 transition-transform group-hover:rotate-90 duration-300"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Chat List with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto glass-scrollbar">
          {chatHistories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative p-4 rounded-full bg-white/30 backdrop-blur-md border border-white/40">
                  <ChatBubbleOutlineIcon 
                    className="text-5xl bg-gradient-to-br from-purple-500 to-blue-500 bg-clip-text text-transparent" 
                  />
                </div>
              </div>
              <Typography 
                variant="body2" 
                className="text-gray-600 font-medium"
              >
                No conversations yet
              </Typography>
              <Typography 
                variant="caption" 
                className="text-gray-400 mt-1"
              >
                Start a new chat to begin
              </Typography>
            </div>
          ) : (
            <List className="p-3 space-y-2">
              {chatHistories.map((chat, index) => (
                <ListItem 
                  key={chat.id} 
                  disablePadding
                  sx={{
                    animation: `slideIn 0.3s ease ${index * 0.05}s both`,
                    '@keyframes slideIn': {
                      from: {
                        opacity: 0,
                        transform: 'translateX(-20px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                >
                  <ListItemButton
                    selected={currentChatId === chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`rounded-xl transition-all duration-300 ${
                      currentChatId === chat.id
                        ? 'glass-active'
                        : 'glass-item'
                    }`}
                    sx={{
                      padding: '12px',
                      backdropFilter: 'blur(10px)',
                      background:
                        currentChatId === chat.id
                          ? 'linear-gradient(135deg, rgba(219, 206, 250, 0.2), rgba(246, 248, 252, 0.2))'
                          : 'rgba(255, 255, 255, 0.25)',
                      border:
                        currentChatId === chat.id
                          ? '1.5px solid rgba(139, 92, 246, 0.4)'
                          : '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow:
                        currentChatId === chat.id
                          ? '0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                          : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        background:
                          currentChatId === chat.id
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25))'
                            : 'rgba(255, 255, 255, 0.4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          className={`font-semibold truncate mb-1 ${
                            currentChatId === chat.id
                              ? 'bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent'
                              : 'text-gray-800'
                          }`}
                        >
                          {chat.title}
                        </Typography>
                      }
                      secondary={
                        <div className="flex flex-col gap-1.5">
                          <Typography
                            variant="caption"
                            className="text-gray-600 truncate leading-relaxed"
                          >
                            {chat.lastMessage}
                          </Typography>
                          <div className="flex justify-between items-center">
                            <Typography
                              variant="caption"
                              className="text-gray-500 font-medium"
                            >
                              {formatTimestamp(chat.timestamp)}
                            </Typography>
                            <div
                              className="px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
                              style={{
                                background: currentChatId === chat.id
                                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))'
                                  : 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                color: currentChatId === chat.id ? '#7c3aed' : '#6b7280',
                              }}
                            >
                              {chat.messageCount}
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </div>

      {/* Custom Styles
      <style jsx>{`
        .glass-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .glass-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 8px 0;
        }

        .glass-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .glass-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
        }
      `}</style> */}


      {/* Custom Styles */}
<style>
{`
  .glass-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .glass-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin: 8px 0;
  }

  .glass-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }

  .glass-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
  }
`}
</style>
    </div>
  );
};

export default ChatHistory;