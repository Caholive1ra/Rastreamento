import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import { isAuthenticated, getUserRole } from './services/api';

// Protected Route wrapper
function ProtectedRoute({
    children,
    allowedRoles
}: {
    children: React.ReactNode;
    allowedRoles: string[];
}) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const role = getUserRole();
    if (!role || !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        } else if (role === 'CLIENT') {
            return <Navigate to="/client" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

// Redirect authenticated users based on role
function AuthRedirect() {
    if (isAuthenticated()) {
        const role = getUserRole();
        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        } else if (role === 'CLIENT') {
            return <Navigate to="/client" replace />;
        }
    }
    return <LoginPage />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<AuthRedirect />} />

                {/* Protected Admin Route */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Client Route - accessible by CLIENT and ADMIN */}
                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
