import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useStore();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
