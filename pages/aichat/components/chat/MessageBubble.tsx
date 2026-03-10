// import React, { useState } from 'react';
// import { IconButton, Tooltip, Snackbar } from '@mui/material';
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import PersonIcon from '@mui/icons-material/Person';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import { ChatMessage } from '../../types/chat.types';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { toggleMessageReaction } from '../../store/slices/chat.slice';
// import ChatResponseCard from './ChatResponseCard';
// import { loadChatMessages, sendFeedback } from '../../store/slices/chat.thunk';
// import MarkdownBlock from './ChatResponse/MarkdownBlock';
// import { RootState } from '@/store/store';
// import { Bot, User } from 'lucide-react';
// import StreamingCursor from '../StreamingCursor';

// interface MessageBubbleProps {
//   message: ChatMessage;
// }

// const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
//   const dispatch = useAppDispatch();
//   const [copySuccess, setCopySuccess] = useState(false);
//   const isUser = message.sender === 'user';
//   const currentChatId = useAppSelector((state) => state.chat.currentChatId);
//   const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);


//   // console.log("Message View : ", message)
//   // console.log("Message type : ", message.type)
//   // console.log("Message id : ", message.id)

//   console.log("MessageBubble ", message.id, " : ", message);
//   const { isStreaming } = message;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(message.content);
//     setCopySuccess(true);
//   };

//   const handleReaction = (reaction: 'like' | 'dislike') => {
//     console.log("HandleReaction Message id : ", message.id)
//     dispatch(sendFeedback({ messageId: message.id, reaction }));
//     dispatch(loadChatMessages(currentChatId));
//   };

//   const BotTyping = () => (
//   <div className="flex items-center gap-1 px-2 py-1">
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//   </div>
// );


// console.log("is User : ", isUser, " chat is loading : ", chatLoading, " message.content is there : ", message?.content)

//   return (
//     <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
//       {!isUser && (
//         <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mt-4">
//           {/* <SmartToyIcon className="text-white text-sm" /> */}
//           <Bot color='blue' />
//         </div>
//       )}


//       {/* BOT: empty content = waiting for first token */}
// {!isUser && isStreaming && !message.content && (
//   <div className="flex items-center gap-1 px-1 py-2">
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//   </div>
// )}

// {/* TEXT: stream tokens live */}
// {message.type === 'text' && message.content && (
//   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//     <MarkdownBlock content={message.content} />
//     {isStreaming && <StreamingCursor />}
//   </div>
// )}

// {/* VISUALIZATION: only render after finalized */}
// {message.type === 'visualization' && message.content && !message.data?.answer && !message.data?.summary && (
//   <MarkdownBlock content={message.content} />
// )}
// {message.type === 'visualization' && message.data && !isStreaming && (
//   <ChatResponseCard data={message.data} />
// )}

// {/* Hide action buttons while streaming */}
// {!isUser && message.id != null && !isStreaming && (
//   <div className="flex items-center gap-1.5 mt-2 ml-1 transition-all duration-300">
//     {/* ... your existing like/dislike/copy buttons unchanged ... */}
//   </div>
// )}

//       {/* <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}> */}
//       {/* <div
//   className={`flex flex-col w-full max-w-full overflow-hidden ${
//     isUser ? 'items-end ml-auto' : 'items-start'
//   }`}
// > */}

//       <div
//         className={`group  px-4 py-2 rounded-2xl max-w-full overflow-hidden ${isUser
//             ? 'bg-gray-100 text-black rounded-tr-sm'
//             // : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm mr-9'
//             : ''
//           }`}
//       >
//         <div
//           // className={`px-2 py-2 rounded-2xl ${isUser
//           //     ? 'bg-gray-200 text-black rounded-tr-sm py-1'
//           //     : 'bg-white text-gray-800 rounded-tl-sm'
//           //   }`}
//         >

//           {/* BOT Loading Animation */}


//           {message.type === 'text' && (
//             <div className="whitespace-pre-wrap text-sm leading-relaxed">
//               {/* {message.content} */}
//               <MarkdownBlock content={message.content} />
//             </div>
//           )}
//           {message.type === 'image' && (
//             <img
//               src={message.content}
//               alt="Response"
//               className="max-w-full rounded-lg"
//             />
//           )}
//           {message.type === 'diagram' && (
//             <div className="bg-gray-50 p-3 rounded border border-gray-200">
//               <pre className="text-xs text-gray-700 whitespace-pre-wrap">
//                 {message.content}
//               </pre>
//             </div>
//           )}


