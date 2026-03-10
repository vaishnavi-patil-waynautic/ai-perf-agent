export type MessageType =
  | 'text'
  | 'image'
  | 'diagram'
  | 'visualization';

export type MessageSender = 'user' | 'bot';

/* ---------- FLEXIBLE VISUALIZATION ---------- */
export interface VisualizationData {
  type?: string;
  x_axis?: string | null;
  y_axes?: string[];
  group_by?: string | null;

  [key: string]: unknown; // ← future proof
}

/* ---------- GENERIC ROW ---------- */
export type ApiResult = Record<string, unknown>;

/* ---------- FULL FLEXIBLE AI DATA ---------- */
export interface ChatMessageData {
  // narrative
  answer?: string;
  summary?: string;
  explanation?: string;
  message?: string;

  // structured
  bugs?: ApiResult[];
  bug_count?: number;

  results?: ApiResult[];
  visualization?: VisualizationData;
  visualization_type?: string;
  chart_metadata?: VisualizationData;

  query?: string;
  execution_time_ms?: number;
  application_used?: string;
  table_used?: string;
  detection_method?: string;
  tools_used?: string[];
  from_cache?: boolean;
  cache_info?: string;

  // future unknown fields
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;                 // UI id (string)
  backendId?: number;         // ← real message_id from API (IMPORTANT for feedback)
  sender: MessageSender;
  type: MessageType;
  content: string;
  timestamp: Date;

  liked?: boolean;
  disliked?: boolean;

  data?: ChatMessageData;
  isStreaming?: boolean; //


  streamParams?: StreamParams;
}

export interface FeedbackPayload {
  message_id: number;
  is_liked: boolean;
  is_disliked: boolean;
}


export interface AIModel {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}
export interface MessageReactionPayload {
  messageId: string;     // UI id
  backendId?: number;    // ← required for API
  reaction: 'like' | 'dislike';
}

export interface FAQ {
  id: string;
  question: string;
  category?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  chatHistories: ChatHistory[];
  currentChatId: string | null;
  faqs: FAQ[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null; 
  isFullScreen : boolean;
  chatLoading: boolean;
}

export interface APIError {
  message: string;
}

export interface SendMessagePayload {
  text: string;
  modelId: string;
}

export interface SendMessageAPIResponse {
  message: ChatMessage;
  chatId: string;
}

export interface StreamParams {
  nlQuestion: string;
  projectId: number;
  chatId?: string | null;
}