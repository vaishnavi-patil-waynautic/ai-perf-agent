// // import React, { useState } from 'react';
// // import {
// //   TextField,
// //   IconButton,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   Tooltip,
// // } from '@mui/material';
// // import SendIcon from '@mui/icons-material/Send';
// // import { useAppDispatch, useAppSelector } from '../../store/hooks';
// // import { sendMessage } from '../../store/slices/chat.thunk';
// // import { setSelectedModel } from '../../store/slices/chat.slice';
// // import { RootState } from '@/store/store';
// // import { Rocket, Brain, Sparkles } from "lucide-react";

// // interface ChatInputProps {
// //   // isFullScreen: boolean;
// // }

// // const ChatInput: React.FC<ChatInputProps> = () => {
// //   const dispatch = useAppDispatch();
// //   const [input, setInput] = useState('');
// //   const selectedModel = useAppSelector((state) => state.chat.selectedModel);
// //   const isLoading = useAppSelector((state) => state.chat.isLoading);

// //   const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen)


// //   const models = [
// //     { id: "gpt-4", name: "GPT-4", icon: <Rocket size={16} /> },
// //     { id: "claude-3", name: "Claude 3", icon: <Brain size={16} /> },
// //     { id: "gemini", name: "Gemini Pro", icon: <Sparkles size={16} /> },
// //   ];

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

// //   return (
// //     <div
// //       className={`bg-white border-t border-gray-200 flex-shrink-0 ${isFullScreen ? 'px-[280px] py-4' : 'p-3'
// //         }`}
// //     >
// //       <div className="flex items-end gap-2">
// //         {/* <FormControl size="small" className="min-w-[120px]">
// //           <Select
// //             value={selectedModel}
// //             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// //             className="bg-gray-50"
// //           >
// //             {models.map((model) => (
// //               <MenuItem key={model.id} value={model.id}>
// //                 {model.name}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl> */}

// //         {/* <FormControl size="small" className="min-w-[52px]">
// //           <Select
// //             value={selectedModel}
// //             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// //             className="bg-gray-50"

// //             /* SHOW ONLY ICON WHEN CLOSED
// //             renderValue={(selected) => {
// //               const m = models.find(x => x.id === selected);
// //               return <div className="flex items-center">{m?.icon}</div>;
// //             }}

// //             MenuProps={{
// //               PaperProps: {
// //                 style: { minWidth: 180 },
// //               },
// //             }}
// //           >
// //             {models.map((model) => (
// //               <MenuItem key={model.id} value={model.id}>
// //                 <div className="flex items-center gap-2">
// //                   {model.icon}
// //                   <span>{model.name}</span>
// //                 </div>
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl> */}

// //         <FormControl size="small">
// //   <Select
// //     value={selectedModel}
// //     onChange={(e) => dispatch(setSelectedModel(e.target.value))}
// //     variant="outlined"

// //     sx={{
// //       width: 40,
// //       height: 40,
// //       "& .MuiSelect-select": {
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: "8px !important",
// //       },
// //       "& fieldset": {
// //         borderColor: "#e5e7eb",
// //       },
// //     }}

// //     IconComponent={() => null} // ❌ removes dropdown arrow

// //     renderValue={(selected) => {
// //       const m = models.find((x) => x.id === selected);
// //       return m?.icon;
// //     }}

// //     MenuProps={{
// //       PaperProps: {
// //         sx: { minWidth: 180 },
// //       },
// //     }}
// //   >
// //     {models.map((model) => (
// //       <MenuItem key={model.id} value={model.id}>
// //         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //           {model.icon}
// //           {model.name}
// //         </div>
// //       </MenuItem>
// //     ))}
// //   </Select>
// // </FormControl>

// //         <TextField
// //           fullWidth
// //           multiline
// //           maxRows={4}
// //           placeholder="Type your message..."
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyPress={handleKeyPress}
// //           disabled={isLoading}
// //           variant="outlined"
// //           size="small"
// //           className="bg-gray-50"
// //         />

// //         <Tooltip title="Send">
// //           <span>
// //             <IconButton
// //               color="primary"
// //               onClick={handleSend}
// //               disabled={!input.trim() || isLoading}
// //               className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
// //             >
// //               <SendIcon />
// //             </IconButton>
// //           </span>
// //         </Tooltip>
// //       </div>

// //       <div className="text-xs text-gray-400 mt-2 text-center">
// //         Press Enter to send, Shift+Enter for new line
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatInput;


// import React, { useState, useMemo } from 'react';
// import {
//   TextField,
//   IconButton,
//   Select,
//   MenuItem,
//   FormControl,
//   Tooltip,
//   Chip,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { sendMessage } from '../../store/slices/chat.thunk';
// import { setSelectedModel } from '../../store/slices/chat.slice';
// import { RootState } from '@/store/store';
// import { Rocket, Brain, Sparkles } from "lucide-react";

// const ChatInput: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [input, setInput] = useState('');
//   const selectedModel = useAppSelector((state) => state.chat.selectedModel);
//   const isLoading = useAppSelector((state) => state.chat.isLoading);
//   const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
//   const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);



//   console.log("ChatPanel chat is loading : ", chatLoading, " ")


//   /* ---------------- FAQ LIST ⭐ ---------------- */
//   const faqList = [
//     "How to fix 504 Gateway errors?",
//     "Generate Load Test Strategy",
//     "Show latest performance data",
//     "Show last build results",
//     "Explain JMX scripting basics",
//     "How to optimize database queries?",
//     "Analyze error logs",
//     "What are NFR best practices?"
//   ];

