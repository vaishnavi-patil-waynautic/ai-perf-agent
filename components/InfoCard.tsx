import React from "react";
import { StatusBadge } from "./StatusBadge";
import { Download, EditIcon, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AddApplicationModal } from "@/pages/autoanalysis/components/AddApplicationModal";


type RecentBuild = {
  state: any;
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
  onUnconfigured?: () => void;
  onProgress?: () => void;
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
  onUnconfigured,
  onProgress
}) => {

  const navigate = useNavigate();
  
  // View button should be disabled for in_progress and not_configured
  const canView = status && !["in_progress", "not_configured", "failed"].includes(status);
  
  // Download/Edit buttons disabled for these statuses
  const isActionDisabled = status && !["completed", "Completed", "configured", "partially_configured"].includes(status);


  const handleRecentBuildClick = () => {
    navigate(recentBuild.link, {
      state: recentBuild.state
    });
  };


  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm ">
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
              onClick={handleRecentBuildClick}
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
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
            disabled={isActionDisabled}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download"
          >
            <Download size={18} />
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isActionDisabled}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}

        {/* View button - enabled for configured, partially_configured */}
        {onView && canView && (
          <button
            onClick={onView}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            View
          </button>
        )}

        {/* Configure/Reconfigure button - shown for not_configured or failed */}
        {onUnconfigured && (status === "not_configured" || status === "failed") && (
          <button
            onClick={onUnconfigured}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {status === "not_configured" ? "Configure" : "Reconfigure"}
          </button>
        )}
        
        {/* In Progress indicator - shown when setup is running */}
        {onProgress && status === "in_progress" && (
          <button
            onClick={onProgress}
            disabled
            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded cursor-not-allowed opacity-75 flex items-center gap-2"
          >
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Configuring...
          </button>
        )}
      </div>

    </div>



  );
};

export default InfoCard;