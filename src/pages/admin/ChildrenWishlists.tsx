import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { Search, Eye, UserCheck, UserX } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import type { Child, WishlistItem, Worker } from '@/types';

interface ExtendedChild extends Child {
    items?: WishlistItem[];
    wishlistId?: string;
}

const ChildrenWishlists = () => {
    const [children, setChildren] = useState<ExtendedChild[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [filter, setFilter] = useState<'all' | 'nice' | 'naughty'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChild, setSelectedChild] = useState<ExtendedChild | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch wishlists and transform data
    const fetchWishlists = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setIsLoading(true);
            setError(null);
            const wishlists = await apiClient.get('/wishlists');

            // Transform wishlists to children with items
            const transformedChildren = wishlists.map((w: any) => ({
                ...w.child,
                wishlistId: w.id,
                items: w.items || [],
                createdAt: w.createdAt
            }));

            setChildren(transformedChildren);
        } catch (err: any) {
            console.error('Error fetching wishlists:', err);
            setError(err.message || 'Failed to load wishlists');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch workers
    const fetchWorkers = async () => {
        try {
            const data = await apiClient.get('/users');
            setWorkers(data.filter((u: Worker) => u.role === 'worker'));
        } catch (err: any) {
            console.error('Error fetching workers:', err);
        }
    };

    useEffect(() => {
        fetchWishlists();
        fetchWorkers();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchWishlists, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredChildren = children.filter((child) => {
        const matchesFilter = filter === 'all' || child.category === filter;
        const matchesSearch =
            child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: children.length,
        nice: children.filter(c => c.category === 'nice').length,
        naughty: children.filter(c => c.category === 'naughty').length,
    };

    const viewWishlist = (child: ExtendedChild) => {
        setSelectedChild(child);
        setIsModalOpen(true);
    };

    const toggleCategory = async (child: ExtendedChild) => {
        const newCategory = child.category === 'nice' ? 'naughty' : 'nice';
        try {
            await apiClient.patch(`/wishlists/child/${child.id}/category`, { category: newCategory });

            // Update local state
            setChildren(children.map(c =>
                c.id === child.id ? { ...c, category: newCategory } : c
            ));
        } catch (err: any) {
            console.error('Error toggling category:', err);
            alert('Failed to update category: ' + err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-300 animate-pulse font-medium">Loading children registry...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/50 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">Error Loading Registry</h3>
                    <p className="text-slate-300 mb-4">{error}</p>
                    <button
                        onClick={() => fetchWishlists()}
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
                    icon: <span>👶</span>,
                    text: 'Children Registry System'
                }}
                title="Children & Wishlists"
                description="Manage children's information and their Christmas wishlists. Track nice and naughty lists in real-time."
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-2xl">👶</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Total Children</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-2xl">😇</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Nice Children</p>
                    <p className="text-4xl font-bold text-green-400">{stats.nice}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-2xl">😈</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Naughty Children</p>
                    <p className="text-4xl font-bold text-red-400">{stats.naughty}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-12 py-4 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === 'all'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 bg-slate-800/50'
                                }`}
                        >
                            All ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilter('nice')}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === 'nice'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 bg-slate-800/50'
                                }`}
                        >
                            😇 Nice ({stats.nice})
                        </button>
                        <button
                            onClick={() => setFilter('naughty')}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === 'naughty'
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 bg-slate-800/50'
                                }`}
                        >
                            😈 Naughty ({stats.naughty})
                        </button>
                    </div>
                </div>
            </div>

            {/* Children Table */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900/40 border-b border-slate-700/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-bold text-cyan-400 uppercase tracking-widest">Child</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-cyan-400 uppercase tracking-widest">Age</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-cyan-400 uppercase tracking-widest">Location</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-cyan-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-cyan-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {filteredChildren.map((child) => (
                                <tr key={child.id} className="hover:bg-slate-700/20 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                👶
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-lg group-hover:text-cyan-400 transition-colors">{child.name}</p>
                                                <p className="text-xs text-slate-500 font-mono">ID: {child.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-300 font-medium">
                                        {child.age} years
                                    </td>
                                    <td className="px-8 py-5 text-slate-300">
                                        {child.location}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${child.category === 'nice'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-lg shadow-green-900/30'
                                            : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-900/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${child.category === 'nice' ? 'bg-green-400' : 'bg-red-400'}`} />
                                            {child.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => viewWishlist(child)}
                                                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl font-medium transition-all text-sm hover:shadow-lg hover:shadow-cyan-900/50 hover:-translate-y-0.5"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Wishlist
                                            </button>
                                            <button
                                                onClick={() => toggleCategory(child)}
                                                className={`p-2 rounded-xl transition-all text-sm font-medium border ${child.category === 'nice'
                                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 hover:shadow-lg hover:shadow-red-900/50'
                                                    : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30 hover:shadow-lg hover:shadow-green-900/50'
                                                    }`}
                                                title={`Mark as ${child.category === 'nice' ? 'Naughty' : 'Nice'}`}
                                            >
                                                {child.category === 'nice' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredChildren.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6 opacity-50 grayscale animate-pulse">🔍</div>
                        <p className="text-slate-400 text-xl font-light">No children found in the registry.</p>
                        <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            {/* Wishlist Modal */}
            {isModalOpen && selectedChild && (
                <WishlistModal
                    child={selectedChild}
                    onClose={() => setIsModalOpen(false)}
                    workers={workers}
                />
            )}
        </div>
    );
};

