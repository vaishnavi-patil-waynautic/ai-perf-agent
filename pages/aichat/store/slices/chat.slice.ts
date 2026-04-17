// import { createSlice, PayloadAction } from '@reduxjs/toolkit';// import {//   ChatState,//   ChatMessage,//   ChatHistory,//   FAQ,//   MessageReactionPayload,// } from '../../types/chat.types';// import {//   sendMessage,//   // loadFAQs,//   loadChatHistories,//   loadChatMessages,//   createChat,//   sendFeedback,//   loadFAQs,// } from './chat.thunk';// import { stat } from 'fs';// const initialState: ChatState = {//   // messages: [//   //   {//   //     id: '1',//   //     sender: 'bot',//   //     type: 'text',//   //     content://   //       "Hello! I'm your Performance Engineering Assistant.\n\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",//   //     timestamp: new Date(),//   //   },//   // ],//   messages: [],//   chatHistories: [],//   currentChatId: null,//   faqs: [],//   selectedModel: 'gpt-4',//   isLoading: false,//   error: null,//   isFullScreen: false,//   chatLoading: false,//   chatMode: 'collapsed'// };// const chatSlice = createSlice({//   name: 'chat',//   initialState,//   reducers: {//     toggleScreenView: (state) => {//       state.isFullScreen = !state.isFullScreen;//     },//     addUserMessage: (state, action: PayloadAction<ChatMessage>) => {//       state.messages.push(action.payload);//       state.chatLoading = true;//     },//     setChatMode: (state, action) => {//   state.chatMode = action.payload;// },//     // Streaming: Add a placeholder bot message that will be updated//     // addStreamingBotMessage: (state, action: PayloadAction<{ id: string }>) => {//     //   state.messages.push({//     //     id: action.payload.id,//     //     sender: 'bot',//     //     type: 'text',//     //     content: '',//     //     timestamp: new Date(),//     //   });//     //   state.chatLoading = true;//     // },//     // Streaming: Update the bot message content as tokens arrive//     // updateStreamingMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {//     //   const message = state.messages.find((m) => m.id === action.payload.id);//     //   if (message) {//     //     message.content = action.payload.content;//     //   }//     // },//     // Streaming: Finalize the message with complete data//     // finalizeStreamingMessage: (state, action: PayloadAction<{ //     //   id: string; //     //   content: string; //     //   data?: any;//     //   type?: 'text' | 'visualization';//     // }>) => {//     //   const message = state.messages.find((m) => m.id === action.payload.id);//     //   if (message) {//     //     message.content = action.payload.content;//     //     message.data = action.payload.data;//     //     message.type = action.payload.type || 'text';//     //   }//     //   state.chatLoading = false;//     // },//     // In addStreamingBotMessage reducer://     // chat.slice.ts — only the CHANGED reducer actions shown//     // The rest of your slice (extraReducers, other actions) stays identical//     // ── CHANGE 1: addStreamingBotMessage now accepts streamParams ──────────────//     addStreamingBotMessage: (//       state,//       action: PayloadAction<{//         id: string;//         streamParams: {//           nlQuestion: string;//           projectId: number;//           chatId: string | null;//         };//       }>//     ) => {//       state.messages.push({//         id: action.payload.id,//         sender: 'bot',//         type: 'text',//         content: '',//         timestamp: new Date(),//         isStreaming: true,//         streamParams: action.payload.streamParams,   // ← stored so StreamingBubble can read it//       });//       state.chatLoading = true;//     },//     // ── CHANGE 2: finalizeStreamingMessage clears isStreaming + streamParams ───//     finalizeStreamingMessage: (//       state,//       action: PayloadAction<{//         id: string;//         content: string;//         data?: any;//         type?: 'text' | 'visualization';//         chatId?: string;//       }>//     ) => {//       const message = state.messages.find((m) => m.id === action.payload.id);//       if (message) {//         message.content = action.payload.content;//         message.data = action.payload.data;//         message.type = action.payload.type || 'text';//         message.isStreaming = false;//         message.streamParams = undefined;            // ← clean up//       }//       state.chatLoading = false;//       // Update chatId if this was a new chat//       if (action.payload.chatId) {//         if (!state.currentChatId || state.currentChatId === '0') {//           state.currentChatId = action.payload.chatId;//         }//       }//     },//     // ── CHANGE 3: updateStreamingMessage stays but is only used for fallback ──//     // (StreamingBubble manages its own local state — this action is no longer//     //  dispatched on every token, only used if you ever need a Redux-driven update)//     updateStreamingMessage: (//       state,//       action: PayloadAction<{ id: string; content: string }>//     ) => {//       const message = state.messages.find((m) => m.id === action.payload.id);//       if (message) {//         message.content = action.payload.content;//       }//     },//     setSelectedModel: (state, action: PayloadAction<string>) => {//       state.selectedModel = action.payload;//     },//     toggleMessageReaction: (state, action: PayloadAction<MessageReactionPayload>) => {//       const message = state.messages.find((m) => m.id === action.payload.messageId);//       if (message) {//         if (action.payload.reaction === 'like') {//           message.liked = !message.liked;//           if (message.liked) message.disliked = false;//         } else {//           message.disliked = !message.disliked;//           if (message.disliked) message.liked = false;//         }//       }//     },//     clearMessages: (state) => {//       state.messages = [];//     },//     setCurrentChat: (state, action: PayloadAction<string>) => {//       state.currentChatId = action.payload;//     },//   },//   extraReducers: (builder) => {//     // Send Message//     builder//       .addCase(sendMessage.pending, (state) => {//         state.isLoading = true;//         state.error = null;//         state.chatLoading = true;//       })//       .addCase(sendMessage.fulfilled, (state, action) => {//         console.log("🟢 addUserMessage", action.payload);//         state.isLoading = false;//         state.chatLoading = false;//         state.messages.push(action.payload.message);//         const newChatId = action.payload.chatId;//         // If this was a new chat (chat=0 or null)//         if (!state.currentChatId || state.currentChatId === "0") {//           state.currentChatId = newChatId;//         }//       })//       .addCase(sendFeedback.fulfilled, (state, action) => {//   const { messageId, reaction } = action.payload;//   const msg = state.messages.find(m => m.id === messageId);//   if (!msg) return;//   if (reaction === "like") {//     msg.liked = true;//     msg.disliked = false;//   }//   if (reaction === "dislike") {//     msg.disliked = true;//     msg.liked = false;//   }// })//       // .addCase(sendFeedback.fulfilled, (state, action) => {//       //   const msg = state.messages.find(m => m.id === action.payload.messageId);//       //   if (msg) {//       //     msg.liked = action.payload.reaction === 'like';//       //     msg.disliked = action.payload.reaction === 'dislike';//       //   }//       // })//       // .addCase(sendMessage.rejected, (state, action) => {//       //   state.isLoading = false;//       //   state.error = action.payload as string;//       //   state.chatLoading = false;//       // })//       .addCase(sendMessage.rejected, (state, action) => {//         state.isLoading = false;//         state.chatLoading = false;//         if (action.payload) {//           state.error = action.payload.message;//         } else {//           state.error = action.error.message || "Something went wrong";//         }//       })//       .addCase(loadFAQs.fulfilled, (state, action) => {//         state.faqs = action.payload;//       })//       .addCase(loadChatHistories.fulfilled, (state, action) => {//         console.log("🟢 Load History", state);//         state.chatHistories = action.payload;//       })//       .addCase(loadChatMessages.pending, (state) => {//         state.isLoading = true;//       })//       .addCase(loadChatMessages.fulfilled, (state, action) => {//         state.isLoading = false;//         state.messages = [...action.payload];//       })//       .addCase(loadChatMessages.rejected, (state, action) => {//         state.isLoading = false;//         state.error = action.payload as string;//       })//       .addCase(createChat.fulfilled, (state, action) => {//         state.currentChatId = action.payload;//         state.messages = [];   // must be empty//       });//   },// });// export const {//   addUserMessage,//   addStreamingBotMessage,//   updateStreamingMessage,//   finalizeStreamingMessage,//   setSelectedModel,//   toggleMessageReaction,//   clearMessages,//   setCurrentChat,//   toggleScreenView,//   setChatMode// } = chatSlice.actions;// export default chatSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, ChatMessage, ChatEntry, MessageReactionPayload } from '../../types/chat.types';
import {
  sendMessage, loadChatHistories, loadChatMessages,
  createChat, sendFeedback, loadFAQs, abortStream, deleteByChatId,
} from './chat.thunk';

