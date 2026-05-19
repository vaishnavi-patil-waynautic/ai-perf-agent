import { JMXRecord } from "../types/type";
import { HistoryRow } from "./HistoryRow";

interface Props {
  history: JMXRecord[];
  onDelete: (id: number) => void;
  onDownload: (id: number, script_name: string) => void;
  compact?: boolean;
showViewMore?: boolean;
onViewMore?: () => void;

}

export const HistoryTable: React.FC<Props> = ({
  history,
  onDelete,
  onDownload,
  compact = false,
  showViewMore = false,
  onViewMore
}) => (
  <div className={`bg-white border rounded-lg overflow-hidden shadow-sm`}>

    <div className="px-6 py-4 bg-gray-50 font-semibold">
      Generated JMX Scripts
    </div>

    {history.length === 0 ? (
      <div className="p-8 text-center text-gray-400 italic">
        No scripts generated yet.
      </div>
    ) : (
      <>
        <table className="w-full text-sm">
          {!compact && (
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Application</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Generated At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
          )}

          <tbody className="divide-y">
            {history.map(item => (
              <HistoryRow
                key={item.id}
                item={item}
                onDelete={onDelete}
                onDownload={onDownload}
                compact={compact}
              />
            ))}
          </tbody>
        </table>

        {/* 🔵 VIEW MORE BELOW ROWS */}
        {compact && showViewMore && (
  <div className="text-center py-3 ">
    <button
      className="text-blue-600 hover:underline"
      onClick={onViewMore}
    >
      Show More
    </button>
  </div>
)}
      </>
    )}
  </div>
);
