// // // import React, { useState } from 'react';
// // // import {
// // //   TextField,
// // //   IconButton,
// // //   Select,
// // //   MenuItem,
// // //   FormControl,
// // //   Tooltip,
// // // } from '@mui/material';
// // // import SendIcon from '@mui/icons-material/Send';
// // // import { useAppDispatch, useAppSelector } from '../../store/hooks';
// // // import { sendMessage } from '../../store/slices/chat.thunk';
// // // import { setSelectedModel } from '../../store/slices/chat.slice';
// // // import { RootState } from '@/store/store';
// // // import { Rocket, Brain, Sparkles } from "lucide-react";

// // // interface ChatInputProps {
// // //   // isFullScreen: boolean;
// // // }

// // // const ChatInput: React.FC<ChatInputProps> = () => {
// // //   const dispatch = useAppDispatch();
// // //   const [input, setInput] = useState('');
// // //   const selectedModel = useAppSelector((state) => state.chat.selectedModel);
// // //   const isLoading = useAppSelector((state) => state.chat.isLoading);

// // //   const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen)


// // //   const models = [
// // //     { id: "gpt-4", name: "GPT-4", icon: <Rocket size={16} /> },
// // //     { id: "claude-3", name: "Claude 3", icon: <Brain size={16} /> },
// // //     { id: "gemini", name: "Gemini Pro", icon: <Sparkles size={16} /> },
// // //   ];

// // //   const handleSend = () => {
// // //     if (input.trim()) {
// // //       dispatch(sendMessage({ text: input.trim(), modelId: selectedModel }));
// // //       setInput('');
// // //     }
// // //   };

// // //   const handleKeyPress = (e: React.KeyboardEvent) => {
// // //     if (e.key === 'Enter' && !e.shiftKey) {
// // //       e.preventDefault();
// // //       handleSend();
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       className={`bg-white border-t border-gray-200 flex-shrink-0 ${isFullScreen ? 'px-[280px] py-4' : 'p-3'
// // //         }`}
// // //     >
// // //       <div className="flex items-end gap-2">
// // //         {/* <FormControl size="small" className="min-w-[120px]">
// // //           <Select
// // //             value={selectedModel}
// // //             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// // //             className="bg-gray-50"
// // //           >
// // //             {models.map((model) => (
// // //               <MenuItem key={model.id} value={model.id}>
// // //                 {model.name}
// // //               </MenuItem>
// // //             ))}
// // //           </Select>
// // //         </FormControl> */}

// // //         {/* <FormControl size="small" className="min-w-[52px]">
// // //           <Select
// // //             value={selectedModel}
// // //             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// // //             className="bg-gray-50"

// // //             /* SHOW ONLY ICON WHEN CLOSED
// // //             renderValue={(selected) => {
// // //               const m = models.find(x => x.id === selected);
// // //               return <div className="flex items-center">{m?.icon}</div>;
// // //             }}

// // //             MenuProps={{
// // //               PaperProps: {
// // //                 style: { minWidth: 180 },
// // //               },
// // //             }}
// // //           >
// // //             {models.map((model) => (
// // //               <MenuItem key={model.id} value={model.id}>
// // //                 <div className="flex items-center gap-2">
// // //                   {model.icon}
// // //                   <span>{model.name}</span>
// // //                 </div>
// // //               </MenuItem>
// // //             ))}
// // //           </Select>
// // //         </FormControl> */}

// // //         <FormControl size="small">
// // //   <Select
// // //     value={selectedModel}
// // //     onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// // //     variant="outlined"

// // //     sx={{
// // //       width: 40,
// // //       height: 40,
// // //       "& .MuiSelect-select": {
// // //         display: "flex",
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         padding: "8px !important",
// // //       },
// // //       "& fieldset": {
// // //         borderColor: "#e5e7eb",
// // //       },
// // //     }}

// // //     IconComponent={() => null} // ❌ removes dropdown arrow

// // //     renderValue={(selected) => {
// // //       const m = models.find((x) => x.id === selected);
// // //       return m?.icon;
// // //     }}

