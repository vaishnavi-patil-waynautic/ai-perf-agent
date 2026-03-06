/**
 * SSE Streaming Service for AI Chatbot
 * 
 * Handles Server-Sent Events (SSE) streaming from the backend.
 * Events received:
 *   - status: Status updates like "🤔 Thinking..." or "🔧 Using tool: fetch_bugs..."
 *   - token: Text chunks to append to the response
 *   - result: Tool execution results (bugs, database queries, etc.)
 *   - done: Final response with complete data
 *   - error: Error messages
 */

export interface SSEStatusEvent {
  type: 'status';
  message: string;
}

export interface SSETokenEvent {
  type: 'token';
  content: string;
}

export interface SSEResultEvent {
  type: 'result';
  tool: string;
  data: any;
}

export interface SSEDoneEvent {
  type: 'done';
  full_response: any;
  error: string | null;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = 
  | SSEStatusEvent 
  | SSETokenEvent 
  | SSEResultEvent 
  | SSEDoneEvent 
  | SSEErrorEvent;

export interface StreamCallbacks {
  onStatus?: (message: string) => void;
  onToken?: (chunk: string) => void;
  onResult?: (tool: string, data: any) => void;
  onDone?: (fullResponse: any, error: string | null) => void;
  onError?: (message: string) => void;
}

export interface StreamParams {
  nlQuestion: string;
  projectId: number;
  chatId?: string | null;
}

const BASE_URL = 'http://localhost:8000/api/v1/aichatbot';

/**
 * Start SSE streaming for a chat question
 * 
 * @param params - Question parameters
 * @param callbacks - Event callbacks
 * @returns Function to close the stream
 */
export function startChatStream(
  params: StreamParams,
  callbacks: StreamCallbacks
): () => void {
  const { nlQuestion, projectId, chatId } = params;

  // Build query parameters
  const queryParams = new URLSearchParams({
    nl_question: nlQuestion,
    project_id: String(projectId),
    ...(chatId ? { chat_id: chatId } : {}),
  });

  // Get auth token
  const token = localStorage.getItem('access_token');
  
  // Note: EventSource doesn't support custom headers, so we pass token as query param
  // For production, consider using fetch with ReadableStream for better security
  const url = `${BASE_URL}/ask/stream/?${queryParams.toString()}&token=${token}`;

  // Create EventSource
  const eventSource = new EventSource(url);

  // Handle messages
  eventSource.onmessage = (event) => {
    let data: SSEEvent;
    
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error('Invalid SSE data:', event.data);
      return;
    }

    switch (data.type) {
      case 'status':
        callbacks.onStatus?.(data.message);
        break;

      case 'token':
        callbacks.onToken?.(data.content);
        break;

      case 'result':
        callbacks.onResult?.(data.tool, data.data);
        break;

      case 'done':
        callbacks.onDone?.(data.full_response, data.error);
        eventSource.close();
        break;

      case 'error':
        callbacks.onError?.(data.message);
        eventSource.close();
        break;

      default:
        console.warn('Unknown SSE event type:', data);
    }
  };

  // Handle errors
  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
    callbacks.onError?.('Connection lost. Please try again.');
    eventSource.close();
  };

  // Return cleanup function
  return () => eventSource.close();
}
