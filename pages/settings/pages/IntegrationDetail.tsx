


// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import { updateIntegration } from "../store/settings.store";
// import IntegrationTokenDialog from "../components/IntegrationTokenDialog";

// export default function IntegrationDetail() {
//   const { integrationId } = useParams<{ integrationId: string }>();
//   const dispatch = useAppDispatch();

//   const integration = useAppSelector(state =>
//     state.settings.integrations.find(i => i.type === integrationId)
//   );

//   const [open, setOpen] = useState(false);

//   if (!integration) {
//     return <div className="text-red-500">Invalid integration</div>;
//   }

//   return (


//     <div className="p-8 space-y-12 bg-gray-50 min-h-screen">

//       <div className="max-w-2xl">
//         {/* <h2 className="text-sm font-medium text-gray-500 mb-6">Variation 6: Card with Icon</h2> */}
//         <h1 className="text-2xl font-bold mb-6 text-gray-900">{integration.name}</h1>
//         <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
//           <div className="flex items-start gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-3">
//                 <h3 className="font-semibold text-gray-900">Connected</h3>
//                 {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span> */}
//               </div>

//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <p className="text-sm opacity-90 mb-1">Authentication Token</p>
//                   <p className="text-xl font-mono font-semibold">****{integration.token?.slice(-4)}</p>
//                 </div>
//                 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full" onClick={()=>{console.log("clicked")}}>Active</span>
//               </div>

//               <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
//                 Edit Token
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// }


// import { useState } from "react";
// import { Edit2, Trash2, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
// import IntegrationTokenDialog from "../components/IntegrationTokenDialog";

// /* ---------------- Dummy Data ---------------- */

// type Status = "active" | "inactive" | "failed";

// type Integration = {
//   id: string;
//   name: string;
//   token?: string;
//   status: Status;
//   error?: string;
// };

// const initialIntegrations: Integration[] = [
//   { id: "github", name: "GitHub", token: "ghp_xxx_1234", status: "active" },
//   { id: "blazemeter", name: "BlazeMeter", status: "inactive" },
//   { id: "ado", name: "Azure DevOps", token: "ado_xxx_9876", status: "active" },
//   { id: "datadog", name: "Datadog", status: "failed", error: "Token expired. Authentication failed." },
//   { id: "jira", name: "Jira", status: "inactive" },
// ];

// export default function IntegrationDetail() {
//   const [integrations, setIntegrations] = useState(initialIntegrations);
//   const [openToken, setOpenToken] = useState<string | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null);

//   /* ---------------- Actions ---------------- */

//   const handleDelete = () => {
//     if (!deleteTarget) return;

//     setIntegrations(prev =>
//       prev.map(i =>
//         i.id === deleteTarget.id
//           ? { ...i, status: "inactive", token: undefined }
//           : i
//       )
//     );

//     setDeleteTarget(null);
//   };

//   const failed = integrations.find(i => i.status === "failed");

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen space-y-8">

//       {/* Top Error Banner */}
//       {failed && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//           <AlertTriangle size={18} />
//           <span><b>{failed.name}:</b> {failed.error}</span>
//         </div>
//       )}

//       <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>

//       {/* Tiles */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//         {integrations.map(integration => (
//           <div
//             key={integration.id}
//             className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6"
//           >
//             <div className="flex items-start gap-4">

//               {/* Left Status Icon */}
//               <div
//                 className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
//                 ${
//                   integration.status === "active"
//                     ? "bg-green-100"
//                     : integration.status === "inactive"
//                     ? "bg-yellow-100"
//                     : "bg-red-100"
//                 }`}
//               >
//                 {integration.status === "active" && (
//                   <CheckCircle2 className="text-green-600" size={20} />
//                 )}
//                 {integration.status === "inactive" && (
//                   <Plus className="text-yellow-600" size={20} />
//                 )}
//                 {integration.status === "failed" && (
//                   <AlertTriangle className="text-red-600" size={20} />
//                 )}
//               </div>

//               {/* Content */}
//               <div className="flex-1">

//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-3">
//                   <h3
//                     className={`font-semibold ${
//                       integration.status === "active"
//                         ? "text-green-700"
//                         : integration.status === "inactive"
//                         ? "text-yellow-700"
//                         : "text-red-700"
//                     }`}
//                   >
//                     {integration.name}
//                   </h3>

