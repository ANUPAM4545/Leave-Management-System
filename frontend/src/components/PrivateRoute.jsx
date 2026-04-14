import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');

    if (!token) return <Navigate to="/login" />;

    if (roles && !roles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role if unauthorized
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;
