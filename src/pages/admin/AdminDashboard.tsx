import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type DashboardStats = {
    totalChildren: number;
    totalGifts: number;
    pendingTasks: number;
    completedTasks: number;
    pendingDeliveries: number;
    completedDeliveries: number;
    niceChildren: number;
    naughtyChildren: number;
};

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalChildren: 0,
        totalGifts: 0,
        pendingTasks: 0,
        completedTasks: 0,
        pendingDeliveries: 0,
        completedDeliveries: 0,
        niceChildren: 0,
        naughtyChildren: 0,
    });

    const [demandData, setDemandData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:3000/api/analytics/stats');
                if (!statsRes.ok) throw new Error('Failed to fetch stats');
                const data = await statsRes.json();
                setStats(data);

                // Fetch Demand for Charts
                const demandRes = await fetch('http://localhost:3000/api/analytics/demand');
                if (!demandRes.ok) throw new Error('Failed to fetch demand data');
                const demandData = await demandRes.json();

                // Process global demand for bar chart (Top 5)
                const topGifts = demandData.global_demand.slice(0, 5);
                setDemandData({
                    labels: topGifts.map((d: any) => d.gift_name),
                    datasets: [
                        {
                            label: 'Requested Qty',
                            data: topGifts.map((d: any) => d.count),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        }
                    ]
                });
                setError(null);
            } catch (error: any) {
                console.error("Failed to fetch dashboard data", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-stardust-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-frost-200 animate-pulse">Loading North Pole Analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-festive-red-900/20 border border-festive-red-500/50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-festive-red-400 mb-2">System Error</h3>
                    <p className="text-frost-200/80 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-festive-red-600 hover:bg-festive-red-500 text-white rounded-lg transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            icon: '👶',
            label: 'Total Children',
            value: stats.totalChildren.toLocaleString(),
            color: 'from-stardust-400 to-stardust-600',
            glow: 'shadow-neon-gold',
            textColor: 'text-stardust-400'
        },
        {
            icon: '🎁',
            label: 'Total Gifts',
            value: stats.totalGifts.toLocaleString(),
            color: 'from-festive-red-500 to-festive-red-700',
            glow: 'shadow-neon-red',
            textColor: 'text-festive-red-400'
        },
        {
            icon: '📋',
            label: 'Pending Tasks',
            value: stats.pendingTasks.toLocaleString(),
            color: 'from-stardust-300 to-stardust-500',
            glow: 'shadow-neon-gold',
            textColor: 'text-stardust-300'
        },
        {
            icon: '✅',
            label: 'Completed Tasks',
            value: stats.completedTasks.toLocaleString(),
            color: 'from-evergreen-500 to-evergreen-700',
            glow: 'shadow-glow-sm', // Defined in global css or custom class
            textColor: 'text-evergreen-400'
        },
        {
            icon: '🚚',
            label: 'Pending Deliveries',
            value: stats.pendingDeliveries.toLocaleString(),
            color: 'from-festive-red-400 to-festive-red-600',
            glow: 'shadow-neon-red',
            textColor: 'text-festive-red-400'
        },
        {
            icon: '📦',
            label: 'Completed Deliveries',
            value: stats.completedDeliveries.toLocaleString(),
            color: 'from-evergreen-400 to-evergreen-600',
            glow: 'shadow-glow-sm',
            textColor: 'text-evergreen-400'
        },
        {
            icon: '😇',
            label: 'Nice Children',
            value: stats.niceChildren.toLocaleString(),
            color: 'from-evergreen-500 to-evergreen-700',
            glow: 'shadow-glow-sm',
            textColor: 'text-evergreen-500'
        },
        {
            icon: '😈',
            label: 'Naughty Children',
            value: stats.naughtyChildren.toLocaleString(),
            color: 'from-festive-red-600 to-festive-red-800',
            glow: 'shadow-neon-red',
            textColor: 'text-festive-red-500'
        },
    ];

    const recentActivities = [
        { id: 1, type: 'task', message: 'New task assigned to Elf #247', time: '2 minutes ago', icon: '📋', color: 'bg-stardust-400/20 text-stardust-400' },
        { id: 2, type: 'delivery', message: 'Delivery completed in North America', time: '5 minutes ago', icon: '✅', color: 'bg-evergreen-500/20 text-evergreen-400' },
        { id: 3, type: 'wishlist', message: 'New wishlist submitted by Emma', time: '12 minutes ago', icon: '🎁', color: 'bg-festive-red-500/20 text-festive-red-400' },
        { id: 4, type: 'task', message: 'Task completed: 500 toy cars', time: '18 minutes ago', icon: '🚗', color: 'bg-stardust-400/20 text-stardust-400' },
        { id: 5, type: 'delivery', message: 'Delivery in progress: Europe', time: '25 minutes ago', icon: '🚚', color: 'bg-festive-red-500/20 text-festive-red-400' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2 text-gradient-red drop-shadow-sm">
                        Dashboard Overview
                    </h1>
                    <p className="text-frost-200/60 text-lg font-light tracking-wide">
                        Welcome back, Santa! Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="glass px-4 py-2 rounded-lg text-sm font-mono text-stardust-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-evergreen-500 animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card p-6 hover:border-stardust-400/30 group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-50 text-4xl grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12`}>
                            {stat.icon}
                        </div>

                        <div className="relative z-10">
                            <p className="text-frost-200/60 text-sm font-medium uppercase tracking-wider mb-2">{stat.label}</p>
                            <p className={`text-3xl font-display font-bold ${stat.textColor} drop-shadow-sm`}>{stat.value}</p>
                        </div>

                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} opacity-70`}></div>
                    </div>
                ))}
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Progress */}
                {/* Task Progress & Analytics */}
                <div className="lg:col-span-2 glass-card p-8">
                    <h2 className="text-2xl font-display font-bold mb-8 text-frost-100 flex items-center gap-3">
                        <span className="text-stardust-400">📊</span> Analytics & Demand
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top Toys Demand Chart */}
                        <div className="bg-north-pole-900/40 p-4 rounded-xl border border-white/5">
                            <h3 className="text-frost-200 mb-4 font-semibold">Top Requested Toys</h3>
                            {demandData ? (
                                <Bar
                                    data={demandData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: false }
                                        },
                                        scales: {
                                            y: { beginAtZero: true, ticks: { color: '#9CA3AF' } },
                                            x: { ticks: { color: '#9CA3AF' } }
                                        }
                                    }}
                                />
                            ) : (
                                <p className="text-frost-200/50 text-sm">Loading demand data...</p>
                            )}
                        </div>

                        {/* Nice vs Naughty Ratio */}
                        <div className="bg-north-pole-900/40 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <h3 className="text-frost-200 mb-4 font-semibold">Nice vs Naughty List</h3>
                            <div className="w-48 h-48">
                                <Doughnut
                                    data={{
                                        labels: ['Nice', 'Naughty'],
                                        datasets: [
                                            {
                                                data: [stats.niceChildren, stats.naughtyChildren],
                                                backgroundColor: [
                                                    'rgba(16, 185, 129, 0.7)', // Evergreen
                                                    'rgba(239, 68, 68, 0.7)',  // Red
                                                ],
                                                borderColor: [
                                                    'rgba(16, 185, 129, 1)',
                                                    'rgba(239, 68, 68, 1)',
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { position: 'bottom', labels: { color: '#D1D5DB' } } }
                                    }}
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-2xl font-bold text-evergreen-400">{stats.niceChildren}</span>
                                <span className="text-frost-200/50 mx-2">vs</span>
                                <span className="text-2xl font-bold text-festive-red-400">{stats.naughtyChildren}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="grid grid-cols-2 gap-6 mt-8">
                        {/* ... (Existing Quick Stats logic preserved but updated if needed) ... */}
                        <div className="bg-north-pole-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-stardust-400/30 transition-colors">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⏱️</div>
                            <div className="text-3xl font-display font-bold text-frost-100 mb-1">{stats.pendingTasks}</div>
                            <div className="text-xs text-frost-200/50 uppercase tracking-widest">Tasks Remaining</div>
                        </div>
                        <div className="bg-north-pole-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-festive-red-400/30 transition-colors">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                            <div className="text-3xl font-display font-bold text-frost-100 mb-1">{stats.pendingDeliveries}</div>
                            <div className="text-xs text-frost-200/50 uppercase tracking-widest">Pending Deliveries</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-8 flex flex-col">
                    <h2 className="text-2xl font-display font-bold mb-8 text-frost-100 flex items-center gap-3">
                        <span className="text-festive-red-400">📜</span> Recent Activity
                    </h2>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex gap-4 p-4 bg-north-pole-900/40 border border-white/5 rounded-xl hover:bg-north-pole-800/60 hover:border-white/10 transition-all duration-300 group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform duration-300 ${activity.color}`}>
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-frost-100 truncate group-hover:text-white transition-colors">{activity.message}</p>
                                    <p className="text-xs text-frost-200/50 mt-1 font-mono">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-stardust-400 hover:text-stardust-300 bg-stardust-400/10 hover:bg-stardust-400/20 rounded-xl transition-all uppercase tracking-wide border border-stardust-400/20">
                        View Log Archive
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-8">
                <h2 className="text-2xl font-display font-bold mb-8 text-frost-100">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="btn-primary flex items-center justify-center gap-3 group">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">👶</span>
                        <span className="font-semibold tracking-wide">View Children</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-3 group hover:border-evergreen-500/50 hover:bg-evergreen-900/20 hover:text-evergreen-400">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">📋</span>
                        <span className="font-semibold tracking-wide">Assign Tasks</span>
                    </button>
                    <button className="btn-gold flex items-center justify-center gap-3 group">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">🚚</span>
                        <span className="font-semibold tracking-wide text-north-pole-950">Track Deliveries</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center gap-3 group hover:border-feature-red-500/50 hover:bg-festive-red-900/20 hover:text-festive-red-400">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">📊</span>
                        <span className="font-semibold tracking-wide">View Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
