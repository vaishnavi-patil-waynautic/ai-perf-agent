// import { ChatMessage, AIModel, ChatHistory, FAQ } from '../types/chat.types';

// // Dummy AI Models
// export const getAIModels = (): Promise<AIModel[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', icon: '🚀' },
//         { id: 'claude-3', name: 'Claude 3', description: 'Balanced performance', icon: '🧠' },
//         { id: 'gemini', name: 'Gemini Pro', description: 'Fast responses', icon: '⚡' },
//       ]);
//     }, 300);
//   });
// };


// // export const sendMessageToAPI = (
// //   text: string,
// //   modelId: string
// // ): Promise<ChatMessage> => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {

// //       // Simulate your real API returning this shape
// //       const apiResponse = {
// //         status: 'success',
// //         data: {
// //           summary: "**Key Observations:** - The TPS varies significantly across different API endpoints for the last build. - The highest TPS observed is for the 'checkout' endpoint, while the lowest is for 'Account.action'. **Conclusion:** - There is a notable disparity in throughput across the API endpoints. **Recommendations:** - Focus on optimizing the lower-performing endpoints, particularly 'Account.action' and 'Catalog.action', to enhance overall application performance.",
// //           visualization: {
// //             type: 'bar' as const,
// //             x_axis: 'build_number',
// //             y_axes: ['tps'],
// //             group_by: 'api_endpoints',
// //           },
// //           results: [
// //             {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "/actions/Account.action",
// //         "tps": 0.07894736842105263
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "/actions/Catalog.action",
// //         "tps": 0.07894736842105263
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "/actions/Order.action",
// //         "tps": 0.1111111111111111
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "checkout",
// //         "tps": 1.0
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "Launch",
// //         "tps": 0.07317073170731707
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "Login",
// //         "tps": 0.07692307692307693
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "/actions/Cart.action",
// //         "tps": 0.07894736842105263
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "item",
// //         "tps": 0.1111111111111111
// //       },
// //       {
// //         "build_number": "BUILD_20260211_141124",
// //         "api_endpoints": "ALL",
// //         "tps": 0.3157894736842105
// //       }
// //           ],
// //           execution_time_ms: 13.9,
// //           table_used: 'autoanalysis_performancetestexecution',
// //           detection_method: 'auto_detected',
// //         },
// //       };

// //       // ✅ If response has visualization, set type to 'visualization'
// //       //    and attach the full data payload
// //       if (apiResponse.data.visualization) {
// //         resolve({
// //           id: Date.now().toString(),
// //           sender: 'bot',
// //           type: 'visualization',        // ← key flag
// //           content: apiResponse.data.summary ?? '',
// //           timestamp: new Date(),
// //           data: apiResponse.data,       // ← full payload
// //         });
// //       } else {
// //         resolve({
// //           id: Date.now().toString(),
// //           sender: 'bot',
// //           type: 'text',
// //           content: apiResponse.data.summary ?? '',
// //           timestamp: new Date(),
// //         });
// //       }
// //     }, 1200);
// //   });
// // };

// // Dummy FAQs

// export const sendMessageToAPI = async (
//   text: string,
//   modelId: string
// ): Promise<ChatMessage> => {

//       const token = localStorage.getItem("access_token");

//     console.log("TOKEN SENT:", token);

//     if (!token) {
//       throw new Error("Missing access token");
//     }

//   // 🔴 Replace with real fetch later
//   const response = await fetch("http://localhost:8000/api/v1/aichatbot/ask/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//      },
//     body: JSON.stringify({
//       nl_question: text,
//       project_id: 1,
//     }),
//   });

//   const apiResponse = await response.json();

//   const data = apiResponse?.data ?? {};

//   /* ---------- TEXT EXTRACTION (Flexible) ---------- */
//   const content =
//     data.answer ??
//     data.summary ??
//     data.explanation ??
//     data.message ??
//     "No response generated.";

//   /* ---------- VISUALIZATION DETECTION ---------- */
//   const hasVisualization =
//     data.visualization ||
//     data.visualization_type ||
//     (data.results && Array.isArray(data.results));

