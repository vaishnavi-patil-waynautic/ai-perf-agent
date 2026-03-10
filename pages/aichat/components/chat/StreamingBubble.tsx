// /**
//  * StreamingBubble.tsx
//  *
//  * This component is the heart of the live streaming UX.
//  *
//  * WHY LOCAL STATE instead of Redux for streaming:
//  *   - Redux dispatch on every token → all connected components re-render
//  *   - Local state + requestAnimationFrame → ONLY this component re-renders,
//  *     and only at screen refresh rate (60fps max), not at SSE token rate
//  *   - Result: smooth word-by-word rendering like ChatGPT/Claude with zero lag
//  *
//  * LIFECYCLE:
//  *   1. Mount → open EventSource using message.streamParams
//  *   2. status events → update local statusText (shown in ChatInput already)
//  *   3. token events  → append to ref (no re-render), rAF flushes to state
//  *   4. done event    → dispatch finalizeStreamingMessage once to Redux,
//  *                      then onDone() callback fires to reload chat list etc.
//  *   5. Unmount       → close EventSource
//  */

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useAppDispatch } from '../../store/hooks';
// import { finalizeStreamingMessage, setCurrentChat } from '../../store/slices/chat.slice';
// import { loadChatHistories } from '../../store/slices/chat.thunk';
// import { ChatMessage } from '../../types/chat.types';

// // Blinking cursor
// const Cursor = () => (
//   <>
//     <span
//       className="inline-block w-[2px] h-[1em] bg-gray-600 ml-[1px] align-middle rounded-sm"
//       style={{ animation: 'sseCursor 1s step-end infinite' }}
//     />
//     <style>{`
//       @keyframes sseCursor {
//         0%, 100% { opacity: 1; }
//         50%       { opacity: 0; }
//       }
//     `}</style>
//   </>
// );

// // Bouncing dots while waiting for first token
// const TypingDots = () => (
//   <div className="flex items-center gap-1 py-1">
//     {['-0.3s', '-0.15s', '0s'].map((delay, i) => (
//       <span
//         key={i}
//         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//         style={{ animationDelay: delay }}
//       />
//     ))}
//   </div>
// );

// // Status pill — shown below cursor while tools are running
// const StatusPill = ({ text }: { text: string }) => (
//   <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
//     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
//     <span className="text-xs text-blue-600 font-medium">{text}</span>
//   </div>
// );

// interface Props {
//   message: ChatMessage;               // the placeholder with isStreaming: true
//   onDone?: (newChatId: string) => void; // called after finalize so parent can react
// }

// const BASE_URL = 'http://localhost:8000/api/v1/aichatbot';

// const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
//   const dispatch = useAppDispatch();

//   // ── Local streaming state ─────────────────────────────────────────────────
//   const [displayText, setDisplayText] = useState('');   // what the user sees
//   const [statusText, setStatusText]   = useState('');   // "🤔 Thinking..." etc.
//   const [isDone, setIsDone]           = useState(false);

//   // Accumulator ref — appended on every token WITHOUT triggering re-render
//   const accRef      = useRef('');
//   const rafRef      = useRef<number | null>(null);
//   const esRef       = useRef<EventSource | null>(null);
//   const finalizedRef = useRef(false); // prevent double finalize

//   // ── rAF flush — syncs accRef → displayText at screen refresh rate ─────────
//   const scheduleFlush = useCallback(() => {
//     if (rafRef.current !== null) return; // already scheduled
//     rafRef.current = requestAnimationFrame(() => {
//       rafRef.current = null;
//       setDisplayText(accRef.current);
//     });
//   }, []);

//   // ── Start EventSource on mount ────────────────────────────────────────────
//   useEffect(() => {
//     const params = message.streamParams;
//     if (!params) return;

//     const token = localStorage.getItem('access_token');
//     const qs = new URLSearchParams({
//       nl_question: params.nlQuestion,
//       project_id:  String(params.projectId),
//       ...(params.chatId ? { chat_id: params.chatId } : {}),
//       token: token ?? '',
//     });

