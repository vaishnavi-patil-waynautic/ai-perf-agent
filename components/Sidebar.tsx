import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { selectApplication  } from '../pages/project/store/project.slice';
import { ChevronRight, Box, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, selectedApp, selectedProject } = useSelector((state: RootState) => state.project);

  const handleAppClick = (appId: number) => {
    dispatch(selectApplication (appId));
    navigate('/dashboard'); // Reset to dashboard view of the app
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-0'}
      `}
    >
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Applications
        </h3>
        
        {!selectedProject && (
           <p className="text-sm text-gray-500 italic">Select a project to view apps.</p>
        )}

        {selectedProject && applications?.length === 0 && (
           <p className="text-sm text-gray-500 italic">No apps found.</p>
        )}

        <ul className="space-y-1">
          {applications?.map((app) => (
            <li key={app.id}>
              <button
                onClick={() => handleAppClick(app.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${selectedApp?.id === app.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <div className="flex items-center">
                  <Box size={16} className="mr-3" />
                  <span className="truncate">{app.name}</span>
                </div>
                {selectedApp?.id === app.id && <ChevronRight size={14} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;