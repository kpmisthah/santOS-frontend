import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { Task } from '../../types';

const WorkerTasks = () => {
    const user = useAuthStore((state) => state.user);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`http://localhost:3000/api/tasks/user/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data);
                }
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            }
        };

        fetchTasks();
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update local state
                setTasks(tasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
                ));
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    const updateTaskDetails = async (progress: number, notes: string) => {
        if (!selectedTask) return;

        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${selectedTask.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ progress, notes }),
            });

            if (response.ok) {
                setTasks(tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, progress, notes, updatedAt: new Date().toISOString() } : task
                ));
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update task details', error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-display font-bold mb-2 text-gradient-gold drop-shadow-sm">
                    My Tasks
                </h1>
                <p className="text-frost-200/60 text-lg font-light tracking-wide">
                    Manage your assigned gift production tasks
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex items-center justify-between group hover:border-frost-200/20">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Total Tasks</p>
                        <p className="text-3xl font-display font-bold text-frost-100">{stats.total}</p>
                    </div>
                    <div className="text-4xl bg-north-pole-800 rounded-lg p-2 group-hover:scale-110 transition-transform">📋</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-stardust-400 flex items-center justify-between group hover:shadow-neon-gold">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Pending</p>
                        <p className="text-3xl font-display font-bold text-stardust-400">{stats.pending}</p>
                    </div>
                    <div className="text-4xl bg-stardust-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-stardust-400">⏱️</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-festive-red-500 flex items-center justify-between group hover:shadow-neon-red">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">In Progress</p>
                        <p className="text-3xl font-display font-bold text-festive-red-400">{stats.inProgress}</p>
                    </div>
                    <div className="text-4xl bg-festive-red-900/30 rounded-lg p-2 group-hover:rotate-180 transition-transform duration-700 text-festive-red-400">🔄</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-evergreen-500 flex items-center justify-between group hover:shadow-glow-sm">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Completed</p>
                        <p className="text-3xl font-display font-bold text-evergreen-400">{stats.completed}</p>
                    </div>
                    <div className="text-4xl bg-evergreen-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-evergreen-400">✅</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="glass-panel p-2 inline-flex gap-2 rounded-xl">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-2.5 rounded-lg font-medium capitalize transition-all duration-300 ${filter === status
                            ? 'bg-stardust-500/20 text-stardust-400 shadow-neon-gold border border-stardust-500/30'
                            : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5'
                            }`}
                    >
                        {status === 'in_progress' ? 'In Progress' : status}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-6">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="glass-card p-6 group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6 relative z-10">
                            {/* Task Info */}
                            <div className="flex-1">
                                <div className="flex items-start gap-5 mb-4">
                                    <div className="w-14 h-14 bg-north-pole-800 rounded-2xl border border-white/5 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                                        🎁
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-2xl font-display font-bold text-frost-100 group-hover:text-white transition-colors">{task.title}</h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${task.priority === 'high'
                                                    ? 'bg-festive-red-500/20 text-festive-red-400 border-festive-red-500/30'
                                                    : task.priority === 'medium'
                                                        ? 'bg-stardust-500/20 text-stardust-400 border-stardust-500/30'
                                                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                    }`}
                                            >
                                                {task.priority} Priority
                                            </span>
                                        </div>
                                        <p className="text-frost-200/60 text-sm mb-5 leading-relaxed max-w-2xl">{task.description}</p>

                                        {/* Task Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-north-pole-900/40 rounded-xl border border-white/5">
                                            <div>
                                                <p className="text-[10px] text-north-pole-400 uppercase tracking-widest font-bold mb-1">Gift Type</p>
                                                <p className="font-medium text-frost-100">{task.giftType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-north-pole-400 uppercase tracking-widest font-bold mb-1">Quantity</p>
                                                <p className="font-medium text-frost-100">{task.quantity} units</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-north-pole-400 uppercase tracking-widest font-bold mb-1">Deadline</p>
                                                <p className="font-medium text-frost-100">{new Date(task.deadline).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-north-pole-400 uppercase tracking-widest font-bold mb-1">Status</p>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${task.status === 'completed'
                                                        ? 'text-evergreen-400'
                                                        : task.status === 'in_progress'
                                                            ? 'text-festive-red-400'
                                                            : 'text-stardust-400'
                                                        }`}
                                                >
                                                    {task.status === 'completed' && <span className="animate-pulse">✅</span>}
                                                    {task.status === 'in_progress' && <span className="animate-spin-slow">🔄</span>}
                                                    {task.status === 'pending' && <span>⏱️</span>}
                                                    {task.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex lg:flex-col gap-3 flex-shrink-0 min-w-[180px]">
                                {task.status === 'pending' && (
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                        className="w-full px-4 py-3 bg-festive-red-500/10 hover:bg-festive-red-500/20 text-festive-red-400 border border-festive-red-500/20 rounded-xl font-bold uppercase tracking-wide transition-all hover:shadow-neon-red text-xs"
                                    >
                                        Start Task
                                    </button>
                                )}
                                {task.status === 'in_progress' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full px-4 py-3 bg-stardust-500/10 hover:bg-stardust-500/20 text-stardust-400 border border-stardust-500/20 rounded-xl font-bold uppercase tracking-wide transition-all hover:shadow-neon-gold text-xs"
                                        >
                                            Update Progress
                                        </button>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'completed')}
                                            className="w-full px-4 py-3 bg-evergreen-500/10 hover:bg-evergreen-500/20 text-evergreen-400 border border-evergreen-500/20 rounded-xl font-bold uppercase tracking-wide transition-all hover:shadow-glow-sm text-xs"
                                        >
                                            Mark Complete
                                        </button>
                                    </>
                                )}
                                {task.status === 'completed' && (
                                    <div className="w-full px-4 py-3 bg-evergreen-900/20 border border-evergreen-500/20 text-evergreen-400 rounded-xl font-bold text-xs text-center uppercase tracking-wide">
                                        Verified
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar for In-Progress Tasks */}
                        {task.status === 'in_progress' && (
                            <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-north-pole-400">Progress</span>
                                    <span className="text-stardust-400">65%</span>
                                </div>
                                <div className="h-2 bg-north-pole-900 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-stardust-600 to-stardust-400 relative overflow-hidden group-hover:animate-shimmer"
                                        style={{ width: '65%' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredTasks.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <div className="text-6xl mb-6 opacity-50 grayscale">📋</div>
                    <p className="text-frost-200/60 text-lg">No tasks found for this filter</p>
                </div>
            )}

            {/* Update Progress Modal */}
            {isModalOpen && selectedTask && (
                <UpdateProgressModal
                    task={selectedTask}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={updateTaskDetails}
                />
            )}
        </div>
    );
};

// Update Progress Modal Component
interface UpdateProgressModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (progress: number, notes: string) => void;
}