// // //     MenuProps={{
// // //       PaperProps: {
// // //         sx: { minWidth: 180 },
// // //       },
// // //     }}
// // //   >
// // //     {models.map((model) => (
// // //       <MenuItem key={model.id} value={model.id}>
// // //         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// // //           {model.icon}
// // //           {model.name}
// // //         </div>
// // //       </MenuItem>
// // //     ))}
// // //   </Select>
// // // </FormControl>

// // //         <TextField
// // //           fullWidth
// // //           multiline
// // //           maxRows={4}
// // //           placeholder="Type your message..."
// // //           value={input}
// // //           onChange={(e) => setInput(e.target.value)}
// // //           onKeyPress={handleKeyPress}
// // //           disabled={isLoading}
// // //           variant="outlined"
// // //           size="small"
// // //           className="bg-gray-50"
// // //         />

// // //         <Tooltip title="Send">
// // //           <span>
// // //             <IconButton
// // //               color="primary"
// // //               onClick={handleSend}
// // //               disabled={!input.trim() || isLoading}
// // //               className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
// // //             >
// // //               <SendIcon />
// // //             </IconButton>
// // //           </span>
// // //         </Tooltip>
// // //       </div>

// // //       <div className="text-xs text-gray-400 mt-2 text-center">
// // //         Press Enter to send, Shift+Enter for new line
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ChatInput;


// // import React, { useState, useMemo } from 'react';
// // import {
// //   TextField,
// //   IconButton,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   Tooltip,
// //   Chip,
// // } from '@mui/material';
// // import SendIcon from '@mui/icons-material/Send';
// // import { useAppDispatch, useAppSelector } from '../../store/hooks';
// // import { sendMessage } from '../../store/slices/chat.thunk';
// // import { setSelectedModel } from '../../store/slices/chat.slice';
// // import { RootState } from '@/store/store';
// // import { Rocket, Brain, Sparkles } from "lucide-react";

// // const ChatInput: React.FC = () => {
// //   const dispatch = useAppDispatch();
// //   const [input, setInput] = useState('');
// //   const selectedModel = useAppSelector((state) => state.chat.selectedModel);
// //   const isLoading = useAppSelector((state) => state.chat.isLoading);
// //   const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
// //   const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);



// //   console.log("ChatPanel chat is loading : ", chatLoading, " ")


// //   /* ---------------- FAQ LIST ⭐ ---------------- */
// //   const faqList = [
// //     "How to fix 504 Gateway errors?",
// //     "Generate Load Test Strategy",
// //     "Show latest performance data",
// //     "Show last build results",
// //     "Explain JMX scripting basics",
// //     "How to optimize database queries?",
// //     "Analyze error logs",
// //     "What are NFR best practices?"
// //   ];

// //   /* ---------------- LIVE MATCH DETECTION ⭐ ---------------- */
// //   const matchedFAQ = useMemo(() => {
// //     if (!input.trim()) return null;

// //     const lowerInput = input.toLowerCase();

// //     return faqList.find(faq =>
// //       faq.toLowerCase().split(" ").some(word =>
// //         lowerInput.includes(word)
// //       )
// //     ) || null;

// //   }, [input]);

// //   const handleSend = () => {
// //     if (input.trim()) {
// //       dispatch(sendMessage({ text: input.trim(), modelId: selectedModel }));
// //       setInput('');
// //     }
// //   };

// //   const handleKeyPress = (e: React.KeyboardEvent) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend();
// //     }
// //   };

// //   const models = [
// //     { id: "gpt-4", name: "GPT-4", icon: <Rocket size={16} /> },
// //     { id: "claude-3", name: "Claude 3", icon: <Brain size={16} /> },
// //     { id: "gemini", name: "Gemini Pro", icon: <Sparkles size={16} /> },
// //   ];

// //   return (
// //     <div className={`bg-white border-t border-gray-200 flex-shrink-0 ${isFullScreen ? 'px-[280px] py-4' : 'p-3'}`}>

// //       <div className="flex items-end gap-2">

// //         {/* Model Selector */}
// //         <FormControl size="small">
// //           <Select
// //             value={selectedModel}
// //             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// //             variant="outlined"
// //             sx={{
// //               width: 40,
// //               height: 40,
// //               "& .MuiSelect-select": {
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 padding: "8px !important",
// //               },
// //             }}
// //             IconComponent={() => null}
// //             renderValue={(selected) => {
// //               const m = models.find((x) => x.id === selected);
// //               return m?.icon;
// //             }}
// //           >
// //             {models.map((model) => (
// //               <MenuItem key={model.id} value={model.id}>
// //                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //                   {model.icon}
// //                   {model.name}
// //                 </div>
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>

