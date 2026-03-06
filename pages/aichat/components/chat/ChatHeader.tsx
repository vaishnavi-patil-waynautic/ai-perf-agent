// import React from 'react';
// import { IconButton, Typography, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import OpenInFullIcon from '@mui/icons-material/OpenInFull';
// import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import { AppDispatch, RootState } from '@/store/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { Bot } from 'lucide-react';

// interface ChatHeaderProps {
//   onClose: () => void;
//   // isFullScreen?: boolean;
//   toggleFullScreen?: () => void;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({
//   onClose,
//   // isFullScreen = false,
//   toggleFullScreen,
// }) => {

  
//   const dispatch = useDispatch<AppDispatch>();
//   const isFullScreen = useSelector((state: RootState) => state.chat.isFullScreen)

//   return (
//     <div className="bg-blue-50 border-b border-gray-200 flex-shrink-0">
//       <div className="flex justify-between items-center p-3 px-4">
//         <div className="flex items-center gap-2">
//           {/* <SmartToyIcon className="text-blue-600" /> */}
//            <Bot color='blue' />
//           <Typography variant="subtitle2" className="font-bold text-gray-800">
//             Waynautic AI Chatbot
//           </Typography>
//         </div>

//         <div className="flex items-center gap-1">
//           {toggleFullScreen && (
//             <Tooltip title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}>
//               <IconButton
//                 size="small"
//                 onClick={toggleFullScreen}
//                 className="text-gray-500 hover:text-blue-600"
//               >
//                 {isFullScreen ? (
//                   <CloseFullscreenIcon fontSize="small" />
//                 ) : (
//                   <OpenInFullIcon fontSize="small" />
//                 )}
//               </IconButton>
//             </Tooltip>
//           )}
//           <Tooltip title="Close Panel">
//             <IconButton
//               size="small"
//               onClick={onClose}
//               className="text-gray-500 hover:text-red-500"
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;


import React from 'react';
import { IconButton, Typography, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Bot, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  toggleFullScreen?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  toggleFullScreen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFullScreen = useSelector((state: RootState) => state.chat.isFullScreen);

  return (
    <div className="relative flex-shrink-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Glass Container */}
      <div className="relative backdrop-blur-xl bg-white/50 border-b border-white/60 shadow-lg">
        <div className="flex justify-between items-center p-4 px-5">
          {/* Left Section - Bot Info */}
          <div className="flex items-center gap-3">
            {/* Bot Icon with Gradient Background */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="relative p-2 bg-gradient-to-br from-purple-200 to-blue-200 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Bot className="text-blue" color='blue' size={22} />
              </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Typography
                  variant="subtitle1"
                  className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                >
                  Waynautic AI
                </Typography>
                <Sparkles className="text-purple-500 animate-pulse" size={14} />
              </div>
              <div className="flex items-center gap-1.5">
                {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div> */}
                {/* <Typography variant="caption" className="text-gray-600 font-medium">
                  Online
                </Typography> */}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Full Screen Toggle */}
            {toggleFullScreen && (
              <Tooltip 
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'} 
                placement="bottom"
              >
                <IconButton
                  size="small"
                  onClick={toggleFullScreen}
                  className="group relative overflow-hidden"
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      // background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                      background: 'white',
                      border: '1.5px solid rgba(139, 92, 246, 0.4)',
                      // transform: 'scale(1.1) rotate(5deg)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
                    },
                  }}
                >
                  {isFullScreen ? (
                    <CloseFullscreenIcon 
                      fontSize="small" 
                      className="text-purple-600 transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <OpenInFullIcon 
                      fontSize="small" 
                      className="text-purple-600 transition-transform group-hover:scale-110"
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Close Button */}
            <Tooltip title="Close Panel" placement="bottom">
              <IconButton
                size="small"
                onClick={onClose}
                className="group relative overflow-hidden"
                sx={{
                  width: 36,
                  height: 36,
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                     background: 'white',
                    // background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))',
                    border: '1.5px solid rgba(239, 68, 68, 0.4)',
                    // transform: 'scale(1.1) rotate(90deg)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)',
                  },
                }}
              >
                <CloseIcon 
                  fontSize="small" 
                  className="text-red-500 transition-transform group-hover:scale-110"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Bottom Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-50"></div>
      </div>
    </div>
  );
};

export default ChatHeader;