//   /* ---------- BUG DETECTION ---------- */
//   const hasBugs = Array.isArray(data.bugs);

//   /* ---------- Decide Message Type ---------- */
//   const messageType =
//     hasVisualization ? "visualization" :
//     hasBugs ? "visualization" :  // treat bugs as structured table
//     "text";

//   return {
//     id: Date.now().toString(),
//     sender: "bot",
//     type: messageType,
//     content,
//     timestamp: new Date(),
//     data,
//   };
// };


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

// // Dummy Chat Histories
// export const getChatHistories = (): Promise<ChatHistory[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve([
//         {
//           id: 'chat-1',
//           title: 'Performance Optimization Discussion',
//           lastMessage: 'How can I optimize my database queries?',
//           timestamp: new Date(Date.now() - 3600000),
//           messageCount: 12,
//         },
//         {
//           id: 'chat-2',
//           title: 'Load Testing Strategy',
//           lastMessage: 'Generate a load test plan for my API',
//           timestamp: new Date(Date.now() - 86400000),
//           messageCount: 8,
//         },
//         {
//           id: 'chat-3',
//           title: 'Error Log Analysis',
//           lastMessage: 'Can you analyze this error log?',
//           timestamp: new Date(Date.now() - 172800000),
//           messageCount: 15,
//         },
//         {
//           id: 'chat-4',
//           title: 'JMX Script Debugging',
//           lastMessage: 'Help me debug this JMX script',
//           timestamp: new Date(Date.now() - 259200000),
//           messageCount: 20,
//         },
//         {
//           id: 'chat-5',
//           title: 'Architecture Diagram Request',
//           lastMessage: 'Draw a microservices architecture',
//           timestamp: new Date(Date.now() - 345600000),
//           messageCount: 5,
//         },
//       ]);
//     }, 400);
//   });
// };

// // Dummy Send Message (Simulate API call)
// // export const sendMessageToAPI = (
// //   text: string,
// //   modelId: string
// // ): Promise<ChatMessage> => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       let response: ChatMessage = {
// //         id: Date.now().toString(),
// //         sender: 'bot',
// //         type: 'text',
// //         content: `[${modelId}] I received your query: "${text}". Here's a detailed response based on your request.`,
// //         timestamp: new Date(),
// //       };

// //       // Mock different response types based on keywords
// //       if (text.toLowerCase().includes('diagram') || text.toLowerCase().includes('architecture')) {
// //         response.type = 'diagram';
// //         response.content = '```mermaid\ngraph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[API Gateway]\n    C --> D[Service 1]\n    C --> E[Service 2]\n    C --> F[Service 3]\n```';
// //       } else if (text.toLowerCase().includes('image') || text.toLowerCase().includes('photo')) {
// //         response.type = 'image';
// //         response.content = 'https://via.placeholder.com/400x300?text=Performance+Dashboard';
// //       } else if (text.toLowerCase().includes('error') || text.toLowerCase().includes('log')) {
// //         response.content = `**Error Analysis:**\n\nBased on the error logs, I've identified the following issues:\n\n1. **Connection Timeout**: The service is taking too long to respond\n2. **Memory Leak**: Gradual memory increase detected\n3. **Database Bottleneck**: Query execution time exceeding thresholds\n\n**Recommendations:**\n- Implement connection pooling\n- Add memory profiling\n- Optimize database indices`;
// //       } else if (text.toLowerCase().includes('strategy') || text.toLowerCase().includes('plan')) {
// //         response.content = `**Load Testing Strategy:**\n\n**Phase 1: Baseline Testing**\n- Duration: 10 minutes\n- Users: 10 concurrent\n- Ramp-up: 1 minute\n\n**Phase 2: Load Testing**\n- Duration: 30 minutes\n- Users: 100 concurrent\n- Ramp-up: 5 minutes\n\n**Phase 3: Stress Testing**\n- Duration: 20 minutes\n- Users: 500 concurrent\n- Ramp-up: 10 minutes\n\n**Success Criteria:**\n- Response time < 2s for 95th percentile\n- Error rate < 0.1%\n- CPU usage < 80%`;
// //       }

// //       resolve(response);
// //     }, 1200);
// //   });
// // };