// ── helpers ──────────────────────────────────────────────────────────────────

const emptyChatEntry = (): ChatEntry => ({
  messages: [],
  isStreaming: false,
  streamId: null,
  loading: false,
});

const ensureChat = (state: ChatState, chatId: string) => {
  if (!chatId) return null;

  if (!state.chatMap[chatId]) {
    state.chatMap[chatId] = emptyChatEntry();
  }
  return state.chatMap[chatId];
};

// ── initial state ─────────────────────────────────────────────────────────────

const initialState: ChatState = {
  chatMap: {},
  chatHistories: [],
  currentChatId: null,
  faqs: [],
  selectedModel: 'gpt-4',
  isLoading: false,
  error: null,
  isFullScreen: false,
  chatLoading: false,
  chatMode: 'collapsed',
  activeStreamId: null,
};

const resetStreamingStateHelper = (state: ChatState) => {
  const chatId =
    state.currentChatId && state.currentChatId !== '0'
      ? state.currentChatId
      : 'new';

  const entry = state.chatMap[chatId];
  if (!entry) return;

  entry.isStreaming = false;
  entry.streamId = null;

  entry.messages.forEach((msg) => {
    if (msg.isStreaming) {
      msg.isStreaming = false;
    }
  });

  state.activeStreamId = null;
  state.chatLoading = false;
  state.isLoading = false;
};

