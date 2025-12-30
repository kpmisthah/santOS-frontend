import { ArrowRight } from 'lucide-react';

export interface Activity {
  id: string;
  message: string;
  time: string;
  icon: string;
  type: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  onViewAll?: () => void;
}

const ActivityFeed = ({ activities, onViewAll }: ActivityFeedProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-3 flex-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all">
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{activity.message}</p>
              <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full mt-6 py-3 text-sm font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl transition-all border border-cyan-500/20 hover:border-cyan-500/30 flex items-center justify-center gap-2 group"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
