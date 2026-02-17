import React from 'react';
import { IconButton, Typography, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface ChatHeaderProps {
  onClose: () => void;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  isFullScreen = false,
  toggleFullScreen,
}) => {
  return (
    <div className="bg-blue-50 border-b border-gray-200 flex-shrink-0">
      <div className="flex justify-between items-center p-3 px-4">
        <div className="flex items-center gap-2">
          <SmartToyIcon className="text-blue-600" />
          <Typography variant="subtitle2" className="font-bold text-gray-800">
            Waynautic AI Chatbot
          </Typography>
        </div>

        <div className="flex items-center gap-1">
          {toggleFullScreen && (
            <Tooltip title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}>
              <IconButton
                size="small"
                onClick={toggleFullScreen}
                className="text-gray-500 hover:text-blue-600"
              >
                {isFullScreen ? (
                  <CloseFullscreenIcon fontSize="small" />
                ) : (
                  <OpenInFullIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close Panel">
            <IconButton
              size="small"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;