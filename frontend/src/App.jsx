import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import CreateLeave from './pages/CreateLeave';
import MyRequests from './pages/MyRequests';
import ManagerQueue from './pages/ManagerQueue';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import { ROLES } from './utils/role';

const DashboardRedirect = () => {
  const role = localStorage.getItem('role');
  if (role === ROLES.EMPLOYEE) return <Navigate to="/employee-dashboard" />;
  if (role === ROLES.MANAGER) return <Navigate to="/manager-dashboard" />;
  if (role === ROLES.HR) return <Navigate to="/hr-dashboard" />;
  return <Navigate to="/login" />;
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/dashboard" element={<DashboardRedirect />} />

                <Route path="/employee-dashboard" element={
                  <PrivateRoute roles={[ROLES.EMPLOYEE]}>
                    <EmployeeDashboard />
                  </PrivateRoute>
                } />

                <Route path="/manager-dashboard" element={
                  <PrivateRoute roles={[ROLES.MANAGER]}>
                    <ManagerDashboard />
                  </PrivateRoute>
                } />

                <Route path="/hr-dashboard" element={
                  <PrivateRoute roles={[ROLES.HR]}>
                    <HRDashboard />
                  </PrivateRoute>
                } />

                <Route path="/create-leave" element={
                  <PrivateRoute roles={[ROLES.EMPLOYEE]}>
                    <CreateLeave />
                  </PrivateRoute>
                } />

                <Route path="/my-requests" element={
                  <PrivateRoute roles={[ROLES.EMPLOYEE]}>
                    <MyRequests />
                  </PrivateRoute>
                } />

                <Route path="/manager-queue" element={
                  <PrivateRoute roles={[ROLES.MANAGER]}>
                    <ManagerQueue />
                  </PrivateRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
