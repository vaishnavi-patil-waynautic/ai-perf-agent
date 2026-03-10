// import { createAsyncThunk } from '@reduxjs/toolkit';
// import {
//   fetchChatHistories,
//   fetchChatMessages,
//   getFAQs,
//   sendFeedbackAPI,
//   sendMessageToAPI,
// } from '../../services/chat.service';
// import { startChatStream } from '../../services/streaming.service';
// import { APIError, ChatHistory, ChatMessage, FAQ, MessageReactionPayload, SendMessagePayload } from '../../types/chat.types';
// import { 
//   addUserMessage, 
//   addStreamingBotMessage, 
//   updateStreamingMessage, 
//   finalizeStreamingMessage 
// } from './chat.slice';

// // Send message thunk
// // export const sendMessage = createAsyncThunk(
// //   'chat/sendMessage',
// //   async (payload: SendMessagePayload, { dispatch, getState, rejectWithValue }) => {
// //     try {
// //       const state: any = getState();
// //       const chatId = state.chat.currentChatId;

// //       // Add user message immediately
// //       const userMessage: ChatMessage = {
// //         id: Date.now().toString(),
// //         sender: 'user',
// //         type: 'text',
// //         content: payload.text,
// //         timestamp: new Date(),
// //       };
// //       dispatch(addUserMessage(userMessage));

// //       // Call API
// //       const { message, chatId: newChatId } = await sendMessageToAPI(
// //         payload.text,
// //         payload.modelId,
// //         chatId && chatId !== "0" ? chatId : undefined
// //       );

// //       // If chat was newly created → reload chat list
// //       if (!chatId || chatId === "0") {
// //         dispatch(loadChatHistories());
// //       }

// //       return { message, chatId: newChatId };
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || 'Failed to send message');
// //     }
// //   }
// // );

// export const sendMessage = createAsyncThunk<
//   { message: ChatMessage; chatId: string }, // return
//   SendMessagePayload,                       // payload
//   { rejectValue: APIError }                 // reject type
// >(
//   'chat/sendMessage',
//   async (payload, { dispatch, getState, rejectWithValue }) => {
//     try {
//       const state: any = getState();
//       const chatId = state.chat.currentChatId;

//       const userMessage: ChatMessage = {
//         id: Date.now().toString(),
//         sender: 'user',
//         type: 'text',
//         content: payload.text,
//         timestamp: new Date(),
//       };

//       dispatch(addUserMessage(userMessage));

//       const { message, chatId: newChatId } = await sendMessageToAPI(
//         payload.text,
//         payload.modelId,
//         chatId && chatId !== "0" ? chatId : undefined
//       );

//       if (!chatId || chatId === "0") {
//         dispatch(loadChatHistories());
//       }

//       return { message, chatId: newChatId };

//     } catch (error: any) {
//       return rejectWithValue({
//         message: error?.message || 'Failed to send message'
//       });
//     }
//   }
// );

// // Send message with streaming
// // export const sendMessageWithStreaming = createAsyncThunk(
// //   'chat/sendMessageWithStreaming',
// //   async (
// //     payload: SendMessagePayload & { onStatus?: (msg: string) => void },
// //     { dispatch, getState, rejectWithValue }
// //   ) => {

// export const sendMessageWithStreaming = createAsyncThunk<
//   { message: ChatMessage; chatId: string | null },
//   SendMessagePayload & { onStatus?: (msg: string) => void },
//   { rejectValue: APIError }
// >(
//   'chat/sendMessageWithStreaming',
//   async (payload, { dispatch, getState, rejectWithValue }) => {
//     try {
//       const state: any = getState();
//       const chatId = state.chat.currentChatId;

//       // Add user message immediately
//       const userMessage: ChatMessage = {
//         id: `user-${Date.now()}`,
//         sender: 'user',
//         type: 'text',
//         content: payload.text,
//         timestamp: new Date(),
//       };
//       dispatch(addUserMessage(userMessage));

//       // Create placeholder bot message
//       const botMessageId = `bot-${Date.now()}`;
//       dispatch(addStreamingBotMessage({ id: botMessageId }));

//       let accumulatedText = '';
//       let finalData: any = null;
//       let newChatId: string | null = null;

