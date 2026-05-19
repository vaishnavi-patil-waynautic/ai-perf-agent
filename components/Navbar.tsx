import React, { useEffect } from 'react';
import { Menu, Search, User as UserIcon, LogOut, ChevronDown, Settings, Power, Briefcase } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../store/store';
import { resetProjectState, selectProject } from '../pages/project/store/project.slice';
import { logout } from '../store/authSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { FormControl, MenuItem, Select, Tooltip } from '@mui/material';
import { fetchProjectById, fetchProjects } from '@/pages/project/store/project.thunks';
import type { AppDispatch } from '../store/store';
import { logoutService } from '@/pages/authentication/services/logoutService';

import {
  FileCode2,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";




interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const profileAvatar = useSelector((state: RootState) => state.user.profile?.avatar);
  const { projects, selectedProject } = useSelector((state: RootState) => state.project);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const location = useLocation();



  useEffect(() => {

    if (projects.length === 0) {
      dispatch(fetchProjects());
      console.log(" fetching ALL PROJECTS")
    }


    const storedId = localStorage.getItem('selectedProjectId');

    if (storedId) {
      dispatch(fetchProjectById(Number(storedId)));
    }

    else {
      console.log("PROJECTS : ", projects)
      console.log("FETCHING FIRST PROJECT")
      const lastId = projects[projects.length - 1]?.id
      if (lastId) dispatch(fetchProjectById(lastId));

    }


  }, [dispatch, selectProject, projects.length]);



  const handleProjectSelect = (projectId: number) => {
    dispatch(selectProject(projectId));
    dispatch(fetchProjectById(projectId));
  }



  const handleLogout = async () => {
    try {
      // First inform backend
      await logoutService();
    } catch (err) {
      console.warn("Logout API error:", err);
    } finally {
      // Always clear frontend state
      dispatch(logout());
      dispatch(resetProjectState());

      navigate("/login", { replace: true });
    }
  };


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center space-x-4">

          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              // src="../static/exgenix.png"
              src="/ai-perf-agent/img/exgenix.png"
              alt="Exgenix"
              className="h-8 w-auto"
            />

            <span className="text-l font-semibold text-gray-800 tracking-tight">

              Waynautic AI Perf Agent
            </span>
          </div>


        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">

          <Tooltip title="Select active project" arrow disableHoverListener disableTouchListener>
            <FormControl size="small">

              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm hover:shadow transition">

                <Briefcase size={16} className="text-gray-500" />

                <Select
                  value={selectedProject?.id ?? ""}
                  onChange={(e) => handleProjectSelect(Number(e.target.value))}
                  variant="standard"
                  disableUnderline
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) {
                      return (
                        <span className="text-gray-400">
                          Select Project
                        </span>
                      );
                    }

                    const selected = projects.find(p => p.id === value);
                    return selected?.name || "";
                  }}


                  MenuProps={{
                    PaperProps: {
                      sx: {
                        minWidth: 180
                      }
                    }
                  }}

                  sx={{
                    minWidth: 120,
                    fontSize: "13px",
                    fontWeight: 500,
                    "& .MuiSelect-select": {
                      padding: "2px 0"
                    }
                  }}
                >

                  {/* NOTICE: No "Select Project" MenuItem */}

                  {projects.map((p) => (
                    <MenuItem
                      key={p.id}
                      value={p.id}
                      sx={{
                        minWidth: 120,
                        fontSize: "13px",
                        py: 1
                      }}
                    >
                      {p.name}
                    </MenuItem>
                  ))}

                </Select>

              </div>

            </FormControl>
          </Tooltip>


          <div className="flex items-center gap-4">

            {/* Profile → Profile settings */}
            <Tooltip title="Profile Settings" arrow>
              <button
                onClick={() => navigate("/settings/profile")}
                className="flex items-center space-x-2 focus:outline-none hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium overflow-hidden border border-blue-200">
                  {(profileAvatar || user?.avatar) ? (
                    <img
                      src={profileAvatar || user?.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={18} />
                  )}
                </div>

                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name}
                </span>
              </button>
            </Tooltip>

            {/* Sign Out – clear, destructive, with tooltip */}
            <Tooltip title="Sign out" arrow>
              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  py-1.5 px-1.5
                  rounded-md
                  text-sm font-medium
                  text-red-600
                  hover:bg-red-50 hover:text-red-700
                  focus:outline-none
                "
              >
                <Power size={16} />

              </button>
            </Tooltip>

          </div>


        </div>
      </div>

      {/* Module Options (Sub-navbar) */}
      <div className="px-4 py-0 bg-gray-50 border-b border-gray-200 overflow-x-auto">

        <nav className="flex items-center justify-between">

          {/* Left: tabs */}
          <div className="flex space-x-1">

            {/* Auto Script */}
            <button
              onClick={() => navigate('/autoscript')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5
      ${location.pathname.startsWith('/autoscript')
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              <FileCode2 size={14} />
              <span>Auto Script</span>
            </button>

            {/* Auto Analysis */}
            <button
              onClick={() => navigate('/autoanalysis')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5
      ${location.pathname === '/autoanalysis'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              <BarChart3 size={14} />
              <span>Auto Analysis</span>
            </button>

            {/* NFR */}
            <button
              onClick={() => navigate('/nfr')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5
      ${location.pathname === '/nfr'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              <ClipboardList size={14} />
              <span>NFR</span>
            </button>

            {/* Governance */}
            <button
              onClick={() => navigate('/governance')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 flex items-center gap-2
      ${location.pathname === '/governance'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              <LayoutDashboard size={14} />
              <span>Governance</span>

              {/* <span className="bg-yellow-200 text-yellow-800 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full">
                WIP
              </span> */}
            </button>

          </div>

          {/* Right: settings */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
          >
            <Settings size={18} />
          </button>

        </nav>


      </div>

    </header>
  );
};

export default Navbar;