// //         {/* Text Input ⭐ */}
// //         <TextField
// //           fullWidth
// //           multiline
// //           maxRows={4}
// //           placeholder="Type your message..."
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyPress={handleKeyPress}
// //           // disabled={isLoading}
// //           variant="outlined"
// //           size="small"
// //           className="bg-gray-50"

// //           /* ⭐ Highlight border if matched */
// //           sx={{
// //             "& .MuiOutlinedInput-root": {
// //               borderColor: matchedFAQ ? "#10b981" : undefined,
// //               "& fieldset": {
// //                 borderColor: matchedFAQ ? "#10b981" : undefined,
// //               },
// //             },
// //           }}
// //         />

// //         <Tooltip title="Send">
// //           <span>
// //             <IconButton
// //               color="primary"
// //               onClick={handleSend}
// //               disabled={!input.trim() || isLoading || chatLoading}
// //               className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
// //             >
// //               <SendIcon />
// //             </IconButton>
// //           </span>
// //         </Tooltip>
// //       </div>

// //       {/* ⭐ FAQ Suggestion */}
// //       {matchedFAQ && (
// //         <div className="mt-2">
// //           <Chip
// //             label={`Suggested: ${matchedFAQ}`}
// //             color="success"
// //             variant="outlined"
// //             clickable
// //             onClick={() => setInput(matchedFAQ)}
// //           />
// //         </div>
// //       )}

// //       <div className="text-xs text-gray-400 mt-2 text-center">
// //         Press Enter to send, Shift+Enter for new line
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatInput;


import React, { useState, useMemo, useEffect } from 'react';
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

const ChatInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const models = useAppSelector((state: RootState) => state.aiModel.models);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);
  const isStreamingActive = useAppSelector((s) => s.chat.isStreamingActive);
  const activeStreamId = useAppSelector((s) => s.chat.activeStreamId);

  console.log("ChatPanel chat is loading : ", chatLoading, " ");

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

  useEffect(() => {
    if (!models.length) {
      dispatch(fetchModels());
    }
  }, [dispatch]);

  useEffect(() => {
    if (models.length && !models.find(m => String(m.id) === String(selectedModel))) {
      dispatch(setSelectedModel(String(models[0].id)));
    }
  }, [models]);

  const handleAbort = () => {
    if (activeStreamId) {
      dispatch(abortStream(activeStreamId));
    }
  };

  const handleSend = () => {

    console.log("Sending chat request-----------------------------------------------");

    if (input.trim()) {
      // Use streaming version
      dispatch(sendMessageWithStreaming({
        text: input.trim(),
        modelId: selectedModel,
        onStatus: (msg) => setStreamStatus(msg)
      })).then(() => {
        // Clear status when done
        setStreamStatus('');
      }).catch(() => {
        // Clear status on error too
        setStreamStatus('');
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
      className={`relative py-4 w-full ${isFullScreen
        ? 'px-4 flex justify-center'
        : 'px-4'
        }`}
    >
      {/* <div className={isFullScreen ? "w-full max-w-5xl" : "w-full"}> */}
      <div className={isFullScreen ? "w-full max-w-3xl mx-auto" : "w-full"}>
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-50/50 via-blue-50/30 to-transparent pointer-events-none"></div>

        {/* Glass Container */}
        <div className="relative backdrop-blur-md bg-white/60 rounded-2xl border border-white/60 shadow-xl p-4 transition-all duration-300">
          {/* <div className="flex items-end gap-3"> */}
          <div className="flex items-end gap-3 w-full min-w-0">
            {/* Model Selector with Glass Effect */}
            {/* <FormControl size="small">
            <Tooltip title="Select AI Model" placement="top">
              <Select
                value={selectedModel}
                onChange={(e) => dispatch(setSelectedModel(e.target.value))}
                variant="outlined"
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 'none',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
                  },
                }}
                IconComponent={() => null}
                renderValue={(selected) => {
                  const m = models.find((x) => x.id === selected);
                  return <div className="text-purple-600">{m?.icon}</div>;
                }}
              >
                {models.map((model) => (
                  <MenuItem 
                    key={model.id} 
                    value={model.id}
                    sx={{
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                      },
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="text-purple-600">{model.icon}</span>
                      <span className="font-medium">{model.name}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </FormControl> */}

            <FormControl size="small" sx={{ flexShrink: 0 }}>
              <Tooltip title="Select AI Model" placement="top">
                <Select
                  value={selectedModel}
                  onChange={(e) => dispatch(setSelectedModel(e.target.value))}
                  variant="outlined"
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px !important",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: 'none',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
                    },
                  }}
                  IconComponent={() => null}
                  // renderValue={(selected) => {
                  //   // const m = models.find((x) => x.id === selected);
                  //   const m = models.find((x) => String(x.id) === String(selected));
                  //   return <div className="text-purple-600">{m?.icon || <Brain size={16} />}</div>;
                  // }}

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
                  {models.map((model) => (
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
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
                          border: '1.5px solid rgba(139, 92, 246, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                          },
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
                            background: selectedModel === model.name
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))'
                              : 'rgba(139, 92, 246, 0.05)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span className={selectedModel === model.name ? "text-purple-600" : "text-purple-500"}>
                            {/* {model?.icon || <Brain size={16} />} */}
                            {getModelIcon(model.provider)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className={`font-semibold text-sm ${selectedModel === model.name
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
                            : 'text-gray-700'
                            }`}>
                            {model.name}
                          </span>
                        </div>
                        {selectedModel === model.name && (
                          <div className="ml-auto">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="text-purple-600"
                            >
                              <path
                                d="M13.5 4.5L6 12L2.5 8.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>
            </FormControl>

            {/* Text Input with Glass Effect */}
            {/* <div className="flex-1 relative"> */}
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
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '14px',
                    transition: 'all 0.3s ease',
                    border: matchedFAQ
                      ? '2px solid rgba(16, 185, 129, 0.5)'
                      : isFocused
                        ? '2px solid rgba(139, 92, 246, 0.4)'
                        : '1.5px solid rgba(255, 255, 255, 0.6)',
                    "& fieldset": {
                      border: 'none',
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.7)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
                    },
                    // '&.Mui-focused': {
                    //   background: 'rgba(255, 255, 255, 0.8)',
                    //   boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
                    // },
                  },
                  // "& .MuiInputBase-input": {
                  //   padding: '12px 16px',
                  //   fontSize: '14px',
                  //   color: '#1f2937',
                  //   '&::placeholder': {
                  //     color: '#9ca3af',
                  //     opacity: 1,
                  //   },
                  // },
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
                title={isStreamingActive ? "Stop generating" : "Send message"}
                placement="top"
              >
                <span>
                  <IconButton
                    onClick={isStreamingActive ? handleAbort : handleSend}
                    disabled={!isStreamingActive && (!input.trim() || isLoading)}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: isStreamingActive
                        ? 'linear-gradient(135deg, #fecaca, #f87171)' // red
                        : (!input.trim() || isLoading
                          ? 'rgba(209, 213, 219, 0.5)'
                          : 'linear-gradient(135deg, #8b5cf6, #3b82f6)'),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: isStreamingActive
                          ? 'linear-gradient(135deg, #f87171, #ef4444)'
                          : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        boxShadow: isStreamingActive
                          ? '0 8px 24px rgba(239,68,68,0.4)'
                          : '0 8px 24px rgba(139,92,246,0.4)',
                      },
                    }}
                  >
                    {isStreamingActive ? (
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

              {/* <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isStreamingActive}
                  className="group relative overflow-hidden"
                  sx={{
                    width: 48,
                    height: 48,
                    background: !input.trim() || isLoading || isStreamingActive
                      ? 'rgba(209, 213, 219, 0.5)'
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 1), rgba(59, 130, 246, 1))',
                      transform: 'scale(1) ',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                    },
                    // '&:active:not(:disabled)': {
                    //   transform: 'scale(0.95)',
                    // },
                    '&:disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  <SendIcon
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    sx={{
                      color: !input.trim() || isLoading || isStreamingActive ? '#9ca3af' : 'white',
                      fontSize: 20,
                    }}
                  />
                </IconButton> */}
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

          {/* Helper Text */}
          <div className="text-xs text-gray-500 mt-3 text-center font-medium">
            <span className="inline-flex items-center gap-2">
              <kbd className="px-2 py-0.5 bg-white/60 border border-white/60 rounded shadow-sm font-mono">
                Enter
              </kbd>
              to send •
              <kbd className="px-2 py-0.5 bg-white/60 border border-white/60 rounded shadow-sm font-mono">
                Shift + Enter
              </kbd>
              for new line
            </span>
          </div>
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
  );
};

