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
  deleteByChatId,
} from '../../store/slices/chat.thunk';
import { setCurrentChat, clearMessages } from '../../store/slices/chat.slice';
import { RootState, store } from '@/store/store';
import { Delete, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { showSnackbar } from '@/store/snackbarStore';
import { PanelLeftClose } from 'lucide-react';
import { useSelector } from 'react-redux';

const ChatHistory: React.FC<{ collapsed?: boolean; onCollapse?: () => void }> = ({ collapsed = false, onCollapse }) => {
  const dispatch = useAppDispatch();
  const chatHistories = useAppSelector((state) => state.chat.chatHistories);
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);
  // isStreamingActive is now per-chat in chatMap, no global flag needed
    const { selectedProject } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    if(selectedProject){
      dispatch(loadChatHistories(selectedProject?.id));
    }
    
  }, [dispatch]);

  const handleChatSelect = (chatId: string) => {
    dispatch(setCurrentChat(chatId));
    // Load messages only if not already cached in chatMap
    const chatEntry = (store.getState() as any).chat?.chatMap?.[chatId];
    if (!chatEntry || chatEntry.messages.length === 0) {
      dispatch(loadChatMessages(chatId));
    }
  };

  const handleNewChat = () => {
    dispatch(setCurrentChat('0'));
  };

  const handleDelete = async (chatId: string) => {
    try {
      await dispatch(deleteByChatId(chatId)).unwrap();

      // optional: if current chat deleted → reset
      if (currentChatId === chatId) {
        dispatch(setCurrentChat(String(0))); // or '0' if that's your empty state
        dispatch(clearMessages());

      }

      dispatch(
        showSnackbar({
          message: `Chat Deleted successfully`,
          type: "success",
        })
      );

    } catch (err: any) {

      console.error("Delete failed:", err);

      dispatch(
        showSnackbar({
          message: err || err?.message || `Chat Deletion failed`,
          type: "error",
        })
      );
    }
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
    <div
      className="relative h-full flex flex-col bg-white border-r border-slate-100 overflow-hidden flex-shrink-0"
      style={{
        width: collapsed ? 0 : 288,
        minWidth: collapsed ? 0 : 288,
        opacity: collapsed ? 0 : 1,
        transition: 'width 280ms cubic-bezier(0.4,0,0.2,1), min-width 280ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
        pointerEvents: collapsed ? 'none' : 'auto',
      }}
    >
      <div className="p-4 flex flex-col h-full" style={{ width: 288 }}>

        {/* Header � logo + title + collapse + new chat */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <img src="/ai-perf-agent/img/exgenix.png" alt="Waynautic" className="h-7 w-auto" />
            <span className="font-bold text-lg text-slate-800 tracking-tight">Waynautic AI</span>
          </div>
          <div className="flex items-center gap-1">

            <button onClick={onCollapse} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Collapse sidebar">
              <PanelLeftClose size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl transition-all duration-200 mb-6 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          New Chat
        </button>




        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Recent Sessions</h3>
          {chatHistories.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-slate-300 text-sm font-medium italic">No history yet</p>
            </div>
          ) : (
            chatHistories.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${currentChatId === chat.id ? "bg-blue-50 text-blue-700 shadow-sm" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                  <MessageSquare size={15} className={`flex-shrink-0 ${currentChatId === chat.id ? "text-blue-500" : "text-slate-400"}`} />
                  <span className="truncate text-sm">{chat.title || "New Chat"}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#cbd5e1}`}</style>
    </div>
  );

};

export default ChatHistory;