//           {/* ✅ Add this */}
//           {message.type === 'visualization'  && message.content && !message.data?.answer && !message.data?.summary && (
//             <MarkdownBlock content={message.content} />
//           )}
//           {message.type === 'visualization' && message.data && (
//             <ChatResponseCard data={message.data} />
//           )}
//         </div>

//         {/* {chatLoading && (
//   <BotTyping />
// )} */}

//         {/* Action Buttons - Only for bot messages */}
//         {/* {!isUser && message.id!=null && (
//           <div className="flex items-center gap-1 mt-1">
//             <Tooltip title="Like">
//               <IconButton
//                 size="small"
//                 onClick={() => handleReaction('like')}
//                 className="hover:bg-gray-100"
//               >
//                 {message.liked ? (
//                   <ThumbUpIcon fontSize="small" className="text-blue-600" />
//                 ) : (
//                   <ThumbUpOutlinedIcon fontSize="small" className="text-gray-400" />
//                 )}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Dislike">
//               <IconButton
//                 size="small"
//                 onClick={() => handleReaction('dislike')}
//                 className="hover:bg-gray-100"
//               >
//                 {message.disliked ? (
//                   <ThumbDownIcon fontSize="small" className="text-red-600" />
//                 ) : (
//                   <ThumbDownOutlinedIcon fontSize="small" className="text-gray-400" />
//                 )}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Copy">
//               <IconButton
//                 size="small"
//                 onClick={handleCopy}
//                 className="hover:bg-gray-100"
//               >
//                 <ContentCopyIcon fontSize="small" className="text-gray-400" />
//               </IconButton>
//             </Tooltip>
//           </div>
//         )} */}

//         {/* {!isUser && message.id != null && ( */}
//   {/* // <div className="flex items-center gap-1.5 mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"> */}
//   {!isUser && message.id != null && (
//   <div className="flex items-center gap-1.5 mt-2 ml-1 transition-all duration-300">
//     {/* Like Button */}
//     <Tooltip title="Like" placement="top">
//       <IconButton
//         size="small"
//         onClick={() => handleReaction('like')}
//         className="group/btn relative overflow-hidden"
//         sx={{
//           width: 32,
//           height: 32,
//           background: message.liked 
//             ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))'
//             : 'rgba(255, 255, 255, 0.5)',
//           backdropFilter: 'blur(10px)',
//           border: message.liked 
//             ? '1.5px solid rgba(59, 130, 246, 0.3)'
//             : '1px solid rgba(255, 255, 255, 0.4)',
//           borderRadius: '10px',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           '&:hover': {
//             background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
//             // transform: 'scale(1.1) translateY(-2px)',
//             boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
//             border: '1.5px solid rgba(59, 130, 246, 0.4)',
//           },
//           // '&:active': {
//           //   transform: 'scale(0.95)',
//           // },
//         }}
//       >
//         {message.liked ? (
//           <ThumbUpIcon 
//             fontSize="small" 
//             className="text-blue-600 transition-transform group-hover/btn:scale-110"
//             sx={{ fontSize: 16 }}
//           />
//         ) : (
//           <ThumbUpOutlinedIcon 
//             fontSize="small" 
//             className="text-gray-500 transition-all group-hover/btn:text-blue-600 group-hover/btn:scale-110"
//             sx={{ fontSize: 16 }}
//           />
//         )}
        
//         {message.liked && (
//           <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
//         )}
//       </IconButton>
//     </Tooltip>

//     {/* Dislike Button */}
//     <Tooltip title="Dislike" placement="top">
//       <IconButton
//         size="small"
//         onClick={() => handleReaction('dislike')}
//         className="group/btn relative overflow-hidden"
//         sx={{
//           width: 32,
//           height: 32,
//           background: message.disliked 
//             ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))'
//             : 'rgba(255, 255, 255, 0.5)',
//           backdropFilter: 'blur(10px)',
//           border: message.disliked 
//             ? '1.5px solid rgba(239, 68, 68, 0.3)'
//             : '1px solid rgba(255, 255, 255, 0.4)',
//           borderRadius: '10px',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           '&:hover': {
//             background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
//             // transform: 'scale(1.1) translateY(-2px)',
//             boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
//             border: '1.5px solid rgba(239, 68, 68, 0.4)',
//           },
//           // '&:active': {
//           //   transform: 'scale(0.95)',
//           // },
//         }}
//       >
//         {message.disliked ? (
//           <ThumbDownIcon 
//             fontSize="small" 
//             className="text-red-600 transition-transform group-hover/btn:scale-110"
//             sx={{ fontSize: 16 }}
//           />
//         ) : (
//           <ThumbDownOutlinedIcon 
//             fontSize="small" 
//             className="text-gray-500 transition-all group-hover/btn:text-red-600 group-hover/btn:scale-110"
//             sx={{ fontSize: 16 }}
//           />
//         )}
        
