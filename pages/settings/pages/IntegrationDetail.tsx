import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle } from "lucide-react";
import IntegrationTokenDialog from "../components/IntegrationTokenDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteIntegration, fetchIntegrations } from "../store/integration.thunk";
import { Integration, IntegrationStatus } from "../types/settings.types";

export default function IntegrationDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProject } = useSelector((state: RootState) => state.project);
  const integrations = useSelector((state: RootState) => state.integration.list);
  const [integrationType, setIntegrationType] = useState<string>("github");
  const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null);
  const user = useSelector((state: RootState) => state.user.profile);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    integrationId?: number;
    type?: string;
  }>({ open: false });


  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    if (!selectedProject?.id) return;
    dispatch(fetchIntegrations(selectedProject.id));
  }, [selectedProject?.id]);

  /* ---------------- Delete ---------------- */
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

  /* ---------------- Helpers ---------------- */
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


  const handleClose = () =>{
    setDialogState({ open: false });
    dispatch(fetchIntegrations(selectedProject.id));
  }

  /* ---------------- UI ---------------- */
  return (
    // <div className="max-w-6xl mx-auto">
    <div className="w-full px-6">

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Integrations</h1>

      {/* <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> */}
        {/* <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"> */}
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
           {/* <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,240px))]"> */}
          {/*<div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-start"> */}
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

              {/* <div className="flex items-start justify-between mb-4"> */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  {/* <div className="flex items-center gap-2 flex-1">
                   */}

                   <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(integration.status)}`} />
                  <h3 className="font-medium text-gray-900 text-base truncate">
                    {integration.name}
                  </h3>
                </div>

                {
                  user?.is_staff && (<div className="flex items-center gap-1 ml-auto flex-wrap">

                    {/* ACTIVE → EDIT */}
                    {integration.status === "active" ? (
                      <>
                        <button
                          // onClick={() => {
                          //   setOpenToken(integration.id ?? null);
                          //   setIntegrationType(integration.type);   // 👈 pass type
                          // }}
                          disabled = {!user?.is_staff}
                          onClick={() => {
                            setDialogState({
                              open: true,
                              integrationId: integration.id ?? undefined,
                              type: integration.type,
                            });
                          }}

                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit token"
                        >
                          <Edit2 size={16} className="text-gray-600" />
                        </button>

                        <button
                          disabled = {!user?.is_staff}
                          onClick={() => setDeleteTarget(integration)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          title="Remove token"
                        >
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      </>
                    ) : (
                      /* INACTIVE / FAILED → NEW TOKEN */
                      <button
                        // onClick={() => {
                        //   setOpenToken(null);              // 👈 new token (no id)
                        //   setIntegrationType(integration.type);
                        // }}
                        onClick={() => {
                          setDialogState({
                            open: true,
                            integrationId: undefined,   // 👈 new
                            type: integration.type,
                          });
                        }}
                        disabled = {!user?.is_staff}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                        title="Configure"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    )}

                  </div>)
                }

                  
              </div>

              <div className="mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status === "active"
                    ? "Active"
                    : integration.status === "failed"
                      ? "Failed"
                      : "Inactive"}
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

      {/* ================= TOKEN DIALOG ================= */}
      {/* <IntegrationTokenDialog
        open={openToken !== null}
        onClose={() => setOpenToken(null)}
        integrationId={openToken ?? undefined}
        type={integrationType}
        projectId={selectedProject?.id}
      /> */}
      <IntegrationTokenDialog
        open={dialogState.open}
        onClose= {handleClose}
        integrationId={dialogState.integrationId}
        type={dialogState.type ?? "github"}
        projectId={selectedProject?.id}
      />


      {/* ================= DELETE MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Integration</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove the token for
              <span className="font-medium text-gray-900"> {deleteTarget.name}</span>?
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
      )}
    </div>
  );
}
