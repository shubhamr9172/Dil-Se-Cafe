import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ChefHat, LogOut, Settings, Home, ShoppingCart, Menu, X } from 'lucide-react';
import { cn } from './ui/Button';
import { useStore } from '../store';

interface LayoutProps {
    children: React.ReactNode;
}

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick?: () => void;
}

function NavLink({ to, icon, label, active, onClick }: NavLinkProps) {
    return (
        <Link
            to={to}
            onClick={onClick}
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

interface BottomNavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

function BottomNavLink({ to, icon, label, active }: BottomNavLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors duration-200 min-w-[64px]",
                active
                    ? "text-primary-600"
                    : "text-neutral-500 hover:text-primary-500"
            )}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
}

export function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        // Clear MojoAuth token
        localStorage.removeItem('mojoauth_token');
        localStorage.removeItem('mojoauth_user');

        // Clear store state
        logout();

        // Redirect to login
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-gradient-to-b from-secondary-800 to-secondary-900 text-neutral-50 flex-col shadow-xl">
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

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-secondary-800 to-secondary-900 text-neutral-50 flex items-center justify-between px-4 shadow-lg z-30">
                <h1 className="text-lg font-bold text-accent-400">Dil Se Cafe</h1>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 hover:bg-secondary-700 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Drawer Menu */}
            <aside
                className={cn(
                    "md:hidden fixed top-0 right-0 bottom-0 w-64 bg-gradient-to-b from-secondary-800 to-secondary-900 text-neutral-50 flex flex-col shadow-xl z-50 transition-transform duration-300",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Drawer Header */}
                <div className="p-4 border-b border-secondary-700 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-accent-400">Dil Se Cafe</h1>
                        <p className="text-xs text-secondary-300 mt-1">POS System</p>
                    </div>
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 hover:bg-secondary-700 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/"
                        icon={<Home className="h-5 w-5" />}
                        label="POS"
                        active={isActive('/')}
                        onClick={closeMobileMenu}
                    />
                    <NavLink
                        to="/orders"
                        icon={<ShoppingCart className="h-5 w-5" />}
                        label="Orders"
                        active={isActive('/orders')}
                        onClick={closeMobileMenu}
                    />
                    <NavLink
                        to="/kitchen"
                        icon={<ChefHat className="h-5 w-5" />}
                        label="Kitchen"
                        active={isActive('/kitchen')}
                        onClick={closeMobileMenu}
                    />
                    <NavLink
                        to="/menu"
                        icon={<Coffee className="h-5 w-5" />}
                        label="Menu"
                        active={isActive('/menu')}
                        onClick={closeMobileMenu}
                    />
                    <NavLink
                        to="/settings"
                        icon={<Settings className="h-5 w-5" />}
                        label="Settings"
                        active={isActive('/settings')}
                        onClick={closeMobileMenu}
                    />
                </nav>

                {/* Drawer Logout Button */}
                <div className="p-4 border-t border-secondary-700">
                    <button
                        onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-700 hover:bg-primary-600 text-neutral-50 transition-colors duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none pt-14 md:pt-0 pb-16 md:pb-0">
                    <div className="py-4 md:py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-30">
                <div className="flex items-center justify-around px-2 safe-bottom">
                    <BottomNavLink
                        to="/"
                        icon={<Home className="h-5 w-5" />}
                        label="POS"
                        active={isActive('/')}
                    />
                    <BottomNavLink
                        to="/orders"
                        icon={<ShoppingCart className="h-5 w-5" />}
                        label="Orders"
                        active={isActive('/orders')}
                    />
                    <BottomNavLink
                        to="/kitchen"
                        icon={<ChefHat className="h-5 w-5" />}
                        label="Kitchen"
                        active={isActive('/kitchen')}
                    />
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors duration-200 min-w-[64px] text-neutral-500 hover:text-primary-500"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-xs font-medium">More</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
