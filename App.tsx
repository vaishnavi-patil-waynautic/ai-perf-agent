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
import { SettingsLayout, ApplicationSettings, UserProfileSettings, AISettings } from "./pages/settings";
import IntegrationsList from './pages/settings/pages/IntegrationList';
import IntegrationDetail from './pages/settings/pages/IntegrationDetail';
import { fetchCurrentUser } from './pages/settings/store/user.thunk';
import GlobalAppSnackbar from './components/GlobalAppSnackbar';
import { authChecked } from './store/authSlice';
import { Bot, BotMessageSquare, MessageCircle, MessagesSquare, Sparkles } from 'lucide-react';
import ResetPassword from './pages/authentication/ResetPassword';
import GovernanceDashboard from './pages/governance/pages/GovernanceDashboard';



// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, authLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

    if (authLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const isFullScreen = useSelector((state: RootState) => state.chat.isFullScreen);
  const selectedProjectId = useSelector((state: RootState) => (state as any).project?.selectedProject?.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reset chat state whenever project changes — even if chatbot is closed
  useEffect(() => {
    dispatch({ type: 'chat/resetChatState' });
    localStorage.removeItem('last_chat_id');
  }, [selectedProjectId]);

  // Auto-open chat if URL has ?chat= param (e.g. on page refresh)
  const [isChatOpen, setIsChatOpen] = useState(
    () => new URLSearchParams(window.location.search).has('chat')
  );
  // const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//   const initAuth = async () => {
//     console.log("Token in storage:", token);

//     if (!token) {
//       dispatch(authChecked(false));
//       return;
//     }

//     try {
//       console.log("Calling /me to validate token...");
//       await dispatch(fetchCurrentUser()).unwrap();
//       console.log("Token VALID");
//       dispatch(authChecked(true));
//     } catch (err) {
//       console.log("Token INVALID → logout", err);
//       dispatch(authChecked(false));
//     }
//   };

//   initAuth();
// }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      {/* 1. Navbar (stays on top) */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* 2. Main Workspace (Flex Container) */}
      <div className="flex flex-1 overflow-hidden relative"
        style={{ background: isChatOpen && !isFullScreen ? '#f1f5f9' : undefined }}
      >

        {/* Left Sidebar (Collapsible) */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Middle: Main Application Content — shrinks to 2/3 when chat open */}
        <main
          className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out relative
            ${isFullScreen && isChatOpen ? 'hidden' : 'flex'}
            ${isChatOpen && !isFullScreen ? 'w-2/3' : 'flex-1'}
          `}
        >
          <div className="flex-1 overflow-y-auto p-0 scroll-smooth">
            {children}
          </div>
          <footer className="w-full text-center py-2 text-xs text-gray-400 border-t border-gray-200 bg-white">
            &copy; {new Date().getFullYear()} Waynautic / EXG. All rights reserved.
          </footer>
        </main>

        {/* Right: AI Chat Panel — 1/3 width, popup style with margins */}
        {/* Right: AI Chat Panel — single instance, handles fullscreen internally */}
        <div
          className={`
            transition-all duration-300 ease-in-out flex-shrink-0
            ${isChatOpen
              ? isFullScreen
                ? 'fixed inset-0 z-50 bg-white'
                : 'w-1/3 p-3'
              : 'w-0 overflow-hidden'
            }
          `}
        >
          {isChatOpen && (
            <div className={isFullScreen ? 'h-full' : 'h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 bg-white'}>
              <ChatPanel onClose={
                () => setIsChatOpen(false)
                } />
            </div>
          )}
        </div>
      </div>

      {/* Floating Trigger Button — bottom-left, hidden when chat open */}
      {/* {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Tooltip title="Ask AI Assistant" arrow placement="right">
            <Fab
              color="primary"
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <BotMessageSquare />
            </Fab>
          </Tooltip>
        </div>
      )} */}


      {/* 1 */}

      {/* {!isChatOpen && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"></div>
      
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
      
      <Tooltip title="Ask AI Assistant" arrow placement="left">
        <Fab
          color="primary"
          onClick={() => setIsChatOpen(true)}
          className="relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110"
        >
          <div className="relative">
            <Sparkles className="animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          </div>
        </Fab>
      </Tooltip>
    </div>
  </div>


)} */}


{/* 2 */}


{!isChatOpen && (
  <div className="fixed bottom-6 right-6 z-50 animate-[float_3s_ease-in-out_infinite]">
    <div className="relative">
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
      </div>
      
      <Tooltip title="Ask AI Assistant" arrow placement="left">
        <Fab
          color="primary"
          onClick={() => {
            dispatch({ type: 'chat/setCurrentChat', payload: '0' });
            setIsChatOpen(true);
          }}
          className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:rotate-12"
        >
          <BotMessageSquare className="w-6 h-6" />
        </Fab>
      </Tooltip>
    </div>
  </div>
)}

{/* 3 */}


{/* {!isChatOpen && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="relative animate-[breathe_4s_ease-in-out_infinite]">
      <Tooltip title="Ask AI Assistant" arrow placement="left">
        <Fab
          color="primary"
          onClick={() => setIsChatOpen(true)}
          className="relative bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-xl hover:shadow-2xl shadow-blue-500/40 transition-all duration-500 hover:scale-110"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
        </Fab>
      </Tooltip>
    </div>
  </div>
)} */}


{/* 4 */}

{/* {!isChatOpen && (
  <div className="fixed bottom-6 right-6 z-50 group">
    <Tooltip title="Ask AI Assistant" arrow placement="left">
      <Fab
        color="primary"
        onClick={() => setIsChatOpen(true)}
        className="relative bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <MessagesSquare className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
          </span>
        </div>
      </Fab>
    </Tooltip>
  </div>
)} */}


{/* 5 */}

{/* {!isChatOpen && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="relative group">
      <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-md group-hover:bg-blue-500/30 transition-all duration-300"></div>
      
      <Tooltip title="Ask AI Assistant" arrow placement="left">
        <Fab
          color="primary"
          onClick={() => setIsChatOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:animate-[wiggle_0.5s_ease-in-out]"
        >
          <BotMessageSquare className="group-hover:scale-110 transition-transform duration-200" />
        </Fab>
      </Tooltip>
    </div>
  </div>
)} */}

<style >{`
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
`}</style>

<style >{`
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`}</style>

<style >{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
`}</style>

<style >{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`}</style>
    </div>
  );
};

const App: React.FC = () => {

  

const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
    const { token } = useSelector((state: RootState) => state.auth);
    const { authLoading } = useSelector((state: RootState) => state.auth);

//     useEffect(() => {
//   const initAuth = async () => {
//     console.log("Token in storage:", token);

//     if (!token) {
//       dispatch(authChecked(false));
//       return;
//     }

//     try {
//       console.log("Calling /me to validate token...");
//       await dispatch(fetchCurrentUser());
//       console.log("Token VALID");
//       dispatch(authChecked(true));
//       console.log("Authchecked true ------------------------------------------------>")
//     } catch (err) {
//       console.log("Token INVALID → logout", err);
//       dispatch(authChecked(false));
//     }
//   };

//   initAuth();
// }, []);


// useEffect(() => {
//   const initAuth = async () => {
//     // 🚫 Do not run bootstrap while on login page
//     if (window.location.pathname.includes("/login")) return;

//     console.log("Token in storage:", token);

//     if (!token) {
//       dispatch(authChecked(false));
//       return;
//     }

//     try {
//       console.log("Calling /me to validate token...");
//       await dispatch(fetchCurrentUser()).unwrap();   // 🔴 MUST unwrap
//       console.log("Token VALID");
//       dispatch(authChecked(true));
//     } catch (err) {
//       console.log("Token INVALID → logout", err);
//       dispatch(authChecked(false));
//     }
//   };

//   initAuth();
// }, [dispatch]);


useEffect(() => {
  const initAuth = async () => {
    console.log("Token in storage:", token);

    // If no token → user is unauthenticated
    if (!token) {
      dispatch(authChecked(false));
      return;
    }

    try {
      console.log("Calling /me to validate token...");
      await dispatch(fetchCurrentUser()).unwrap();
      dispatch(authChecked(true));
    } catch (err) {
      dispatch(authChecked(false));
    }
  };

  initAuth();
}, [dispatch, token]);




if (authLoading) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}


  return (
    <Router basename="/ai-perf-agent">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />




        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } /> */}

        <Route path="/governance" element={
          <ProtectedRoute>
            <AppLayout>
              <GovernanceDashboard />
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
        {/* <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        /> */}

        <Route path="*" element={<Navigate to="/dashboard" />} />

        
        
      </Routes>

      <GlobalAppSnackbar />


    </Router>
  );
};

export default App;

