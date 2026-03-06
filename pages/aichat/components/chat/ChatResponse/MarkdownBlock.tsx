import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownBlock({ content }: { content?: string }) {
  if (!content) return null;

  return (
    // <div style={{ marginBottom: 1 }}>
    <div className="w-full max-w-full overflow-hidden break-words pt-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ margin: "1px 0 1px", fontSize: 14 }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ margin: "1px 0 1px", fontSize: 14 }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ margin: "1px 0 1px", fontSize: 14 }}>{children}</h3>
          ),
          // p: ({ children }) => (
          //   <p style={{ margin: "1px 0", lineHeight: 1.5 }}>{children}</p>
          // ),
          //           p: ({ children }) => {
          //   if (
          //     typeof children === "string" &&
          //     children.trim() === "."
          //   ) {
          //     return null;
          //   }

          //   return (
          //     <p style={{ margin: "1px 0", lineHeight: 1.5 }}>
          //       {children}
          //     </p>
          //   );
          // },
          //           li: ({ children }) => (
          //             <li style={{ marginBottom: 1 }}>{children}</li>
          //           ),
          // a: ({ href, children }) => (
          //   <div style={{ margin: "1px 0" }}>
          //     <a
          //       href={href}
          //       target="_blank"
          //       rel="noopener noreferrer"
          //       style={{ color: "#2563eb", textDecoration: "underline" }}
          //     >
          //       {children}
          //     </a>
          //   </div>
          // ),
          //           a: ({ href, children }) => (
          //   <a
          //     href={href}
          //     target="_blank"
          //     rel="noopener noreferrer"
          //     style={{ color: "#2563eb", textDecoration: "underline" }}
          //   >
          //     {children}
          //   </a>
          // ),

          p: ({ children, node }) => {
            // If paragraph is inside list item → render as span
            if (node?.position?.start?.line) {
              const parent = (node as any).parent;
              if (parent?.type === "listItem") {
                return (
                  <span style={{ fontSize: 14, lineHeight: 1.5 }}>
                    {children}
                  </span>
                );
              }
            }

            return (
              // <p style={{ margin: "6px 0", lineHeight: 1.6 }}>
              <p style={{ fontSize: 14,  margin: "6px 0", lineHeight: 1.6, wordBreak: "break-word" }}>
                {children}
              </p>
            );
          },

          li: ({ children }) => (
            <li style={{fontSize: 14, marginBottom: "6px" }}>
              {children}
            </li>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}