//     const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;
//     const es  = new EventSource(url);
//     esRef.current = es;

//     es.onmessage = (event) => {
//       let data: any;
//       try { data = JSON.parse(event.data); }
//       catch { return; }

//       switch (data.type) {
//         // ── Status: "🤔 Thinking..." / "🔧 Using tool…" ────────────────────
//         case 'status':
//           setStatusText(data.message ?? '');
//           break;

//         // ── Token: append word to accumulator, schedule rAF flush ──────────
//         case 'token':
//           accRef.current += data.content;
//           scheduleFlush();
//           break;

//         // ── Tool result: stored in full_response on done, ignore here ───────
//         case 'result':
//           break;

//         // ── Done: commit to Redux once ─────────────────────────────────────
//         case 'done': {
//           es.close();
//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           const responseData = data.full_response?.data ?? data.full_response ?? {};
//           const newChatId    = String(responseData.chat_id ?? params.chatId ?? '');
//           const finalText    = accRef.current || responseData.answer || responseData.summary || '';

//           const hasVisualization =
//             responseData.visualization ||
//             responseData.visualization_type ||
//             (Array.isArray(responseData.results) && responseData.results.length) ||
//             (Array.isArray(responseData.bugs)    && responseData.bugs.length)    ||
//             (Array.isArray(responseData.query_results) && responseData.query_results.length);

//           dispatch(finalizeStreamingMessage({
//             id:      message.id,
//             content: finalText,
//             data:    responseData,
//             type:    hasVisualization ? 'visualization' : 'text',
//             chatId:  newChatId,
//           }));

//           // If brand-new chat, reload sidebar
//           if (!params.chatId) {
//             dispatch(loadChatHistories());
//             if (newChatId) dispatch(setCurrentChat(newChatId));
//           }

//           onDone?.(newChatId);
//           break;
//         }

//         // ── Error ────────────────────────────────────────────────────────────
//         case 'error': {
//           es.close();
//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           dispatch(finalizeStreamingMessage({
//             id:      message.id,
//             content: accRef.current || 'An error occurred. Please try again.',
//             type:    'text',
//           }));
//           break;
//         }
//       }
//     };

//     es.onerror = () => {
//       es.close();
//       setStatusText('');
//       setIsDone(true);

//       if (finalizedRef.current) return;
//       finalizedRef.current = true;

//       dispatch(finalizeStreamingMessage({
//         id:      message.id,
//         content: accRef.current || 'Connection lost. Please try again.',
//         type:    'text',
//       }));
//     };

//     // ── Cleanup on unmount ──────────────────────────────────────────────────
//     return () => {
//       es.close();
//       if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once — streamParams never changes for a given message

//   // ── Render ─────────────────────────────────────────────────────────────────
//   if (isDone) return null; // Redux message takes over after finalize

//   return (
//     <div className="text-sm leading-relaxed text-gray-800">
//       {/* Waiting for first token */}
//       {!displayText && !isDone && <TypingDots />}

//       {/* Streaming text + cursor */}
//       {displayText && (
//         <span className="whitespace-pre-wrap">
//           {displayText}
//           {!isDone && <Cursor />}
//         </span>
//       )}

//       {/* Tool status pill */}
//       {statusText && <StatusPill text={statusText} />}
//     </div>
//   );
// };

// export default StreamingBubble;


/**
 * StreamingBubble.tsx
 *
 * Handles live SSE streaming for a single bot message.
 *
 * ARCHITECTURE
 * Redux:
 *   - stores placeholder message
 *   - stores final message after streaming
 *
 * Component:
 *   - owns EventSource
 *   - renders tokens smoothly
 *
 * Why not Redux per token?
 * Because that would cause the entire chat to re-render.
 * Instead we use:
 *
 * token → ref → requestAnimationFrame → React state
 *
 * This limits rendering to ~60fps.
 */

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useAppDispatch } from '../../store/hooks';
// import {
//   finalizeStreamingMessage,
//   setCurrentChat,
// } from '../../store/slices/chat.slice';
// import { loadChatHistories } from '../../store/slices/chat.thunk';
// import { ChatMessage } from '../../types/chat.types';