//       // Start streaming
//       return new Promise((resolve, reject) => {
//         const closeStream = startChatStream(
//           {
//             nlQuestion: payload.text,
//             projectId: 1,
//             chatId: chatId && chatId !== "0" ? chatId : null,
//           },
//           {
//             onStatus: (message) => {
//               payload.onStatus?.(message);
//             },
//             onToken: (chunk) => {
//               accumulatedText += chunk;
//               dispatch(updateStreamingMessage({ 
//                 id: botMessageId, 
//                 content: accumulatedText 
//               }));
//             },
//             onResult: (tool, data) => {
//               console.log(`Tool result from ${tool}:`, data);
//               // Store results for final message
//               if (!finalData) finalData = {};
//               if (tool === 'fetch_bugs') {
//                 finalData.bugs = data;
//               } else if (tool === 'query_database') {
//                 finalData.results = data;
//               }
//             },
//             onDone: (fullResponse, error) => {
//               // Clear status
//               payload.onStatus?.('');
              
//               if (error) {
//                 reject(new Error(error));
//                 return;
//               }

//               // Extract data from response
//               const responseData = fullResponse?.data || fullResponse;
//               newChatId = String(responseData.chat_id || chatId);

//               // Determine message type
//               const hasVisualization =
//                 responseData.visualization ||
//                 responseData.visualization_type ||
//                 (responseData.results && Array.isArray(responseData.results)) ||
//                 (responseData.bugs && Array.isArray(responseData.bugs));

//               // Finalize the message
//               dispatch(finalizeStreamingMessage({
//                 id: botMessageId,
//                 content: accumulatedText || responseData.answer || responseData.summary || '',
//                 data: responseData,
//                 type: hasVisualization ? 'visualization' : 'text',
//               }));

//               // If chat was newly created → reload chat list
//               if (!chatId || chatId === "0") {
//                 dispatch(loadChatHistories());
//               }

//               resolve({ 
//                 message: {
//                   id: botMessageId,
//                   sender: 'bot',
//                   type: hasVisualization ? 'visualization' : 'text',
//                   content: accumulatedText,
//                   timestamp: new Date(),
//                   data: responseData,
//                 },
//                 chatId: newChatId 
//               });
//             },
//             onError: (message) => {
//               // Clear status on error
//               payload.onStatus?.('');
//               reject(new Error(message));
//             },
//           }
//         );
//       });
//     } catch (error: any) {
//       return rejectWithValue({
//   message: error?.message || 'Failed to send message'
// });
// }
//   }
// );
// // Load FAQs
// // export const loadFAQs = createAsyncThunk(
// //   'chat/loadFAQs',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const faqs = await getFAQs();
// //       return faqs;
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || 'Failed to load FAQs');
// //     }
// //   }
// // );

// // // Load chat histories
// // export const loadChatHistories = createAsyncThunk(
// //   'chat/loadChatHistories',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       return await fetchChatHistories();
// //     } catch (error: any) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// export const loadFAQs = createAsyncThunk<
//   FAQ[],
//   void,
//   { rejectValue: APIError }
// >(
//   'chat/loadFAQs',
//   async (_, { rejectWithValue }) => {
//     try {
//       const faqs = await getFAQs();
//       return faqs;
//     } catch (error: any) {
//       return rejectWithValue({
//         message: error?.message || 'Failed to load FAQs'
//       });
//     }
//   }
// );

// export const loadChatHistories = createAsyncThunk<
//   ChatHistory[],
//   void,
//   { rejectValue: APIError }
// >(
//   'chat/loadChatHistories',
//   async (_, { rejectWithValue }) => {
//     try {
//       return await fetchChatHistories();
//     } catch (error: any) {
//       return rejectWithValue({
//         message: error?.message || 'Failed to load histories'
//       });
//     }
//   }
// );

// // Load messages for a specific chat
// export const loadChatMessages = createAsyncThunk(
//   'chat/loadChatMessages',
//   async (chatId: string, { rejectWithValue }) => {
//     try {
//       return await fetchChatMessages(chatId);
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // export const sendFeedback = createAsyncThunk(
// //   'chat/sendFeedback',
// //   async ({ messageId, reaction }: MessageReactionPayload, { rejectWithValue }) => {
// //     try {
// //       await sendFeedbackAPI(
// //         messageId,
// //         reaction === 'like',
// //         reaction === 'dislike'
// //       );
// //       return { messageId, reaction };
// //     } catch (error: any) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// // Create new chat
// export const createChat = createAsyncThunk(
//   'chat/createChat',
//   async (_, { rejectWithValue }) => {
//     try {
//       const chatId = await createChat();
//       return chatId;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to create chat');
//     }
//   }
// );