export default ChatInput;


// /**
//  * ChatInput.tsx
//  *
//  * Adds to your existing ChatInput:
//  *   1. Abort button — replaces Send while isStreamingActive is true
//  *   2. FAQ fuzzy matching — ranks FAQs by query similarity as user types
//  *   3. model_name flows through sendMessageWithStreaming via Redux selectedModel
//  *
//  * The model selector dropdown was already in your original ChatInput via
//  * setSelectedModel / selectedModel from Redux. It is preserved here unchanged.
//  */

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { IconButton, Tooltip, MenuItem, Select, SelectChangeEvent } from '@mui/material';
// import SendIcon               from '@mui/icons-material/Send';
// import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { setSelectedModel }               from '../../store/slices/chat.slice';
// import { sendMessageWithStreaming, abortStream } from '../../store/slices/chat.thunk';
// import { FAQ } from '../../types/chat.types';
// import { getModelConfig } from '../Modelconfig';  // for icon next to model name
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';



// /* ── FAQ fuzzy scoring ───────────────────────────────────────────────────────
//    Returns 0–1 score. Blend of:
//      word overlap   (70%) — fraction of query words present in the FAQ
//      bigram overlap (30%) — character-level similarity for typo tolerance
// ───────────────────────────────────────────────────────────────────────────── */
// function scoreFAQ(query: string, faq: FAQ): number {
//   if (!query.trim()) return 0;

//   const q  = query.toLowerCase().trim();
//   const fq = faq.question.toLowerCase();

//   if (fq.includes(q)) return 1;                     // exact substring → top rank

//   const qWords  = q.split(/\s+/).filter(Boolean);
//   const fqWords = fq.split(/\s+/).filter(Boolean);
//   if (!qWords.length) return 0;

//   const wordScore =
//     qWords.filter((w) => fqWords.some((fw) => fw.includes(w) || w.includes(fw))).length
//     / qWords.length;

//   const bigrams = (s: string) => {
//     const set = new Set<string>();
//     for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
//     return set;
//   };
//   const qBi = bigrams(q);
//   const fBi = bigrams(fq);
//   let shared = 0;
//   qBi.forEach((b) => { if (fBi.has(b)) shared++; });
//   const bigramScore = (2 * shared) / (qBi.size + fBi.size + 0.001);

//   return wordScore * 0.7 + bigramScore * 0.3;
// }

// const MIN_FAQ_SCORE  = 0.15;
// const MAX_FAQ_SHOWN  = 4;

// import SmartToyIcon from '@mui/icons-material/SmartToy'; // OpenAI
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Gemini
// import PsychologyIcon from '@mui/icons-material/Psychology'; // Claude
// import BoltIcon from '@mui/icons-material/Bolt'; // Mistral / fast models

// const iconStyle = { fontSize: 16, color: '#2563eb' }; // blue-600

// export const getModelIcon = (provider: string) => {
//   switch (provider?.toLowerCase()) {
//     case 'openai':
//       return <SmartToyIcon sx={iconStyle} />;
//     case 'claude':
//       return <PsychologyIcon sx={iconStyle} />;
//     case 'gemini':
//       return <AutoAwesomeIcon sx={iconStyle} />;
//     default:
//       return <BoltIcon sx={iconStyle} />;
//   }
// };