//         {message.disliked && (
//           <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
//         )}
//       </IconButton>
//     </Tooltip>

//     {/* Copy Button */}
//     <Tooltip title="Copy" placement="top">
//       <IconButton
//         size="small"
//         onClick={handleCopy}
//         className="group/btn relative overflow-hidden"
//         sx={{
//           width: 32,
//           height: 32,
//           background: 'rgba(255, 255, 255, 0.5)',
//           backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(255, 255, 255, 0.4)',
//           borderRadius: '10px',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           '&:hover': {
//             background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
//             transform: 'scale(1.1) translateY(-2px)',
//             boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)',
//             border: '1.5px solid rgba(139, 92, 246, 0.4)',
//           },
//           '&:active': {
//             transform: 'scale(0.95)',
//           },
//         }}
//       >
//         <ContentCopyIcon 
//           fontSize="small" 
//           className="text-gray-500 transition-all group-hover/btn:text-purple-600 group-hover/btn:scale-110"
//           sx={{ fontSize: 16 }}
//         />
//       </IconButton>
//     </Tooltip>
//   </div>
// )}

//         <span className="text-xs text-gray-400 mt-1">
//           {message.timestamp.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </span>
//       </div>

//       {isUser && (
//         <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
//           {/* <PersonIcon className="text-white text-sm" /> */}
//           <User color='white'/>
//         </div>
//       )}

//       <Snackbar
//         open={copySuccess}
//         autoHideDuration={2000}
//         onClose={() => setCopySuccess(false)}
//         message="Copied to clipboard!"
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       />
//     </div>
//   );
// };

// export default MessageBubble;


// import React, { useState } from 'react';
// import { IconButton, Tooltip, Snackbar } from '@mui/material';
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { ChatMessage } from '../../types/chat.types';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import ChatResponseCard from './ChatResponseCard';
// import { loadChatMessages, sendFeedback } from '../../store/slices/chat.thunk';
// import MarkdownBlock from './ChatResponse/MarkdownBlock';
// import { RootState } from '@/store/store';
// import { Bot, User } from 'lucide-react';

// interface MessageBubbleProps {
//   message: ChatMessage;
// }

// // Blinking cursor shown at end of streaming text
// const StreamingCursor = () => (
//   <span
//     className="inline-block w-[2px] h-[1em] bg-gray-500 ml-0.5 align-middle"
//     style={{ animation: 'blink 1s step-end infinite' }}
//   >
//     <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
//   </span>
// );

// // Bouncing dots shown before first token arrives
// const TypingDots = () => (
//   <div className="flex items-center gap-1 px-1 py-2">
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
//     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//   </div>
// );

// const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
//   const dispatch = useAppDispatch();
//   const [copySuccess, setCopySuccess] = useState(false);
//   const isUser = message.sender === 'user';
//   const currentChatId = useAppSelector((state) => state.chat.currentChatId);
//   const { isStreaming } = message;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(message.content);
//     setCopySuccess(true);
//   };

//   const handleReaction = (reaction: 'like' | 'dislike') => {
//     dispatch(sendFeedback({ messageId: message.id, reaction }));
//     dispatch(loadChatMessages(currentChatId));
//   };

//   return (
//     <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>

//       {/* Bot avatar */}
//       {!isUser && (
//         <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mt-1">
//           <Bot color="blue" size={18} />
//         </div>
//       )}

//       {/* Bubble */}
//       <div
//         className={`group px-4 py-2 rounded-2xl max-w-[80%] overflow-hidden ${
//           isUser ? 'bg-gray-100 text-black rounded-tr-sm' : ''
//         }`}
//       >

//         {/* ── WAITING: no content yet ── */}
//         {!isUser && isStreaming && !message.content && <TypingDots />}

//         {/* ── TEXT message ── */}
//         {message.type === 'text' && message.content && (
//           <div className="text-sm leading-relaxed">
//             {isStreaming
//               // During streaming: plain text + cursor (avoids broken markdown flicker)
//               ? <span className="whitespace-pre-wrap">{message.content}<StreamingCursor /></span>
//               // Finalized: full markdown
//               : <MarkdownBlock content={message.content} />
//             }
//           </div>
//         )}

//         {/* ── IMAGE ── */}
//         {message.type === 'image' && (
//           <img src={message.content} alt="Response" className="max-w-full rounded-lg" />
//         )}

