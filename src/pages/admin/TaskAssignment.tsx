import { useState, useEffect, type FormEvent } from 'react';
import type { Task } from '../../types';

interface Worker {
    id: string;
    name: string;
    email: string;
    role: string;
}

const TaskAssignment = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null);

    // Fetch tasks from API
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3000/api/tasks');

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data);
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            setError(err.message || 'Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch workers (elves) from API
    const fetchWorkers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');

            if (!response.ok) {
                throw new Error('Failed to fetch workers');
            }

            const data = await response.json();
            // Filter only workers (elves)
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

    const filteredTasks = tasks.filter(task =>
        filter === 'all' || task.status === filter
    );

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    // Assign task to worker
    const handleAssignTask = async (taskId: string, workerId: string) => {
        if (!workerId) return;

        try {
            setAssigningTaskId(taskId);
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/assign`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: workerId }),
            });

            if (!response.ok) {
                throw new Error('Failed to assign task');
            }

            // Refresh tasks
            await fetchTasks();
        } catch (err: any) {
            console.error('Error assigning task:', err);
            alert('Failed to assign task: ' + err.message);
        } finally {
            setAssigningTaskId(null);
        }
    };

    // Delete task
    // Delete task
    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err: any) {
            console.error('Error deleting task:', err);
            alert('Failed to delete task');
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-gradient-gold drop-shadow-sm">
                        Task Assignment
                    </h1>
                    <p className="text-frost-200/60 text-base md:text-lg font-light tracking-wide">
                        Assign and manage gift production tasks for elves
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 btn-primary group w-full sm:w-auto"
                >
                    <span className="group-hover:rotate-90 transition-transform duration-300 text-xl">➕</span>
                    <span>Create New Task</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="glass-card p-4 bg-festive-red-500/10 border-festive-red-500/30">
                    <p className="text-festive-red-200 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        {error}
                    </p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="glass-card p-4 md:p-6 flex items-center justify-between group hover:border-frost-200/20">
                    <div>
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Total Tasks</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-frost-100">{stats.total}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-north-pole-800 rounded-lg p-2 group-hover:scale-110 transition-transform">📋</div>
                </div>
                <div className="glass-card p-4 md:p-6 border-l-4 border-stardust-400 flex items-center justify-between group hover:shadow-neon-gold">
                    <div>
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-stardust-400">{stats.pending}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-stardust-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-stardust-400">⏱️</div>
                </div>
                <div className="glass-card p-4 md:p-6 border-l-4 border-festive-red-500 flex items-center justify-between group hover:shadow-neon-red">
                    <div>
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">In Progress</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-festive-red-400">{stats.inProgress}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-festive-red-900/30 rounded-lg p-2 group-hover:rotate-180 transition-transform duration-700 text-festive-red-400">🔄</div>
                </div>
                <div className="glass-card p-4 md:p-6 border-l-4 border-evergreen-500 flex items-center justify-between group hover:shadow-glow-sm">
                    <div>
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Completed</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-evergreen-400">{stats.completed}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-evergreen-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-evergreen-400">✅</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="glass-panel p-2 flex gap-2 rounded-xl overflow-x-auto">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 md:px-6 py-2.5 rounded-lg font-medium capitalize transition-all duration-300 whitespace-nowrap ${filter === status
                            ? 'bg-stardust-500/20 text-stardust-400 shadow-neon-gold border border-stardust-500/30'
                            : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5'
                            }`}
                    >
                        {status === 'in_progress' ? 'In Progress' : status}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="glass-card p-12 text-center">
                    <div className="text-6xl mb-6 animate-bounce">⏳</div>
                    <p className="text-frost-200/60 text-lg">Loading tasks...</p>
                </div>
            )}

            {/* Tasks Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="glass-card p-4 md:p-6 group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden transition-all">
                            {/* Task Header */}
                            <div className="flex items-start justify-between mb-4 relative z-10 gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-display font-bold mb-1 text-frost-100 group-hover:text-white transition-colors truncate">
                                        {task.title}
                                    </h3>
                                    {task.description && (
                                        <p className="text-frost-200/60 text-sm line-clamp-2">{task.description}</p>
                                    )}
                                </div>
                                <span
                                    className={`px-2 md:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${task.priority === 'high'
                                        ? 'bg-festive-red-500/20 text-festive-red-400 border-festive-red-500/30'
                                        : task.priority === 'medium'
                                            ? 'bg-stardust-500/20 text-stardust-400 border-stardust-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </div>

                            {/* Task Details */}
                            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 relative z-10 bg-north-pole-900/40 p-3 md:p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                    <span className="text-north-pole-400 w-20 md:w-24 flex-shrink-0">🎁 Gift Type:</span>
                                    <span className="font-medium text-frost-100 truncate">{task.giftType}</span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                    <span className="text-north-pole-400 w-20 md:w-24 flex-shrink-0">📦 Quantity:</span>
                                    <span className="font-medium text-frost-100">{task.quantity} units</span>
                                </div>
                                {task.deadline && (
                                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                        <span className="text-north-pole-400 w-20 md:w-24 flex-shrink-0">📅 Deadline:</span>
                                        <span className="font-medium text-frost-100">
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {/* Assignment Section */}
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm pt-2 border-t border-white/5">
                                    <span className="text-north-pole-400 w-20 md:w-24 flex-shrink-0">🧝 Assigned:</span>
                                    {task.assignee ? (
                                        <span className="font-medium text-stardust-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-stardust-400"></span>
                                            {task.assignee.name}
                                        </span>
                                    ) : (
                                        <select
                                            onChange={(e) => handleAssignTask(task.id, e.target.value)}
                                            disabled={assigningTaskId === task.id}
                                            className="glass-input px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm flex-1"
                                        >
                                            <option value="">Assign to elf...</option>
                                            {workers.map((worker) => (
                                                <option key={worker.id} value={worker.id} className="bg-north-pole-900">
                                                    {worker.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge and Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10 gap-2">
                                <span
                                    className={`inline-flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${task.status === 'completed'
                                        ? 'text-evergreen-400 bg-evergreen-900/30 shadow-glow-sm'
                                        : task.status === 'in_progress'
                                            ? 'text-festive-red-400 bg-festive-red-900/30 shadow-neon-red'
                                            : 'text-stardust-400 bg-stardust-900/30 shadow-neon-gold'
                                        }`}
                                >
                                    {task.status === 'completed' && <span className="animate-pulse">✅</span>}
                                    {task.status === 'in_progress' && <span className="animate-spin-slow">🔄</span>}
                                    {task.status === 'pending' && <span>⏱️</span>}
                                    <span className="hidden sm:inline">{task.status.replace('_', ' ')}</span>
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-2 hover:bg-festive-red-900/30 hover:text-festive-red-400 rounded-lg transition-colors text-frost-200"
                                        title="Delete"
                                    >
                                        <span className="text-base md:text-lg">🗑️</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredTasks.length === 0 && (
                <div className="glass-card p-8 md:p-12 text-center">
                    <div className="text-5xl md:text-6xl mb-6 opacity-50 grayscale">📋</div>
                    <p className="text-frost-200/60 text-base md:text-lg">
                        {filter === 'all' ? 'No tasks created yet' : `No ${filter.replace('_', ' ')} tasks found`}
                    </p>
                    {filter === 'all' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 btn-primary px-6 py-3"
                        >
                            Create Your First Task
                        </button>
                    )}
                </div>
            )}

            {/* Create Task Modal */}
            {isModalOpen && (
                <CreateTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchTasks}
                    workers={workers}
                />
            )}
        </div>
    );
};

// Create Task Modal Component
interface CreateTaskModalProps {
    onClose: () => void;
    onSuccess: () => void;
    workers: Worker[];
}

const CreateTaskModal = ({ onClose, onSuccess, workers }: CreateTaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        giftType: '',
        quantity: '',
        priority: 'medium',
        deadline: '',
        assignedTo: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || undefined,
                    giftType: formData.giftType,
                    quantity: parseInt(formData.quantity),
                    priority: formData.priority,
                    deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
                    assignedTo: formData.assignedTo || undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create task');
            }

            // Success!
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error creating task:', err);
            setError(err.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-in border border-stardust-400/20 shadow-2xl shadow-stardust-900/50" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-north-pole-900/90 backdrop-blur-md border-b border-white/10 p-6 md:p-8 flex items-center justify-between z-10">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-gradient-gold">Create New Task</h2>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group">
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300 block">✖️</span>
                    </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-festive-red-500/10 border border-festive-red-500/30 rounded-xl">
                            <p className="text-festive-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Task Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Build 500 Toy Cars"
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed description of the task..."
                            rows={3}
                            className="glass-input w-full px-4 py-3 rounded-xl resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Gift Type *</label>
                            <input
                                type="text"
                                value={formData.giftType}
                                onChange={(e) => setFormData({ ...formData, giftType: e.target.value })}
                                placeholder="e.g., Toy Cars"
                                required
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Quantity *</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="500"
                                min="1"
                                required
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Priority *</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            >
                                <option value="low" className="bg-north-pole-900">Low</option>
                                <option value="medium" className="bg-north-pole-900">Medium</option>
                                <option value="high" className="bg-north-pole-900">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Deadline</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Assign to Elf (Optional)</label>
                        <select
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            className="glass-input w-full px-4 py-3 rounded-xl"
                        >
                            <option value="" className="bg-north-pole-900">Unassigned</option>
                            {workers.map((worker) => (
                                <option key={worker.id} value={worker.id} className="bg-north-pole-900">
                                    {worker.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 btn-gold ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Creating Task...' : 'Create Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
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

export default TaskAssignment;
