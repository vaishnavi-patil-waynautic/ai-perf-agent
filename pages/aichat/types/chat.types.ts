export type MessageType = 'text' | 'image' | 'diagram' | 'visualization';
export type MessageSender = 'user' | 'bot';

export interface VisualizationData {
  type?: string;
  x_axis?: string | null;
  y_axes?: string[];
  group_by?: string | null;
  [key: string]: unknown;
}

export type ApiResult = Record<string, unknown>;

export interface ChatMessageData {
  answer?: string;
  summary?: string;
  explanation?: string;
  message?: string;
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
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  backendId?: number;
  sender: MessageSender;
  type: MessageType;
  content: string;
  timestamp: string;
  liked?: boolean;
  disliked?: boolean;
  data?: ChatMessageData;
  isStreaming?: boolean;
  modelName?: string;
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
  timestamp: string;
  messageCount: number;
}

export interface MessageReactionPayload {
  messageId: string;
  backendId?: number;
  reaction: 'like' | 'dislike';
}

export interface FAQ {
  id: string;
  question: string;
  category?: string;
}

/** Per-chat state stored in chatMap */
export interface ChatEntry {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamId: string | null;
  loading: boolean;
}

export interface ChatState {
  /** Per-chat state — key is chatId (or 'new' for unsaved chats) */
  chatMap: Record<string, ChatEntry>;

  chatHistories: ChatHistory[];
  currentChatId: string | null;
  faqs: FAQ[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  isFullScreen: boolean;
  chatLoading: boolean;
  chatMode: 'closed' | 'collapsed' | 'fullscreen';
  /** Global stream id for abort support */
  activeStreamId: string | null;
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