//         {/* ── DIAGRAM ── */}
//         {message.type === 'diagram' && (
//           <div className="bg-gray-50 p-3 rounded border border-gray-200">
//             <pre className="text-xs text-gray-700 whitespace-pre-wrap">{message.content}</pre>
//           </div>
//         )}

//         {/* ── VISUALIZATION ──
//             During streaming: show accumulating plain text.
//             After finalized: show ChatResponseCard (chart/table). */}
//         {message.type === 'visualization' && isStreaming && message.content && (
//           <div className="text-sm leading-relaxed">
//             <span className="whitespace-pre-wrap">{message.content}<StreamingCursor /></span>
//           </div>
//         )}
//         {message.type === 'visualization' && !isStreaming && message.data && (
//           <ChatResponseCard data={message.data} />
//         )}

//         {/* ── ACTION BUTTONS (only after finalized) ── */}
//         {!isUser && message.id != null && !isStreaming && (
//           <div className="flex items-center gap-1.5 mt-2 ml-1">
//             <Tooltip title="Like" placement="top">
//               <IconButton
//                 size="small"
//                 onClick={() => handleReaction('like')}
//                 sx={{
//                   width: 32, height: 32,
//                   background: message.liked
//                     ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.15))'
//                     : 'rgba(255,255,255,0.5)',
//                   border: message.liked ? '1.5px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.4)',
//                   borderRadius: '10px',
//                   '&:hover': { boxShadow: '0 4px 16px rgba(59,130,246,0.25)' },
//                 }}
//               >
//                 {message.liked
//                   ? <ThumbUpIcon sx={{ fontSize: 16 }} className="text-blue-600" />
//                   : <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Dislike" placement="top">
//               <IconButton
//                 size="small"
//                 onClick={() => handleReaction('dislike')}
//                 sx={{
//                   width: 32, height: 32,
//                   background: message.disliked
//                     ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.15))'
//                     : 'rgba(255,255,255,0.5)',
//                   border: message.disliked ? '1.5px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.4)',
//                   borderRadius: '10px',
//                   '&:hover': { boxShadow: '0 4px 16px rgba(239,68,68,0.25)' },
//                 }}
//               >
//                 {message.disliked
//                   ? <ThumbDownIcon sx={{ fontSize: 16 }} className="text-red-600" />
//                   : <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Copy" placement="top">
//               <IconButton
//                 size="small"
//                 onClick={handleCopy}
//                 sx={{
//                   width: 32, height: 32,
//                   background: 'rgba(255,255,255,0.5)',
//                   border: '1px solid rgba(255,255,255,0.4)',
//                   borderRadius: '10px',
//                   '&:hover': { boxShadow: '0 4px 16px rgba(139,92,246,0.25)' },
//                 }}
//               >
//                 <ContentCopyIcon sx={{ fontSize: 16 }} className="text-gray-500" />
//               </IconButton>
//             </Tooltip>
//           </div>
//         )}

//         {/* Timestamp */}
//         <span className="text-xs text-gray-400 mt-1 block">
//           {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </span>
//       </div>

//       {/* User avatar */}
//       {isUser && (
//         <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
//           <User color="white" size={18} />
//         </div>
//       )}

//       <Snackbar
//         open={copySuccess}
//         autoHideDuration={2000}
//         onClose={() => setCopySuccess(false)}
//         message="Copied to clipboard!"
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       />
//     </div>
//   );
// };

// export default MessageBubble;

/**
 * MessageBubble.tsx
 *
 * Renders a single chat message.
 * Key rule: if message.isStreaming is true, delegate to <StreamingBubble>.
 * That component owns the EventSource and local state.
 * Once streaming is done it dispatches finalizeStreamingMessage and returns null,
 * at which point Redux re-renders this component with the completed message.
 */

import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import ThumbUpOutlinedIcon    from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon            from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon  from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon          from '@mui/icons-material/ThumbDown';
import ContentCopyIcon        from '@mui/icons-material/ContentCopy';
import { ChatMessage }        from '../../types/chat.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ChatResponseCard       from './ChatResponseCard';
import { loadChatMessages, sendFeedback } from '../../store/slices/chat.thunk';
import MarkdownBlock          from './ChatResponse/MarkdownBlock';
import StreamingBubble        from './StreamingBubble';
import { Bot, User }          from 'lucide-react';

