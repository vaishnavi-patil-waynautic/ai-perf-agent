import React, { useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadChatHistories,
  loadChatMessages,
  createChat,
} from '../../store/slices/chat.thunk';
import { setCurrentChat } from '../../store/slices/chat.slice';

const ChatHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatHistories = useAppSelector((state) => state.chat.chatHistories);
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    dispatch(loadChatHistories());
  }, [dispatch]);

  const handleChatSelect = (chatId: string) => {
    dispatch(setCurrentChat(chatId));
    dispatch(loadChatMessages(chatId));
  };

  const handleNewChat = () => {
    dispatch(createChat());
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
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <Typography variant="h6" className="font-bold text-gray-800">
            Chat History
          </Typography>
          <Tooltip title="New Chat">
            <IconButton
              size="small"
              onClick={handleNewChat}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatHistories.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <ChatBubbleOutlineIcon className="mb-2 text-4xl" />
            <Typography variant="body2">No chat history yet</Typography>
          </div>
        ) : (
          <List className="p-2">
            {chatHistories.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem disablePadding className="mb-1">
                  <ListItemButton
                    selected={currentChatId === chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`rounded-lg ${
                      currentChatId === chat.id
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          className="font-semibold text-gray-800 truncate"
                        >
                          {chat.title}
                        </Typography>
                      }
                      secondary={
                        <div className="flex flex-col">
                          <Typography
                            variant="caption"
                            className="text-gray-500 truncate"
                          >
                            {chat.lastMessage}
                          </Typography>
                          <div className="flex justify-between items-center mt-1">
                            <Typography variant="caption" className="text-gray-400">
                              {formatTimestamp(chat.timestamp)}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-gray-400 bg-gray-200 px-2 py-0.5 rounded"
                            >
                              {chat.messageCount} msgs
                            </Typography>
                          </div>
                        </div>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;