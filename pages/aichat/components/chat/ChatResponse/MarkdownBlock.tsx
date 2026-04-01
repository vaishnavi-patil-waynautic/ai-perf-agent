import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppSelector } from '../../../store/hooks';
import { RootState } from "@/store/store";

export default function MarkdownBlock({ content, suppressTable }: { content?: string; suppressTable?: boolean }) {
  if (!content) return null;

  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const tableMaxW = isFullScreen ? "w-full" : "w-80";

  return (
    <div className={`w-full min-w-0 overflow-x-auto break-words pt-1 ${tableMaxW}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: suppressTable
            ? () => null
            : ({ children }) => (
                <div className={`overflow-x-auto my-3 rounded-lg border border-gray-200 shadow-sm ${tableMaxW}`}>
                  <table className="text-sm border-collapse" style={{ minWidth: "max-content" }}>
                    {children}
                  </table>
                </div>
              ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 text-gray-700">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{children}</td>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-bold mt-3 mb-1 text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mt-3 mb-1 text-gray-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-2 mb-1 text-gray-800">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed my-1.5 text-gray-800 break-words">{children}</p>
          ),
          li: ({ children }) => (
            <li className="text-sm mb-1 text-gray-800 leading-relaxed">{children}</li>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 my-1.5 space-y-0.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 my-1.5 space-y-0.5">{children}</ol>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800">
              {children}
            </a>
          ),
          code: ({ inline, children, ...props }: any) =>
            inline ? (
              <code className="bg-gray-100 text-pink-600 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-3 my-2 overflow-x-auto font-mono leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-300 pl-3 my-2 text-gray-600 italic text-sm">{children}</blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
