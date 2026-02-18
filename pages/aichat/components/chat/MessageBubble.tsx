import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ChatMessage } from '../../types/chat.types';
import { useAppDispatch } from '../../store/hooks';
import { toggleMessageReaction } from '../../store/slices/chat.slice';
import ChatResponseCard from './ChatResponseCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const dispatch = useAppDispatch();
  const [copySuccess, setCopySuccess] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopySuccess(true);
  };

  const handleReaction = (reaction: 'like' | 'dislike') => {
    dispatch(toggleMessageReaction({ messageId: message.id, reaction }));
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <SmartToyIcon className="text-white text-sm" />
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
          }`}
        >
          {message.type === 'text' && (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          )}
          {message.type === 'image' && (
            <img
              src={message.content}
              alt="Response"
              className="max-w-full rounded-lg"
            />
          )}
          {message.type === 'diagram' && (
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {message.content}
              </pre>
            </div>
          )}


{/* ✅ Add this */}
{message.type === 'visualization' && message.data && (
  <ChatResponseCard data={message.data} />
)}
        </div>

        {/* Action Buttons - Only for bot messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1">
            <Tooltip title="Like">
              <IconButton
                size="small"
                onClick={() => handleReaction('like')}
                className="hover:bg-gray-100"
              >
                {message.liked ? (
                  <ThumbUpIcon fontSize="small" className="text-blue-600" />
                ) : (
                  <ThumbUpOutlinedIcon fontSize="small" className="text-gray-400" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Dislike">
              <IconButton
                size="small"
                onClick={() => handleReaction('dislike')}
                className="hover:bg-gray-100"
              >
                {message.disliked ? (
                  <ThumbDownIcon fontSize="small" className="text-red-600" />
                ) : (
                  <ThumbDownOutlinedIcon fontSize="small" className="text-gray-400" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Copy">
              <IconButton
                size="small"
                onClick={handleCopy}
                className="hover:bg-gray-100"
              >
                <ContentCopyIcon fontSize="small" className="text-gray-400" />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <span className="text-xs text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <PersonIcon className="text-white text-sm" />
        </div>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default MessageBubble;