interface WishlistModalProps {
    child: ExtendedChild;
    onClose: () => void;
    workers: Worker[];
}

const WishlistModal = ({ child, onClose, workers }: WishlistModalProps) => {
    const wishlistItems = child.items || [];
    const [assignedItems, setAssignedItems] = useState<Set<string>>(new Set());
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const handleAssignTask = async (item: WishlistItem) => {
        if (!selectedWorker) return;

        try {
            setIsAssigning(true);
            await apiClient.post('/tasks', {
                title: `Build ${item.giftName} for ${child.name}`,
                description: `Gift request from ${child.name} (Age: ${child.age}, Location: ${child.location}). Priority: ${item.priority}`,
                giftType: item.giftName,
                quantity: 1,
                priority: item.priority,
                assignedTo: selectedWorker,
                deadline: new Date(new Date().getFullYear(), 11, 24).toISOString()
            });

            setAssignedItems(prev => new Set(prev).add(item.id));
            setAssigningId(null);
            setSelectedWorker('');
            alert(`Task assigned to ${workers.find(w => w.id === selectedWorker)?.name}!`);
        } catch (err: any) {
            console.error('Error assigning task:', err);
            alert('Failed to create task: ' + err.message);
        } finally {
            setIsAssigning(false);
        }
    };

    const stats = {
        total: wishlistItems.length,
        high: wishlistItems.filter(item => item.priority === 'high').length,
        medium: wishlistItems.filter(item => item.priority === 'medium').length,
        low: wishlistItems.filter(item => item.priority === 'low').length,
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl shadow-cyan-900/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 p-6 md:p-8 z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    {child.name}'s Wishlist
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${child.category === 'nice'
                                    ? 'border-green-500 text-green-400 bg-green-500/10'
                                    : 'border-red-500 text-red-400 bg-red-500/10'
                                    }`}>
                                    {child.category} List
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-base">📍</span>
                                    <span className="font-mono">{child.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-base">🎂</span>
                                    <span className="font-mono">{child.age} years old</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors group flex-shrink-0"
                        >
                            <span className="text-xl group-hover:rotate-90 transition-transform duration-300 block">✖️</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {wishlistItems.length > 0 && (
                    <div className="px-6 md:px-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Wishes</p>
                            <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-red-500/20">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">High Priority</p>
                            <p className="text-2xl font-bold text-red-400">{stats.high}</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-yellow-500/20">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Medium</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-blue-500/20">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Low Priority</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.low}</p>
                        </div>
                    </div>
                )}

                {/* Modal Content */}
                <div className="p-6 md:p-8 space-y-3">
                    {wishlistItems.length > 0 ? (
                        <>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span>🎁</span>
                                <span>Requested Gifts</span>
                            </h3>
                            {wishlistItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 md:p-5 flex flex-col gap-4 group hover:border-slate-600/50 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-slate-600 w-8">#{index + 1}</span>
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center text-2xl border border-red-500/10 group-hover:scale-110 transition-transform flex-shrink-0">
                                                    {item.priority === 'high' ? '⭐' : item.priority === 'medium' ? '✨' : '💫'}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Wants:</p>
                                                <p className="font-bold text-lg md:text-xl text-white mb-2 leading-tight">{item.giftName}</p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider ${item.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                        item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                        {item.priority} priority
                                                    </span>
                                                    {assignedItems.has(item.id) && (
                                                        <span className="text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                                                            <span>✅</span> Task Created
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!assignedItems.has(item.id) && (
                                            <div className="flex-shrink-0 w-full sm:w-auto">
                                                {assigningId === item.id ? (
                                                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-cyan-500/30">
                                                        <select
                                                            className="bg-slate-900/50 border border-slate-700/50 text-white rounded-lg text-xs py-2 px-2 w-32 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none"
                                                            value={selectedWorker}
                                                            onChange={(e) => setSelectedWorker(e.target.value)}
                                                            disabled={isAssigning}
                                                        >
                                                            <option value="">Select Elf...</option>
                                                            {workers.map(w => (
                                                                <option key={w.id} value={w.id}>{w.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignTask(item)}
                                                            disabled={!selectedWorker || isAssigning}
                                                            className="bg-cyan-500 text-white px-3 py-2 rounded text-xs font-bold disabled:opacity-50 hover:bg-cyan-400 transition-colors"
                                                        >
                                                            {isAssigning ? '...' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setAssigningId(null)}
                                                            disabled={isAssigning}
                                                            className="text-red-400 hover:bg-slate-700/50 p-1 rounded transition-colors disabled:opacity-50"
                                                        >
                                                            ✖️
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAssigningId(item.id)}
                                                        className="w-full sm:w-auto px-4 py-2 bg-slate-700/50 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <span>👷</span> Assign Elf
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-50 grayscale">🎁</div>
                            <p className="text-slate-400 text-lg">No wishlist items yet</p>
                            <p className="text-sm text-slate-500 mt-2">This child hasn't added any wishes to their list.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChildrenWishlists;
