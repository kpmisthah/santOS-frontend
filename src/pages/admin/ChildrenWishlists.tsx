import { useState, useEffect } from 'react';
import type { Child, WishlistItem } from '../../types';

interface Worker {
    id: string;
    name: string;
    email: string;
    role: string;
}

const ChildrenWishlists = () => {
    const [children, setChildren] = useState<any[]>([]); // Using any for flexible transformation
    const [filter, setFilter] = useState<'all' | 'nice' | 'naughty'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChild, setSelectedChild] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch workers (elves)
    const fetchWorkers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (response.ok) {
                const data = await response.json();
                setWorkers(data.filter((u: any) => u.role === 'worker'));
            }
        } catch (error) {
            console.error("Failed to fetch workers", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/wishlists');
                if (response.ok) {
                    const wishlists = await response.json();

                    // Transform: The backend returns Wishlists with nested Child. 
                    // We want to display Children.
                    // Let's create a flat structure for the table.
                    const transformedChildren = wishlists.map((w: any) => ({
                        ...w.child,
                        wishlistId: w.id,
                        // If no items, this might be empty, but that's fine.
                        items: w.items || [],
                        // Parse date if needed, or keep string
                        createdAt: w.createdAt
                    }));

                    setChildren(transformedChildren);
                }
            } catch (error) {
                console.error("Failed to fetch wishlists", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        fetchWorkers();
        // Poll for updates every 10s to see new submissions live!
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredChildren = children.filter((child) => {
        const matchesFilter = filter === 'all' || child.category === filter || (filter === 'nice' && (!child.category)); // Default to nice if undefined?
        const matchesSearch = child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: children.length,
        nice: children.filter(c => c.category === 'nice').length,
        naughty: children.filter(c => c.category === 'naughty').length,
    };

    const viewWishlist = (child: any) => {
        setSelectedChild(child);
        setIsModalOpen(true);
    };

    const toggleCategory = async (child: any) => {
        const newCategory = child.category === 'nice' ? 'naughty' : 'nice';
        try {
            const response = await fetch(`http://localhost:3000/api/wishlists/child/${child.id}/category`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: newCategory }),
            });

            if (response.ok) {
                // Update local state
                setChildren(children.map(c =>
                    c.id === child.id ? { ...c, category: newCategory } : c
                ));
            }
        } catch (error) {
            console.error('Failed to toggle category', error);
        }
    };

    return (
        <div className={`space-y-8 animate-fade-in ${isLoading ? 'opacity-50' : ''}`}>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2 text-gradient-gold drop-shadow-sm">
                        Children & Wishlists
                    </h1>
                    <p className="text-frost-200/60 text-lg font-light tracking-wide">
                        Manage children's information and their Christmas wishlists
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="glass px-4 py-2 rounded-lg text-sm font-mono text-stardust-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-evergreen-400 animate-pulse"></span>
                        Naughty/Nice List Live
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-stardust-400 flex items-center justify-between group hover:shadow-neon-gold transition-all">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Total Children</p>
                        <p className="text-4xl font-display font-bold text-frost-100">{stats.total}</p>
                    </div>
                    <div className="text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all grayscale group-hover:grayscale-0">👶</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-evergreen-500 flex items-center justify-between group hover:shadow-glow-sm transition-all">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Nice Children</p>
                        <p className="text-4xl font-display font-bold text-evergreen-400">{stats.nice}</p>
                    </div>
                    <div className="text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all grayscale group-hover:grayscale-0">😇</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-festive-red-500 flex items-center justify-between group hover:shadow-neon-red transition-all">
                    <div>
                        <p className="text-frost-200/60 text-sm font-medium mb-1 uppercase tracking-wider">Naughty Children</p>
                        <p className="text-4xl font-display font-bold text-festive-red-400">{stats.naughty}</p>
                    </div>
                    <div className="text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all grayscale group-hover:grayscale-0">😈</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Search */}
                    <div className="flex-1 w-full relative group">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-north-pole-400 group-focus-within:text-stardust-400 transition-colors">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input w-full pl-12 pr-4 py-4 rounded-xl"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 w-full md:w-auto p-1 bg-north-pole-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all duration-300 ${filter === 'all'
                                ? 'bg-stardust-500/20 text-stardust-400 shadow-neon-gold border border-stardust-500/30'
                                : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5'
                                }`}
                        >
                            All ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilter('nice')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all duration-300 ${filter === 'nice'
                                ? 'bg-evergreen-500/20 text-evergreen-400 shadow-glow-sm border border-evergreen-500/30'
                                : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5'
                                }`}
                        >
                            😇 Nice ({stats.nice})
                        </button>
                        <button
                            onClick={() => setFilter('naughty')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-medium transition-all duration-300 ${filter === 'naughty'
                                ? 'bg-festive-red-500/20 text-festive-red-400 shadow-neon-red border border-festive-red-500/30'
                                : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5'
                                }`}
                        >
                            😈 Naughty ({stats.naughty})
                        </button>
                    </div>
                </div>
            </div>

            {/* Children Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-north-pole-900/40 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest font-mono">
                                    Child
                                </th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest font-mono">
                                    Age
                                </th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest font-mono">
                                    Location
                                </th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest font-mono">
                                    Status
                                </th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest font-mono">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredChildren.map((child) => (
                                <tr key={child.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                👶
                                            </div>
                                            <div>
                                                <p className="font-semibold text-frost-100 text-lg group-hover:text-white transition-colors">{child.name}</p>
                                                <p className="text-xs text-north-pole-400 font-mono">ID: {child.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-frost-200/80 font-medium">
                                        {child.age} years
                                    </td>
                                    <td className="px-8 py-5 text-frost-200/80">
                                        {child.location}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${child.category === 'nice'
                                                ? 'bg-evergreen-900/30 text-evergreen-400 border-evergreen-500/30 shadow-glow-sm'
                                                : 'bg-festive-red-900/30 text-festive-red-400 border-festive-red-500/30 shadow-neon-red'
                                                }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${child.category === 'nice' ? 'bg-evergreen-400' : 'bg-festive-red-400'}`}></span>
                                            {child.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => viewWishlist(child)}
                                                className="px-4 py-2 bg-stardust-400/10 hover:bg-stardust-400/20 text-stardust-400 border border-stardust-400/20 rounded-lg font-medium transition-all text-sm hover:shadow-neon-gold hover:-translate-y-0.5"
                                            >
                                                View Wishlist
                                            </button>
                                            <button
                                                onClick={() => toggleCategory(child)}
                                                className={`px-3 py-2 rounded-lg transition-all text-sm font-medium border ${child.category === 'nice'
                                                    ? 'bg-festive-red-500/10 hover:bg-festive-red-500/20 text-festive-red-400 border-festive-red-500/30 hover:shadow-neon-red'
                                                    : 'bg-evergreen-500/10 hover:bg-evergreen-500/20 text-evergreen-400 border-evergreen-500/30 hover:shadow-glow-sm'
                                                    }`}
                                                title={`Mark as ${child.category === 'nice' ? 'Naughty' : 'Nice'}`}
                                            >
                                                {child.category === 'nice' ? '😈' : '😇'}
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
                        <p className="text-frost-200/60 text-xl font-light">No children found in the registry.</p>
                        <p className="text-sm text-north-pole-400 mt-2">Try adjusting your filters or search terms.</p>
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

