import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { PanelLeftOpen } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  toggleFullScreen?: () => void;
  sidebarCollapsed?: boolean;
  onExpandSidebar?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  toggleFullScreen,
  sidebarCollapsed = false,
  onExpandSidebar,
}) => {
  const isFullScreen = useSelector((state: RootState) => state.chat.isFullScreen);

  const showLeft = !isFullScreen || sidebarCollapsed;

  return (

    <div
      className={`${isFullScreen
        ? "absolute top-0 left-0 right-0 z-10"
        : "relative w-full py-3"
        } flex items-center justify-between px-3 pt-2 pointer-events-none`}
    >
      {/* Left — only shown when sidebar is collapsed or not fullscreen */}
      <div className="flex items-center gap-2 pointer-events-auto mt-2">
        {!isFullScreen && (
          <div className="flex items-center justify-between w-full px-4  ">

            <div className="flex items-center gap-3">
              <img src="/ai-perf-agent/img/exgenix.png" className="h-7 w-auto" />
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                Waynautic AI
              </span>
            </div>

          </div>
        )}
        {showLeft && isFullScreen && sidebarCollapsed && (
          <>
            <Tooltip title="Expand sidebar" placement="bottom">
              <button
                onClick={onExpandSidebar}
                className="p-1.5 rounded-lg hover:backdrop-blur-sm hover:bg-white hover:shadow-sm hover:border hover:border-slate-200/60 text-gray-500 hover:text-gray-700 transition-all"
              >
                <PanelLeftOpen size={16} />
              </button>
            </Tooltip>


            <div className="flex items-center gap-3">
              <img src="/ai-perf-agent/img/exgenix.png" alt="Waynautic" className="h-7 w-auto" />
              <span className="font-bold text-lg text-slate-800 tracking-tight">Waynautic AI</span>
            </div>
          </>
        )}
      </div>

      {/* Right — always visible */}
      <div className="flex items-center gap-1.5 pointer-events-auto ml-auto mt-2 mr-5">
        {toggleFullScreen && (
          <Tooltip title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'} placement="bottom">
            <IconButton size="small" onClick={toggleFullScreen} sx={{
              width: 32, height: 32,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(203,213,225,0.6)',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              '&:hover': { background: 'white', borderColor: 'rgba(139,92,246,0.4)' },
            }}>
              {isFullScreen
                ? <CloseFullscreenIcon sx={{ fontSize: 15 }} className="text-purple-600" />
                : <OpenInFullIcon sx={{ fontSize: 15 }} className="text-purple-600" />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Close" placement="bottom">
          <IconButton size="small" onClick={onClose} sx={{
            width: 32, height: 32,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(203,213,225,0.6)',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            '&:hover': { background: 'white', borderColor: 'rgba(239,68,68,0.4)' },
          }}>
            <CloseIcon sx={{ fontSize: 15 }} className="text-red-500" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatHeader;