//                   {integration.status === "active" && (
//                     <div className="flex gap-1">
//                       <button
//                         onClick={() => setOpenToken(integration.id)}
//                         className="p-1.5 rounded hover:bg-gray-100"
//                       >
//                         <Edit2 size={16} />
//                       </button>
//                       <button
//                         onClick={() => setDeleteTarget(integration)}
//                         className="p-1.5 rounded hover:bg-gray-100 text-red-600"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Body */}
//                 {integration.status === "active" && (
//                   <>
//                     <p className="text-sm text-gray-500 mb-1">Authentication Token</p>
//                     <p className="text-lg font-mono font-semibold mb-3">
//                       ****{integration.token?.slice(-4)}
//                     </p>

//                     <button
//                       onClick={() => setOpenToken(integration.id)}
//                       className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
//                     >
//                       Edit Token
//                     </button>
//                   </>
//                 )}

//                 {integration.status === "inactive" && (
//                   <button
//                     onClick={() => setOpenToken(integration.id)}
//                     className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
//                   >
//                     Add Token
//                   </button>
//                 )}

//                 {integration.status === "failed" && (
//                   <>
//                     <p className="text-sm text-red-600 mb-3">{integration.error}</p>

//                     <button
//                       onClick={() => setOpenToken(integration.id)}
//                       className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
//                     >
//                       Fix Connection
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Token Dialog */}
//       <IntegrationTokenDialog
//         open={!!openToken}
//         onClose={() => setOpenToken(null)}
//         integrationId={openToken}
//       />

//       {/* Delete Confirmation */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-[360px]">
//             <h3 className="font-semibold mb-2">Delete Token</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Remove token for <b>{deleteTarget.name}</b>?
//             </p>

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="px-3 py-1.5 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-3 py-1.5 bg-red-600 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState } from "react";
// import { Edit2, Trash2, Plus, AlertTriangle, CheckCircle2, X } from "lucide-react";
// import IntegrationTokenDialog from "../components/IntegrationTokenDialog";

// /* ---------------- Dummy Data ---------------- */

// type Status = "active" | "inactive" | "failed";

// type Integration = {
//   id: string;
//   name: string;
//   token?: string;
//   status: Status;
//   error?: string;
// };

// const initialIntegrations: Integration[] = [
//   { id: "github", name: "GitHub", token: "ghp_xxx_1234", status: "active" },
//   { id: "blazemeter", name: "BlazeMeter", status: "inactive" },
//   { id: "ado", name: "Azure DevOps", token: "ado_xxx_9876", status: "active" },
//   { id: "datadog", name: "Datadog", status: "failed", error: "Token expired. Authentication failed." },
//   { id: "jira", name: "Jira", status: "inactive" },
// ];

// export default function IntegrationDetail() {
//   const [integrations, setIntegrations] = useState(initialIntegrations);
//   const [openToken, setOpenToken] = useState<string | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null);

//   /* ---------------- Actions ---------------- */

//   const handleDelete = () => {
//     if (!deleteTarget) return;

//     setIntegrations(prev =>
//       prev.map(i =>
//         i.id === deleteTarget.id
//           ? { ...i, status: "inactive", token: undefined }
//           : i
//       )
//     );

//     setDeleteTarget(null);
//   };

//   const failed = integrations.find(i => i.status === "failed");

//   return (
//     // <div className="p-8 bg-gray-50 min-h-screen space-y-8">

//     //   {/* Top Error Banner */}
//     //   {failed && (
//     //     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//     //       <AlertTriangle size={18} />
//     //       <span><b>{failed.name}:</b> {failed.error}</span>
//     //     </div>
//     //   )}

//     //   <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>

//     //   {/* Horizontal Scrollable Pills */}
//     //   <div className="flex gap-4 overflow-x-auto pb-4">
//     //     {integrations.map(integration => (
//     //       <div
//     //         key={integration.id}
//     //         className={`
//     //           relative flex-shrink-0 w-56 px-6 py-5 rounded-2xl border-2 
//     //           ${
//     //             integration.status === "active"
//     //               ? "bg-green-600 border-green-600"
//     //               : integration.status === "inactive"
//     //               ? "bg-white border-yellow-500"
//     //               : "bg-white border-yellow-500"
//     //           }
//     //         `}
//     //       >
//     //         {/* Close/Delete button for active integrations */}
//     //         {integration.status === "active" && (
//     //           <button
//     //             onClick={() => setDeleteTarget(integration)}
//     //             className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
//     //           >
//     //             <X size={16} className="text-white" />
//     //           </button>
//     //         )}

