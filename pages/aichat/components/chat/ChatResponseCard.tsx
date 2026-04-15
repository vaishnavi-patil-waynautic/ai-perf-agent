// import { useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, Cell,
// } from 'recharts';
// import { ChatMessageData } from '../../types/chat.types';
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";


// interface Props {
//   data: ChatMessageData;
// }

// const CustomTooltip = ({ active, payload }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: '#fff', border: '1px solid #e5e5e5',
//       borderRadius: 8, padding: '8px 12px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13,
//     }}>
//       <div style={{ color: '#6b7280', marginBottom: 3, fontSize: 12 }}>
//         {payload[0]?.payload?.endpoint}
//       </div>
//       <div style={{ color: '#111', fontWeight: 600 }}>
//         {Number(payload[0]?.value).toFixed(4)}
//         <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>TPS</span>
//       </div>
//     </div>
//   );
// };

// const ChatResponseCard: React.FC<Props> = ({ data }) => {
//   const [view, setView] = useState<'chart' | 'table'>('chart');


//   console.log("Chat Response needs to visualize ********************************")


//   // If bugs exist but no visualization config → render as table
//   if (data.bugs && !data.visualization) {
//     console.log("Bugs only ___________________________________________", data)
//     const bugRows = data.bugs;

//     return (
//       <div>
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             p: ({ children }) => (
//               <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
//                 {children}
//               </p>
//             ),
//             strong: ({ children }) => (
//               <strong style={{ fontWeight: 600 }}>{children}</strong>
//             ),
//             a: ({ href, children }) => (
//               <a
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#2563eb", textDecoration: "underline" }}
//               >
//                 {children}
//               </a>
//             ),
//             li: ({ children }) => (
//               <li style={{ marginBottom: 4 }}>{children}</li>
//             ),
//           }}
//         >
//           {data.answer ?? data.summary ?? ""}
//         </ReactMarkdown>


//         {/* <table style={{ width: "100%", fontSize: 13 }}>
//         <thead>
//           <tr>
//             {Object.keys(bugRows[0] ?? {}).map((key) => (
//               <th key={key} style={{ textAlign: "left", padding: 6 }}>
//                 {key}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {bugRows.map((row, i) => (
//             <tr key={i}>
//               {Object.values(row).map((val, idx) => (
//                 <td key={idx} style={{ padding: 6 }}>
//                   {String(val)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table> */}


//         <table
//           style={{
//             width: "auto",
//             borderCollapse: "separate",
//             borderSpacing: 0,
//             fontSize: 13,
//             border: "1px solid #e5e7eb",
//             borderRadius: 10,
//             overflow: "hidden",
//             background: "#fff",
//           }}
//         >
//           <thead>
//             <tr style={{ background: "#f9fafb" }}>
//               {Object.keys(bugRows[0]).map((key) => (
//                 <th
//                   key={key}
//                   style={{
//                     textAlign: "left",
//                     padding: "5px 6px",
//                     fontWeight: 600,
//                     color: "#374151",
//                     borderBottom: "1px solid #e5e7eb",
//                   }}
//                 >
//                   {key.replace(/_/g, " ")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {bugRows.map((row, i) => (
//               <tr
//                 key={i}
//                 style={{
//                   background: i % 2 === 0 ? "#ffffff" : "#fafafa",
//                 }}
//               >
//                 {Object.values(row).map((val, idx) => (
//                   <td
//                     key={idx}
//                     style={{
//                       padding: "10px 12px",
//                       borderBottom: "1px solid #f3f4f6",
//                       color: "#374151",
//                       maxWidth: 300,
//                       wordBreak: "break-word",
//                     }}
//                   >
//                     {typeof val === "string" && val.startsWith("http") ? (
//                       <a
//                         href={val}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ color: "#2563eb", textDecoration: "underline" }}
//                       >
//                         View
//                       </a>
//                     ) : (
//                       String(val)
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//       </div>
//     );
//   }

//   const visualization =
//     data.visualization ??
//     (data.visualization_type && data.chart_metadata
//       ? {
//         type: data.visualization_type,
//         x_axis: data.chart_metadata.x_axis,
//         y_axes: data.chart_metadata.y_axes,
//         group_by: data.chart_metadata.group_by ?? undefined,
//       }
//       : undefined);

//   if (!data?.results?.length) {

//     console.log("Nothing to show -------")
//     return (
//       <ReactMarkdown remarkPlugins={[remarkGfm]}>
//         {data.answer ?? data.summary ?? ""}
//       </ReactMarkdown>
//     );
//   }

//   const xKey =
//     visualization?.group_by ||
//     visualization?.x_axis ||
//     Object.keys(data.results[0])[0];

//   const yKey =
//     visualization?.y_axes?.[0] ||
//     Object.keys(data.results[0])[1];


//   const grouped: Record<string, number[]> = {};

//   data.results.forEach((r) => {
//     const x = String(r?.[xKey] ?? "Unknown");
//     const y = Number(r?.[yKey] ?? 0);

//     if (!grouped[x]) grouped[x] = [];
//     grouped[x].push(y);
//   });

//   const chartData = Object.entries(grouped).map(([k, values]) => ({
//     endpoint: k,
//     value: values.reduce((a, b) => a + b, 0) / values.length, // average
//   }));

//   const max = Math.max(...chartData.map(d => d.value));



//   // const max = Math.max(...chartData.map(d => d.value));




//   if (!visualization) {

//     console.log("NO tables no visualization --------------------------", data)
//     return (
//       <ReactMarkdown remarkPlugins={[remarkGfm]}>
//         {data.answer ?? data.summary ?? ""}
//       </ReactMarkdown>
//     );
//   }


//   console.log("Rendering normal visaualization --------------------------", data)

//   return (
//     <div style={{ fontFamily: 'inherit' }}>

//       {/* Summary */}
//       {data.summary && (
//         <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', margin: '0 0 16px' }}>
//           {data.summary.split(/\*\*(.*?)\*\*/g).map((part, i) =>
//             i % 2 === 1
//               ? <strong key={i} style={{ color: '#111', fontWeight: 600 }}>{part}</strong>
//               : <span key={i}>{part}</span>
//           )}
//         </p>
//       )}


//       {data.answer && (
//         <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', margin: '0 0 16px' }}>
//           {data.answer.split(/\*\*(.*?)\*\*/g).map((part, i) =>
//             i % 2 === 1
//               ? <strong key={i} style={{ color: '#111', fontWeight: 600 }}>{part}</strong>
//               : <span key={i}>{part}</span>
//           )}
//         </p>
//       )}

//       {/* Visualization card */}
//       <div style={{
//         border: '1px solid #e5e7eb', borderRadius: 12,
//         overflow: 'hidden', marginBottom: 10,
//       }}>

//         {/* Toolbar */}
//         <div style={{
//           display: 'flex', alignItems: 'center',
//           justifyContent: 'space-between',
//           padding: '10px 14px',
//           borderBottom: '1px solid #f3f4f6',
//           background: '#fafafa',
//         }}>
//           <span style={{ fontSize: 12.5, color: '#9ca3af' }}>
//             {yKey.toUpperCase()} by {xKey.replace('_', ' ')}
//           </span>
//           <div style={{
//             display: 'flex', gap: 1,
//             background: '#efefef', borderRadius: 6, padding: 2,
//           }}>
//             {(['chart', 'table'] as const).map(v => (
//               <button key={v} onClick={() => setView(v)} style={{
//                 background: view === v ? '#fff' : 'transparent',
//                 border: 'none', borderRadius: 5,
//                 padding: '3px 11px', fontSize: 12,
//                 color: view === v ? '#111' : '#9ca3af',
//                 fontWeight: view === v ? 500 : 400,
//                 cursor: 'pointer',
//                 boxShadow: view === v ? '0 1px 2px rgba(0,0,0,0.07)' : 'none',
//                 transition: 'all 0.12s',
//                 fontFamily: 'inherit',
//               }}>
//                 {v.charAt(0).toUpperCase() + v.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chart */}
//         {view === 'chart' && (
//           <div style={{ padding: '20px 8px 8px 0', background: '#fff' }}>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart
//                 data={chartData}
//                 margin={{ top: 0, right: 16, left: 0, bottom: 52 }}
//                 barCategoryGap="35%"
//               >
//                 <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
//                 <XAxis
//                   dataKey="endpoint"
//                   tick={{ fontSize: 11, fill: '#9ca3af' }}
//                   angle={-38} textAnchor="end"
//                   interval={0} tickLine={false} axisLine={false}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 11, fill: '#9ca3af' }}
//                   tickLine={false} axisLine={false}
//                   tickFormatter={v => v.toFixed(1)} width={34}
//                 />
//                 <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
//                 <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={32}>
//                   {chartData.map((r, i) => (
//                     <Cell key={i} fill={r.value === max ? '#111827' : '#e5e7eb'} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Table */}
//         {view === 'table' && (
//           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//             <thead>
//               <tr>
//                 {['Endpoint', 'Value', ''].map((h, i) => (
//                   <th key={i} style={{
//                     padding: '9px 16px',
//                     textAlign: i === 0 ? 'left' : 'right',
//                     color: '#9ca3af', fontWeight: 500, fontSize: 12,
//                     borderBottom: '1px solid #f3f4f6',
//                     background: '#fafafa',
//                   }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {[...chartData].sort((a, b) => b.value - a.value).map((r, i) => (
//                 <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
//                   <td style={{
//                     padding: '9px 16px',
//                     color: r.value === max ? '#111' : '#374151',
//                     fontWeight: r.value === max ? 600 : 400,
//                   }}>
//                     {r.endpoint}
//                     {r.value === max && (
//                       <span style={{
//                         marginLeft: 8, fontSize: 11, color: '#6b7280',
//                         background: '#f3f4f6', padding: '1px 7px',
//                         borderRadius: 20, fontWeight: 400,
//                       }}>peak</span>
//                     )}
//                   </td>
//                   <td style={{
//                     padding: '9px 16px', textAlign: 'right',
//                     color: r.value === max ? '#111' : '#6b7280',
//                     fontWeight: r.value === max ? 600 : 400,
//                     fontVariantNumeric: 'tabular-nums',
//                   }}>
//                     {r.value.toFixed(4)}
//                   </td>
//                   <td style={{ padding: '9px 16px 9px 0', width: 100 }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
//                       <div style={{ width: 64, height: 3, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
//                         <div style={{
//                           height: '100%',
//                           width: `${(r.value / max) * 100}%`,
//                           background: r.value === max ? '#111' : '#d1d5db',
//                           borderRadius: 4,
//                         }} />
//                       </div>
//                       <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 28, textAlign: 'right' }}>
//                         {((r.value / max) * 100).toFixed(0)}%
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Footer meta */}
//       <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#9ca3af' }}>
//         {data.table_used && <span>{data.table_used}</span>}
//         {data.execution_time_ms && <><span>·</span><span>{data.execution_time_ms.toFixed(1)}ms</span></>}
//         {data.detection_method && <><span>·</span><span>{data.detection_method.replace('_', ' ')}</span></>}
//       </div>
//     </div>
//   );
// };

