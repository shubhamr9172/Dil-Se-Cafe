import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Check for MojoAuth token
        const token = localStorage.getItem('mojoauth_token');

        if (token) {
            // Token exists, user is authenticated
            setIsAuthenticated(true);
        } else {
            // No token, user is not authenticated
            setIsAuthenticated(false);
        }
    }, []);

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-neutral-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated, render children
    return <>{children}</>;
}
