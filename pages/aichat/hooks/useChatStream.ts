import { useState, useRef, useCallback } from 'react';
import { ChatMessage, ChatMessageData } from '../types/chat.types';

interface StreamCallbacks {
  onStatus?: (message: string) => void;
  onToken?: (chunk: string) => void;
  onResult?: (tool: string, data: any) => void;
  onDone?: (fullResponse: any, error: string | null) => void;
  onError?: (message: string) => void;
}

interface StreamParams {
  nlQuestion: string;
  projectId: number;
  chatId?: string | null;
}

export function useChatStream() {
  const [streamingText, setStreamingText] = useState('');
  const [status, setStatus] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [bugResults, setBugResults] = useState<any>(null);
  const [dbResults, setDbResults] = useState<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback(
    ({ nlQuestion, projectId, chatId }: StreamParams, callbacks?: StreamCallbacks) => {
      // Reset state
      setStreamingText('');
      setStatus('');
      setIsStreaming(true);
      setBugResults(null);
      setDbResults(null);

      // Build URL
      const params = new URLSearchParams({
        nl_question: nlQuestion,
        project_id: String(projectId),
        ...(chatId ? { chat_id: chatId } : {}),
      });

      const token = localStorage.getItem('access_token');
      const url = `http://localhost:8000/api/v1/aichatbot/ask/stream/?${params.toString()}`;

      // Create EventSource with auth header (via URL param since EventSource doesn't support headers)
      // Note: For production, consider using fetch with ReadableStream instead
      const urlWithAuth = `${url}&token=${token}`;
      const eventSource = new EventSource(urlWithAuth);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (e) {
          console.error('Invalid SSE data:', event.data);
          return;
        }

        switch (data.type) {
          case 'status':
            setStatus(data.message);
            callbacks?.onStatus?.(data.message);
            break;

          case 'token':
            setStreamingText((prev) => prev + data.content);
            callbacks?.onToken?.(data.content);
            break;

          case 'result':
            if (data.tool === 'fetch_bugs') {
              setBugResults(data.data);
            } else if (data.tool === 'query_database') {
              setDbResults(data.data);
            }
            callbacks?.onResult?.(data.tool, data.data);
            break;

          case 'done':
            setIsStreaming(false);
            setStatus('');
            callbacks?.onDone?.(data.full_response, data.error);
            eventSource.close();
            break;

          case 'error':
            setIsStreaming(false);
            setStatus('');
            callbacks?.onError?.(data.message);
            eventSource.close();
            break;

          default:
            console.warn('Unknown SSE event type:', data.type);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setIsStreaming(false);
        setStatus('');
        callbacks?.onError?.('Connection lost. Please try again.');
        eventSource.close();
      };

      return () => {
        eventSource.close();
        setIsStreaming(false);
      };
    },
    []
  );

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsStreaming(false);
      setStatus('');
    }
  }, []);

  return {
    streamingText,
    status,
    isStreaming,
    bugResults,
    dbResults,
    startStream,
    stopStream,
  };
}
