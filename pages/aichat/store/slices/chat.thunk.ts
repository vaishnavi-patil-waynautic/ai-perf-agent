import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteChatById,
  fetchChatHistories,
  fetchChatMessages,
  getFAQs,
  sendFeedbackAPI,
  sendMessageToAPI,
} from '../../services/chat.service';
import {
  APIError,
  ChatHistory,
  ChatMessage,
  FAQ,
  MessageReactionPayload,
  SendMessageAPIResponse,
  SendMessagePayload,
} from '../../types/chat.types';
import {
  addUserMessage,
  addStreamingBotMessage,
  setActiveStreamId,
  addOptimisticChat,
} from './chat.slice';
import { config } from '../../../../config/backendConfig';

const ABORT_URL = `${config.baseUrl}/aichatbot/abort/`;

// ─────────────────────────────────────────────────────────────────────────────
// abortStream
//   1. Fires window event → StreamingBubble closes its EventSource immediately
//   2. Calls POST /api/v1/chatbot/abort/ to tell the server to stop
//   3. Clears Redux activeStreamId
// ─────────────────────────────────────────────────────────────────────────────
export const abortStream = createAsyncThunk<void, string, { rejectValue: APIError }>(
  'chat/abortStream',
  async (streamId, { dispatch, rejectWithValue }) => {
    try {
      // Freeze UI immediately (optimistic)
      window.dispatchEvent(
        new CustomEvent('abort-stream', { detail: { streamId } })
      );

      // Tell the server
      const token = localStorage.getItem('access_token');
      await fetch(ABORT_URL, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stream_id: streamId }),
      });

      dispatch(setActiveStreamId(null));
    } catch (error: any) {
      dispatch(setActiveStreamId(null));
      return rejectWithValue({ message: error?.message || 'Abort failed' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// sendMessageWithStreaming
//   - streamParams keeps its ORIGINAL 3-field shape (no streamId/modelName)
//   - modelName is passed as a separate top-level field on the action
//   - StreamingBubble generates its own stream_id locally and reads
//     selectedModel from Redux to build the SSE URL
// ─────────────────────────────────────────────────────────────────────────────
export const sendMessageWithStreaming = createAsyncThunk<
  { botMessageId: string },
  SendMessagePayload & { onStatus?: (msg: string) => void },
  { rejectValue: APIError }
>(
  'chat/sendMessageWithStreaming',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {

      console.log("Sending message 2---------------------------------");

      const state        = getState() as any;
      const chatId       = state.chat.currentChatId;
      const selectedModel: string = state.chat.selectedModel;
      const chatKey = chatId && chatId !== '0' ? chatId : 'new';

      // 1. Add user message scoped to this chat
      const userMessage: ChatMessage = {
        id       : `user-${Date.now()}`,
        sender   : 'user',
        type     : 'text',
        content  : payload.text,
        timestamp: new Date().toISOString(),
      };
      dispatch(addUserMessage({ ...userMessage, chatId: chatKey } as any));

      console.log("Sending message 4---------------------------------");

      // 2. Add streaming placeholder scoped to this chat
      const botMessageId = `bot-${Date.now()}`;
      dispatch(
        addStreamingBotMessage({
          id        : botMessageId,
          modelName : selectedModel,
          chatId    : chatKey,
          streamParams: {
            nlQuestion: payload.text,
            projectId : 1,
            chatId    : chatId && chatId !== '0' ? chatId : null,
          },
        })
      );

      // If new chat, add optimistic placeholder to sidebar immediately
      if (!chatId || chatId === '0') {
        dispatch(addOptimisticChat({ id: 'new', title: payload.text.slice(0, 40) || 'New Chat' }));
      }

      // 3. StreamingBubble takes over from here
      return { botMessageId };
    } catch (error: any) {
      return rejectWithValue({ message: error?.message || 'Failed to send message' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// All other thunks unchanged
// ─────────────────────────────────────────────────────────────────────────────

export const sendMessage = createAsyncThunk<
  SendMessageAPIResponse,
  SendMessagePayload,
  { rejectValue: APIError }
>(
  'chat/sendMessage',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state : any = getState();
      const chatId       = state.chat.currentChatId;
      const projectId    = state.project?.selectedProject?.id;

      const userMessage: ChatMessage = {
        id       : Date.now().toString(),
        sender   : 'user',
        type     : 'text',
        content  : payload.text,
        timestamp: new Date().toISOString(),
      };
      dispatch(addUserMessage(userMessage));

      const { message, chatId: newChatId } = await sendMessageToAPI(
        payload.text,
        payload.modelId,
        projectId,
        chatId && chatId !== '0' ? chatId : undefined
      );

      if (!chatId || chatId === '0') dispatch(loadChatHistories(projectId));

      return { message, chatId: newChatId };
    } catch (error: any) {
      return rejectWithValue({ message: error?.message || 'Failed to send message' });
    }
  }
);

export const loadFAQs = createAsyncThunk<FAQ[], void, { rejectValue: APIError }>(
  'chat/loadFAQs',
  async (_, { rejectWithValue }) => {
    try { return await getFAQs(); }
    catch (error: any) {
      return rejectWithValue({ message: error?.message || 'Failed to load FAQs' });
    }
  }
);

export const loadChatHistories = createAsyncThunk<ChatHistory[], number, { rejectValue: APIError }>(
  'chat/loadChatHistories',
  async (projectId, { rejectWithValue }) => {
    try { return await fetchChatHistories(projectId); }
    catch (error: any) {
      return rejectWithValue({ message: error?.message });
    }
  }
);

export const loadChatMessages = createAsyncThunk(
  'chat/loadChatMessages',
  async (chatId: string, { rejectWithValue }) => {
    try { 
      const data = await fetchChatMessages(chatId)
      console.log("-----------------Data_______", data)
      return data; 
    }
    catch (error: any) { return rejectWithValue(error.message); }
  }
);

export const deleteByChatId = createAsyncThunk(
  "chat/deleteByChatId",
  async (chatId: string, { rejectWithValue }) => {
    try {
      await deleteChatById(chatId);
      return chatId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

export const sendFeedback = createAsyncThunk<
  MessageReactionPayload,
  MessageReactionPayload,
  { rejectValue: APIError }
>(
  'chat/sendFeedback',
  async ({ messageId, reaction }, { rejectWithValue }) => {
    try {
      await sendFeedbackAPI(messageId, reaction === 'like', reaction === 'dislike');
      return { messageId, reaction };
    } catch (error: any) {
      return rejectWithValue({ message: error?.message || 'Feedback failed' });
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