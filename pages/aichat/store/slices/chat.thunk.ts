import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  sendMessageToAPI,
  getFAQs,
  getChatHistories,
  loadChatById,
  createNewChat,
} from '../../services/chat.service';
import { ChatMessage, SendMessagePayload } from '../../types/chat.types';
import { addUserMessage } from './chat.slice';

// Send message thunk
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { dispatch, rejectWithValue }) => {
    try {
      // Add user message first
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'text',
        content: payload.text,
        timestamp: new Date(),
      };
      dispatch(addUserMessage(userMessage));

      // Get bot response
      const botResponse = await sendMessageToAPI(payload.text, payload.modelId);
      return botResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// Load FAQs
export const loadFAQs = createAsyncThunk(
  'chat/loadFAQs',
  async (_, { rejectWithValue }) => {
    try {
      const faqs = await getFAQs();
      return faqs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load FAQs');
    }
  }
);

// Load chat histories
export const loadChatHistories = createAsyncThunk(
  'chat/loadChatHistories',
  async (_, { rejectWithValue }) => {
    try {
      const histories = await getChatHistories();
      return histories;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load chat histories');
    }
  }
);

// Load messages for a specific chat
export const loadChatMessages = createAsyncThunk(
  'chat/loadChatMessages',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const messages = await loadChatById(chatId);
      return messages;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load chat messages');
    }
  }
);

// Create new chat
export const createChat = createAsyncThunk(
  'chat/createChat',
  async (_, { rejectWithValue }) => {
    try {
      const chatId = await createNewChat();
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create chat');
    }
  }
);