// Wishlist Modal Component
interface ExtendedChild extends Child {
    items?: WishlistItem[];
    wishlistId?: string;
}

interface WishlistModalProps {
    child: ExtendedChild;
    onClose: () => void;
    workers: Worker[];
}

const WishlistModal = ({ child, onClose, workers }: WishlistModalProps) => {
    // Use real wishlist items from the child object
    const wishlistItems = child.items || [];
    const [assignedItems, setAssignedItems] = useState<Set<string>>(new Set());
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [selectedWorker, setSelectedWorker] = useState<string>("");

    const handleAssignTask = async (item: WishlistItem) => {
        if (!selectedWorker) return;

        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Build ${item.giftName} for ${child.name}`,
                    description: `Gift request from ${child.name} (Age: ${child.age}, Location: ${child.location}). priority: ${item.priority}`,
                    giftType: item.giftName,
                    quantity: 1,
                    priority: item.priority,
                    assignedTo: selectedWorker,
                    deadline: new Date(new Date().getFullYear(), 11, 24).toISOString() // Xmas Eve
                })
            });

            if (response.ok) {
                setAssignedItems(prev => new Set(prev).add(item.id));
                setAssigningId(null);
                setSelectedWorker("");
                alert(`Task assigned to ${workers.find(w => w.id === selectedWorker)?.name}!`);
            }
        } catch (error) {
            console.error("Failed to assign task", error);
            alert("Failed to create task");
        }
    };

    // Calculate statistics
    const stats = {
        total: wishlistItems.length,
        high: wishlistItems.filter((item: any) => item.priority === 'high').length,
        medium: wishlistItems.filter((item: any) => item.priority === 'medium').length,
        low: wishlistItems.filter((item: any) => item.priority === 'low').length,
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-in border border-stardust-400/20 shadow-2xl shadow-stardust-900/50" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-north-pole-900/90 backdrop-blur-md border-b border-white/10 p-6 md:p-8 z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">{child.name}'s Wishlist</h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${child.category === 'nice' ? 'border-evergreen-500 text-evergreen-400' : 'border-festive-red-500 text-festive-red-400'}`}>
                                    {child.category} List
                                </span>
                            </div>

                            {/* Child Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                                <div className="flex items-center gap-2 text-frost-200/60">
                                    <span className="text-base">📍</span>
                                    <span className="font-mono">{child.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-frost-200/60">
                                    <span className="text-base">🎂</span>
                                    <span className="font-mono">{child.age} years old</span>
                                </div>
                                <div className="flex items-center gap-2 text-frost-200/60">
                                    <span className="text-base">📅</span>
                                    <span className="font-mono">Submitted: {new Date(child.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-frost-200/60">
                                    <span className="text-base">🆔</span>
                                    <span className="font-mono text-[10px]">ID: {child.wishlistId?.substring(0, 8)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group flex-shrink-0"
                        >
                            <span className="text-xl group-hover:rotate-90 transition-transform duration-300 block">✖️</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {wishlistItems.length > 0 && (
                    <div className="px-6 md:px-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="glass-panel p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-frost-200/60 uppercase tracking-wider mb-1">Total Wishes</p>
                            <p className="text-2xl font-bold text-stardust-400">{stats.total}</p>
                        </div>
                        <div className="glass-panel p-3 rounded-lg border border-festive-red-500/20">
                            <p className="text-[10px] text-frost-200/60 uppercase tracking-wider mb-1">High Priority</p>
                            <p className="text-2xl font-bold text-festive-red-400">{stats.high}</p>
                        </div>
                        <div className="glass-panel p-3 rounded-lg border border-stardust-500/20">
                            <p className="text-[10px] text-frost-200/60 uppercase tracking-wider mb-1">Medium</p>
                            <p className="text-2xl font-bold text-stardust-400">{stats.medium}</p>
                        </div>
                        <div className="glass-panel p-3 rounded-lg border border-blue-500/20">
                            <p className="text-[10px] text-frost-200/60 uppercase tracking-wider mb-1">Low Priority</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.low}</p>
                        </div>
                    </div>
                )}

                {/* Modal Content */}
                <div className="p-6 md:p-8 space-y-3">
                    {wishlistItems.length > 0 ? (
                        <>
                            <h3 className="text-lg font-bold text-frost-100 mb-4 flex items-center gap-2">
                                <span>🎁</span>
                                <span>Requested Gifts</span>
                            </h3>
                            {wishlistItems.map((item: any, index: number) => (
                                <div key={item.id} className="bg-north-pole-800/40 border border-white/5 rounded-xl p-4 md:p-5 flex flex-col gap-4 overflow-hidden relative group">
                                    {/* Status / Assign UI */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-north-pole-500 w-8">#{index + 1}</span>
                                                <div className="w-12 h-12 bg-festive-red-900/20 rounded-xl flex items-center justify-center text-2xl border border-festive-red-500/10 group-hover:scale-110 transition-transform flex-shrink-0">
                                                    {item.priority === 'high' ? '⭐' : item.priority === 'medium' ? '✨' : '💫'}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-north-pole-400 uppercase tracking-wide mb-1">Wants:</p>
                                                <p className="font-bold text-lg md:text-xl text-frost-100 mb-2 leading-tight">{item.giftName}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider ${item.priority === 'high' ? 'bg-festive-red-500/20 text-festive-red-400 border border-festive-red-500/30' :
                                                        item.priority === 'medium' ? 'bg-stardust-500/20 text-stardust-400 border border-stardust-500/30' :
                                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                        {item.priority} priority
                                                    </span>
                                                    {assignedItems.has(item.id) && (
                                                        <span className="text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider bg-evergreen-500/20 text-evergreen-400 border border-evergreen-500/30 flex items-center gap-1">
                                                            <span>✅</span> Task Created
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!assignedItems.has(item.id) && (
                                            <div className="flex-shrink-0">
                                                {assigningId === item.id ? (
                                                    <div className="flex items-center gap-2 bg-north-pole-900/80 p-2 rounded-lg border border-stardust-500/30 animate-fade-in">
                                                        <select
                                                            className="glass-input text-xs py-1 px-2 w-32"
                                                            value={selectedWorker}
                                                            onChange={(e) => setSelectedWorker(e.target.value)}
                                                        >
                                                            <option value="">Select Elf...</option>
                                                            {workers.map(w => (
                                                                <option key={w.id} value={w.id} className="text-black">{w.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignTask(item as unknown as WishlistItem)}
                                                            disabled={!selectedWorker}
                                                            className="bg-stardust-500 text-north-pole-900 px-2 py-1 rounded text-xs font-bold disabled:opacity-50 hover:bg-stardust-400"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setAssigningId(null)}
                                                            className="text-festive-red-400 hover:bg-white/10 p-1 rounded"
                                                        >
                                                            ✖️
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAssigningId(item.id)}
                                                        className="px-4 py-2 bg-north-pole-700/50 hover:bg-stardust-500/20 text-stardust-400 border border-stardust-500/20 hover:border-stardust-500/50 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
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
                            <p className="text-frost-200/60 text-lg">No wishlist items yet</p>
                            <p className="text-sm text-north-pole-400 mt-2">This child hasn't added any wishes to their list.</p>
                        </div>
                    )}

                    {/* Additional Info */}
                    {wishlistItems.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                            <div className="glass-panel p-4 rounded-xl border border-stardust-500/20">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">ℹ️</span>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-frost-100 mb-1">Wishlist Summary</h4>
                                        <p className="text-xs text-frost-200/60 leading-relaxed">
                                            {child.name} has requested <span className="text-stardust-400 font-bold">{stats.total}</span> gift{stats.total !== 1 ? 's' : ''} for Christmas.
                                            {stats.high > 0 && <span> <span className="text-festive-red-400 font-bold">{stats.high}</span> high priority item{stats.high !== 1 ? 's' : ''}.</span>}
                                            {stats.medium > 0 && <span> <span className="text-stardust-400 font-bold">{stats.medium}</span> medium priority.</span>}
                                            {stats.low > 0 && <span> <span className="text-blue-400 font-bold">{stats.low}</span> low priority.</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChildrenWishlists;
