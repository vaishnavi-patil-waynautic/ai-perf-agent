import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveStreamId, setStreamId } from "../../store/slices/chat.slice";
import { ChatMessage } from "../../types/chat.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { config } from "../../../../config/backendConfig";
import { v4 as uuidv4 } from "uuid";
import {
  startStream,
  abortStreamById,
  registerTokenCallback,
  registerStatusCallback,
  unregisterTokenCallback,
  getAccumulatedText,
  isStreamActive,
  getStreamIdForMessage,
} from "../../services/streaming.manager";

const BASE_URL = `${config.baseUrl}/aichatbot`;

interface Props {
  message: ChatMessage;
  onDone?: (newChatId: string) => void;
}

const Cursor = () => (
  <>
    <span
      className="inline-block w-[2px] h-[1em] bg-gray-500 ml-[2px] align-middle"
      style={{ animation: "cursorBlink 1s step-end infinite" }}
    />
    <style>{`@keyframes cursorBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }`}</style>
  </>
);

const StreamingBubble: React.FC<Props> = ({ message, onDone }) => {
  const dispatch = useAppDispatch();
  const selectedModel = useAppSelector((s) => s.chat.selectedModel);
  const isFullScreen = useAppSelector((s) => s.chat.isFullScreen);
  const tableMaxW = isFullScreen ? "w-full" : "max-w-[320px]";
  const projectId = useAppSelector((s: any) => s.project?.selectedProject?.id);

  const streamIdRef = useRef<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  /* ── Auto-scroll ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const el = document.getElementById("chat-scroll-container");
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayedText]);

  /* ── Start stream via manager (survives unmount) ─────────────────────── */
  useEffect(() => {
    const params = message.streamParams;
    if (!params) return;

    // Check if a stream already exists for this message (StrictMode double-mount
    // or component remount) — reuse it instead of starting a new one
    const existingStreamId = getStreamIdForMessage(message.id);
    if (existingStreamId && isStreamActive(existingStreamId)) {
      streamIdRef.current = existingStreamId;
      registerTokenCallback(existingStreamId, (text) => setDisplayedText(text));
      registerStatusCallback(existingStreamId, (msg) => setStatusText(msg));
      const existing = getAccumulatedText(existingStreamId);
      if (existing) setDisplayedText(existing);
      return () => { unregisterTokenCallback(existingStreamId); };
    }

    const token = localStorage.getItem("access_token");
    const streamId = uuidv4();
    streamIdRef.current = streamId;

    dispatch(setActiveStreamId(streamId));
    // setStreamId will be called by the manager after stream starts

    const qs = new URLSearchParams({
      nl_question: params.nlQuestion,
      project_id: String(projectId),
      stream_id: streamId,
      model_name: message.modelName ?? selectedModel,
      ...(params.chatId ? { chat_id: params.chatId } : {}),
      token: token ?? "",
    });

    console.log("This streaming is called -- StreamingBubble---------------------------------");

    // Register live token callback for this component instance
    startStream({
      url: `${BASE_URL}/ask/stream/?${qs.toString()}`,
      streamId,
      messageId: message.id,
      chatId: params.chatId ?? null,
      projectId,
      modelName: message.modelName ?? selectedModel,
      selectedModel,
      onDone: (newChatId) => {
        setIsStreaming(false);
        onDone?.(newChatId);
      },
    });

    // Register token + status callbacks
    registerTokenCallback(streamId, (text) => setDisplayedText(text));
    registerStatusCallback(streamId, (msg) => setStatusText(msg));

    return () => {
      if (streamIdRef.current) {
        unregisterTokenCallback(streamIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id]);

  /* ── Abort via window event ───────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: Event) => {
      const { streamId } = (e as CustomEvent).detail ?? {};
      if (streamId && streamId !== streamIdRef.current) return;
      if (streamIdRef.current) abortStreamById(streamIdRef.current);
      setIsStreaming(false);
      dispatch(setActiveStreamId(null));
    };
    window.addEventListener("abort-stream", handler);
    return () => window.removeEventListener("abort-stream", handler);
  }, [dispatch]);

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="text-sm text-gray-800 leading-relaxed w-full min-w-0">
      {isStreaming && !displayedText ? (
        // Waiting for first token — spinner + status in a card
        <div className="inline-flex items-center gap-3 px-4 py-3 bg-white border border-blue-100 rounded-2xl shadow-sm">
          <svg className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          <span className="text-sm text-slate-500">
            {statusText || 'Thinking…'}
          </span>
        </div>
      ) : isStreaming ? (
        // Streaming: plain text + cursor + status
        <>
          <span className="whitespace-pre-wrap">
            {displayedText}
            <Cursor />
          </span>
          {statusText && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white border border-blue-100 rounded-xl shadow-sm text-xs text-slate-500">
              <svg className="w-3 h-3 text-blue-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              {statusText}
            </div>
          )}
        </>
      ) : (
        // Done: full markdown
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className={`overflow-x-auto my-6 border border-slate-200 shadow-lg shadow-slate-200/40 bg-white rounded-2xl ${tableMaxW}`}>
                <table className="w-full text-left border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">{children}</tr>,
            th: ({ children }) => <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{children}</th>,
            td: ({ children }) => <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{children}</td>,
          }}
        >
          {displayedText}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default StreamingBubble;