// const BASE_URL = 'http://localhost:8000/api/v1/aichatbot';

// interface Props {
//   message: ChatMessage;
//   onDone?: (newChatId: string) => void;
// }

// /* -------------------------------------------------------------------------- */
// /*                                  UI bits                                   */
// /* -------------------------------------------------------------------------- */

// const Cursor = () => (
//   <>
//     <span
//       className="inline-block w-[2px] h-[1em] bg-gray-600 ml-[1px] align-middle rounded-sm"
//       style={{ animation: 'sseCursor 1s step-end infinite' }}
//     />
//     <style>{`
//       @keyframes sseCursor {
//         0%, 100% { opacity: 1; }
//         50% { opacity: 0; }
//       }
//     `}</style>
//   </>
// );

// const TypingDots = () => (
//   <div className="flex items-center gap-1 py-1">
//     {['-0.3s', '-0.15s', '0s'].map((delay, i) => (
//       <span
//         key={i}
//         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//         style={{ animationDelay: delay }}
//       />
//     ))}
//   </div>
// );

// const StatusPill = ({ text }: { text: string }) => (
//   <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
//     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
//     <span className="text-xs text-blue-600 font-medium">{text}</span>
//   </div>
// );

// /* -------------------------------------------------------------------------- */
// /*                             Streaming Component                            */
// /* -------------------------------------------------------------------------- */

// const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
//   const dispatch = useAppDispatch();

//   /* ---------------------------------------------------------------------- */
//   /*                            Local streaming state                       */
//   /* ---------------------------------------------------------------------- */

//   const [displayText, setDisplayText] = useState('');
//   const [statusText, setStatusText] = useState('');
//   const [isDone, setIsDone] = useState(false);

//   // accumulator for tokens (no re-render)
//   const accRef = useRef('');

//   // requestAnimationFrame id
//   const rafRef = useRef<number | null>(null);

//   // SSE connection
//   const esRef = useRef<EventSource | null>(null);

//   // prevents finalize firing twice
//   const finalizedRef = useRef(false);

//   /* ---------------------------------------------------------------------- */
//   /*                      requestAnimationFrame flush                       */
//   /* ---------------------------------------------------------------------- */

//   const scheduleFlush = useCallback(() => {
//     if (rafRef.current !== null) return;

//     rafRef.current = requestAnimationFrame(() => {
//       rafRef.current = null;
//       setDisplayText(accRef.current);
//     });
//   }, []);

//   /* ---------------------------------------------------------------------- */
//   /*                            Start streaming                             */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     const params = message.streamParams;
//     if (!params) return;

//     const token = localStorage.getItem('access_token');

//     const qs = new URLSearchParams({
//       nl_question: params.nlQuestion,
//       project_id: String(params.projectId),
//       ...(params.chatId ? { chat_id: params.chatId } : {}),
//       token: token ?? '',
//     });

//     const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;

//     const es = new EventSource(url);
//     esRef.current = es;

//     /* ------------------------------ SSE events --------------------------- */

//     es.onmessage = (event) => {
//       let data: any;

//       try {
//         data = JSON.parse(event.data);
//       } catch {
//         return;
//       }

//       switch (data.type) {
//         /* ---------------------------- status event ----------------------- */

//         case 'status':
//           setStatusText(data.message ?? '');
//           break;

//         /* ----------------------------- token event ----------------------- */

//         case 'token':
//           accRef.current += data.content ?? '';
//           scheduleFlush();
//           break;

//         /* ----------------------------- tool result ----------------------- */

//         case 'result':
//           // ignore during streaming
//           break;

//         /* ------------------------------ done event ----------------------- */

//         case 'done': {
//           es.close();

//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           const responseData =
//             data.full_response?.data ?? data.full_response ?? {};

//           const newChatId = String(
//             responseData.chat_id ?? params.chatId ?? ''
//           );

//           const finalText =
//             accRef.current ||
//             responseData.answer ||
//             responseData.summary ||
//             '';

