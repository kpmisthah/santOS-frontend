import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { WorkerStats, Task } from '../../types';

const WorkerDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const [stats, setStats] = useState<WorkerStats>({
        assignedTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        productivity: 0,
    });

    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`http://localhost:3000/api/tasks/user/${user.id}`);
                if (response.ok) {
                    const tasks = await response.json();
                    setRecentTasks(tasks);

                    // Calculate stats
                    const completed = tasks.filter((t: Task) => t.status === 'completed').length;
                    const pending = tasks.filter((t: Task) => t.status === 'pending').length;
                    const inProgress = tasks.filter((t: Task) => t.status === 'in_progress').length;

                    setStats({
                        assignedTasks: tasks.length,
                        completedTasks: completed,
                        pendingTasks: pending,
                        inProgressTasks: inProgress,
                        productivity: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
        const interval = setInterval(fetchTasks, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-evergreen-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-frost-200 animate-pulse">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-frost-100">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2 text-gradient-gold drop-shadow-sm">
                        Worker Dashboard
                    </h1>
                    <p className="text-frost-200/60 text-lg font-light tracking-wide">
                        Welcome back, Elf! Let's make some magic today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="glass px-4 py-2 rounded-lg text-sm font-mono text-evergreen-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-evergreen-400 animate-pulse"></span>
                        Shift Active
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="glass-card p-6 flex flex-col justify-between group hover:border-frost-200/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-north-pole-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            📋
                        </div>
                        <span className="text-xs font-mono text-north-pole-400">ASSIGNED</span>
                    </div>
                    <p className="text-3xl font-display font-bold mb-1 text-frost-100">{stats.assignedTasks}</p>
                    <div className="h-1 w-full bg-north-pole-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-frost-200 w-full"></div></div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between group hover:border-evergreen-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-evergreen-900/50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            ✅
                        </div>
                        <span className="text-xs font-mono text-evergreen-400">DONE</span>
                    </div>
                    <p className="text-3xl font-display font-bold mb-1 text-evergreen-400 shadow-glow-sm">{stats.completedTasks}</p>
                    <div className="h-1 w-full bg-north-pole-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-evergreen-500 w-3/4"></div></div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between group hover:border-stardust-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-stardust-900/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            ⏱️
                        </div>
                        <span className="text-xs font-mono text-stardust-400">PENDING</span>
                    </div>
                    <p className="text-3xl font-display font-bold mb-1 text-stardust-400">{stats.pendingTasks}</p>
                    <div className="h-1 w-full bg-north-pole-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-stardust-500 w-1/4"></div></div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between group hover:border-festive-red-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-festive-red-900/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            🔄
                        </div>
                        <span className="text-xs font-mono text-festive-red-400">WIP</span>
                    </div>
                    <p className="text-3xl font-display font-bold mb-1 text-festive-red-400">{stats.inProgressTasks}</p>
                    <div className="h-1 w-full bg-north-pole-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-festive-red-500 w-1/2"></div></div>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between group hover:border-stardust-400/50 hover:shadow-neon-gold">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-stardust-400 to-stardust-600 rounded-xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform shadow-neon-gold">
                            🎯
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-display font-bold mb-1 text-stardust-300">{stats.productivity}%</p>
                        <p className="text-stardust-200/60 text-sm font-medium">Productivity</p>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Progress */}
                <div className="lg:col-span-2 glass-card p-8">
                    <h2 className="text-2xl font-display font-bold mb-8 text-frost-100 flex items-center gap-3">
                        <span>📊</span> Your Progress
                    </h2>

                    <div className="space-y-8">
                        {/* Completion Rate */}
                        <div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-frost-200/80 font-medium">Task Completion Rate</span>
                                <span className="font-bold text-stardust-400">
                                    {Math.round((stats.completedTasks / stats.assignedTasks) * 100)}%
                                </span>
                            </div>
                            <div className="h-4 bg-north-pole-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-evergreen-600 to-evergreen-400 relative overflow-hidden"
                                    style={{ width: `${(stats.completedTasks / stats.assignedTasks) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-30"></div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-north-pole-400 font-mono">
                                <span>{stats.completedTasks} tasks completed</span>
                                <span>{stats.assignedTasks} total assigned</span>
                            </div>
                        </div>

                        {/* Productivity Score */}
                        <div>
                            <div className="flex justify-between mb-3 text-sm">
                                <span className="text-frost-200/80 font-medium">Productivity Score</span>
                                <span className="font-bold text-stardust-400">{stats.productivity}%</span>
                            </div>
                            <div className="h-4 bg-north-pole-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-stardust-600 to-stardust-400 relative overflow-hidden"
                                    style={{ width: `${stats.productivity}%` }}
                                >
                                    <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-30"></div>
                                </div>
                            </div>
                        </div>

                        {/* Task Breakdown */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-north-pole-900/50 border border-white/5 rounded-2xl p-4 text-center group hover:border-stardust-500/30 transition-colors">
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
                                <div className="text-2xl font-bold text-stardust-400">{stats.pendingTasks}</div>
                                <div className="text-xs text-north-pole-400 font-mono mt-1">PENDING</div>
                            </div>
                            <div className="bg-north-pole-900/50 border border-white/5 rounded-2xl p-4 text-center group hover:border-festive-red-500/30 transition-colors">
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔄</div>
                                <div className="text-2xl font-bold text-festive-red-400">{stats.inProgressTasks}</div>
                                <div className="text-xs text-north-pole-400 font-mono mt-1">IN PROGRESS</div>
                            </div>
                            <div className="bg-north-pole-900/50 border border-white/5 rounded-2xl p-4 text-center group hover:border-evergreen-500/30 transition-colors">
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✅</div>
                                <div className="text-2xl font-bold text-evergreen-400">{stats.completedTasks}</div>
                                <div className="text-xs text-north-pole-400 font-mono mt-1">COMPLETED</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="glass-card p-8 bg-gradient-to-b from-stardust-900/10 to-transparent">
                    <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                        <span className="text-stardust-400">🏆</span> Achievements
                    </h2>
                    <div className="space-y-4">
                        <div className="relative overflow-hidden bg-north-pole-900/40 border border-stardust-500/30 rounded-xl p-4 group hover:bg-stardust-900/20 transition-all cursor-default">
                            <div className="absolute inset-0 bg-stardust-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl filter drop-shadow-glow">🏆</div>
                                <div>
                                    <h3 className="font-bold text-stardust-300 mb-1 group-hover:text-stardust-200">Top Performer</h3>
                                    <p className="text-xs text-north-pole-300">Completed 100+ tasks ahead of schedule.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden bg-north-pole-900/40 border border-evergreen-500/30 rounded-xl p-4 group hover:bg-evergreen-900/20 transition-all cursor-default">
                            <div className="absolute inset-0 bg-evergreen-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl filter drop-shadow-glow-sm">⚡</div>
                                <div>
                                    <h3 className="font-bold text-evergreen-300 mb-1 group-hover:text-evergreen-200">Speed Demon</h3>
                                    <p className="text-xs text-north-pole-300">Fastest task completion record!</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden bg-north-pole-900/40 border border-festive-red-500/30 rounded-xl p-4 group hover:bg-festive-red-900/20 transition-all cursor-default">
                            <div className="absolute inset-0 bg-festive-red-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl filter drop-shadow-glow-sm">🎯</div>
                                <div>
                                    <h3 className="font-bold text-festive-red-300 mb-1 group-hover:text-festive-red-200">Perfectionist</h3>
                                    <p className="text-xs text-north-pole-300">Zero defects reported this month.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-bold">Recent Tasks</h2>
                    <a href="/worker/tasks" className="text-stardust-400 hover:text-stardust-300 font-medium text-sm transition-colors uppercase tracking-wide flex items-center gap-2 group">
                        View All Tasks
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentTasks.map((task) => (
                        <div key={task.id} className="bg-north-pole-900/40 border border-white/5 rounded-2xl p-6 hover:bg-north-pole-800/60 hover:border-stardust-500/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-display font-semibold text-lg text-frost-100 group-hover:text-white transition-colors line-clamp-1">{task.title}</h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.priority === 'high'
                                        ? 'bg-festive-red-500/20 text-festive-red-400 border border-festive-red-500/20'
                                        : 'bg-stardust-500/20 text-stardust-400 border border-stardust-500/20'
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                            <p className="text-sm text-north-pole-300 mb-6 line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span
                                    className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${task.status === 'completed'
                                        ? 'text-evergreen-400 bg-evergreen-900/30'
                                        : 'text-stardust-400 bg-stardust-900/30'
                                        }`}
                                >
                                    {task.status.replace('-', ' ')}
                                </span>
                                <span className="text-xs text-north-pole-400 font-mono">
                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-8">
                <h2 className="text-2xl font-display font-bold mb-8">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="btn-primary flex items-center justify-center gap-3">
                        <span className="text-xl">📋</span>
                        <span className="font-semibold tracking-wide">View My Tasks</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-3 hover:border-evergreen-500/40 hover:text-evergreen-400">
                        <span className="text-xl">✅</span>
                        <span className="font-semibold tracking-wide">Update Progress</span>
                    </button>
                    <button className="btn-gold flex items-center justify-center gap-3 text-north-pole-950">
                        <span className="text-xl">📊</span>
                        <span className="font-semibold tracking-wide">View Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
