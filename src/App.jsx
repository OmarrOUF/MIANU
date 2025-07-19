import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from "./components/Pages/Home/Home"
import Inscription from "./components/Pages/Inscription"
import Committees from "./components/Pages/Committees"
import Archive from './components/Pages/Archive/Archive'
import EquipePage from './components/Pages/Equipe/EquipePage'
import NotFound from "./components/Pages/notFound"
import Unauthorized from "./components/Pages/Unauthorized"

// Auth imports
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import SignupSIM from './components/Auth/SignupSimulation';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Auth/Dashboard';
import PrivateRoute from './components/Auth/PrivateRoute';
import MunAdvisorSignup from "./components/Auth/MunAdvisorSignup";

// Admin imports
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminRoute from './components/Admin/AdminRoute';

// UI components
import Spinner from './components/UI/LoadingSpinner'; // Import the LoadingSpinner component

import { useAuth } from './contexts/AuthContext';

// Create a route guard for unauthenticated users
const UnauthenticatedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Spinner />; // Use the imported Spinner component
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="inscription" element={<Inscription />} />
            <Route path="committees" element={<Committees />} />
            <Route path="equipe" element={<EquipePage />} />
            <Route path="archive" element={<Archive />} />
            <Route path="cij" element={<NotFound />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Auth routes */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signupsim" element={<SignupSIM />} />
            <Route path="advisor-signup" element={
              <UnauthenticatedRoute>
                <MunAdvisorSignup />
              </UnauthenticatedRoute>
            } />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Ensure this is the last route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