const UpdateProgressModal = ({ task, onClose, onUpdate }: UpdateProgressModalProps) => {
    const [progress, setProgress] = useState(task.progress || 0);
    const [notes, setNotes] = useState(task.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(progress, notes);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card max-w-lg w-full transform transition-all animate-scale-in border border-stardust-400/20 shadow-2xl shadow-stardust-900/50" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="bg-north-pole-900/90 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between z-10 rounded-t-2xl">
                    <h2 className="text-2xl font-display font-bold text-gradient-gold">Update Progress</h2>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group">
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300 block">✖️</span>
                    </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-frost-100 mb-2">{task.title}</h3>
                        <p className="text-sm text-frost-200/60">{task.description}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-4 uppercase tracking-wide">
                            Current Progress: <span className="text-frost-100">{progress}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="w-full h-3 bg-north-pole-900 rounded-lg appearance-none cursor-pointer accent-stardust-400 hover:accent-stardust-300 transition-all border border-white/10"
                            style={{
                                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${progress}%, #0F172A ${progress}%, #0F172A 100%)`
                            }}
                        />
                        <div className="flex justify-between text-[10px] font-mono text-north-pole-400 mt-2 uppercase tracking-wider">
                            <span>Start</span>
                            <span>Halfway</span>
                            <span>Done</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Progress Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about your progress..."
                            rows={4}
                            className="glass-input w-full px-4 py-3 rounded-xl resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button
                            type="submit"
                            className="flex-1 btn-gold"
                        >
                            Update Progress
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkerTasks;
