import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, initialized } = useStore();
    const location = useLocation();

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