//   /* ---------------- LIVE MATCH DETECTION ⭐ ---------------- */
//   const matchedFAQ = useMemo(() => {
//     if (!input.trim()) return null;

//     const lowerInput = input.toLowerCase();

//     return faqList.find(faq =>
//       faq.toLowerCase().split(" ").some(word =>
//         lowerInput.includes(word)
//       )
//     ) || null;

//   }, [input]);

//   const handleSend = () => {
//     if (input.trim()) {
//       dispatch(sendMessage({ text: input.trim(), modelId: selectedModel }));
//       setInput('');
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const models = [
//     { id: "gpt-4", name: "GPT-4", icon: <Rocket size={16} /> },
//     { id: "claude-3", name: "Claude 3", icon: <Brain size={16} /> },
//     { id: "gemini", name: "Gemini Pro", icon: <Sparkles size={16} /> },
//   ];

//   return (
//     <div className={`bg-white border-t border-gray-200 flex-shrink-0 ${isFullScreen ? 'px-[280px] py-4' : 'p-3'}`}>

//       <div className="flex items-end gap-2">

//         {/* Model Selector */}
//         <FormControl size="small">
//           <Select
//             value={selectedModel}
//             onChange={(e) => dispatch(setSelectedModel(e.target.value))}
//             variant="outlined"
//             sx={{
//               width: 40,
//               height: 40,
//               "& .MuiSelect-select": {
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "8px !important",
//               },
//             }}
//             IconComponent={() => null}
//             renderValue={(selected) => {
//               const m = models.find((x) => x.id === selected);
//               return m?.icon;
//             }}
//           >
//             {models.map((model) => (
//               <MenuItem key={model.id} value={model.id}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   {model.icon}
//                   {model.name}
//                 </div>
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Text Input ⭐ */}
//         <TextField
//           fullWidth
//           multiline
//           maxRows={4}
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           // disabled={isLoading}
//           variant="outlined"
//           size="small"
//           className="bg-gray-50"

//           /* ⭐ Highlight border if matched */
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderColor: matchedFAQ ? "#10b981" : undefined,
//               "& fieldset": {
//                 borderColor: matchedFAQ ? "#10b981" : undefined,
//               },
//             },
//           }}
//         />

//         <Tooltip title="Send">
//           <span>
//             <IconButton
//               color="primary"
//               onClick={handleSend}
//               disabled={!input.trim() || isLoading || chatLoading}
//               className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
//             >
//               <SendIcon />
//             </IconButton>
//           </span>
//         </Tooltip>
//       </div>

//       {/* ⭐ FAQ Suggestion */}
//       {matchedFAQ && (
//         <div className="mt-2">
//           <Chip
//             label={`Suggested: ${matchedFAQ}`}
//             color="success"
//             variant="outlined"
//             clickable
//             onClick={() => setInput(matchedFAQ)}
//           />
//         </div>
//       )}

//       <div className="text-xs text-gray-400 mt-2 text-center">
//         Press Enter to send, Shift+Enter for new line
//       </div>
//     </div>
//   );
// };

// export default ChatInput;


import React, { useState, useMemo } from 'react';
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

const ChatInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [streamStatus, setStreamStatus] = useState('');
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);

  console.log("ChatPanel chat is loading : ", chatLoading, " ");

  /* ---------------- FAQ LIST ⭐ ---------------- */
  const faqList = [
    "How to fix 504 Gateway errors?",
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

    const lowerInput = input.toLowerCase();

    return faqList.find(faq =>
      faq.toLowerCase().split(" ").some(word =>
        lowerInput.includes(word)
      )
    ) || null;

  }, [input]);

  const handleSend = () => {
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

  const models = [
    { id: "gpt-4", name: "GPT-4", icon: <Rocket size={16} /> },
    { id: "claude-3", name: "Claude 3", icon: <Brain size={16} /> },
    { id: "gemini", name: "Gemini Pro", icon: <Sparkles size={16} /> },
  ];

  return (
    // <div className={`relative ${isFullScreen ? 'px-[280px] py-4' : 'p-4'}`}>

<div
  className={`relative py-4 w-full ${
    isFullScreen
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
      renderValue={(selected) => {
        const m = models.find((x) => x.id === selected);
        return <div className="text-purple-600">{m?.icon}</div>;
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
          value={model.id}
          sx={{
            borderRadius: '12px',
            margin: '4px 0',
            padding: '12px 16px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: selectedModel === model.id 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))'
              : 'transparent',
            border: selectedModel === model.id
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
                background: selectedModel === model.id
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))'
                  : 'rgba(139, 92, 246, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <span className={selectedModel === model.id ? "text-purple-600" : "text-purple-500"}>
                {model.icon}
              </span>
            </div>
            <div className="flex-1">
              <span className={`font-semibold text-sm ${
                selectedModel === model.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' 
                  : 'text-gray-700'
              }`}>
                {model.name}
              </span>
            </div>
            {selectedModel === model.id && (
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
          <Tooltip title="Send Message" placement="top">
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || isLoading || chatLoading}
                className="group relative overflow-hidden"
                sx={{
                  width: 48,
                  height: 48,
                  background: !input.trim() || isLoading || chatLoading
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
                    color: !input.trim() || isLoading || chatLoading ? '#9ca3af' : 'white',
                    fontSize: 20,
                  }} 
                />
              </IconButton>
            </span>
          </Tooltip>
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