//           const hasVisualization =
//             responseData.visualization ||
//             responseData.visualization_type ||
//             (Array.isArray(responseData.results) &&
//               responseData.results.length) ||
//             (Array.isArray(responseData.bugs) &&
//               responseData.bugs.length) ||
//             (Array.isArray(responseData.query_results) &&
//               responseData.query_results.length);

//           dispatch(
//             finalizeStreamingMessage({
//               id: message.id,
//               content: finalText,
//               data: responseData,
//               type: hasVisualization ? 'visualization' : 'text',
//               chatId: newChatId,
//             })
//           );

//           // reload sidebar if new chat created
//           if (!params.chatId) {
//             dispatch(loadChatHistories());
//             if (newChatId) dispatch(setCurrentChat(newChatId));
//           }

//           onDone?.(newChatId);
//           break;
//         }

//         /* ------------------------------ error event ---------------------- */

//         case 'error': {
//           es.close();

//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           dispatch(
//             finalizeStreamingMessage({
//               id: message.id,
//               content:
//                 accRef.current ||
//                 'An error occurred. Please try again.',
//               type: 'text',
//             })
//           );

//           break;
//         }
//       }
//     };

//     /* ------------------------------ network error ----------------------- */

//     es.onerror = () => {
//       es.close();

//       setStatusText('');
//       setIsDone(true);

//       if (finalizedRef.current) return;
//       finalizedRef.current = true;

//       dispatch(
//         finalizeStreamingMessage({
//           id: message.id,
//           content:
//             accRef.current || 'Connection lost. Please try again.',
//           type: 'text',
//         })
//       );
//     };

//     /* ------------------------------ cleanup ----------------------------- */

//     return () => {
//       es.close();

//       if (rafRef.current !== null) {
//         cancelAnimationFrame(rafRef.current);
//       }
//     };

//   }, [dispatch, message.streamParams, message.id, onDone, scheduleFlush]);

//   /* ---------------------------------------------------------------------- */
//   /*                                Render                                  */
//   /* ---------------------------------------------------------------------- */

//   if (isDone) return null;

//   return (
//     <div className="text-sm leading-relaxed text-gray-800">
//       {/* waiting for first token */}
//       {/* {!displayText && !isDone && <TypingDots />} */}

//       {/* streaming text */}
//       {displayText && (
//         <span className="whitespace-pre-wrap">
//           {displayText}
//           {!isDone && <Cursor />}
//         </span>
//       )}

//       {/* tool status */}
//       {statusText && <StatusPill text={statusText} />}
//     </div>
//   );
// };

// export default StreamingBubble;


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useAppDispatch } from '../../store/hooks';
// import {
//   finalizeStreamingMessage,
//   setCurrentChat,
// } from '../../store/slices/chat.slice';
// import { loadChatHistories } from '../../store/slices/chat.thunk';
// import { ChatMessage } from '../../types/chat.types';

// const BASE_URL = 'http://localhost:8000/api/v1/aichatbot';

// interface Props {
//   message: ChatMessage;
//   onDone?: (newChatId: string) => void;
// }

// /* ---------------- Cursor ---------------- */

// const Cursor = () => (
//   <>
//     <span
//       className="inline-block w-[2px] h-[1em] bg-gray-600 ml-[1px] align-middle rounded-sm"
//       style={{ animation: 'sseCursor 1s step-end infinite' }}
//     />
//     <style>{`
//       @keyframes sseCursor {
//         0%,100% {opacity:1;}
//         50% {opacity:0;}
//       }
//     `}</style>
//   </>
// );

// /* ---------------- Status Pill ---------------- */

// const StatusPill = ({ text }: { text: string }) => (
//   <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
//     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
//     <span className="text-xs text-blue-600 font-medium">{text}</span>
//   </div>
// );

// /* -------------------------------------------------------------------------- */
// /*                             Streaming Component                            */
// /* -------------------------------------------------------------------------- */

// const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
//   const dispatch = useAppDispatch();

