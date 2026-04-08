/**
 * StreamingManager — module-level singleton
 *
 * Keeps EventSource connections alive independent of React component lifecycle.
 * When StreamingBubble unmounts (e.g. chat switch), the stream continues here.
 * When the component remounts, it reads the accumulated text from the manager.
 */

import { store } from '../../../store/store';
import {
  finalizeStreamingMessage,
  setActiveStreamId,
  setStreamId,
} from '../store/slices/chat.slice';
import { loadChatHistories, loadChatMessages } from '../store/slices/chat.thunk';
import { showSnackbar } from '../../../store/snackbarStore';

interface ActiveStream {
  es: EventSource;
  messageId: string;
  chatId: string | null;
  projectId: number;
  modelName: string;
  selectedModel: string;
  accumulatedText: string;
  streamId: string;
  onToken?: (text: string) => void;
  onStatus?: (msg: string) => void;
  onDone?: (newChatId: string) => void;
}

const activeStreams = new Map<string, ActiveStream>();
// Secondary index: messageId → streamId, to prevent duplicate streams per message
const messageStreamMap = new Map<string, string>();

export function registerTokenCallback(streamId: string, cb: (text: string) => void) {
  const stream = activeStreams.get(streamId);
  if (stream) stream.onToken = cb;
}

export function registerStatusCallback(streamId: string, cb: (msg: string) => void) {
  const stream = activeStreams.get(streamId);
  if (stream) stream.onStatus = cb;
}

export function unregisterTokenCallback(streamId: string) {
  const stream = activeStreams.get(streamId);
  if (stream) { stream.onToken = undefined; stream.onStatus = undefined; }
}

export function getAccumulatedText(streamId: string): string {
  return activeStreams.get(streamId)?.accumulatedText ?? '';
}

export function isStreamActive(streamId: string): boolean {
  return activeStreams.has(streamId);
}

export function getStreamIdForMessage(messageId: string): string | undefined {
  return messageStreamMap.get(messageId);
}

export function startStream(params: {
  url: string;
  streamId: string;
  messageId: string;
  chatId: string | null;
  projectId: number;
  modelName: string;
  selectedModel: string;
  onDone?: (newChatId: string) => void;
}) {
  // Deduplicate: if a stream already exists for this messageId, don't start another
  const existingStreamId = messageStreamMap.get(params.messageId);
  if (existingStreamId && activeStreams.has(existingStreamId)) {
    return existingStreamId;
  }
  const es = new EventSource(params.url);

  const stream: ActiveStream = {
    es,
    messageId: params.messageId,
    chatId: params.chatId,
    projectId: params.projectId,
    modelName: params.modelName,
    selectedModel: params.selectedModel,
    accumulatedText: '',
    streamId: params.streamId,
    onDone: params.onDone,
  };

  activeStreams.set(params.streamId, stream);
  messageStreamMap.set(params.messageId, params.streamId);

  // Register streamId in Redux for this chat
  store.dispatch(setStreamId({ chatId: params.chatId ?? 'new', streamId: params.streamId }));

  es.onmessage = (event) => {
    let data: any;
    try { data = JSON.parse(event.data); } catch { return; }

    const s = activeStreams.get(params.streamId);
    if (!s) return;

    switch (data.type) {
      case 'status': {
        s.onStatus?.(data.message ?? '');
        break;
      }

      case 'token': {
        const chunk = data.content ?? '';
        if (!chunk) break;
        s.accumulatedText += chunk;
        s.onToken?.(s.accumulatedText);
        break;
      }

      case 'done': {
        es.close();
        activeStreams.delete(params.streamId);
        messageStreamMap.delete(params.messageId);

        const responseData = data.full_response?.data ?? data.full_response ?? {};
        const newChatId = String(responseData.chat_id ?? params.chatId ?? '');

        const hasVisualization =
          responseData.visualization ||
          responseData.visualization_type ||
          (Array.isArray(responseData.results) && responseData.results.length) ||
          (Array.isArray(responseData.bugs) && responseData.bugs.length) ||
          (Array.isArray(responseData.query_results) && responseData.query_results.length);

        store.dispatch(finalizeStreamingMessage({
          id: params.messageId,
          chatId: params.chatId ?? 'new',
          content: responseData.answer || responseData.summary || s.accumulatedText,
          data: {
            ...responseData,
            results: responseData.results || responseData.bugs || responseData.query_results || [],
          },
          type: hasVisualization ? 'visualization' : 'text',
          newChatId,
          modelName: params.modelName ?? params.selectedModel,
        }));

        store.dispatch(setActiveStreamId(null));
        store.dispatch(setStreamId({ chatId: params.chatId ?? 'new', streamId: null }));

        if (!params.chatId) {
          store.dispatch(loadChatHistories(params.projectId));
        }

        // Reload the chat messages to get the finalized response from the server
        if (newChatId && newChatId !== '0') {
          store.dispatch(loadChatMessages(newChatId));
        }

        s.onDone?.(newChatId);
        break;
      }

      case 'error': {
        es.close();
        activeStreams.delete(params.streamId);
        messageStreamMap.delete(params.messageId);
        store.dispatch(setActiveStreamId(null));
        store.dispatch(setStreamId({ chatId: params.chatId ?? 'new', streamId: null }));
        store.dispatch(showSnackbar({
          message: data.message || 'An error occurred. Please try again.',
          type: 'error',
        }));
        break;
      }
    }
  };

  es.onerror = () => {
    es.close();
    activeStreams.delete(params.streamId);
    messageStreamMap.delete(params.messageId);
    store.dispatch(setActiveStreamId(null));
    store.dispatch(setStreamId({ chatId: params.chatId ?? 'new', streamId: null }));
    store.dispatch(showSnackbar({
      message: 'Connection lost. Please try again.',
      type: 'error',
    }));
  };

  return params.streamId;
}

export function abortStreamById(streamId: string) {
  const stream = activeStreams.get(streamId);
  if (stream) {
    stream.es.close();
    activeStreams.delete(streamId);
    messageStreamMap.delete(stream.messageId);
  }
}
