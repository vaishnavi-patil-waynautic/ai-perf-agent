import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  addApplication,
  updateApplication,
  deleteApplication
} from "../store/settings.store";
import ApplicationCard from "../components/ApplicationCard";
import AddApplicationDialog from "../components/AddApplicationDialog";
import { useState } from "react";
import { Application } from "../types/settings.types";
import InfoCard from "@/components/InfoCard";

export default function ApplicationSettings() {
  const applications = useSelector(
    (state: RootState) => state.settings.applications
  );

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const handleAdd = (data: { name: string; description: string }) => {
    dispatch(
      addApplication({
        id: crypto.randomUUID(),
        ...data
      })
    );
  };

  const handleEdit = (data: { name: string; description: string }) => {
    if (!editingApp) return;

    dispatch(
      updateApplication({
        id: editingApp.id,
        name: data.name,
        description: data.description
      })
    );

    setEditingApp(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteApplication(id));
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
            onEdit={() => {
              setEditingApp(app);
              setOpen(true);
            }}
            onDelete={() => handleDelete(app.id)}
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
