// import { JMXRecord } from "../types/type";
// import { HistoryRow } from "./HistoryRow";

// interface Props {
//   history: JMXRecord[];
//   onDelete: (id: number) => void;
//   onDownload: (id: number, script_name: string) => void;
// }

// export const HistoryTable: React.FC<Props> = ({ history, onDelete, onDownload }) => (
//   <div className="bg-white border rounded-lg overflow-hidden mt-8 shadow-sm">
//     <div className="px-6 py-4 bg-gray-50 font-semibold">
//       Generated JMX Scripts
//     </div>

//     {history.length === 0 ? (
//       <div className="p-8 text-center text-gray-400 italic">
//         No scripts generated yet.
//       </div>
//     ) : (
//       <table className="w-full text-sm">

//         <thead>
//   <tr className="bg-gray-50 border-b">
//     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//       File Name
//     </th>
//     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//       Application
//     </th>
//     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//       Generated At
//     </th>
//     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//       Status
//     </th>
//     <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
//       {/* Actions */}
//     </th>
//   </tr>
// </thead>


//         <tbody className="divide-y">
//           {history.map(item => (
//             <HistoryRow key={item.id} item={item} onDelete={onDelete} onDownload={onDownload} />
//           ))}
//         </tbody>
//       </table>
//     )}
//   </div>
// );

import React from "react";
import { JMXRecord } from "../types/type";

interface Props {
  history: JMXRecord[];
  onDelete: (id: number) => void;
  onDownload: (id: number, name: string) => void;
  compact?: boolean;
}

export const HistoryTable: React.FC<Props> = ({
  history,
  onDelete,
  onDownload,
  compact = false,
}) => {
  if (!history.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        No scripts generated yet
      </div>
    );
  }

  // ---------------- COMPACT VIEW ----------------
  if (compact) {
    return (
      <table className="w-full text-sm">
        <tbody>
          {history.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="py-2 font-medium">{row.name}</td>
              <td className="text-right space-x-3">
                <button
                  onClick={() => onDownload(row.id, row.name)}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </button>

                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ---------------- FULL VIEW ----------------
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Script Name</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Created</th>
          <th className="p-2 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {history.map((row) => (
          <tr key={row.id} className="border-t">
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.status}</td>
            <td className="p-2">
              {new Date(row.created_on).toLocaleString()}
            </td>
            <td className="p-2 text-right space-x-3">
              <button
                onClick={() => onDownload(row.id, row.name)}
                className="text-blue-600 hover:underline"
              >
                Download
              </button>

              <button
                onClick={() => onDelete(row.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