//   const [displayText, setDisplayText] = useState('');
//   const [typedText, setTypedText] = useState('');
//   const [statusText, setStatusText] = useState('');
//   const [isDone, setIsDone] = useState(false);

//   const accRef = useRef('');
//   const rafRef = useRef<number | null>(null);
//   const esRef = useRef<EventSource | null>(null);
//   const finalizedRef = useRef(false);

//   /* ---------------- rAF flush ---------------- */

//   const scheduleFlush = useCallback(() => {
//     if (rafRef.current !== null) return;

//     rafRef.current = requestAnimationFrame(() => {
//       rafRef.current = null;
//       setDisplayText(accRef.current);
//     });
//   }, []);

//   /* ---------------- Typing Animation ---------------- */

//   useEffect(() => {
//     if (typedText.length >= displayText.length) return;

//     const timeout = setTimeout(() => {
//       setTypedText(displayText.slice(0, typedText.length + 1));
//     }, 15); // typing speed

//     return () => clearTimeout(timeout);
//   }, [displayText, typedText]);

//   /* ---------------- Start Streaming ---------------- */

//   useEffect(() => {
//     const params = message.streamParams;
//     if (!params) return;

//     const token = localStorage.getItem('access_token');

//     const qs = new URLSearchParams({
//       nl_question: params.nlQuestion,
//       project_id: String(params.projectId),
//       ...(params.chatId ? { chat_id: params.chatId } : {}),
//       token: token ?? '',
//     });

//     const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;

//     const es = new EventSource(url);
//     esRef.current = es;

//     es.onmessage = (event) => {
//       let data: any;

//       try {
//         data = JSON.parse(event.data);
//       } catch {
//         return;
//       }

//       switch (data.type) {
//         case 'status':
//           setStatusText(data.message ?? '');
//           break;

//         case 'token':
//           accRef.current += data.content ?? '';
//           scheduleFlush();
//           break;

//         case 'done': {
//           es.close();

//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           const responseData =
//             data.full_response?.data ?? data.full_response ?? {};

//           const newChatId = String(
//             responseData.chat_id ?? params.chatId ?? ''
//           );

//           const finalText =
//             accRef.current ||
//             responseData.answer ||
//             responseData.summary ||
//             '';

//           dispatch(
//             finalizeStreamingMessage({
//               id: message.id,
//               content: finalText,
//               data: responseData,
//               type: 'text',
//               chatId: newChatId,
//             })
//           );

//           if (!params.chatId) {
//             dispatch(loadChatHistories());
//             if (newChatId) dispatch(setCurrentChat(newChatId));
//           }

//           onDone?.(newChatId);
//           break;
//         }

//         case 'error': {
//           es.close();

//           setStatusText('');
//           setIsDone(true);

//           if (finalizedRef.current) break;
//           finalizedRef.current = true;

//           dispatch(
//             finalizeStreamingMessage({
//               id: message.id,
//               content:
//                 accRef.current || 'An error occurred. Please try again.',
//               type: 'text',
//             })
//           );

//           break;
//         }
//       }
//     };

//     es.onerror = () => {
//       es.close();

//       setStatusText('');
//       setIsDone(true);

//       if (finalizedRef.current) return;
//       finalizedRef.current = true;

//       dispatch(
//         finalizeStreamingMessage({
//           id: message.id,
//           content:
//             accRef.current || 'Connection lost. Please try again.',
//           type: 'text',
//         })
//       );
//     };

//     return () => {
//       es.close();
//       if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
//     };
//   }, [dispatch, message.streamParams, message.id, onDone, scheduleFlush]);

//   /* ---------------- Render ---------------- */

//   if (isDone) return null;

//   return (
//     <div className="text-sm leading-relaxed text-gray-800">
//       {typedText && (
//         <span className="whitespace-pre-wrap">
//           {typedText}
//           {!isDone && <Cursor />}
//         </span>
//       )}

//       {statusText && <StatusPill text={statusText} />}
//     </div>
//   );
// };

// export default StreamingBubble;


