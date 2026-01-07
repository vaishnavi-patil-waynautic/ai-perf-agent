import { JMXRecord } from "../types/type";
import { HistoryRow } from "./HistoryRow";

interface Props {
  history: JMXRecord[];
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
}

export const HistoryTable: React.FC<Props> = ({ history, onDelete, onDownload }) => (
  <div className="bg-white border rounded-lg overflow-hidden mt-8 shadow-sm">
    <div className="px-6 py-4 bg-gray-50 font-semibold">
      Generated JMX Scripts
    </div>

    {history.length === 0 ? (
      <div className="p-8 text-center text-gray-400 italic">
        No scripts generated yet.
      </div>
    ) : (
      <table className="w-full text-sm">

        <thead>
  <tr className="bg-gray-50 border-b">
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
      File Name
    </th>
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
      Application
    </th>
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
      Generated At
    </th>
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
      Status
    </th>
    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {/* Actions */}
    </th>
  </tr>
</thead>


        <tbody className="divide-y">
          {history.map(item => (
            <HistoryRow key={item.id} item={item} onDelete={onDelete} onDownload={onDownload} />
          ))}
        </tbody>
      </table>
    )}
  </div>
);