//     //         {/* Not Configured button for inactive/failed */}
//     //         {(integration.status === "inactive" || integration.status === "failed") && (
//     //           <button
//     //             onClick={() => setOpenToken(integration.id)}
//     //             className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
//     //           >
//     //             <X size={16} className="text-white" />
//     //           </button>
//     //         )}

//     //         {/* Content */}
//     //         <div className="flex items-center gap-3 mb-3">
//     //           <h3
//     //             className={`font-semibold text-base ${
//     //               integration.status === "active"
//     //                 ? "text-white"
//     //                 : "text-gray-900"
//     //             }`}
//     //           >
//     //             {integration.name}
//     //           </h3>

//     //           {integration.status === "active" && (
//     //             <CheckCircle2 size={18} className="text-white" />
//     //           )}
//     //         </div>

//     //         {/* Status Badge */}
//     //         <div
//     //           className={`
//     //             inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//     //             ${
//     //               integration.status === "active"
//     //                 ? "bg-white/20 text-white"
//     //                 : "bg-yellow-100 text-yellow-800"
//     //             }
//     //           `}
//     //         >
//     //           {integration.status === "active" ? "Configured" : "Not Configured"}
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>

//     //   {/* Token Dialog */}
//     //   <IntegrationTokenDialog
//     //     open={!!openToken}
//     //     onClose={() => setOpenToken(null)}
//     //     initialToken={openToken}
//     //     onSave={()=>{}}
//     //   />

//     //   {/* Delete Confirmation */}
//     //   {deleteTarget && (
//     //     <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//     //       <div className="bg-white rounded-xl shadow-lg p-6 w-[360px]">
//     //         <h3 className="font-semibold mb-2">Delete Token</h3>
//     //         <p className="text-sm text-gray-600 mb-4">
//     //           Remove token for <b>{deleteTarget.name}</b>?
//     //         </p>

//     //         <div className="flex justify-end gap-2">
//     //           <button
//     //             onClick={() => setDeleteTarget(null)}
//     //             className="px-3 py-1.5 border rounded"
//     //           >
//     //             Cancel
//     //           </button>
//     //           <button
//     //             onClick={handleDelete}
//     //             className="px-3 py-1.5 bg-red-600 text-white rounded"
//     //           >
//     //             Delete
//     //           </button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>

//   <div className="p-8 bg-gray-50 min-h-screen space-y-6">

//     {/* Title */}
//     <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>

//     {/* Error Banner BELOW TITLE */}
//     {failed && (
//       <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//         <AlertTriangle size={18} />
//         <span><b>{failed.name}:</b> {failed.error}</span>
//       </div>
//     )}

//     {/* Horizontal Pills */}
//     <div className="flex gap-4 overflow-x-auto pb-4">

//       {integrations.map(integration => (
//         <div
//           key={integration.id}
//           className={`
//             relative flex-shrink-0 w-56 px-6 py-5 rounded-2xl border-2 transition
//             ${
//               integration.status === "active"
//                 ? "bg-green-600 border-green-600"
//                 : integration.status === "failed"
//                 ? "bg-white border-red-500"
//                 : "bg-white border-yellow-500"
//             }
//           `}
//         >

//           {/* ===== ACTIVE ICONS ===== */}
//           {integration.status === "active" && (
//             <div className="absolute top-3 right-3 flex gap-1">

//               {/* Edit */}
//               <button
//                 onClick={() => setOpenToken(integration.id)}
//                 className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
//               >
//                 <Edit2 size={14} className="text-white" />
//               </button>

//               {/* Delete */}
//               <button
//                 onClick={() => setDeleteTarget(integration)}
//                 className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
//               >
//                 <Trash2 size={14} className="text-white" />
//               </button>

//             </div>
//           )}

//           {/* ===== ADD TOKEN BUTTON (Inactive + Failed) ===== */}
//           {(integration.status === "inactive" || integration.status === "failed") && (
//             <button
//               onClick={() => setOpenToken(integration.id)}
//               className={`
//                 absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition
//                 ${
//                   integration.status === "failed"
//                     ? "bg-red-500 hover:bg-red-600"
//                     : "bg-yellow-500 hover:bg-yellow-600"
//                 }
//               `}
//             >
//               <Plus size={14} className="text-white" />
//             </button>
//           )}

//           {/* ===== CONTENT ===== */}
//           <div className="flex items-center gap-2 mb-3">

