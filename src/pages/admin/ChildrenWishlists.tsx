import { useState, useEffect } from 'react';
import type { Child } from '../../types';

const ChildrenWishlists = () => {
    const [children, setChildren] = useState<any[]>([]); // Using any for flexible transformation
    const [filter, setFilter] = useState<'all' | 'nice' | 'naughty'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChild, setSelectedChild] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="space-y-8 animate-fade-in">
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
                <WishlistModal child={selectedChild} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

// Wishlist Modal Component
interface WishlistModalProps {
    child: Child;
    onClose: () => void;
}

const WishlistModal = ({ child, onClose }: WishlistModalProps) => {
    const wishlistItems = [
        { id: '1', name: 'LEGO Star Wars Set', priority: 'high', status: 'approved' },
        { id: '2', name: 'Bicycle', priority: 'high', status: 'approved' },
        { id: '3', name: 'Art Supplies Kit', priority: 'medium', status: 'pending' },
        { id: '4', name: 'Board Games', priority: 'low', status: 'approved' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-in border border-stardust-400/20 shadow-2xl shadow-stardust-900/50" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-north-pole-900/90 backdrop-blur-md border-b border-white/10 p-8 flex items-center justify-between z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-display font-bold text-gradient-gold">{child.name}'s Wishlist</h2>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${child.category === 'nice' ? 'border-evergreen-500 text-evergreen-400' : 'border-festive-red-500 text-festive-red-400'}`}>
                                {child.category} List
                            </span>
                        </div>
                        <p className="text-frost-200/60 flex items-center gap-2 text-sm font-mono">
                            <span>📍 {child.location}</span>
                            <span className="text-north-pole-500">•</span>
                            <span>🎂 {child.age} years old</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300 block">✖️</span>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-4">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-north-pole-800/40 border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 hover:bg-north-pole-800/60 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-festive-red-900/20 rounded-xl flex items-center justify-center text-2xl border border-festive-red-500/10 group-hover:scale-110 transition-transform">🎁</div>
                                <div>
                                    <p className="font-semibold text-lg text-frost-100">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider ${item.priority === 'high' ? 'bg-festive-red-500/20 text-festive-red-400' :
                                            item.priority === 'medium' ? 'bg-stardust-500/20 text-stardust-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {item.priority} priority
                                        </span>
                                        <span className={`text-[10px] px-2 py-1 rounded-sm font-bold uppercase tracking-wider ${item.status === 'approved' ? 'bg-evergreen-500/20 text-evergreen-400' :
                                            'bg-stardust-500/20 text-stardust-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {item.status === 'pending' ? (
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-evergreen-500/20 hover:bg-evergreen-500/30 text-evergreen-400 border border-evergreen-500/30 rounded-lg text-sm font-bold uppercase tracking-wide transition-all hover:scale-105">
                                        Approve
                                    </button>
                                    <button className="px-4 py-2 bg-festive-red-500/20 hover:bg-festive-red-500/30 text-festive-red-400 border border-festive-red-500/30 rounded-lg text-sm font-bold uppercase tracking-wide transition-all hover:scale-105">
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="text-2xl opacity-50">
                                    {item.status === 'approved' ? '✅' : '❌'}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button className="btn-primary flex items-center gap-2 px-6">
                            <span>Add New Wish</span>
                            <span className="text-xl">+</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildrenWishlists;
