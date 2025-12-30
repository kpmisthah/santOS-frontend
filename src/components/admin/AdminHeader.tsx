
import { Search, Bell, Settings } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-30 bg-slate-800/40 backdrop-blur-xl border-b border-slate-700/50 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-slate-300">
            North Pole Command Center
          </h2>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search children, task, deliveries..."
              className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-10 py-2.5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 hover:bg-slate-700/50 rounded-xl transition-all group">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <button className="p-2.5 hover:bg-slate-700/50 rounded-xl transition-all group">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
