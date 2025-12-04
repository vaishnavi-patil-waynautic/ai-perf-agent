export type MessageType = 'text' | 'image' | 'diagram';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  type: MessageType;
  content: string; // Text content or Image URL
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  icon?: React.ReactNode;
}