// ── slice ─────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    toggleScreenView: (state) => { state.isFullScreen = !state.isFullScreen; },
    setChatMode: (state, action) => { state.chatMode = action.payload; },
    setSelectedModel: (state, action: PayloadAction<string>) => { state.selectedModel = action.payload; },
    setCurrentChat: (state, action: PayloadAction<string>) => { state.currentChatId = action.payload; },
    setActiveStreamId: (state, action: PayloadAction<string | null>) => { state.activeStreamId = action.payload; },

    addUserMessage: (state, action: PayloadAction<ChatMessage & { chatId?: string }>) => {
      const { chatId: cid, ...msg } = action.payload;
      const key = cid ?? ((!state.currentChatId || state.currentChatId === '0') ? 'new' : state.currentChatId);
      ensureChat(state, key).messages.push(msg);
    },

    addStreamingBotMessage: (state, action: PayloadAction<{
      id: string;
      modelName: string;
      chatId?: string;
      streamParams: { nlQuestion: string; projectId: number; chatId?: string | null };
    }>) => {
      const key = action.payload.chatId ?? action.payload.streamParams.chatId ?? state.currentChatId ?? 'new';
      const entry = ensureChat(state, key);
      entry.messages.push({
        id: action.payload.id,
        sender: 'bot',
        type: 'text',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
        modelName: action.payload.modelName,
        streamParams: action.payload.streamParams,
      });
      entry.isStreaming = true;
      entry.streamId = null; // will be set by StreamingBubble via setStreamId
    },

    setStreamId: (state, action: PayloadAction<{ chatId: string; streamId: string | null }>) => {
      const entry = state.chatMap[action.payload.chatId];
      if (entry) entry.streamId = action.payload.streamId;
      state.activeStreamId = action.payload.streamId;
    },

    finalizeStreamingMessage: (state, action: PayloadAction<{
      id: string;
      chatId: string;
      content: string;
      data?: any;
      type?: 'text' | 'visualization';
      newChatId?: string;
      modelName?: string;
    }>) => {
      const { id, chatId, content, data, type, newChatId, modelName } = action.payload;

      // Find the message in the correct chat entry
      const entry = state.chatMap[chatId];
      if (entry) {
        const msg = entry.messages.find(m => m.id === id);
        if (msg) {
          msg.content = content;
          msg.data = data;
          msg.type = type || 'text';
          msg.isStreaming = false;
          msg.modelName = modelName ?? msg.modelName;
          msg.streamParams = undefined;
        }
        entry.isStreaming = false;
        entry.streamId = null;
      }

      // If this was a new chat that got a real ID, migrate the entry
      if (newChatId && newChatId !== chatId && newChatId !== '0') {
        if (state.chatMap[chatId]) {
          state.chatMap[newChatId] = state.chatMap[chatId];
          delete state.chatMap[chatId];
        }
        if (state.currentChatId === chatId || state.currentChatId === '0') {
          state.currentChatId = newChatId;
        }
        // Remove the optimistic 'new' placeholder — real entry will come from loadChatHistories
        state.chatHistories = state.chatHistories.filter(c => c.id !== 'new');
      }

      state.activeStreamId = null;
    },

    updateStreamingMessage: (state, action: PayloadAction<{ id: string; chatId: string; content: string }>) => {
      const entry = state.chatMap[action.payload.chatId];
      if (entry) {
        const msg = entry.messages.find(m => m.id === action.payload.id);
        if (msg) msg.content = action.payload.content;
      }
    },

    toggleMessageReaction: (state, action: PayloadAction<MessageReactionPayload & { chatId?: string }>) => {
      const key = action.payload.chatId ?? state.currentChatId ?? '';
      const entry = state.chatMap[key];
      if (!entry) return;
      const msg = entry.messages.find(m => m.id === action.payload.messageId);
      if (!msg) return;
      if (action.payload.reaction === 'like') { msg.liked = !msg.liked; if (msg.liked) msg.disliked = false; }
      else { msg.disliked = !msg.disliked; if (msg.disliked) msg.liked = false; }
    },



    clearMessages: (state) => ({
      chatMap: {},
      chatHistories: [],
      currentChatId: null,
      faqs: [],
      selectedModel: 'gpt-4',
      isLoading: false,
      error: null,
      isFullScreen: state.isFullScreen,
      chatLoading: false,
      chatMode: 'collapsed',
      activeStreamId: null,
    }),

    // clearMessages : () =>{

    // },

    addOptimisticChat: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const exists = state.chatHistories.find(c => c.id === action.payload.id);
      if (!exists) {
        state.chatHistories.unshift({
          id: action.payload.id,
          title: action.payload.title,
          lastMessage: '',
          timestamp: new Date().toISOString(),
          messageCount: 0,
        });
      }
    },

    resetChatState: (state) => {
      state.chatMap = {};
      state.chatHistories = [];
      state.currentChatId = '0';
      state.activeStreamId = null;
    },

    clearNewChat: (state) => {
      delete state.chatMap['new'];
    },

    // resetChatState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const newChatId = action.payload.chatId;
        const key = state.currentChatId && state.currentChatId !== '0' ? state.currentChatId : 'new';
        ensureChat(state, key).messages.push(action.payload.message);

        if (!state.currentChatId || state.currentChatId === '0') {
          state.currentChatId = newChatId;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || action.error.message || 'Something went wrong';
      })
      .addCase(sendFeedback.fulfilled, (state, action) => {
        const { messageId, reaction } = action.payload;
        // Search all chats for the message
        for (const entry of Object.values(state.chatMap)) {
          const msg = entry.messages.find(m => m.id === messageId);
          if (msg) {
            if (reaction === 'like') { msg.liked = true; msg.disliked = false; }
            else { msg.disliked = true; msg.liked = false; }
            break;
          }
        }
      })
      .addCase(loadFAQs.fulfilled, (state, action) => { state.faqs = action.payload; })
      .addCase(loadChatHistories.fulfilled, (state, action) => { state.chatHistories = action.payload; })
      .addCase(loadChatMessages.pending, (state, action) => {
        const chatId = action.meta.arg as string;
        ensureChat(state, chatId).loading = true;
      })
      .addCase(loadChatMessages.fulfilled, (state, action) => {
        const chatId = action.meta.arg as string;
        const entry = ensureChat(state, chatId);
        entry.loading = false;
        // Merge: keep any streaming messages, add loaded ones
        const streamingMsgs = entry.messages.filter(m => m.isStreaming);
        const loadedIds = new Set(action.payload.map((m: ChatMessage) => m.id));
        const uniqueStreaming = streamingMsgs.filter(m => !loadedIds.has(m.id));
        entry.messages = [...action.payload, ...uniqueStreaming];
      })
      .addCase(loadChatMessages.rejected, (state, action) => {
        const chatId = action.meta.arg as string;
        if (state.chatMap[chatId]) state.chatMap[chatId].loading = false;
        state.error = action.payload as string;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.currentChatId = action.payload;
        state.chatMap[action.payload] = emptyChatEntry();
      })
      .addCase(abortStream.fulfilled, (state) => {
  resetStreamingStateHelper(state);
})
.addCase(abortStream.rejected, (state) => {
  resetStreamingStateHelper(state);
})
      .addCase(deleteByChatId.fulfilled, (state, action) => {
        state.chatHistories = state.chatHistories.filter(c => c.id !== action.payload);
        delete state.chatMap[action.payload];
      });
},
});

export const {
  addUserMessage,
  addStreamingBotMessage,
  updateStreamingMessage,
  finalizeStreamingMessage,
  setSelectedModel,
  toggleMessageReaction,
  clearMessages,
  setCurrentChat,
  toggleScreenView,
  setChatMode,
  setActiveStreamId,
  setStreamId,
  addOptimisticChat,
  resetChatState,
  clearNewChat,
} = chatSlice.actions;

export default chatSlice.reducer;
