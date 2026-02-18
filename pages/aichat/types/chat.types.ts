export type MessageType = 'text' | 'image' | 'diagram'  | 'visualization';
export type MessageSender = 'user' | 'bot';

export interface VisualizationData {
  type: 'bar' | 'line' | 'area' | 'table';
  x_axis: string;
  y_axes: string[];
  group_by: string;
}

export interface ApiResult {
  [key: string]: string | number;
}

export interface ChatMessageData {
  query?: string;
  summary?: string;
  visualization?: VisualizationData;
  results?: ApiResult[];
  execution_time_ms?: number;
  application_used?: string;
  table_used?: string;
  detection_method?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  type: MessageType;
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  data?: ChatMessageData;  // ← add this
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
}

export interface SendMessagePayload {
  text: string;
  modelId: string;
}

export interface MessageReactionPayload {
  messageId: string;
  reaction: 'like' | 'dislike';
}