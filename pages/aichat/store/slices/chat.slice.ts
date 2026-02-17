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
  loadFAQs,
  loadChatHistories,
  loadChatMessages,
  createChat,
} from './chat.thunk';

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      sender: 'bot',
      type: 'text',
      content:
        "Hello! I'm your Performance Engineering Assistant.\n\nI can help you analyze NFRs, debug JMX scripts, or explain error logs.",
      timestamp: new Date(),
    },
  ],
  chatHistories: [],
  currentChatId: null,
  faqs: [],
  selectedModel: 'gpt-4',
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
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
      state.messages = [initialState.messages[0]];
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
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load FAQs
    builder
      .addCase(loadFAQs.fulfilled, (state, action) => {
        state.faqs = action.payload;
      });

    // Load Chat Histories
    builder
      .addCase(loadChatHistories.fulfilled, (state, action) => {
        state.chatHistories = action.payload;
      });

    // Load Chat Messages
    builder
      .addCase(loadChatMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(loadChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create New Chat
    builder
      .addCase(createChat.fulfilled, (state, action) => {
        state.currentChatId = action.payload;
        state.messages = [initialState.messages[0]];
      });
  },
});

export const {
  addUserMessage,
  setSelectedModel,
  toggleMessageReaction,
  clearMessages,
  setCurrentChat,
} = chatSlice.actions;

export default chatSlice.reducer;