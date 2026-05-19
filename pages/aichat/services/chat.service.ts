import { config } from '@/config/backendConfig';
import { ChatMessage, ChatHistory, FAQ } from '../types/chat.types';

const BASE_URL = `${config.baseUrl}/aichatbot`;



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

/* ---------------- SEND MESSAGE (CREATE / EXISTING CHAT) ---------------- */
export const sendMessageToAPI = async (
  text: string,
  modelId: string,
  projectId : Number,
  chatId?: string | null,
  
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
      project_id: projectId,
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
    timestamp: new Date().toISOString(),
    data,
  };

  return {
    message,
    chatId: String(data.chat_id),
  };
};


/* ---------------- CHAT LIST ---------------- */
export const fetchChatHistories = async (projectId: number): Promise<ChatHistory[]> => {

  const token = localStorage.getItem("access_token");
  const res = await fetch(`${BASE_URL}/chats/?project_id=${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  const chats = json?.data ?? [];

  return chats.map((c: any) => ({
    id: String(c.id),
    title: c.title,
    lastMessage: c.last_message,
    timestamp: new Date(c.updated_on).toISOString(),
    messageCount: c.message_count,
  }));
};

export const deleteChatById = async (chatId: string) => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${BASE_URL}/chats/${chatId}/`, {
    method: "DELETE",
     headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }
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
    timestamp: new Date(m.created_on).toISOString(),
  })).flatMap((userMsg: ChatMessage, i: number) => {
    const m = msgs[i];


    const botMsg: ChatMessage = {
      id: `${m.id}`,
      sender: "bot",
      type: m.visualization_type || m.bug_results ? "visualization" : "text",
      content: m.summary ?? "",
      timestamp: new Date(m.created_on).toISOString(),
      liked: m.user_feedback?.is_liked ?? false,
      disliked: m.user_feedback?.is_disliked ?? false,
      data: {
        answer: m.summary ?? m.answer ?? "",
        bugs: m.bug_results || m.bugs,  // ✅ bug_results from API
        results: m.query_results || m.results,  // ✅ query_results from API
        visualization_type: m.visualization_type,
        chart_metadata: m.chart_metadata,
        table_used: m.table_used,
        execution_time_ms: m.execution_time_ms
      },
    };

    console.log("*********************Botmsg : ", botMsg)

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