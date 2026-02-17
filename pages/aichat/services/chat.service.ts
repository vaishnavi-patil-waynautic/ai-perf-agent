import { ChatMessage, AIModel, ChatHistory, FAQ } from '../types/chat.types';

// Dummy AI Models
export const getAIModels = (): Promise<AIModel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', icon: '🚀' },
        { id: 'claude-3', name: 'Claude 3', description: 'Balanced performance', icon: '🧠' },
        { id: 'gemini', name: 'Gemini Pro', description: 'Fast responses', icon: '⚡' },
      ]);
    }, 300);
  });
};

// Dummy FAQs
export const getFAQs = (): Promise<FAQ[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', question: 'How to fix 504 Gateway errors?', category: 'Troubleshooting' },
        { id: '2', question: 'Generate Load Test Strategy', category: 'Testing' },
        { id: '3', question: 'Analyze Report #402', category: 'Analysis' },
        { id: '4', question: 'What are NFR best practices?', category: 'Performance' },
        { id: '5', question: 'Explain JMX scripting basics', category: 'Development' },
        { id: '6', question: 'How to optimize database queries?', category: 'Performance' },
        { id: '7', question: 'Understanding error logs', category: 'Troubleshooting' },
        { id: '8', question: 'Setup monitoring dashboard', category: 'Monitoring' },
      ]);
    }, 300);
  });
};

// Dummy Chat Histories
export const getChatHistories = (): Promise<ChatHistory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'chat-1',
          title: 'Performance Optimization Discussion',
          lastMessage: 'How can I optimize my database queries?',
          timestamp: new Date(Date.now() - 3600000),
          messageCount: 12,
        },
        {
          id: 'chat-2',
          title: 'Load Testing Strategy',
          lastMessage: 'Generate a load test plan for my API',
          timestamp: new Date(Date.now() - 86400000),
          messageCount: 8,
        },
        {
          id: 'chat-3',
          title: 'Error Log Analysis',
          lastMessage: 'Can you analyze this error log?',
          timestamp: new Date(Date.now() - 172800000),
          messageCount: 15,
        },
        {
          id: 'chat-4',
          title: 'JMX Script Debugging',
          lastMessage: 'Help me debug this JMX script',
          timestamp: new Date(Date.now() - 259200000),
          messageCount: 20,
        },
        {
          id: 'chat-5',
          title: 'Architecture Diagram Request',
          lastMessage: 'Draw a microservices architecture',
          timestamp: new Date(Date.now() - 345600000),
          messageCount: 5,
        },
      ]);
    }, 400);
  });
};

// Dummy Send Message (Simulate API call)
export const sendMessageToAPI = (
  text: string,
  modelId: string
): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        type: 'text',
        content: `[${modelId}] I received your query: "${text}". Here's a detailed response based on your request.`,
        timestamp: new Date(),
      };

      // Mock different response types based on keywords
      if (text.toLowerCase().includes('diagram') || text.toLowerCase().includes('architecture')) {
        response.type = 'diagram';
        response.content = '```mermaid\ngraph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[API Gateway]\n    C --> D[Service 1]\n    C --> E[Service 2]\n    C --> F[Service 3]\n```';
      } else if (text.toLowerCase().includes('image') || text.toLowerCase().includes('photo')) {
        response.type = 'image';
        response.content = 'https://via.placeholder.com/400x300?text=Performance+Dashboard';
      } else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('log')) {
        response.content = `**Error Analysis:**\n\nBased on the error logs, I've identified the following issues:\n\n1. **Connection Timeout**: The service is taking too long to respond\n2. **Memory Leak**: Gradual memory increase detected\n3. **Database Bottleneck**: Query execution time exceeding thresholds\n\n**Recommendations:**\n- Implement connection pooling\n- Add memory profiling\n- Optimize database indices`;
      } else if (text.toLowerCase().includes('strategy') || text.toLowerCase().includes('plan')) {
        response.content = `**Load Testing Strategy:**\n\n**Phase 1: Baseline Testing**\n- Duration: 10 minutes\n- Users: 10 concurrent\n- Ramp-up: 1 minute\n\n**Phase 2: Load Testing**\n- Duration: 30 minutes\n- Users: 100 concurrent\n- Ramp-up: 5 minutes\n\n**Phase 3: Stress Testing**\n- Duration: 20 minutes\n- Users: 500 concurrent\n- Ramp-up: 10 minutes\n\n**Success Criteria:**\n- Response time < 2s for 95th percentile\n- Error rate < 0.1%\n- CPU usage < 80%`;
      }

      resolve(response);
    }, 1200);
  });
};

// Create new chat
export const createNewChat = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`chat-${Date.now()}`);
    }, 200);
  });
};

// Load chat by ID
export const loadChatById = (chatId: string): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return dummy messages for the selected chat
      resolve([
        {
          id: '1',
          sender: 'bot',
          type: 'text',
          content: `Welcome back! This is chat session: ${chatId}`,
          timestamp: new Date(Date.now() - 300000),
        },
        {
          id: '2',
          sender: 'user',
          type: 'text',
          content: 'Previous question from this chat',
          timestamp: new Date(Date.now() - 240000),
        },
        {
          id: '3',
          sender: 'bot',
          type: 'text',
          content: 'Previous response from this chat session.',
          timestamp: new Date(Date.now() - 180000),
        },
      ]);
    }, 500);
  });
};