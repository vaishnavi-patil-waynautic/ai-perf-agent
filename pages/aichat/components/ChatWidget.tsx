import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from '../pages/ChatWindow';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);


  console.log("New Chat Widget--------------------------------------------")

  return (
    <>
      {/* The Chat Window Popup */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip
          title={isOpen ? 'Close Chat' : 'Open AI Assistant'}
          arrow
          placement="left"
        >
          <Fab
            color="primary"
            aria-label="chat"
            onClick={() => setIsOpen(!isOpen)}
            className={`${
              isOpen
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-300`}
            size="large"
          >
            <ChatIcon
              className={
                isOpen
                  ? 'rotate-90 transition-transform'
                  : 'transition-transform'
              }
            />
          </Fab>
        </Tooltip>
      </div>
    </>
  );
};

export default ChatWidget;