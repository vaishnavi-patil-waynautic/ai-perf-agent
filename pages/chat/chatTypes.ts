export type MessageType = 'text' | 'image' | 'diagram';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  type: MessageType;
  content: string; // Text content or Image URL
  timestamp: string;
}

export interface AIModel {
  id: string;
  name: string;
  icon?: React.ReactNode;
}