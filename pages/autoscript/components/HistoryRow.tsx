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


import { Trash2, Download, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "../../../components/StatusBadge";
import { JMXRecord } from "../types/type";
import { Tooltip } from "@mui/material";
import { useState } from "react";

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
  // if (compact) {
  //   return (
  //     <tr className="hover:bg-gray-50">
  //       <td className="pl-5 py-3 flex items-center gap-2">
  //         <FileText size={14} className="text-blue-500" />
  //         {item.name}
  //       </td>

  //       <td className="px-4 py-3 text-right">
  //          {item.status == "completed" && <button
  //           onClick={() => onDownload(item.id, item.name)}
  //           disabled={item.status !== "completed"}
  //           className="mr-2 text-blue-600"
  //         >
  //           <Download size={14} />
  //         </button>}

  //         <button
  //           onClick={() => onDelete(item.id)}
  //           className="text-red-600"
  //         >
  //           <Trash2 size={14} />
  //         </button>
  //       </td>
  //     </tr>
  //   );
  // }

if (compact) {
  return (
    <tr className="hover:bg-gray-50 align-middle">
      {/* <td className="pl-5 py-3 flex items-center gap-2">
        <FileText size={14} className="text-blue-500" />

        <span className="flex items-center gap-3">
          {item.name}

          {item.status === "pending" || item.status === "processing" ? (
            <Loader2
              size={14}
              className="text-yellow-500 animate-spin"
            />
          ) : item.status === "completed" ? (
            <CheckCircle2
              size={14}
              className="text-green-500"
            />
          ) : item.status === "failed" ? (
            <XCircle
              size={14}
              className="text-red-500"
            />
          ) : null}
        </span>
      </td> */}

      <td className="pl-5 py-3 max-w-[250px] align-middle">
  <div className="flex items-center gap-2 min-w-0">
    <FileText size={14} className="text-blue-500 shrink-0" />

    <div className="flex items-center gap-2 min-w-0">
      <Tooltip title={item.name}>
  <span className="truncate max-w-[300px] block cursor-pointer">
    {item.name}
  </span>
</Tooltip>

      {/* Status */}
      <span className="shrink-0">
        {item.status === "pending" || item.status === "processing" ? (
          <Loader2 size={14} className="text-yellow-500 animate-spin" />
        ) : item.status === "completed" ? (
          <CheckCircle2 size={14} className="text-green-500" />
        ) : item.status === "failed" ? (
          <XCircle size={14} className="text-red-500" />
        ) : null}
      </span>
    </div>
  </div>
</td>

      {/* <td className="px-4 py-3 text-right"> */}
      <td className="px-4 py-3 text-right whitespace-nowrap align-middle">
        {item.status === "completed" && (
          <button
            onClick={() => onDownload(item.id, item.name)}
            className="mr-2 text-blue-600"
          >
            <Download size={14} />
          </button>
        )}

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
  // return (
  //   <tr className="hover:bg-gray-50">
  //     <td className="px-6 py-4 flex items-center gap-2">
  //       <FileText size={16} className="text-blue-500" />
  //       {item.name}
  //     </td>

  //     <td className="px-6 py-4">
  //       {item.application_name || "Default App"}
  //     </td>

  //     <td className="px-6 py-4">
  //       {item.created_on.replace("Z", "")}
  //     </td>

  //     <td className="px-6 py-4">
  //       <StatusBadge status={item.status} />
  //     </td>

  //     <td className="px-6 py-4 text-right">
  //       {item.status == "completed" && <button
  //         onClick={() => onDownload(item.id, item.name)}
  //         disabled={item.status !== "completed"}
  //         className= {` mr-2 ${ item.status !== "completed" ? "text-blue-100" : "text-blue-600" }`}
  //       >
  //         <Download size={16} />
  //       </button>}

  //       <button
  //         onClick={() => onDelete(item.id)}
  //         className="text-red-600"
  //       >
  //         <Trash2 size={16} />
  //       </button>
  //     </td>
  //   </tr>
  // );

  return (
  <tr className="hover:bg-gray-50 align-middle">
    {/* NAME COLUMN */}
    <td className="px-6 py-4 max-w-[300px] align-middle">
      {/* <div className="flex items-center gap-2 min-w-0">
        <FileText size={16} className="text-blue-500 shrink-0" />

        <span
          className="truncate block"
          title={item.name} // ✅ tooltip
        >
          {item.name}
        </span>
      </div> */}

      <div className="relative group w-full">
  <span className="truncate block group-hover:invisible">
    {item.name}
  </span>

  <div className="absolute left-0 top-0 z-50 hidden group-hover:block bg-white shadow-lg border rounded px-2 py-1 max-w-[400px] break-words">
    {item.name}
  </div>
</div>

    </td>

    {/* APPLICATION */}
    <td className="px-6 py-4 align-middle">
      {item.application_name || "Default App"}
    </td>

    {/* DATE */}
    <td className="px-6 py-4 align-middle">
      {item.created_on.replace("Z", "")}
    </td>

    {/* STATUS */}
    <td className="px-6 py-4 align-middle">
      <StatusBadge status={item.status} />
    </td>

    {/* ACTIONS */}
    <td className="px-6 py-4 text-right whitespace-nowrap align-middle">
      {item.status === "completed" && (
        <button
          onClick={() => onDownload(item.id, item.name)}
          className="mr-2 text-blue-600"
        >
          <Download size={16} />
        </button>
      )}

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