// // Create new chat
// export const createNewChat = (): Promise<string> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`chat-${Date.now()}`);
//     }, 200);
//   });
// };

// // Load chat by ID
// export const loadChatById = (chatId: string): Promise<ChatMessage[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Return dummy messages for the selected chat
//       resolve([
//         {
//           id: '1',
//           sender: 'bot',
//           type: 'text',
//           content: `Welcome back! This is chat session: ${chatId}`,
//           timestamp: new Date(Date.now() - 300000),
//         },
//         {
//           id: '2',
//           sender: 'user',
//           type: 'text',
//           content: 'Previous question from this chat',
//           timestamp: new Date(Date.now() - 240000),
//         },
//         {
//           id: '3',
//           sender: 'bot',
//           type: 'text',
//           content: 'Previous response from this chat session.',
//           timestamp: new Date(Date.now() - 180000),
//         },
//       ]);
//     }, 500);
//   });
// };


import { ChatMessage, ChatHistory, FAQ } from '../types/chat.types';

const BASE_URL = "http://localhost:8000/api/v1/aichatbot";

/* ---------------- SEND MESSAGE (CREATE / EXISTING CHAT) ---------------- */
export const sendMessageToAPI = async (
  text: string,
  modelId: string,
  chatId?: string | null
): Promise<{ message: ChatMessage; chatId: string }> => {

  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Missing access token");

  const response = await fetch(`${BASE_URL}/ask/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nl_question: text,
      project_id: 1,
      ...(chatId ? { chat_id: Number(chatId) } : {}),
    }),
  });

  const json = await response.json();
  const data = json?.data ?? {};

  const content =
    data.answer ??
    data.summary ??
    "No response generated.";

  const hasVisualization =
    data.visualization ||
    data.visualization_type ||
    (data.results && Array.isArray(data.results)) ||
    (data.bugs && Array.isArray(data.bugs)) ||
    (data.query_results && Array.isArray(data.query_results));

  const message: ChatMessage = {
    id: Date.now().toString(),
    sender: "bot",
    type: hasVisualization ? "visualization" : "text",
    content,
    timestamp: new Date(),
    data,
  };

  return {
    message,
    chatId: String(data.chat_id),
  };
};


/* ---------------- CHAT LIST ---------------- */
export const fetchChatHistories = async (): Promise<ChatHistory[]> => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${BASE_URL}/chats/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  const chats = json?.data ?? [];

  return chats.map((c: any) => ({
    id: String(c.id),
    title: c.title,
    lastMessage: c.last_message,
    timestamp: new Date(c.updated_on),
    messageCount: c.message_count,
  }));
};


/* ---------------- CHAT MESSAGES ---------------- */
export const fetchChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${BASE_URL}/chats/${chatId}/messages/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  const msgs = json?.data?.messages ?? [];

  return msgs.map((m: any) => ({
    id: `u-${m.id}`,
    sender: "user",
    type: "text",
    content: m.natural_language_query,
    timestamp: new Date(m.created_on),
  })).flatMap((userMsg: ChatMessage, i: number) => {
    const m = msgs[i];

    const botMsg: ChatMessage = {
      id: `${m.id}`,
      sender: "bot",
      type: m.visualization_type ? "visualization" : "text",
      content: m.summary ?? "",
      timestamp: new Date(m.created_on),
      liked: m.user_feedback?.is_liked ?? false,
      disliked: m.user_feedback?.is_disliked ?? false,
      data: {
        results: m.results || m.bugs || m.query_results,
        visualization_type: m.visualization_type,
        chart_metadata: m.chart_metadata,
        table_used: m.table_used,
        execution_time_ms: m.execution_time_ms
      },
    };

    return [userMsg, botMsg];
  });
};


/* ---------------- FEEDBACK ---------------- */
export const sendFeedbackAPI = async (
  messageId: string,
  liked: boolean,
  disliked: boolean
) => {
  const token = localStorage.getItem("access_token");

  await fetch(`${BASE_URL}/feedback/message/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message_id: Number(messageId),
      is_liked: liked,
      is_disliked: disliked,
    }),
  });
};