// import React, { useEffect, useRef, useState } from 'react';
// import { useAppDispatch } from '../../store/hooks';
// import {
//   finalizeStreamingMessage,
//   setCurrentChat,
// } from '../../store/slices/chat.slice';
// import { loadChatHistories } from '../../store/slices/chat.thunk';
// import { ChatMessage } from '../../types/chat.types';

// const BASE_URL = 'http://localhost:8000/api/v1/aichatbot';

// interface Props {
//   message: ChatMessage;
//   onDone?: (newChatId: string) => void;
// }

// const Cursor = () => (
//   <span
//     className="inline-block w-[2px] h-[1em] bg-gray-600 ml-[1px] align-middle"
//     style={{ animation: 'blink 1s step-end infinite' }}
//   />
// );

// const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
//   const dispatch = useAppDispatch();

//   const [typedText, setTypedText] = useState('');
//   const [statusText, setStatusText] = useState('');
//   const [isDone, setIsDone] = useState(false);

//   const queueRef = useRef<string[]>([]);
//   const typingRef = useRef(false);
//   const esRef = useRef<EventSource | null>(null);
//   const finalizedRef = useRef(false);

//   /* ---------------- typing loop ---------------- */

//   const startTyping = () => {
//     if (typingRef.current) return;
//     typingRef.current = true;

//     const typeNext = () => {
//       if (queueRef.current.length === 0) {
//         typingRef.current = false;
//         return;
//       }

//       const nextChar = queueRef.current.shift()!;
//       setTypedText((prev) => prev + nextChar);

//       setTimeout(typeNext, 12); // typing speed
//     };

//     typeNext();
//   };

//   /* ---------------- streaming ---------------- */

// //   useEffect(() => {
// //     const params = message.streamParams;
// //     if (!params) return;

// //     const token = localStorage.getItem('access_token');

// //     const qs = new URLSearchParams({
// //       nl_question: params.nlQuestion,
// //       project_id: String(params.projectId),
// //       ...(params.chatId ? { chat_id: params.chatId } : {}),
// //       token: token ?? '',
// //     });

// //     const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;

// //     const es = new EventSource(url);
// //     esRef.current = es;

// //     es.onmessage = (event) => {
// //       let data: any;

// //       try {
// //         data = JSON.parse(event.data);
// //       } catch {
// //         return;
// //       }

// //       switch (data.type) {
// //         case 'status':
// //           setStatusText(data.message ?? '');
// //           break;

// //         case 'token':
// //           const text = data.content ?? '';

// //           // push each char to queue
// //           for (const c of text) {
// //             queueRef.current.push(c);
// //           }

// //           startTyping();
// //           break;

// //         case 'done': {
// //           es.close();
// //           setStatusText('');
// //           setIsDone(true);

// //           if (finalizedRef.current) break;
// //           finalizedRef.current = true;

// //           const responseData =
// //             data.full_response?.data ?? data.full_response ?? {};

// //           const newChatId = String(
// //             responseData.chat_id ?? params.chatId ?? ''
// //           );

// //           dispatch(
// //             finalizeStreamingMessage({
// //               id: message.id,
// //               content: typedText,
// //               data: responseData,
// //               type: 'text',
// //               chatId: newChatId,
// //             })
// //           );

// //           if (!params.chatId) {
// //             dispatch(loadChatHistories());
// //             if (newChatId) dispatch(setCurrentChat(newChatId));
// //           }

// //           onDone?.(newChatId);
// //           break;
// //         }
// //       }
// //     };

// //     es.onerror = () => {
// //       es.close();
// //       setIsDone(true);
// //     };

// //     return () => {
// //       es.close();
// //     };
// //   }, [dispatch, message, typedText, onDone]);

// useEffect(() => {
//   const params = message.streamParams;
//   if (!params) return;

//   // prevent duplicate streams
//   if (esRef.current) return;

//   const token = localStorage.getItem('access_token');

//   const qs = new URLSearchParams({
//     nl_question: params.nlQuestion,
//     project_id: String(params.projectId),
//     ...(params.chatId ? { chat_id: params.chatId } : {}),
//     token: token ?? '',
//   });

//   const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;

//   const es = new EventSource(url);
//   esRef.current = es;

