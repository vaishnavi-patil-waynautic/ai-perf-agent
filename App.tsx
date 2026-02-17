import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import ForgotPassword from './pages/authentication/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AutoScript from './pages/autoscript/pages/AutoscriptPage';
import NFRPage from './pages/NFR/pages/NFRPage';
import NFRWizardPage from './pages/NFR/pages/NFRWizardPage';
import NFRResultPage from './pages/NFR/pages/NFRResultPage';
import ChatWidget from './pages/aichat/components/ChatWidget';
import ChatPanel from './pages/aichat/pages/ChatPanel'; 
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { AutoAnalysisRoutes } from './pages/autoanalysis';
import { ConfigDetailsPage } from './pages/autoanalysis/pages/ConfigDetailsPage';
import { ResultPage } from './pages/autoanalysis/pages/ResultPage';
import { DashboardPage } from './pages/autoanalysis/pages/DashboardPage';
import { SettingsLayout, ApplicationSettings, IntegrationsSettings, UserProfileSettings, AISettings } from "./pages/settings";
import IntegrationsList from './pages/settings/pages/IntegrationList';
import IntegrationDetail from './pages/settings/pages/IntegrationDetail';
import { fetchCurrentUser } from './pages/settings/store/user.thunk';


// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (token) {
    dispatch(fetchCurrentUser());
  }
}, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      {/* 1. Navbar (stays on top) */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* 2. Main Workspace (Flex Container) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Sidebar (Collapsible) */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Middle: Main Application Content */}
        {/* We use flex-1 to let it take all available space, unless Chat is open */}
        <main
          className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out relative
            ${isChatOpen && isFullScreen ? 'hidden' : 'flex'} 
            `}
        >
          <div className="flex-1 overflow-y-auto p-0 scroll-smooth">
            {children}
          </div>

          {/* Footer inside main area so it doesn't get pushed by chat */}
          <footer className="w-full text-center py-2 text-xs text-gray-400 border-t border-gray-200 bg-white">
            &copy; {new Date().getFullYear()} Waynautic / EXG. All rights reserved.
          </footer>
        </main>

        {/* Right: AI Chat Panel (VS Code Style) */}
        <div
          className={`
            border-l border-gray-200 bg-white shadow-xl z-20 transition-all duration-300 ease-in-out
            ${isChatOpen ? (isFullScreen ? 'w-full absolute inset-0 z-30' : 'w-[400px] xl:w-1/3') : 'w-0 border-none'}
          `}
        >
          {isChatOpen && (
            <ChatPanel
              onClose={() => setIsChatOpen(false)}
              isFullScreen={isFullScreen}
              toggleFullScreen={() => setIsFullScreen(!isFullScreen)}
            />
          )}
        </div>
      </div>

      {/* Floating Trigger Button (Only visible when chat is CLOSED) */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Tooltip title="Ask AI Assistant" arrow placement="left">
            <Fab
              color="primary"
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <ChatIcon />
            </Fab>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router basename="/ai-perf-agent">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />




        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/autoscript" element={
          <ProtectedRoute>
            <AppLayout>
              <AutoScript />
            </AppLayout>
          </ProtectedRoute>
        } />


        {/* NFR Module Routes */}
        <Route
          path="/nfr"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NFRPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nfr/wizard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NFRWizardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nfr/result/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NFRResultPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/autoanalysis"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/autoanalysis/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ConfigDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/autoanalysis/projects/:projectId/apps/:appId/result/:buildId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ResultPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsLayout />
              </AppLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<ApplicationSettings />} />
          <Route path="applications" element={<ApplicationSettings />} />

          {/* Integrations */}
          <Route path="integrations">
            <Route index element={<IntegrationDetail />} />
            <Route path=":integrationId" element={<IntegrationDetail />} />
          </Route>

          <Route path="profile" element={<UserProfileSettings />} />
          <Route path="ai" element={<AISettings />} />
        </Route>



        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />

        
        
      </Routes>


    </Router>
  );
};

export default App;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