interface Props {
  message: ChatMessage;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const dispatch       = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const currentChatId  = useAppSelector((s) => s.chat.currentChatId);
  const isUser         = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
  };

  const handleReaction = (reaction: 'like' | 'dislike') => {
    dispatch(sendFeedback({ messageId: message.id, reaction }));
    // dispatch(loadChatMessages(currentChatId));
  };

  // ── Reaction / action buttons (only on finalized bot messages) ────────────
  const ActionBar = () => (
    <div className="flex items-center gap-1.5 mt-2 ml-1">
      <Tooltip title="Like" placement="top">
        <IconButton
          size="small"
          onClick={() => handleReaction('like')}
          sx={{
            width: 32, height: 32, borderRadius: '10px',
            background: message.liked
              ? 'linear-gradient(135deg,rgba(59,130,246,.15),rgba(37,99,235,.15))'
              : 'rgba(255,255,255,.5)',
            border: message.liked
              ? '1.5px solid rgba(59,130,246,.3)'
              : '1px solid rgba(255,255,255,.4)',
            '&:hover': { boxShadow: '0 4px 16px rgba(59,130,246,.25)' },
          }}
        >
          {message.liked
            ? <ThumbUpIcon sx={{ fontSize: 16 }} className="text-blue-600" />
            : <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Dislike" placement="top">
        <IconButton
          size="small"
          onClick={() => handleReaction('dislike')}
          sx={{
            width: 32, height: 32, borderRadius: '10px',
            background: message.disliked
              ? 'linear-gradient(135deg,rgba(239,68,68,.15),rgba(220,38,38,.15))'
              : 'rgba(255,255,255,.5)',
            border: message.disliked
              ? '1.5px solid rgba(239,68,68,.3)'
              : '1px solid rgba(255,255,255,.4)',
            '&:hover': { boxShadow: '0 4px 16px rgba(239,68,68,.25)' },
          }}
        >
          {message.disliked
            ? <ThumbDownIcon sx={{ fontSize: 16 }} className="text-red-600" />
            : <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy" placement="top">
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            width: 32, height: 32, borderRadius: '10px',
            background: 'rgba(255,255,255,.5)',
            border: '1px solid rgba(255,255,255,.4)',
            '&:hover': { boxShadow: '0 4px 16px rgba(139,92,246,.25)' },
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 16 }} className="text-gray-500" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* ── Bot avatar ─────────────────────────────────────────────────────── */}
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mt-1">
          <Bot size={18} color="blue" />
        </div>
      )}

      {/* ── Bubble ─────────────────────────────────────────────────────────── */}
      <div
        className={`group px-4 py-2 rounded-2xl overflow-hidden
          ${isUser ? 'bg-gray-100 text-black rounded-tr-sm max-w-[75%]' : 'max-w-[80%]'}`}
      >

        {/* ══ CASE 1: STREAMING ════════════════════════════════════════════
            StreamingBubble owns the EventSource.
            When it finalizes, Redux updates isStreaming → false and this
            branch is replaced by CASE 2/3 on next render.
        ══════════════════════════════════════════════════════════════════ */}
        {message.isStreaming && (
          <StreamingBubble message={message} />
        )}

        {/* ══ CASE 2: FINALIZED TEXT ═══════════════════════════════════════ */}
        {!message.isStreaming && message.type === 'text' && (
          <div className="text-sm leading-relaxed">
            <MarkdownBlock content={message.content} />
          </div>
        )}

        {/* ══ CASE 3: FINALIZED VISUALIZATION ══════════════════════════════
            ChatResponseCard renders summary markdown + chart/table.
            The summary text inside the data is rendered inside the card,
            so we do NOT render message.content separately here.
        ══════════════════════════════════════════════════════════════════ */}
        {!message.isStreaming && message.type === 'visualization' && (
          <>
            {/* Plain-text content that arrived before visualization data */}
            {message.content && !message.data?.answer && !message.data?.summary && (
              <MarkdownBlock content={message.content} />
            )}
            {message.data && <ChatResponseCard data={message.data} />}
          </>
        )}

        {/* ══ CASE 4: IMAGE / DIAGRAM ══════════════════════════════════════ */}
        {!message.isStreaming && message.type === 'image' && (
          <img src={message.content} alt="Response" className="max-w-full rounded-lg" />
        )}
        {!message.isStreaming && message.type === 'diagram' && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{message.content}</pre>
          </div>
        )}

        {/* ── Action bar (only on finalized bot messages) ──────────────────── */}
        {!isUser && !message.isStreaming && message.id && <ActionBar />}

        {/* ── Timestamp ────────────────────────────────────────────────────── */}
        <span className="text-xs text-gray-400 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* ── User avatar ────────────────────────────────────────────────────── */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
          <User size={18} color="white" />
        </div>
      )}

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

// ── React.memo — prevents sibling bubbles from re-rendering when Redux
//   updates a different message (e.g. streaming text of the newest bubble) ──
export default React.memo(MessageBubble);
