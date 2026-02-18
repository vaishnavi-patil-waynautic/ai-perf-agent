import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import ApplicationCard from "../components/ApplicationCard";
import AddApplicationDialog from "../components/AddApplicationDialog";
import { useState } from "react";
import InfoCard from "@/components/InfoCard";
import { createApplication, deleteApplication, updateApplication } from "@/pages/project/store/project.thunks";
import { Application } from "@/pages/project/types/project.types";
import { showSnackbar } from "@/store/snackbarStore";

export default function ApplicationSettings() {

  const applications = useSelector(
    (state: RootState) => state.project.applications
  );

  const dispatch = useDispatch<AppDispatch>();
  const { selectedProject } = useSelector((state: RootState) => state.project);
  const user = useSelector((state: RootState) => state.user.profile);

  const [open, setOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // const handleAdd = async (data: { name: string; description: string }) => {
  //   if (!selectedProject?.id) return;

  //   try {
  //     await dispatch(createApplication({
  //       projectId: selectedProject.id,
  //       name: data.name,
  //       description: data.description
  //     })).unwrap();

  //     console.log("[UI] Application created");

  //   } catch (err) {
  //     console.error("[UI] Create failed:", err);
  //   }
  // };

  const handleAdd = async (data: { name: string; description: string }) => {
  if (!selectedProject?.id) return;

  try {
    await dispatch(
      createApplication({
        projectId: selectedProject.id,
        name: data.name,
        description: data.description,
      })
    ).unwrap();

    dispatch(
      showSnackbar({
        message: "Application created successfully",
        type: "success",
      })
    );
  } catch (err: any) {
    console.error("[UI] Create failed:", err);

    dispatch(
      showSnackbar({
        message: err?.message || "Failed to create application",
        type: "error",
      })
    );
  }
};



  // const handleEdit = async (data: { name: string; description: string }) => {
  //   if (!editingApp) return;

  //   try {
  //     await dispatch(updateApplication({
  //       appId: editingApp.id,   // must be NUMBER
  //       name: data.name,
  //       description: data.description
  //     })).unwrap();

  //     console.log("[UI] Application updated");

  //     setEditingApp(null);

  //   } catch (err) {
  //     console.error("[UI] Update failed:", err);
  //   }
  // };


  // const handleDelete = async (id: number) => {
  //   try {
  //     await dispatch(deleteApplication(id)).unwrap();
  //     console.log("[UI] Application deleted");
  //   } catch (err) {
  //     console.error("[UI] Delete failed:", err);
  //   }
  // };
const handleEdit = async (data: { name: string; description: string }) => {
  if (!editingApp) return;

  try {
    await dispatch(
      updateApplication({
        appId: editingApp.id,
        name: data.name,
        description: data.description,
      })
    ).unwrap();

    setEditingApp(null);

    dispatch(
      showSnackbar({
        message: "Application updated successfully",
        type: "success",
      })
    );
  } catch (err: any) {
    console.error("[UI] Update failed:", err);

    dispatch(
      showSnackbar({
        message: err?.message || "Failed to update application",
        type: "error",
      })
    );
  }
};


const handleDelete = async (id: number) => {
  try {
    await dispatch(deleteApplication(id)).unwrap();

    dispatch(
      showSnackbar({
        message: "Application deleted successfully",
        type: "success",
      })
    );
  } catch (err: any) {
    console.error("[UI] Delete failed:", err);

    dispatch(
      showSnackbar({
        message: err?.message || "Failed to delete application",
        type: "error",
      })
    );
  }
};


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Applications
        </h1>
        <button
          onClick={() => {
            setEditingApp(null);
            setOpen(true);
          }}
          disabled={!user?.is_staff}
          className={`
    px-4 py-2 rounded-md text-white transition
    ${user?.is_staff
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"}
  `}
        >
          Add Application
        </button>
      </div>

      <div className="space-y-3">
        {applications.map(app => (
          // <ApplicationCard
          //   key={app.id}
          //   app={app}
          //   onEdit={() => {
          //     setEditingApp(app);
          //     setOpen(true);
          //   }}
          //   onDelete={() => handleDelete(app.id)}
          // />

          <InfoCard
            key={app.id}
            name={app.name}
            desc={app.description}
            {...(user?.is_staff && {
              onEdit: () => {
                setEditingApp(app);
                setOpen(true);
              },
              onDelete: () => handleDelete(app.id),
            })}
          />

        ))}
      </div>

      <AddApplicationDialog
        open={open}
        initialData={editingApp}
        onClose={() => {
          setOpen(false);
          setEditingApp(null);
        }}
        onSubmit={editingApp ? handleEdit : handleAdd}
      />
    </div>
  );
}
