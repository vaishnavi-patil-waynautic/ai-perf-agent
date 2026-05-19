import MarkdownBlock from "./ChatResponse/MarkdownBlock";
import VisualizationBlock from "./ChatResponse/VisualizationBlock";
import MetaFooter from "./ChatResponse/MetaFooter";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "@/store/store";
import { toggleScreenView } from "../../store/slices/chat.slice";
import { useDispatch } from "react-redux";

interface Props {
  data: any;
}


import { useState } from "react";

function ExpandableText({
  text,
  maxLength = 50,
}: {
  text: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return <span>—</span>;

  const isLong = text.length > maxLength;
  const displayText =
    isExpanded || !isLong
      ? text
      : `${text.slice(0, maxLength)}...`;

  return (
    <span className="whitespace-nowrap inline-flex items-center">
      <span>{displayText}</span>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </span>
  );
}

/** Clean native table rendered from raw results array */
function ResultsTable({ rows }: { rows: any[] }) {
  if (!rows?.length) return null;

  const allColumns = Object.keys(rows[0]);

  // Check if this is bug data (has url and title columns)
  const hasUrl = allColumns.includes("url");
  const hasTitle = allColumns.includes("title");
  const isBugData = hasUrl && hasTitle;

  // For bug data, hide the url column
  const columns = isBugData
    ? allColumns.filter((col) => col !== "url")
    : allColumns;

  const getColumnWidth = (col: string) => {
    switch (col) {
      case "title":
        return "min-w-[400px]";
      case "name":
        return "min-w-[400px]";
      case "description":
      case "summary":
        return "min-w-[450px]";
      default:
        return "min-w-[180px]";
    }
  };

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
              {columns.map((col) => {
                const rawValue = row[col];
                const value =
                  rawValue === null || rawValue === undefined
                    ? "—"
                    : String(rawValue);

                // If this is the title column in bug data, make it clickable
                if (isBugData && col === "title" && row.url) {
                  return (
                    <td
                      key={col}
                      className="px-4 py-2.5 text-gray-700 whitespace-nowrap min-w-[300px]"
                    >
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        <ExpandableText text={value} />
                      </a>
                    </td>
                  );
                }

                return (
                  <td
                    key={col}
                    className={`px-4 py-2.5 text-gray-700 whitespace-nowrap ${getColumnWidth(col)}`}
                  >
                    <ExpandableText text={value} />
                  </td>
                );
              })}
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

  // Check for bugs data first, then other data sources
  const dataset: any[] =
    data.bugs ||           // Bugs from Azure DevOps
    data.results ||        // Query results from database
    data.table ||
    data.data ||
    data.query_results ||
    data.bug_results ||
    [];

  const hasData = Array.isArray(dataset) && dataset.length > 0;

  // Check if this is NFR content (has nfr_content column) - don't show raw table for NFR
  const isNFRContent = hasData && dataset.length > 0 &&
    dataset[0] && 'nfr_content' in dataset[0];

  const isNoneViz = data.visualization_type === "none" || data.bugs || !data.visualization_type;

  const visualization =
    data.visualization || data.visualization_type ||
    (!isNoneViz && data.visualization_type && data.chart_metadata
      ? { type: data.visualization_type, ...data.chart_metadata }
      : undefined);


  console.log("[visualization : ", visualization, "------isNonViz : ", isNoneViz, " Data : ", dataset, " ]")

  return (
    <div className="w-full max-w-full overflow-hidden">


      {hasSummary && (
        <MarkdownBlock
          content={data.summary}
          suppressTable={!!data.bugs || (hasData && !isNFRContent)}
        />
      )}
      {hasAnswer && !hasSummary && (
        <MarkdownBlock
          content={data.answer}
          suppressTable={!!data.bugs || (hasData && !isNFRContent)}
        />
      )}
      {hasContent && !hasAnswer && !hasSummary && (
        <MarkdownBlock
          content={data.content}
          suppressTable={!!data.bugs || (hasData && !isNFRContent)}
        />
      )}

      {/* Native table for structured bug data only (not for NFR content or other text-heavy results) */}
      {data.bugs && isNoneViz && <ResultsTable rows={data.bugs} />}

      {/* For non-bug, non-NFR structured data (scripts, performance metrics, etc.) */}
      {!data.bugs && hasData && isNoneViz && !isNFRContent && <ResultsTable rows={dataset} />}


      {/* Chart visualization (fullscreen only) */}
      {!isNoneViz && (hasData || visualization) && isFullScreen && (
        <VisualizationBlock data={dataset} visualization={visualization} chart_metadata={data?.chart_metadata}/>
      )}

      {/* Collapsed fullscreen prompt */}
      {!isNoneViz && (hasData || visualization) && !isFullScreen && (
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