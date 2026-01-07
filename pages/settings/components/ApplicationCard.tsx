import { Download, Edit, Trash2 } from "lucide-react";
import { Application } from "../types/settings.types";
import { on } from "events";

export default function ApplicationCard({ app, onEdit, onDelete }: { app: Application, onEdit?: () => void, onDelete?: () => void }) {
  return (
    <div
                    key={app.id}
                    className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    {/* Left section: title and description */}
                    <div>
    
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="text-base font-semibold text-gray-900">{app.name}</div>
                      </div>
    
    
                      {/* Created On */}
                      <div className="text-xs text-gray-500 mt-1">
                        {app.description}
                      </div>
    
    
    
    
                    </div>
    
                    {/* Right section: icons and button */}
                    <div className="flex items-center space-x-3">
                      {/* Edit icon */}
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit"
                        onClick={() => onEdit && onEdit()}
                      >
                        <Edit size={18} />
                      </button>
    
                      <button
                        onClick={() => onDelete && onDelete()}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
  );
}
