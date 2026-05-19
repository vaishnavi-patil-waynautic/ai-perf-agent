import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppSelector } from '../../../store/hooks';
import { RootState } from "@/store/store";

export default function MarkdownBlock({ content, suppressTable, fromCodeBlock }: { content?: string; suppressTable?: boolean; fromCodeBlock?: boolean }) {
  if (!content) return null;

  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const tableMaxW = isFullScreen ? "w-full" : "max-w-[320px]";

  function normalizeMarkdown(text: string) {
    return text
      .replace(/^\s+/gm, "")   // 🔥 remove leading indentation
      .replace(/\n{3,}/g, "\n\n") // 🔥 collapse excessive newlines
      .trim();
  }

  return (
    <div className={` w-full min-w-0 overflow-x-auto prose prose-slate max-w-none ${fromCodeBlock ? `
          prose-p:my-1
          prose-li:my-1
          prose-ul:my-2
          prose-li>p:my-0
          prose-strong:font-medium
        ` : ``}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Tables ──────────────────────────────────────────────────────
          table: suppressTable
            ? () => null
            : ({ children }) => (
              <div className={`overflow-x-auto my-6 border border-slate-200 shadow-lg shadow-slate-200/40 bg-white rounded-2xl ${tableMaxW}`}>
                <table className="w-full text-left border-collapse">{children}</table>
              </div>
            ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{children}</td>
          ),

          // ── Headings ────────────────────────────────────────────────────
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-900 mb-4 mt-6 first:mt-0 break-words">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-slate-800 mb-3 mt-5 first:mt-0 break-words">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-slate-800 mb-2 mt-4 first:mt-0 break-words">{children}</h3>
          ),

          // ── Paragraph ───────────────────────────────────────────────────
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 leading-relaxed text-slate-700 break-words text-sm">{children}</p>
          ),

          // ── Lists ───────────────────────────────────────────────────────
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 font-semibold">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 mb-4 space-y-1.5 text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed marker:font-semibold marker:text-slate-600">
              {children}
            </li>
          ),

          code({ children, className }: any) {
            const isInline = !className;
            let text = String(children);

            if (isInline) {
              return <code>{children}</code>;
            }

            const looksLikeMarkdown =
              text.includes("#") || text.includes("- ") || text.includes("|");

            if (looksLikeMarkdown) {
              text = normalizeMarkdown(text);

              return (
                <div className="my-3 text-sm leading-normal text-slate-800 font-sans">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // ── Headings ────────────────────────────────────────────────────
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-slate-900 mb-4 mt-6 first:mt-0 break-words">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-slate-800 mb-3 mt-5 first:mt-0 break-words">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-bold text-slate-800 mb-2 mt-4 first:mt-0 break-words">{children}</h3>
                      ),

                      // ── Paragraph ───────────────────────────────────────────────────
                      p: ({ children }) => (
                        <p className="mb-4 last:mb-0 leading-relaxed text-slate-700 break-words text-sm">{children}</p>
                      ),

                      // ── Lists ───────────────────────────────────────────────────────
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 font-semibold">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-6 mb-4 space-y-1.5 text-slate-700">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm leading-relaxed marker:font-semibold marker:text-slate-600">
                          {children}
                        </li>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-medium">{children}</strong>
                      ),

                      table: suppressTable
                        ? () => null
                        : ({ children }) => (
                          <div className={`overflow-x-auto my-6 border border-slate-200 shadow-lg shadow-slate-200/40 bg-white rounded-2xl ${tableMaxW}`}>
                            <table className="w-full text-left border-collapse">{children}</table>
                          </div>
                        ),
                      thead: ({ children }) => (
                        <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody>{children}</tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{children}</td>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 px-4 py-3 rounded-r-2xl italic text-slate-600 my-4 break-words">
                          {children}
                        </blockquote>
                      ),

                      code: ({ children, className }: any) => (

                        < pre className="bg-slate-900 text-white p-3 rounded">
                          <code>{children}</code>
                        </pre>),

                      // ── Links ────────────────────────────────────────────────────────
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors">
                          {children}
                        </a>
                      ),

                      em: ({ children }) => (
                        <em className="italic text-slate-600">{children}</em>
                      ),

                      // ── HR ───────────────────────────────────────────────────────────
                      hr: () => <hr className="my-4 border-slate-200" />,
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                </div>
              );
            }

            return (
              <pre className="bg-slate-900 text-white p-3 rounded">
                <code>{children}</code>
              </pre>
            );
          },
          // ── Blockquote ───────────────────────────────────────────────────
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 px-4 py-3 rounded-r-2xl italic text-slate-600 my-4 break-words">
              {children}
            </blockquote>
          ),

          // ── Links ────────────────────────────────────────────────────────
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors">
              {children}
            </a>
          ),

          // ── Emphasis ─────────────────────────────────────────────────────
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-600">{children}</em>
          ),

          // ── HR ───────────────────────────────────────────────────────────
          hr: () => <hr className="my-4 border-slate-200" />,
        }}
      >
        {content}
      </ReactMarkdown >
    </div >
  );
}