// /* ── Component ───────────────────────────────────────────────────────────── */
// const ChatInput: React.FC = () => {
//   const dispatch          = useAppDispatch();
//   const faqs              = useAppSelector((s) => s.chat.faqs);
//   const selectedModel     = useAppSelector((s) => s.chat.selectedModel);
//   const isStreamingActive = useAppSelector((s) => s.chat.isStreamingActive);
//   const activeStreamId    = useAppSelector((s) => s.chat.activeStreamId);
//   const chatLoading       = useAppSelector((s) => s.chat.chatLoading);
//   const models = useSelector((state: RootState) => state.aiModel.models);

//   const [text,        setText]        = useState('');
//   const [suggestions, setSuggestions] = useState<FAQ[]>([]);
//   const [showSugg,    setShowSugg]    = useState(false);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   /* ── FAQ suggestions ──────────────────────────────────────────────────── */
//   useEffect(() => {
//     const trimmed = text.trim();
//     if (!trimmed || trimmed.length < 2) { setSuggestions([]); return; }

//     const ranked = faqs
//       .map((faq) => ({ faq, score: scoreFAQ(trimmed, faq) }))
//       .filter(({ score }) => score >= MIN_FAQ_SCORE)
//       .sort((a, b) => b.score - a.score)
//       .slice(0, MAX_FAQ_SHOWN)
//       .map(({ faq }) => faq);

//     setSuggestions(ranked);
//   }, [text, faqs]);

//   /* ── Auto-grow textarea ───────────────────────────────────────────────── */
//   useEffect(() => {
//     const ta = textareaRef.current;
//     if (!ta) return;
//     ta.style.height = 'auto';
//     ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
//   }, [text]);

//   /* ── Handlers ─────────────────────────────────────────────────────────── */
//   const handleSend = useCallback(() => {
//     const msg = text.trim();
//     if (!msg || chatLoading || isStreamingActive) return;
//     setText('');
//     setSuggestions([]);
//     setShowSugg(false);
//     dispatch(sendMessageWithStreaming({ text: msg, modelId: selectedModel }));
//   }, [text, chatLoading, isStreamingActive, selectedModel, dispatch]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
//   };

//   const handleAbort = () => {
//     if (activeStreamId) dispatch(abortStream(activeStreamId));
//   };

//   const handleModelChange = (e: SelectChangeEvent) => {
//     dispatch(setSelectedModel(e.target.value));
//   };

//   const handleSuggestionClick = (faq: FAQ) => {
//     setText(faq.question);
//     setSuggestions([]);
//     setShowSugg(false);
//     textareaRef.current?.focus();
//   };

//   /* ── Render ───────────────────────────────────────────────────────────── */
//   // const modelCfg = getModelConfig(selectedModel);

//   return (
//     <div className="relative px-4 py-3 border-t border-gray-100 bg-white">

//       {/* ── FAQ dropdown ─────────────────────────────────────────────── */}
//       {showSugg && suggestions.length > 0 && (
//         <div className="
//           absolute bottom-full left-4 right-4 mb-1
//           bg-white border border-gray-200 rounded-xl shadow-lg
//           overflow-hidden z-50
//         ">
//           <p className="text-[10px] text-gray-400 px-3 pt-2 pb-1 uppercase tracking-wide font-medium">
//             Suggested questions
//           </p>
//           {suggestions.map((faq) => (
//             <button
//               key={faq.id}
//               onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(faq); }}
//               className="
//                 w-full text-left px-3 py-2 text-sm text-gray-700
//                 hover:bg-blue-50 hover:text-blue-700 transition-colors
//                 flex items-start gap-2
//               "
//             >
//               <span className="text-blue-400 mt-0.5 flex-shrink-0 font-bold">?</span>
//               <span>{faq.question}</span>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* ── Model selector row ───────────────────────────────────────── */}
//       <div className="flex items-center gap-2 mb-2">
//         {/* Small coloured dot matching the current model's brand colour */}
//         <div
//           className={`w-2 h-2 rounded-full flex-shrink-0`}
//         />

//         <Select
//   value={selectedModel}
//   onChange={handleModelChange}
//   size="small"
//   variant="standard"
//   disableUnderline
//   disabled={isStreamingActive}
//   renderValue={(selected) => {
//   const model = models.find(
//     (m) => String(m.id) === String(selected) // 🔥 important fix
//   );

//   if (!model) return selected;

