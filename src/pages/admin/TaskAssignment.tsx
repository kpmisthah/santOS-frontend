import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import {
    ClipboardList,
    Plus,
    Search,
    Clock,
    PlayCircle,
    CheckCircle2,
    User,
    Calendar,
    Gift
} from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import type { Task, Worker } from '@/types';

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    // Fetch tasks from API
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setIsLoading(true);
            setError(null);
            const data = await apiClient.get('/tasks');
            setTasks(data);
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            setError(err.message || 'Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch workers from API
    const fetchWorkers = async () => {
        try {
            const data = await apiClient.get('/users');
            const elfWorkers = data.filter((user: Worker) => user.role === 'worker');
            setWorkers(elfWorkers);
        } catch (err: any) {
            console.error('Error fetching workers:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchWorkers();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, []);

    const getWorkerName = (workerId?: string) => {
        if (!workerId) return 'Unassigned';
        return workers.find(w => w.id === workerId)?.name || 'Unassigned';
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.giftType.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    const getStatusConfig = (status: Task['status']) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock };
            case 'in_progress':
                return { label: 'In Progress', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: PlayCircle };
            case 'completed':
                return { label: 'Completed', class: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 };
        }
    };

    const getPriorityClass = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'medium':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'low':
                return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
        }
    };

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        try {
            setUpdatingTaskId(taskId);
            await apiClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
            await fetchTasks();
        } catch (err: any) {
            console.error('Error updating task:', err);
            alert('Failed to update task status: ' + err.message);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-300 animate-pulse font-medium">Loading tasks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/50 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">Error Loading Tasks</h3>
                    <p className="text-slate-300 mb-4">{error}</p>
                    <button
                        onClick={() => fetchTasks()}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                badge={{
                    icon: <ClipboardList className="w-4 h-4" />,
                    text: 'Workshop Task Management'
                }}
                title="Task Assignment"
                description="Assign and track production tasks for the elf workshop. Monitor progress and ensure all gifts are ready for Christmas."
                actions={
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Total Tasks</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Pending</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">{stats.pending}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">In Progress</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">{stats.inProgress}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Completed</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{stats.completed}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search tasks or gift types..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-12 py-4 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                        {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${filter === status
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/50'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50 bg-slate-800/50'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map((task) => {
                    const statusConfig = getStatusConfig(task.status);
                    const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';

                    return (
                        <div
                            key={task.id}
                            className={`bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border ${isOverdue ? 'border-red-500/50' : 'border-slate-700/50'} hover:border-purple-500/50 transition-all duration-300`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Task Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <Gift className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-lg font-bold text-white">
                                                    {task.title}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.class}`}>
                                                    <statusConfig.icon className="w-3 h-3" />
                                                    {statusConfig.label}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full border font-semibold uppercase ${getPriorityClass(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                {isOverdue && (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                                                        ⚠️ Overdue
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                                            <div className="flex items-center gap-6 text-sm flex-wrap">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <User className="w-4 h-4" />
                                                    <span>{getWorkerName(task.assignedTo)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Gift className="w-4 h-4" />
                                                    <span>{task.quantity} units</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 lg:flex-shrink-0">
                                    {task.status === 'pending' && (
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                            disabled={updatingTaskId === task.id}
                                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-medium transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <PlayCircle className="w-4 h-4" />
                                            {updatingTaskId === task.id ? 'Updating...' : 'Start'}
                                        </button>
                                    )}
                                    {task.status === 'in_progress' && (
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'completed')}
                                            disabled={updatingTaskId === task.id}
                                            className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-medium transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {updatingTaskId === task.id ? 'Updating...' : 'Complete'}
                                        </button>
                                    )}
                                    {task.status === 'completed' && (
                                        <span className="px-4 py-2 text-green-400 text-sm flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Done
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredTasks.length === 0 && (
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-6 opacity-50">📋</div>
                    <p className="text-slate-400 text-xl">No tasks match your search.</p>
                </div>
            )}

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <CreateTaskModal
                    workers={workers}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        setIsCreateModalOpen(false);
                        fetchTasks();
                    }}
                />
            )}
        </div>
    );
};

interface CreateTaskModalProps {
    workers: Worker[];
    onClose: () => void;
    onSuccess: () => void;
}

const CreateTaskModal = ({ workers, onClose, onSuccess }: CreateTaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        giftType: '',
        quantity: 1,
        priority: 'medium' as Task['priority'],
        assignedTo: '',
        deadline: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await apiClient.post('/tasks', {
                ...formData,
                deadline: new Date(formData.deadline).toISOString(),
            });

            onSuccess();
        } catch (err: any) {
            console.error('Error creating task:', err);
            setError(err.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl max-w-lg w-full rounded-3xl border border-slate-700/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Create New Task</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Task Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                            placeholder="e.g., Build 500 LEGO Sets"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none"
                            rows={3}
                            placeholder="Describe the task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Gift Type</label>
                            <input
                                type="text"
                                required
                                value={formData.giftType}
                                onChange={(e) => setFormData({ ...formData, giftType: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                placeholder="e.g., LEGO Set"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Assign To</label>
                            <select
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                            >
                                <option value="">Unassigned</option>
                                {workers.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Deadline</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl font-semibold transition-all border border-slate-700/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TasksPage;
