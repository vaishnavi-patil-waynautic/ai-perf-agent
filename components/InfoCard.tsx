import React from "react";
import { StatusBadge } from "./StatusBadge";
import { Download, EditIcon, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';


type RecentBuild = {
  id: string;
  name: string;
  link: string;
  onNavigate?: (id: string) => void;
};


type InfoCardProps = {
  name: string;
  desc?: string;
  createdOn?: string;
  createdBy?: string;
  recentBuild?: RecentBuild;
  status?: string;
  onDownload?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onEdit?: () => void;
};

const InfoCard: React.FC<InfoCardProps> = ({
  name,
  desc,
  createdOn,
  createdBy,
  recentBuild,
  status,
  onDownload,
  onDelete,
  onView,
  onEdit,
}) => {

  const navigate = useNavigate();
  // Only enable buttons for these statuses
  const isDisabled =
    status && !["Completed",'completed', "configured", "unconfigured"].includes(status);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Left Section */}
      <div>
        <div className="flex items-center space-x-3 mb-1">
          <div className="text-base font-semibold text-gray-900">{name}</div>
          {status && <StatusBadge status={status} />}
        </div>

        {desc && <div className="text-sm text-gray-500">{desc}</div>}

        {createdOn && (
          <div className="text-xs text-gray-500 mt-1">Created On: {createdOn}</div>
        )}

        {createdBy && (
          <div className="text-xs text-gray-500 mt-1">Created By: {createdBy}</div>
        )}

        {recentBuild && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="text-xs text-gray-500">Recent Build:</div>
            <span
              onClick={() => {
                if (recentBuild?.link) {
                  console.log("Navigating to:", recentBuild.link);
                  navigate(recentBuild.link);
                }
              }} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
            >
              {recentBuild.name || "-"}
            </span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {onDownload && (
          <button
            onClick={onDownload}
            disabled={isDisabled}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 disabled:opacity-50"
            title="Download"
          >
            <Download size={18} />
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isDisabled}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isDisabled}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}

        {onView && (
          <button
            onClick={onView}
            disabled={isDisabled}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoCard;