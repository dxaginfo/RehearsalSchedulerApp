import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Group pages
import GroupsPage from './pages/groups/GroupsPage';
import GroupDetailsPage from './pages/groups/GroupDetailsPage';
import CreateGroupPage from './pages/groups/CreateGroupPage';

// Rehearsal pages
import RehearsalsPage from './pages/rehearsals/RehearsalsPage';
import RehearsalDetailsPage from './pages/rehearsals/RehearsalDetailsPage';
import CreateRehearsalPage from './pages/rehearsals/CreateRehearsalPage';

// User pages
import ProfilePage from './pages/user/ProfilePage';
import AvailabilityPage from './pages/user/AvailabilityPage';

// Other pages
import NotFoundPage from './pages/NotFoundPage';

// Redux
import { checkAuthState } from './redux/slices/authSlice';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      </Route>
      
      {/* Main application routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Group routes */}
        <Route path="groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="groups/:groupId" element={<ProtectedRoute><GroupDetailsPage /></ProtectedRoute>} />
        <Route path="groups/create" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />
        
        {/* Rehearsal routes */}
        <Route path="rehearsals" element={<ProtectedRoute><RehearsalsPage /></ProtectedRoute>} />
        <Route path="rehearsals/:rehearsalId" element={<ProtectedRoute><RehearsalDetailsPage /></ProtectedRoute>} />
        <Route path="rehearsals/create" element={<ProtectedRoute><CreateRehearsalPage /></ProtectedRoute>} />
        
        {/* User routes */}
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="availability" element={<ProtectedRoute><AvailabilityPage /></ProtectedRoute>} />
      </Route>
      
      {/* Not found route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;