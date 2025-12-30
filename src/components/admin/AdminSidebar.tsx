
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Users, ClipboardList, Truck, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const role = user?.role || 'admin';

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/children', label: 'Children & Wishlists', icon: Users },
    { path: '/admin/tasks', label: 'Task Assignment', icon: ClipboardList },
    { path: '/admin/deliveries', label: 'Delivery Tracking', icon: Truck },
  ];

  const workerNavItems = [
    { path: '/worker/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { path: '/worker/tasks', label: 'My Tasks', icon: ClipboardList },
  ];

  const navItems = role === 'admin' ? adminNavItems : workerNavItems;

  const handleLogout = () => {
    logout();
    // window.location.href = '/'; // or use navigate from hook
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 z-50">
      {/* Brand */}
      <div className="p-6 border-b border-slate-700/50">
        <Link to={role === 'admin' ? "/admin/dashboard" : "/worker/dashboard"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎅</span>
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SantaOS
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{role === 'admin' ? 'Admin Portal' : 'Worker Portal'}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-sm shadow-lg">
            🎅
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate text-sm">
              {user?.name || 'Santa Claus'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || 'santa@northpole.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