//   es.onmessage = (event) => {
//     let data: any;

//     try {
//       data = JSON.parse(event.data);
//     } catch {
//       return;
//     }

//     switch (data.type) {
//       case 'status':
//         setStatusText(data.message ?? '');
//         break;

//       case 'token': {
//         const text = data.content ?? '';

//         for (const c of text) {
//           queueRef.current.push(c);
//         }

//         startTyping();
//         break;
//       }

//     //   case 'done': {
//     //     es.close();
//     //     setStatusText('');
//     //     setIsDone(true);

//     //     if (finalizedRef.current) break;
//     //     finalizedRef.current = true;

//     //     const responseData =
//     //       data.full_response?.data ?? data.full_response ?? {};

//     //     const newChatId = String(
//     //       responseData.chat_id ?? params.chatId ?? ''
//     //     );

//     //     dispatch(
//     //       finalizeStreamingMessage({
//     //         id: message.id,
//     //         content: typedText,
//     //         data: responseData,
//     //         type: 'text',
//     //         chatId: newChatId,
//     //       })
//     //     );

//     //     if (!params.chatId) {
//     //       dispatch(loadChatHistories());
//     //       if (newChatId) dispatch(setCurrentChat(newChatId));
//     //     }

//     //     onDone?.(newChatId);
//     //     break;
//     //   }

//     case 'done': {
//   es.close();
//   setStatusText('');

//   const responseData =
//     data.full_response?.data ?? data.full_response ?? {};

//   const newChatId = String(
//     responseData.chat_id ?? params.chatId ?? ''
//   );

//   const finishWhenTypingDone = () => {
//     if (queueRef.current.length === 0 && !typingRef.current) {

//       if (finalizedRef.current) return;
//       finalizedRef.current = true;

//       setIsDone(true);

//       dispatch(
//         finalizeStreamingMessage({
//           id: message.id,
//           content: typedText,
//           data: responseData,
//           type: 'text',
//           chatId: newChatId,
//         })
//       );

//       if (!params.chatId) {
//         dispatch(loadChatHistories());
//         if (newChatId) dispatch(setCurrentChat(newChatId));
//       }

//       onDone?.(newChatId);

//     } else {
//       requestAnimationFrame(finishWhenTypingDone);
//     }
//   };

//   finishWhenTypingDone();

//   break;
// }
//     }
//   };

//   es.onerror = () => {
//     es.close();
//     setIsDone(true);
//   };

//   return () => {
//     es.close();
//     esRef.current = null;
//   };

// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [message.id]);

//   if (isDone) return null;

//   return (
//     <div className="text-sm text-gray-800 whitespace-pre-wrap">
//       {typedText}
//       {!isDone && <Cursor />}

//       {statusText && (
//         <div className="text-xs text-blue-500 mt-2">{statusText}</div>
//       )}
//     </div>
//   );
// };

// export default StreamingBubble;


import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  finalizeStreamingMessage,
  setCurrentChat,
} from "../../store/slices/chat.slice";
import { loadChatHistories } from "../../store/slices/chat.thunk";
import { ChatMessage } from "../../types/chat.types";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE_URL = "http://localhost:8000/api/v1/aichatbot";

interface Props {
  message: ChatMessage;
  onDone?: (newChatId: string) => void;
}

/* Cursor */

const Cursor = () => (
  <>
    <span
      className="inline-block w-[2px] h-[1em] bg-gray-600 ml-[2px]"
      style={{ animation: "cursorBlink 1s step-end infinite" }}
    />
    <style>{`
      @keyframes cursorBlink {
        0%,100%{opacity:1;}
        50%{opacity:0;}
      }
    `}</style>
  </>
);

/* Component */