//   return (
//     <div className="flex items-center gap-2">
//       {getModelIcon(model.provider)}
//       <span className="text-sm font-medium text-gray-700">
//         {model.name}
//       </span>
//     </div>
//   );
// }}
//   sx={{
//     fontSize: 12,
//     color: '#6b7280',
//     minWidth: 160,
//     display: 'flex',
//     alignItems: 'center',

//     '& .MuiSelect-select': {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       padding: '4px 0',
//     },

//     '& .MuiSelect-icon': {
//       fontSize: 18,
//       color: '#9ca3af',
//       right: 0,
//     },

//     '&.Mui-disabled': { opacity: 0.5 },
//   }}
// >
//           {models.map((m) => (
//   <MenuItem
//     key={m.id}
//     value={m.id}
//     sx={{
//       fontSize: 13,
//       paddingY: 1,
//       paddingX: 1.5,
//     }}
//   >
//     <div className="flex items-center gap-3">
//       {getModelIcon(m.provider)}
//       <span className="text-gray-700">{m.name}</span>
//     </div>
//   </MenuItem>
// ))}
//         </Select>
//       </div>

//       {/* ── Input row ────────────────────────────────────────────────── */}
//       <div className="
//         flex items-end gap-2
//         bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2
//         focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100
//         transition-all
//       ">
//         <textarea
//           ref={textareaRef}
//           rows={1}
//           value={text}
//           placeholder="Ask anything about performance…"
//           onChange={(e) => { setText(e.target.value); setShowSugg(true); }}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setShowSugg(true)}
//           onBlur={() => setTimeout(() => setShowSugg(false), 150)}
//           disabled={isStreamingActive}
//           className="
//             flex-1 resize-none bg-transparent text-sm text-gray-800
//             placeholder:text-gray-400 outline-none
//             max-h-[160px] leading-relaxed py-0.5
//             disabled:opacity-50 disabled:cursor-not-allowed
//           "
//         />

//         {/* ── Abort (shown while streaming) ───────────────────────── */}
//         {isStreamingActive ? (
//           <Tooltip title="Stop generating" placement="top">
//             <IconButton
//               onClick={handleAbort}
//               size="small"
//               sx={{
//                 width: 36, height: 36, flexShrink: 0, borderRadius: '10px',
//                 background: 'linear-gradient(135deg,#fee2e2,#fecaca)',
//                 border    : '1px solid #fca5a5',
//                 '&:hover' : {
//                   background: 'linear-gradient(135deg,#fecaca,#f87171)',
//                   boxShadow : '0 2px 12px rgba(239,68,68,.35)',
//                 },
//               }}
//             >
//               <StopCircleOutlinedIcon sx={{ fontSize: 18, color: '#dc2626' }} />
//             </IconButton>
//           </Tooltip>
//         ) : (
//           /* ── Send ──────────────────────────────────────────────── */
//           <Tooltip title={text.trim() ? 'Send (Enter)' : ''} placement="top">
//             <span>
//               <IconButton
//                 onClick={handleSend}
//                 disabled={!text.trim() || chatLoading}
//                 size="small"
//                 sx={{
//                   width: 36, height: 36, flexShrink: 0, borderRadius: '10px',
//                   background: text.trim()
//                     ? 'linear-gradient(135deg,#3b82f6,#2563eb)'
//                     : 'rgba(0,0,0,.06)',
//                   border: 'none', transition: 'all .2s',
//                   '&:hover': text.trim()
//                     ? { boxShadow: '0 2px 12px rgba(59,130,246,.45)' } : {},
//                   '&.Mui-disabled': { background: 'rgba(0,0,0,.06)' },
//                 }}
//               >
//                 <SendIcon sx={{
//                   fontSize: 16,
//                   color   : text.trim() ? '#fff' : '#9ca3af',
//                   transform: 'rotate(-45deg)',
//                 }} />
//               </IconButton>
//             </span>
//           </Tooltip>
//         )}
//       </div>

//       {/* ── Streaming hint ───────────────────────────────────────────── */}
//       {isStreamingActive && (
//         <p className="text-[11px] text-gray-400 mt-1 text-center select-none">
//           Generating… press{' '}
//           <span className="font-medium text-red-400">Stop</span> to cancel
//         </p>
//       )}
//     </div>
//   );
// };

// export default ChatInput;