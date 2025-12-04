import React from 'react';
import { Menu, Search, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { selectProject } from '../store/projectSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, selectedProject } = useSelector((state: RootState) => state.project);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold p-1 rounded text-xs">EXG</div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Waynautic AI Perf Agent</span>
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Project Dropdown */}
          <div className="relative">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => dispatch(selectProject(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="" disabled>Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-100 text-gray-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
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
          </div>
        </div>
      </div>

      {/* Module Options (Sub-navbar) */}
      <div className="px-4 py-0 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1">
          {['PTLC', 'NFR', 'Scripting', 'Auto Analysis', 'AI Governance', 'AI Chatbot', 'Governance / Dashboard'].map((item) => (
            <button 
              key={item}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-t-md transition-colors border-b-2 border-transparent hover:border-blue-500 whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;