const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
  const dispatch = useAppDispatch();

  const [typedText, setTypedText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [renderMarkdown, setRenderMarkdown] = useState(false);

  const queueRef = useRef<string[]>([]);
  const fullTextRef = useRef("");
  const typingRef = useRef(false);
  const esRef = useRef<EventSource | null>(null);
  const finalizedRef = useRef(false);



  /* ---------------- typing engine ---------------- */

  const startTyping = () => {
    if (typingRef.current) return;
    typingRef.current = true;

    const typeNext = () => {
      if (queueRef.current.length === 0) {
        typingRef.current = false;
        return;
      }

      const nextChar = queueRef.current.shift()!;

      fullTextRef.current += nextChar;

      setTypedText((prev) => prev + nextChar);

      setTimeout(typeNext, 12);
    };

    typeNext();
  };

  /* ---------------- streaming ---------------- */

  useEffect(() => {
  const el = document.getElementById("chat-scroll-container");

  if (el) {
    el.scrollTop = el.scrollHeight;
  }
}, [typedText]);

  useEffect(() => {
    const params = message.streamParams;
    if (!params) return;

    if (esRef.current) return;

    const token = localStorage.getItem("access_token");

    const qs = new URLSearchParams({
      nl_question: params.nlQuestion,
      project_id: String(params.projectId),
      ...(params.chatId ? { chat_id: params.chatId } : {}),
      token: token ?? "",
    });

    const url = `${BASE_URL}/ask/stream/?${qs.toString()}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (event) => {
      let data: any;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case "status":
          setStatusText(data.message ?? "");
          break;

        case "token": {
          const text = data.content ?? "";

          for (const c of text) {
            queueRef.current.push(c);
          }

          startTyping();
          break;
        }

        case "done": {
          es.close();
          setStatusText("");

          const responseData =
            data.full_response?.data ?? data.full_response ?? {};

          const newChatId = String(
            responseData.chat_id ?? params.chatId ?? ""
          );

          const finalize = () => {
            if (queueRef.current.length === 0 && !typingRef.current) {
              if (finalizedRef.current) return;
              finalizedRef.current = true;

              setRenderMarkdown(true);

            //   dispatch(
            //     finalizeStreamingMessage({
            //       id: message.id,
            //       content: fullTextRef.current,
            //       data: responseData,
            //       type: "text",
            //       chatId: newChatId,
            //     })
            //   );

            const hasVisualization =
  responseData.visualization ||
  responseData.visualization_type ||
  (Array.isArray(responseData.results) && responseData.results.length) ||
  (Array.isArray(responseData.bugs) && responseData.bugs.length) ||
  (Array.isArray(responseData.query_results) && responseData.query_results.length);

dispatch(
  finalizeStreamingMessage({
    id: message.id,
    content: responseData.answer || responseData.summary || fullTextRef.current,
    data: {
      ...responseData,
      results:
        responseData.results ||
        responseData.bugs ||
        responseData.query_results ||
        [],
    },
    type: hasVisualization ? "visualization" : "text",
    chatId: newChatId,
  })
);

              if (!params.chatId) {
                dispatch(loadChatHistories());
                if (newChatId) dispatch(setCurrentChat(newChatId));
              }

              onDone?.(newChatId);
            } else {
              requestAnimationFrame(finalize);
            }
          };

          finalize();
          break;
        }
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };

    // stream must start once per message
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id]);

  /* ---------------- render ---------------- */

//   return (
//     <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
//       {renderMarkdown ? (
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {fullTextRef.current}
//         </ReactMarkdown>
//       ) : (
//         <>
//           {typedText}
//           <Cursor />
//         </>
//       )}

//       {statusText && (
//         <div className="text-xs text-blue-500 mt-2">{statusText}</div>
//       )}
//     </div>
//   );


// return (
//   <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
//     <ReactMarkdown remarkPlugins={[remarkGfm]}>
//       {typedText}
//     </ReactMarkdown>

//     {!typingRef.current && <Cursor />}

//     {statusText && (
//       <div className="text-xs text-blue-500 mt-2">{statusText}</div>
//     )}
//   </div>
// );

return (
  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {typedText}
    </ReactMarkdown>

    {!typingRef.current && <Cursor />}

    {statusText && (
      <div className="text-xs text-blue-500 mt-2">{statusText}</div>
    )}

    <div  />
  </div>
);

};

export default StreamingBubble;