export type MessageType = 'text' | 'image' | 'diagram';
export type MessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  type: MessageType;
  content: string; // Text content or Image URL
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
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