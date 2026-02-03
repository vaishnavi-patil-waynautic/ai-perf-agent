import React, { useEffect } from 'react';
import { Menu, Search, User as UserIcon, LogOut, ChevronDown, Settings, Power } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../store/store';
import { resetProjectState, selectProject } from '../pages/project/store/project.slice';
import { logout } from '../store/authSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from '@mui/material';
import { fetchProjectById, fetchProjects } from '@/pages/project/store/project.thunks';
import type { AppDispatch } from '../store/store';
import { logoutService } from '@/pages/authentication/services/logoutService';
import { fetchProject } from '@/services/application/slice';



interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, selectedProject } = useSelector((state: RootState) => state.project);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const location = useLocation();


  console.log("SELECTED PROJECT IN NAVBAR : ", selectedProject);


  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }

    const storedId = localStorage.getItem('selectedProjectId');

    if (storedId) {
      dispatch(fetchProjectById(Number(storedId)));
    }
  }, [dispatch, projects.length]);



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
          {/* <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Menu size={24} />
          </button> */}

          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              // src="../static/exgenix.png"
              src="/ai-perf-agent/img/exgenix.png"
              alt="Exgenix"
              className="h-6 w-auto"
            />

            <span className="text-xl font-bold text-gray-800 tracking-tight">
              Waynautic AI Perf Agent
            </span>
          </div>



          {/* <div className="h-6 w-px bg-gray-300 mx-2"></div> */}

          {/* Project Dropdown */}

        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-100 text-gray-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div> */}

          <div className="relative">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => handleProjectSelect(Number(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="" disabled hidden>
                Select Project
              </option>

              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Profile Dropdown */}
          {/* <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium overflow-hidden border border-blue-200">
                {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <UserIcon size={18} />}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div> */}


          <div className="flex items-center gap-4">

            {/* Profile → Profile settings */}
            <Tooltip title="Profile Settings" arrow>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 focus:outline-none hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium overflow-hidden border border-blue-200">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
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

                {/* <span className="hidden sm:inline">Sign Out</span> */}
              </button>
            </Tooltip>

          </div>


        </div>
      </div>

      {/* Module Options (Sub-navbar) */}
      <div className="px-4 py-0 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        {/* <nav className="flex space-x-1">

    <button
      onClick={() => navigate('/autoscript')}
      className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-t-md transition-colors border-b-2 border-transparent hover:border-blue-500 whitespace-nowrap"
    >
      Auto Script
    </button>

    <button
      onClick={() => navigate('/autoanalysis')}
      className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-t-md transition-colors border-b-2 border-transparent hover:border-blue-500 whitespace-nowrap"
    >
      Auto Analysis
    </button>

    <button
      onClick={() => navigate('/nfr')}
      className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-t-md transition-colors border-b-2 border-transparent hover:border-blue-500 whitespace-nowrap"
    >
      NFR
    </button>

    <button
      onClick={() => navigate('/governance')}
      className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-t-md transition-colors border-b-2 border-transparent hover:border-blue-500 whitespace-nowrap"
    >
      Governance / Dashboard
    </button>

  </nav> */}


        <nav className="flex items-center justify-between">

          {/* Left: tabs */}
          <div className="flex space-x-1">

            <button
              onClick={() => navigate('/autoscript')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap border-b-2
      ${location.pathname.startsWith('/autoscript')
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
    `}
            >
              Auto Script
            </button>

            <button
              onClick={() => navigate('/autoanalysis')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap border-b-2
        ${location.pathname === '/autoanalysis'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              Auto Analysis
            </button>

            <button
              onClick={() => navigate('/nfr')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap border-b-2
        ${location.pathname === '/nfr'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
      `}
            >
              NFR
            </button>

            <button
              onClick={() => navigate('/governance')}
              className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap border-b-2 flex items-center space-x-2
              ${location.pathname === '/governance'
                  ? 'text-blue-600 bg-white border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:border-blue-500 border-transparent'}
              `}
            >
              <span>Governance / Dashboard</span>
              <span className="bg-yellow-200 text-yellow-800 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full">
                WIP
              </span>
            </button>


          </div>

          {/* Right: settings icon */}
          <button
            onClick={() => navigate('/settings')}
            className="p-1 py-3 text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

        </nav>

      </div>

    </header>
  );
};

export default Navbar;