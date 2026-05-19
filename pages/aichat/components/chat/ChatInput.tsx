import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendMessage, sendMessageWithStreaming } from '../../store/slices/chat.thunk';
import { setSelectedModel } from '../../store/slices/chat.slice';
import { RootState } from '@/store/store';
import { Rocket, Brain, Sparkles } from "lucide-react";
import { abortStream } from '../../store/slices/chat.thunk';
import { showSnackbar } from '@/store/snackbarStore';

import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BoltIcon from '@mui/icons-material/Bolt';
import { fetchModels } from '../../../settings/store/aiModel.thunk';

const iconStyle = { fontSize: 16, color: '#7c3aed' };

export const getModelIcon = (provider: string) => {
  switch (provider?.toLowerCase()) {
    case 'openai':
      return <SmartToyIcon sx={iconStyle} />;
    case 'claude':
      return <PsychologyIcon sx={iconStyle} />;
    case 'gemini':
      return <AutoAwesomeIcon sx={iconStyle} />;
    default:
      return <BoltIcon sx={iconStyle} />;
  }
};

interface ChatInputProps {
  inputValue?: string;
  onInputChange?: (val: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, onInputChange }) => {
  const dispatch = useAppDispatch();
  const [localInput, setLocalInput] = useState('');
  const input = inputValue !== undefined ? inputValue : localInput;
  const setInput = (val: string) => {
    if (onInputChange) onInputChange(val);
    else setLocalInput(val);
  };
  const [isFocused, setIsFocused] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const models = useAppSelector((state: RootState) => state.aiModel.models);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);
  const isStreamingActive = useAppSelector((s) => s.chat.activeStreamId !== null);
  const activeStreamId = useAppSelector((s) => s.chat.activeStreamId);
  const currentChatId = useAppSelector((s) => s.chat.currentChatId);
  const chatHistories = useAppSelector((s) => s.chat.chatHistories);
  const hasModels = models.length > 0;
  const isModelSelected = !!selectedModel;

  // Only freeze input if THIS chat is currently streaming
  const isCurrentChatStreaming = useAppSelector((s) => {
    const cid = s.chat.currentChatId;
    const key = (!cid || cid === '0') ? 'new' : cid;
    return s.chat.chatMap[key]?.isStreaming ?? false;
  });
  const { selectedProject } = useAppSelector((state: RootState) => state.project);


  /* ---------------- FAQ LIST ⭐ ---------------- */
  const faqList = [
    "Is the application ready for deployment?",
    "Generate Load Test Strategy",
    "Show latest performance data",
    "Show last build results",
    "Explain JMX scripting basics",
    "How to optimize database queries?",
    "Analyze error logs",
    "What are NFR best practices?"
  ];

  /* ---------------- LIVE MATCH DETECTION ⭐ ---------------- */
  const matchedFAQ = useMemo(() => {
    if (!input.trim()) return null;

    const STOP_WORDS = ["is", "the", "are", "what", "how", "to", "for", "a", "an"];

    const inputWords = input
      .toLowerCase()
      .split(/\s+/)
      .filter(w => !STOP_WORDS.includes(w));

    let bestMatch = null;
    let bestScore = 0;

    for (const faq of faqList) {
      const faqWords = faq
        .toLowerCase()
        .split(/\s+/)
        .filter(w => !STOP_WORDS.includes(w));

      let score = 0;

      for (const word of inputWords) {
        if (faqWords.includes(word)) {
          score++;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    return bestScore > 0 ? bestMatch : null;
  }, [input]);

  const hasCheckedOnce = useRef(false);

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(fetchModels(selectedProject.id));
      hasCheckedOnce.current = false;
    }
  }, [dispatch, selectedProject?.id]);

  useEffect(() => {
    if (
      models.length &&
      !models.find(m => String(m.id) === String(selectedModel))
    ) {
      dispatch(setSelectedModel(String(models[0].id)));
    }
  }, [models]);

  useEffect(() => {
    // skip first empty state before API responds
    if (!hasCheckedOnce.current) {
      hasCheckedOnce.current = true;
      return;
    }

    if (selectedProject?.id && models.length === 0) {
      dispatch(showSnackbar({
        message: 'No model available for this project. Please add a model.',
        type: 'error',
      }));
    }
  }, [models, selectedProject?.id, dispatch]);


  const handleAbort = () => {
    if (activeStreamId) {
      dispatch(abortStream(activeStreamId));
    }
  };

  const handleSend = () => {
    if (!hasModels) {
      dispatch(showSnackbar({
        message: 'No model available for this project. Please add a model.',
        type: 'error',
      }));
      return;
    }

    if (!selectedModel) {
      dispatch(showSnackbar({
        message: 'Please select a model.',
        type: 'error',
      }));
      return;
    }

    if (input.trim()) {

      console.log("Sending message 1---------------------------------");
      dispatch(sendMessageWithStreaming({
        text: input.trim(),
        modelId: selectedModel,
        onStatus: (msg) => setStreamStatus(msg),
      })).unwrap().then(() => {
        setStreamStatus('');
      }).catch((err: any) => {
        setStreamStatus('');
        dispatch(showSnackbar({
          message: err?.message || err?.error || 'Failed to send message',
          type: 'error',
        }));
      });
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    // <div className={`relative ${isFullScreen ? 'px-[280px] py-4' : 'p-4'}`}>

    <div
      className={`relative py-4 w-full ${isFullScreen ? 'px-8' : 'px-4'}`}
    >
      <div className={`relative group ${isFullScreen ? 'w-full max-w-4xl mx-auto' : 'w-full'}`}>
        {/* Animated Ring Background */}
        <div className="absolute -inset-[2px] rounded-[30px] overflow-hidden opacity-100 transition-opacity duration-500">
          <div
            style={{
              width: '200%',
              aspectRatio: '1/1',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 120deg, #93c5fd 150deg, #2563eb 180deg, #60a5fa 210deg, transparent 240deg, transparent 360deg)',
              animation: 'spinRing 5s linear infinite',
            }}
          />
          <style>{`@keyframes spinRing { to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>
        </div>

        {/* <div className={isFullScreen ? "w-full max-w-5xl" : "w-full"}> */}
        <div className="w-full">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-50/50 via-blue-50/30 to-transparent pointer-events-none"></div>

          {/* Glass Container */}
          <div className="relative bg-white rounded-[28px] p-4 border border-slate-100 focus-within:border-transparent transition-all shadow-sm group-focus-within:shadow-lg"> {/* <div className="flex items-end gap-3"> */}
            <div className="flex items-end gap-3 w-full min-w-0">

              <FormControl size="small" sx={{ flexShrink: 0 }}>
                <Tooltip title="Select AI Model" placement="top">
                  <Select
                    value={selectedModel}
                    onChange={(e) => dispatch(setSelectedModel(e.target.value))}
                    variant="outlined"

                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '20px',
                      background: '#eff6ff',
                      border: '1px solid #dbeafe',
                      transition: 'all 0.2s ease',
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 !important",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                      },
                      '&:hover': {
                        background: '#dbeafe',
                      },
                    }}
                    IconComponent={() => null}


                    renderValue={(selected) => {
                      const m = models.find((x) => String(x.name) === String(selected));
                      return (
                        <div className="flex items-center justify-center">
                          {m ? getModelIcon(m.provider) : <Brain size={16} />}
                        </div>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          marginTop: '8px',
                          borderRadius: '16px',
                          backdropFilter: 'blur(20px)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1.5px solid rgba(139, 92, 246, 0.2)',
                          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.15)',
                          overflow: 'hidden',
                          '& .MuiList-root': {
                            padding: '8px',
                          },
                        },
                      },
                    }}
                  >

                    {models.length === 0 ? (
                      <MenuItem disabled>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#3e0202',
                            fontStyle: 'italic',
                          }}
                        >
                          No model available
                        </span>
                      </MenuItem>
                    ) : (
                      models.map((model) => (
                        <MenuItem
                          key={model.id}
                          value={model.name}
                          sx={{
                            borderRadius: '12px',
                            margin: '4px 0',
                            padding: '12px 16px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: selectedModel === model.name
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))'
                              : 'transparent',
                            border: selectedModel === model.name
                              ? '1.5px solid rgba(139, 92, 246, 0.3)'
                              : '1.5px solid transparent',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                              transform: 'translateX(4px)',
                              border: '1.5px solid rgba(139, 92, 246, 0.2)',
                            },
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12, width: '100%' }}>
                            <div
                              className="flex items-center justify-center"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                background: 'rgba(139, 92, 246, 0.05)',
                              }}
                            >
                              {getModelIcon(model.provider)}
                            </div>

                            <span className="font-semibold text-sm text-gray-700">
                              {model.name}
                            </span>
                          </div>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </Tooltip>
              </FormControl>

              <div className="flex-1 relative min-w-0">
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  variant="outlined"
                  size="small"

                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: 'transparent',
                      borderRadius: '0px',
                      border: 'none',
                      boxShadow: 'none',
                      "& fieldset": {
                        border: 'none',
                      },
                      '&:hover': {
                        background: 'transparent',
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: '12px 0',
                      fontSize: '16px',
                      color: '#334155',
                      lineHeight: '1.5',
                    }
                  }}
                />

                {/* Animated Glow Effect on Focus */}
                {isFocused && (
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-sm opacity-20 -z-10 animate-pulse"
                    style={{ pointerEvents: 'none' }}
                  ></div>
                )}
              </div>

              {/* Send Button with Glass Effect */}
              <span>

                <Tooltip
                  title={isCurrentChatStreaming ? "Stop generating" : "Send message"}
                  placement="top"
                >
                  <span>
                    <IconButton
                      onClick={isCurrentChatStreaming ? handleAbort : handleSend}
                      disabled={
                        !isCurrentChatStreaming &&
                        (
                          !input.trim() ||
                          isLoading

                        )
                      }

                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        background: (!input.trim() || isLoading) && !isCurrentChatStreaming
                          ? '#f1f5f9'
                          : isCurrentChatStreaming
                            ? '#fecaca'
                            : '#2563eb',
                        color: (!input.trim() || isLoading) && !isCurrentChatStreaming
                          ? '#cbd5f5'
                          : 'white',
                        '&:hover': {
                          background: isCurrentChatStreaming
                            ? '#ef4444'
                            : (!input.trim() || isLoading)
                              ? '#f1f5f9'
                              : '#1d4ed8',
                        },
                      }}
                    >
                      {isCurrentChatStreaming ? (
                        // STOP ICON
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      ) : (
                        <SendIcon
                          sx={{
                            color: (!input.trim() || isLoading) ? '#9ca3af' : 'white',
                          }}
                        />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>


              </span>
            </div>

            {/* FAQ Suggestion with Glass Effect */}
            {matchedFAQ && !streamStatus && (
              <div
                className="mt-3 animate-slideDown"
                style={{
                  animation: 'slideDown 0.3s ease-out',
                }}
              >
                <Chip
                  label={`💡 Suggested: ${matchedFAQ}`}
                  clickable
                  onClick={() => setInput(matchedFAQ)}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(16, 185, 129, 0.3)',
                    color: '#059669',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '6px 4px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)',
                    },
                  }}
                />
              </div>
            )}

            {/* Streaming Status Indicator */}
            {streamStatus && (
              <div
                className="mt-3 animate-slideDown flex items-center gap-2"
                style={{
                  animation: 'slideDown 0.3s ease-out',
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm text-blue-700 font-medium">{streamStatus}</span>
                </div>
              </div>
            )}
          </div>

          {/* Animation Keyframes */}
          <style >{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
      </div>

    </div>
  );
};

export default ChatInput;