//             <h3
//               className={`font-semibold text-base ${
//                 integration.status === "active"
//                   ? "text-white"
//                   : integration.status === "failed"
//                   ? "text-red-600"
//                   : "text-gray-900"
//               }`}
//             >
//               {integration.name}
//             </h3>

//             {/* {integration.status === "active" && (
//               <CheckCircle2 size={18} className="text-white" />
//             )} */}
//           </div>

//           {/* ===== STATUS BADGE ===== */}
//           <div
//             className={`
//               inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//               ${
//                 integration.status === "active"
//                   ? "bg-white/20 text-white"
//                   : integration.status === "failed"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-yellow-100 text-yellow-800"
//               }
//             `}
//           >
//             {integration.status === "active"
//               ? "Active"
//               : integration.status === "failed"
//               ? "Failed"
//               : "Inactive"}
//           </div>

//           {/* ===== FAILED ERROR TEXT INSIDE TILE (optional) ===== */}
//           {integration.status === "failed" && (
//             <p className="text-xs text-red-600 mt-2">
//               {integration.error}
//             </p>
//           )}

//         </div>
//       ))}

//     </div>

//     </div>

//   );
// }




import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, MoreVertical, AlertCircle } from "lucide-react";
import IntegrationTokenDialog from "../components/IntegrationTokenDialog";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteIntegration, fetchIntegrations } from "../store/integration.thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Integration, IntegrationStatus } from "../types/settings.types";

/* ---------------- Dummy Data ---------------- */


export default function IntegrationDetail() {

   const dispatch = useDispatch<AppDispatch>();
  const { selectedProject } = useSelector((state: RootState) => state.project);
  
const integrations = useSelector((state: RootState) => state.integration.list);

  const [openToken, setOpenToken] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  /* ---------------- Actions ---------------- */

  useEffect(() => {
  if (!selectedProject?.id) return;
  dispatch(fetchIntegrations(selectedProject.id));
}, [selectedProject?.id]);


 const handleDelete = () => {
  if (!deleteTarget || !deleteTarget.id || !selectedProject?.id) return;

  dispatch(
    deleteIntegration({
      projectId: selectedProject.id,
      id: Number(deleteTarget.id),
    })
  );

  setDeleteTarget(null);
};


  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusDot = (status: IntegrationStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const shortenText = (text: string, max: number) => {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "...";
  };


  return (

    <div className="max-w-6xl mx-auto">

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Integrations</h1>

      {integrations.some(i => i.status === "failed") && (
        <div className="mb-6 space-y-2">
          {integrations
            .filter(i => i.status === "failed")
            .map(i => (
              <div
                key={i.id}
                className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />

                <div className="flex-1">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm opacity-90 break-words">{i.error}</p>
                </div>
              </div>
            ))}
        </div>
      )}


      <div
        className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5">

        {integrations.map(integration => (
          <div
            key={integration.id ?? integration.type}
            onMouseEnter={() => setHoveredCard(integration.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative bg-white rounded-xl shadow-sm hover:shadow-md 
                 transition-all duration-200 border-l-4 border-transparent
                 h-[150px] flex flex-col justify-between"
            style={{
              borderLeftColor:
                integration.status === "active"
                  ? "#22c55e"
                  : integration.status === "failed"
                    ? "#ef4444"
                    : "#d1d5db"
            }}
          >
            <div className="p-5 flex flex-col h-full">


              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">

                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(integration.status)}`} />

                  <h3 className="font-medium text-gray-900 text-base truncate">
                    {integration.name}
                  </h3>
                </div>

                {(hoveredCard === integration.id || integration.status !== "active") && (
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {integration.status === "active" ? (
                      <>
                        <button
                          onClick={() => setOpenToken(String(integration.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit token"
                        >
                          <Edit2 size={16} className="text-gray-600" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(integration)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          title="Remove token"
                        >
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setOpenToken(String(integration.id))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                        title="Configure"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status === "active" ? "Active" : integration.status === "failed" ? "Failed" : "Inactive"}
                </span>
              </div>


              {integration.status === "active" && integration.token && (
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {integration.token.substring(0, 12)}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>




      <IntegrationTokenDialog
        open={!!openToken}
        onClose={() => setOpenToken(null)}
        initialToken={String(openToken)}
        onSave={() => { }}
      />

      {
        deleteTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Integration</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to remove the token for <span className="font-medium text-gray-900">{deleteTarget.name}</span>? This will deactivate the integration.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}