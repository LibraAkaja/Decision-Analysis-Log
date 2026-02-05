import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

// Auth Pages
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

// Dashboard Pages
import UserDashboard from '../pages/dashboard/UserDashboard.jsx';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard.jsx';

// Other Pages
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Dashboard - Protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin Dashboard - Protected & Admin Only */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Not Found */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </Router>
);

export default AppRoutes;