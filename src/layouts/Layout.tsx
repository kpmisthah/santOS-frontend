import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
    children: ReactNode;
    role: 'admin' | 'worker';
}

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

const Layout = ({ children, role }: LayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuthStore();

    const adminNavItems: NavItem[] = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/children', label: 'Children & Wishlists', icon: '👶' },
        { path: '/admin/tasks', label: 'Task Assignment', icon: '📋' },
        { path: '/admin/deliveries', label: 'Delivery Tracking', icon: '🚚' },
    ];

    const workerNavItems: NavItem[] = [
        { path: '/worker/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/worker/tasks', label: 'My Tasks', icon: '📋' },
    ];

    const navItems = role === 'admin' ? adminNavItems : workerNavItems;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-north-pole-950 text-frost-100 font-sans selection:bg-festive-red-500/30 selection:text-stardust-300">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 glass-panel border-r border-white/5 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Brand */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                    <Link to={role === 'admin' ? '/admin/dashboard' : '/worker/dashboard'} className="flex items-center gap-4 group">
                        <div className="text-4xl animate-bounce-slow filter drop-shadow-glow transition-transform group-hover:scale-110 duration-300">🎅</div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-gradient-gold tracking-wider group-hover:text-stardust-300 transition-colors">
                                SantaOS
                            </h3>
                            <p className="text-xs text-north-pole-400 font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">{role} Portal</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-4 px-6 py-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-festive-red-600/90 to-festive-red-800/90 text-white shadow-neon-red'
                                    : 'text-north-pole-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${isActive ? 'block' : 'hidden'}`}></div>
                                <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                <span className="tracking-wide relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-gradient-to-t from-black/40 to-transparent">
                    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-gradient-to-br from-stardust-400 to-stardust-600 rounded-full flex items-center justify-center text-2xl shadow-neon-gold">
                            {role === 'admin' ? '🎅' : '🧝'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-white truncate text-lg shadow-sm">
                                {user?.name || (role === 'admin' ? 'Santa Claus' : 'Elf Worker')}
                            </p>
                            <p className="text-xs text-stardust-400/80 font-mono truncate">
                                {user?.email || (role === 'admin' ? 'santa@northpole.com' : 'elf@workshop.com')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full group flex items-center justify-center gap-3 px-4 py-3 bg-north-pole-800/50 hover:bg-festive-red-900/40 border border-festive-red-500/20 text-festive-red-400 hover:text-festive-red-200 rounded-xl font-medium transition-all duration-300 hover:shadow-neon-red hover:border-festive-red-500/50"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
                        <span className="tracking-wide">Logout System</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-north-pole-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="lg:ml-72 min-h-screen flex flex-col relative">
                {/* Background Ambient Glow */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-festive-red-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-evergreen-600/10 rounded-full blur-[100px] mix-blend-screen animate-float"></div>
                </div>

                {/* Top Bar */}
                <header className="sticky top-0 z-30 glass-panel border-b border-white/5 px-8 py-5">
                    <div className="flex items-center justify-between relative z-10">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-frost-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Breadcrumbs / Page Title Placeholder (Optional) */}
                        <div className="hidden md:block">
                            <h2 className="text-xl font-display font-medium text-frost-200/80">
                                {role === 'admin' ? 'North Pole Command Center' : 'Elf Workshop Station'}
                            </h2>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl mx-8 hidden sm:block">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search children, tasks, deliveries..."
                                    className="glass-input w-full px-5 py-3 pl-12 rounded-xl focus:shadow-neon-gold/20"
                                />
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-north-pole-400 group-focus-within:text-stardust-400 transition-colors">
                                    🔍
                                </span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-3 hover:bg-white/5 rounded-xl transition-all hover:scale-110 group">
                                <span className="text-2xl filter drop-shadow-sm">🔔</span>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-festive-red-500 rounded-full shadow-neon-red animate-pulse"></span>
                            </button>
                            <button className="p-3 hover:bg-white/5 rounded-xl transition-all hover:scale-110 hover:rotate-90 duration-500">
                                <span className="text-2xl">⚙️</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 relative z-10 overflow-y-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t border-white/5 px-8 py-6 text-center text-sm text-north-pole-400/60 font-mono relative z-10">
                    <p>&copy; 2024 SantaOS. Spreading joy worldwide. 🌍❤️ | System Version 25.12.0-alpha</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
