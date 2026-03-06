import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchChatHistories,
  fetchChatMessages,
  getFAQs,
  sendFeedbackAPI,
  sendMessageToAPI,
} from '../../services/chat.service';
import { ChatMessage, MessageReactionPayload, SendMessagePayload } from '../../types/chat.types';
import { addUserMessage } from './chat.slice';

// Send message thunk
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const chatId = state.chat.currentChatId;

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'text',
        content: payload.text,
        timestamp: new Date(),
      };
      dispatch(addUserMessage(userMessage));

      // Call API
      const { message, chatId: newChatId } = await sendMessageToAPI(
        payload.text,
        payload.modelId,
        chatId && chatId !== "0" ? chatId : undefined
      );

      // If chat was newly created → reload chat list
      if (!chatId || chatId === "0") {
        dispatch(loadChatHistories());
      }

      return { message, chatId: newChatId };
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
      return await fetchChatHistories();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Load messages for a specific chat
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

export const sendFeedback = createAsyncThunk(
  'chat/sendFeedback',
  async ({ messageId, reaction }: MessageReactionPayload, { rejectWithValue }) => {
    try {
      await sendFeedbackAPI(
        messageId,
        reaction === 'like',
        reaction === 'dislike'
      );
      return { messageId, reaction };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new chat
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