// export const sendFeedback = createAsyncThunk<
//   MessageReactionPayload,
//   MessageReactionPayload,
//   { rejectValue: APIError }
// >(
//   'chat/sendFeedback',
//   async ({ messageId, reaction }, { rejectWithValue }) => {
//     try {
//       await sendFeedbackAPI(
//         messageId,
//         reaction === 'like',
//         reaction === 'dislike'
//       );

//       return { messageId, reaction };

//     } catch (error: any) {
//       return rejectWithValue({
//         message: error?.message || 'Feedback failed'
//       });
//     }
//   }
// );


import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchChatHistories,
  fetchChatMessages,
  getFAQs,
  sendFeedbackAPI,
  sendMessageToAPI,
} from '../../services/chat.service';
import { APIError, ChatHistory, ChatMessage, FAQ, MessageReactionPayload, SendMessageAPIResponse, SendMessagePayload } from '../../types/chat.types';
import {
  addUserMessage,
  addStreamingBotMessage,
  finalizeStreamingMessage,
} from './chat.slice';

// ─────────────────────────────────────────────────────────────────────────────
// sendMessageWithStreaming
//
// ARCHITECTURE CHANGE:
//   Previously: thunk owned the EventSource and dispatched every token → Redux
//               → all MessageBubbles re-rendered on each word (very slow)
//
//   Now:        thunk only adds the placeholder message with streamParams.
//               The <StreamingBubble> component owns the EventSource and updates
//               its LOCAL state (no Redux on every token → only streaming bubble
//               re-renders at 60fps via requestAnimationFrame).
//               On done/error, StreamingBubble dispatches finalizeStreamingMessage
//               once to commit the result to Redux.
// ─────────────────────────────────────────────────────────────────────────────
export const sendMessageWithStreaming = createAsyncThunk<
  { botMessageId: string }, // return type
  SendMessagePayload & { onStatus?: (msg: string) => void }, // payload
  { rejectValue: APIError }
>(
  'chat/sendMessageWithStreaming',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const chatId = state.chat.currentChatId;

      // 1. Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        content: payload.text,
        timestamp: new Date(),
      };
      dispatch(addUserMessage(userMessage));

      // 2. Add streaming placeholder — stores streamParams so the component
      //    can start its own EventSource without needing props drilling
      const botMessageId = `bot-${Date.now()}`;
      dispatch(
        addStreamingBotMessage({
          id: botMessageId,
          streamParams: {
            nlQuestion: payload.text,
            projectId: 1,
            chatId: chatId && chatId !== '0' ? chatId : null,
          },
        })
      );

      // 3. Return — StreamingBubble component takes it from here
      return { botMessageId };
    } catch (error: any) {
      return rejectWithValue({
  message: error?.message || 'Failed to send message'
});
}
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// All other thunks below are UNCHANGED
// ─────────────────────────────────────────────────────────────────────────────

export const sendMessage = createAsyncThunk<
  SendMessageAPIResponse,
  SendMessagePayload,
  { rejectValue: APIError }
>(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const chatId = state.chat.currentChatId;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'text',
        content: payload.text,
        timestamp: new Date(),
      };
      dispatch(addUserMessage(userMessage));

      const { message, chatId: newChatId } = await sendMessageToAPI(
        payload.text,
        payload.modelId,
        chatId && chatId !== '0' ? chatId : undefined
      );

      if (!chatId || chatId === '0') {
        dispatch(loadChatHistories());
      }

      return { message, chatId: newChatId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const loadFAQs = createAsyncThunk<
  FAQ[],
  void,
  { rejectValue: APIError }
>(
  'chat/loadFAQs',
  async (_, { rejectWithValue }) => {
    try {
      return await getFAQs();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load FAQs');
    }
  }
);

export const loadChatHistories = createAsyncThunk<
  ChatHistory[],
  void,
  { rejectValue: APIError }
>(
  'chat/loadChatHistories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchChatHistories();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadChatMessages = createAsyncThunk(
  'chat/loadChatMessages',
  async (chatId: string, { rejectWithValue }) => {
    try {
      return await fetchChatMessages(chatId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendFeedback = createAsyncThunk<
  MessageReactionPayload,
  MessageReactionPayload,
  { rejectValue: APIError }
>(
  'chat/sendFeedback',
  async ({ messageId, reaction }: MessageReactionPayload, { rejectWithValue }) => {
    try {
      await sendFeedbackAPI(messageId, reaction === 'like', reaction === 'dislike');
      return { messageId, reaction };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (_, { rejectWithValue }) => {
    try {
      const chatId = await createChat();
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create chat');
    }
  }
);