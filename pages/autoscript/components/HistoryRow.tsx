// import { Trash2, Download, FileText } from "lucide-react";
// import { StatusBadge } from "../../../components/StatusBadge";
// import { JMXRecord } from "../types/type";

// export const HistoryRow = ({
//   item,
//   onDelete,
//   onDownload
// }: {
//   item: JMXRecord;
//   onDelete: (id: number) => void;
//   onDownload: (id: number, script_name: string) => void;
// }) => {


//   // console.log("Rendering HistoryRow for item:", item);

//   return (
//     <tr className="hover:bg-gray-50">
//       <td className="px-6 py-4 flex items-center gap-2">
//         <FileText size={16} className="text-blue-500" />
//         {item.name}
//       </td>
//       <td className="px-6 py-4">
//         {item.application_name || "Default App"}
//       </td>
//       <td className="px-6 py-4">{item.created_on.replace("Z", "")}</td>
//       <td className="px-6 py-4">
//         <StatusBadge status={item.status} />
//       </td>
//       <td className="px-6 py-4 text-right">
//         <button
//           onClick={() => onDownload(item.id, item.name)}
//           disabled={item.status !== "completed"}
//           className={`p-1 rounded ${item.status === "completed"
//               ? "text-blue-600 hover:bg-blue-50"
//               : "text-gray-400 cursor-not-allowed"
//             }`}
//         >
//           <Download size={16} />
//         </button>

//         <button
//           onClick={() => onDelete(item.id)}
//           // className={`p-1 rounded 
//             // // ${item.status === "completed" ?
//             //    "text-red-600 hover:bg-red-50"
//               // : "text-gray-400 cursor-not-allowed"
//               className={`p-1 rounded text-red-600 hover:bg-red-50
//             }`}
//         >
//           <Trash2 size={16} />
//         </button>
//       </td>

//     </tr>
//   )
// };


import { Trash2, Download, FileText } from "lucide-react";
import { StatusBadge } from "../../../components/StatusBadge";
import { JMXRecord } from "../types/type";

export const HistoryRow = ({
  item,
  onDelete,
  onDownload,
  compact = false
}: {
  item: JMXRecord;
  onDelete: (id: number) => void;
  onDownload: (id: number, script_name: string) => void;
  compact?: boolean;
}) => {

  // 🟢 COMPACT MODE (script name + actions only)
  if (compact) {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-3 flex items-center gap-2">
          <FileText size={14} className="text-blue-500" />
          {item.name}
        </td>

        <td className="px-6 py-3 text-right">
          <button
            onClick={() => onDownload(item.id, item.name)}
            disabled={item.status !== "completed"}
            className="mr-2 text-blue-600"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </td>
      </tr>
    );
  }

  // 🔵 FULL MODE
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 flex items-center gap-2">
        <FileText size={16} className="text-blue-500" />
        {item.name}
      </td>

      <td className="px-6 py-4">
        {item.application_name || "Default App"}
      </td>

      <td className="px-6 py-4">
        {item.created_on.replace("Z", "")}
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onDownload(item.id, item.name)}
          disabled={item.status !== "completed"}
          className="mr-2 text-blue-600"
        >
          <Download size={16} />
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};
