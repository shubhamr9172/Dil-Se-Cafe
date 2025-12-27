import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, FileText, ChefHat, LogOut, Settings, Home, ShoppingCart } from 'lucide-react';
import { cn } from './ui/Button';
import { useStore } from '../store';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface LayoutProps {
    children: React.ReactNode;
}

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

function NavLink({ to, icon, label, active }: NavLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                active
                    ? "bg-primary-600 text-neutral-50 shadow-md"
                    : "text-secondary-200 hover:bg-secondary-700 hover:text-neutral-50"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useStore();

    const handleLogout = async () => {
        await signOut(auth);
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar with warm cafe colors */}
            <aside className="w-64 bg-gradient-to-b from-secondary-800 to-secondary-900 text-neutral-50 flex flex-col shadow-xl">
                {/* Logo/Brand */}
                <div className="p-6 border-b border-secondary-700">
                    <h1 className="text-2xl font-bold text-accent-400">Dil Se Cafe</h1>
                    <p className="text-xs text-secondary-300 mt-1">POS System</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/"
                        icon={<Home className="h-5 w-5" />}
                        label="POS"
                        active={isActive('/')}
                    />
                    <NavLink
                        to="/orders"
                        icon={<ShoppingCart className="h-5 w-5" />}
                        label="Orders"
                        active={isActive('/orders')}
                    />
                    <NavLink
                        to="/kitchen"
                        icon={<ChefHat className="h-5 w-5" />}
                        label="Kitchen"
                        active={isActive('/kitchen')}
                    />
                    <NavLink
                        to="/menu"
                        icon={<Coffee className="h-5 w-5" />}
                        label="Menu"
                        active={isActive('/menu')}
                    />
                    <NavLink
                        to="/settings"
                        icon={<Settings className="h-5 w-5" />}
                        label="Settings"
                        active={isActive('/settings')}
                    />
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-secondary-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-700 hover:bg-primary-600 text-neutral-50 transition-colors duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
