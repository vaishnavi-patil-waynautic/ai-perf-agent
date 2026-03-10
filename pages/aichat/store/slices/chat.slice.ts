import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatState,
  ChatMessage,
  ChatHistory,
  FAQ,
  MessageReactionPayload,
} from '../../types/chat.types';
import {
  sendMessage,
  // loadFAQs,
  loadChatHistories,
  loadChatMessages,
  createChat,
  sendFeedback,
  loadFAQs,
} from './chat.thunk';
import { stat } from 'fs';

const initialState: ChatState = {
  // messages: [
  //   {
  //     id: '1',
  //     sender: 'bot',
  //     type: 'text',
  //     content:
  //       "Hello! I'm your Performance Engineering Assistant.\n\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",
  //     timestamp: new Date(),
  //   },
  // ],
  messages: [],
  chatHistories: [],
  currentChatId: null,
  faqs: [],
  selectedModel: 'gpt-4',
  isLoading: false,
  error: null,
  isFullScreen: false,
  chatLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleScreenView: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      state.chatLoading = true;
    },
    // Streaming: Add a placeholder bot message that will be updated
    // addStreamingBotMessage: (state, action: PayloadAction<{ id: string }>) => {
    //   state.messages.push({
    //     id: action.payload.id,
    //     sender: 'bot',
    //     type: 'text',
    //     content: '',
    //     timestamp: new Date(),
    //   });
    //   state.chatLoading = true;
    // },
    // Streaming: Update the bot message content as tokens arrive
    // updateStreamingMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
    //   const message = state.messages.find((m) => m.id === action.payload.id);
    //   if (message) {
    //     message.content = action.payload.content;
    //   }
    // },
    // Streaming: Finalize the message with complete data
    // finalizeStreamingMessage: (state, action: PayloadAction<{ 
    //   id: string; 
    //   content: string; 
    //   data?: any;
    //   type?: 'text' | 'visualization';
    // }>) => {
    //   const message = state.messages.find((m) => m.id === action.payload.id);
    //   if (message) {
    //     message.content = action.payload.content;
    //     message.data = action.payload.data;
    //     message.type = action.payload.type || 'text';
    //   }
    //   state.chatLoading = false;
    // },
    // In addStreamingBotMessage reducer:
    // chat.slice.ts — only the CHANGED reducer actions shown
    // The rest of your slice (extraReducers, other actions) stays identical

    // ── CHANGE 1: addStreamingBotMessage now accepts streamParams ──────────────
    addStreamingBotMessage: (
      state,
      action: PayloadAction<{
        id: string;
        streamParams: {
          nlQuestion: string;
          projectId: number;
          chatId: string | null;
        };
      }>
    ) => {
      state.messages.push({
        id: action.payload.id,
        sender: 'bot',
        type: 'text',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        streamParams: action.payload.streamParams,   // ← stored so StreamingBubble can read it
      });
      state.chatLoading = true;
    },

    // ── CHANGE 2: finalizeStreamingMessage clears isStreaming + streamParams ───
    finalizeStreamingMessage: (
      state,
      action: PayloadAction<{
        id: string;
        content: string;
        data?: any;
        type?: 'text' | 'visualization';
        chatId?: string;
      }>
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
        message.data = action.payload.data;
        message.type = action.payload.type || 'text';
        message.isStreaming = false;
        message.streamParams = undefined;            // ← clean up
      }
      state.chatLoading = false;

      // Update chatId if this was a new chat
      if (action.payload.chatId) {
        if (!state.currentChatId || state.currentChatId === '0') {
          state.currentChatId = action.payload.chatId;
        }
      }
    },

    // ── CHANGE 3: updateStreamingMessage stays but is only used for fallback ──
    // (StreamingBubble manages its own local state — this action is no longer
    //  dispatched on every token, only used if you ever need a Redux-driven update)
    updateStreamingMessage: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },

    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    toggleMessageReaction: (state, action: PayloadAction<MessageReactionPayload>) => {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        if (action.payload.reaction === 'like') {
          message.liked = !message.liked;
          if (message.liked) message.disliked = false;
        } else {
          message.disliked = !message.disliked;
          if (message.disliked) message.liked = false;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.chatLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {

        console.log("🟢 addUserMessage", action.payload);
        state.isLoading = false;
        state.chatLoading = false;

        state.messages.push(action.payload.message);

        const newChatId = action.payload.chatId;

        // If this was a new chat (chat=0 or null)
        if (!state.currentChatId || state.currentChatId === "0") {
          state.currentChatId = newChatId;
        }
      })

      .addCase(sendFeedback.fulfilled, (state, action) => {
  const { messageId, reaction } = action.payload;

  const msg = state.messages.find(m => m.id === messageId);
  if (!msg) return;

  if (reaction === "like") {
    msg.liked = true;
    msg.disliked = false;
  }

  if (reaction === "dislike") {
    msg.disliked = true;
    msg.liked = false;
  }
})
      // .addCase(sendFeedback.fulfilled, (state, action) => {
      //   const msg = state.messages.find(m => m.id === action.payload.messageId);
      //   if (msg) {
      //     msg.liked = action.payload.reaction === 'like';
      //     msg.disliked = action.payload.reaction === 'dislike';
      //   }
      // })
      // .addCase(sendMessage.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      //   state.chatLoading = false;
      // })

      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.chatLoading = false;

        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message || "Something went wrong";
        }
      })
      .addCase(loadFAQs.fulfilled, (state, action) => {
        state.faqs = action.payload;
      })
      .addCase(loadChatHistories.fulfilled, (state, action) => {
        console.log("🟢 Load History", state);
        state.chatHistories = action.payload;
      })
      .addCase(loadChatMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = [...action.payload];
      })
      .addCase(loadChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.currentChatId = action.payload;
        state.messages = [];   // must be empty
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
  toggleScreenView
} = chatSlice.actions;

export default chatSlice.reducer;