// export default ChatResponseCard;


import MarkdownBlock from "./ChatResponse/MarkdownBlock";
import VisualizationBlock from "./ChatResponse/VisualizationBlock";
import MetaFooter from "./ChatResponse/MetaFooter";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "@/store/store";
import { toggleScreenView } from "../../store/slices/chat.slice";
import { useDispatch } from "react-redux";
import { useRef } from "react";

interface Props {
  data: any;
}

/** Clean native table rendered from raw results array */
function ResultsTable({ rows }: { rows: any[] }) {
  if (!rows?.length) return null;
  const columns = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm my-3">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                } hover:bg-blue-50/40 transition-colors`}
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                  {row[col] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
        {rows.length} row{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function ChatResponseCard({ data }: Props) {

  const dispatch = useDispatch<any>();

  const isFullScreen = useAppSelector((state: RootState) => state.chat.isFullScreen);
  const chatLoading = useAppSelector((state: RootState) => state.chat.chatLoading);

  const handleToggle = () => dispatch(toggleScreenView());

  if (!data) return null;

  if (chatLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  const hasSummary = !!data.summary;
  const hasAnswer = !!data.answer;
  const hasContent = !!data.content;

  const dataset: any[] =
    data.results ||
    data.bugs ||
    data.table ||
    data.data ||
    data.query_results ||
    data.bug_results ||
    [];

  const hasData = Array.isArray(dataset) && dataset.length > 0;

  // visualization_type "none" means: show text + raw table, no chart
  const isNoneViz = data.visualization_type === "none" || !data.visualization_type;

  const visualization =
    data.visualization || data.visualization_type ||
    (!isNoneViz && data.visualization_type && data.chart_metadata
      ? { type: data.visualization_type, ...data.chart_metadata }
      : undefined);


  console.log("[visualization : ", visualization, "------isNonViz : ",isNoneViz, " Data : ", dataset, " ]")

  return (
    <div className="w-full max-w-full overflow-hidden">

      {/* Answer / summary text */}
      {hasSummary && <MarkdownBlock content={data.summary} suppressTable={hasData && isNoneViz} />}
      {hasAnswer && !hasSummary && (
        <MarkdownBlock content={data.answer} suppressTable={hasData && isNoneViz} />
      )}
      {hasContent && !hasAnswer && !hasSummary && (
        <MarkdownBlock content={data.content} suppressTable={hasData && isNoneViz} />
      )}

      {/* Native table for visualization_type "none" — rendered once, not duplicated */}
      {/* {hasData && isNoneViz && <ResultsTable rows={dataset} />} */}


      {/* Chart visualization (fullscreen only) */}
      {!isNoneViz && (hasData || visualization) && isFullScreen && (
        <VisualizationBlock data={dataset} visualization={visualization} />
      )}

      {/* Collapsed fullscreen prompt */}
      {!isNoneViz && (hasData || visualization) && !isFullScreen && (
        // <div className="bg-blue-50 border border-blue-100 my-2 rounded-xl px-4 py-3 flex items-center justify-between">
        //   <span className="text-sm text-gray-500">Visualization available</span>
        //   <button
        //     onClick={handleToggle}
        //     className="text-blue-600 font-medium text-sm hover:underline"
        //   >
        //     Switch to full screen →
        //   </button>
        // </div>
        <div className="bg-blue-50 border border-blue-100 my-2 rounded-xl px-4 py-3 flex flex-col items-center text-center gap-2">
          <span className="text-sm text-gray-500">
            Visualization available
          </span>

          <button
            onClick={handleToggle}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Switch to full screen →
          </button>
        </div>
      )}

      <MetaFooter data={data} />
    </div>
  );
}

/** Remove all markdown table blocks from a string */
function stripMarkdownTable(text: string): string {
  // Remove any line that starts with | (table rows, header, separator)
  const lines = text.split("\n");
  const filtered = lines.filter(line => !line.trim().startsWith("|"));
  return filtered.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}