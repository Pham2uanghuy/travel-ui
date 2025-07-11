import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.ts';

const ProtectedRoute = () => {
    const { user, loading } = useAuthStore();

    if (loading) {
        // Hoặc bạn có thể return spinner loading ở đây
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
