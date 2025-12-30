import { useState, useEffect, type FormEvent } from 'react';
import type { Delivery } from '../../types';

interface Child {
    id: string;
    name: string;
    location: string;
    category: string;
}

const DeliveryTracking = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingDeliveryId, setUpdatingDeliveryId] = useState<string | null>(null);

    // Fetch deliveries from API
    const fetchDeliveries = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3000/api/deliveries');

            if (!response.ok) {
                throw new Error('Failed to fetch deliveries');
            }

            const data = await response.json();
            setDeliveries(data);
        } catch (err: any) {
            console.error('Error fetching deliveries:', err);
            setError(err.message || 'Failed to load deliveries');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch children for creating deliveries
    const fetchChildren = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/wishlists');

            if (!response.ok) {
                throw new Error('Failed to fetch children');
            }

            const data = await response.json();
            // Extract unique children from wishlists
            const uniqueChildren = data.map((wishlist: any) => wishlist.child);
            setChildren(uniqueChildren);
        } catch (err: any) {
            console.error('Error fetching children:', err);
        }
    };

    useEffect(() => {
        fetchDeliveries();
        fetchChildren();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDeliveries, 30000);
        return () => clearInterval(interval);
    }, []);

    const regions = ['all', ...Array.from(new Set(deliveries.map(d => d.region)))];

    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesStatus = filter === 'all' || delivery.status.replace('_', '-') === filter;
        const matchesRegion = selectedRegion === 'all' || delivery.region === selectedRegion;
        return matchesStatus && matchesRegion;
    });

    const stats = {
        total: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending').length,
        inTransit: deliveries.filter(d => d.status === 'in_transit').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
    };

    const regionStats = regions.slice(1).map(region => ({
        name: region,
        total: deliveries.filter(d => d.region === region).length,
        delivered: deliveries.filter(d => d.region === region && d.status === 'delivered').length,
    }));

    // Update delivery status
    const handleUpdateStatus = async (deliveryId: string, newStatus: 'pending' | 'in_transit' | 'delivered') => {
        try {
            setUpdatingDeliveryId(deliveryId);
            const response = await fetch(`http://localhost:3000/api/deliveries/${deliveryId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update delivery status');
            }

            // Refresh deliveries
            await fetchDeliveries();
        } catch (err: any) {
            console.error('Error updating delivery:', err);
            alert('Failed to update delivery status: ' + err.message);
        } finally {
            setUpdatingDeliveryId(null);
        }
    };

    // Get next status for a delivery
    const getNextStatus = (currentStatus: string): 'in_transit' | 'delivered' | null => {
        if (currentStatus === 'pending') return 'in_transit';
        if (currentStatus === 'in_transit') return 'delivered';
        return null;
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-gradient-gold drop-shadow-sm">
                        Delivery Tracking
                    </h1>
                    <p className="text-frost-200/60 text-base md:text-lg font-light tracking-wide">
                        Monitor gift deliveries across all regions worldwide
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 btn-primary group w-full sm:w-auto"
                >
                    <span className="group-hover:rotate-90 transition-transform duration-300 text-xl">➕</span>
                    <span>Create Delivery</span>
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
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Total Deliveries</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-frost-100">{stats.total}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-north-pole-800 rounded-lg p-2 group-hover:scale-110 transition-transform">📦</div>
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
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">In Transit</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-festive-red-400">{stats.inTransit}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-festive-red-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-festive-red-400">🚚</div>
                </div>
                <div className="glass-card p-4 md:p-6 border-l-4 border-evergreen-500 flex items-center justify-between group hover:shadow-glow-sm">
                    <div>
                        <p className="text-frost-200/60 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Delivered</p>
                        <p className="text-2xl md:text-3xl font-display font-bold text-evergreen-400">{stats.delivered}</p>
                    </div>
                    <div className="text-3xl md:text-4xl bg-evergreen-900/30 rounded-lg p-2 group-hover:scale-110 transition-transform text-evergreen-400">✅</div>
                </div>
            </div>

            {/* Region Statistics */}
            {regionStats.length > 0 && (
                <div className="glass-panel p-6 md:p-8 rounded-2xl">
                    <h2 className="text-xl md:text-2xl font-display font-bold mb-6 text-frost-100 flex items-center gap-3">
                        <span className="text-stardust-400">🌍</span> Regional Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {regionStats.map((region) => (
                            <div key={region.name} className="bg-north-pole-800/40 rounded-xl p-4 md:p-6 border border-white/5 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-base md:text-lg text-frost-100 tracking-wide truncate">{region.name}</h3>
                                    <div className="text-xs md:text-sm font-mono text-stardust-400 bg-stardust-900/30 px-2 py-1 rounded flex-shrink-0">
                                        {region.total > 0 ? Math.round((region.delivered / region.total) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-north-pole-900 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-evergreen-600 to-evergreen-400 relative overflow-hidden transition-all duration-500"
                                            style={{ width: `${region.total > 0 ? (region.delivered / region.total) * 100 : 0}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-north-pole-400">
                                        <span className="group-hover:text-evergreen-400 transition-colors">{region.delivered} delivered</span>
                                        <span>{region.total} total</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="glass-panel p-4 md:p-6 rounded-2xl">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Status Filter */}
                    <div className="flex-1">
                        <label className="block text-xs md:text-sm font-bold text-stardust-400 mb-3 uppercase tracking-wide">Filter by Status</label>
                        <div className="flex gap-2 flex-wrap">
                            {(['all', 'pending', 'in_transit', 'delivered'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 md:px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 text-xs md:text-sm whitespace-nowrap ${filter === status
                                            ? 'bg-stardust-500/20 text-stardust-400 shadow-neon-gold border border-stardust-500/30'
                                            : 'text-north-pole-400 hover:text-frost-100 hover:bg-white/5 bg-north-pole-900/50 border border-transparent'
                                        }`}
                                >
                                    {status === 'in_transit' ? 'In Transit' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Region Filter */}
                    <div className="min-w-full lg:min-w-[250px]">
                        <label className="block text-xs md:text-sm font-bold text-stardust-400 mb-3 uppercase tracking-wide">Filter by Region</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg z-10">🌎</span>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="glass-input w-full pl-12 pr-4 py-3 rounded-xl appearance-none cursor-pointer"
                            >
                                {regions.map((region) => (
                                    <option key={region} value={region} className="bg-north-pole-900 capitalize">
                                        {region}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-north-pole-400">▼</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="glass-card p-12 text-center">
                    <div className="text-6xl mb-6 animate-bounce">⏳</div>
                    <p className="text-frost-200/60 text-lg">Loading deliveries...</p>
                </div>
            )}

            {/* Deliveries Table - Desktop */}
            {!isLoading && (
                <>
                    <div className="hidden lg:block glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-north-pole-900/40 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Child</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Region</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Address</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Gifts</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stardust-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredDeliveries.map((delivery) => {
                                        const nextStatus = getNextStatus(delivery.status);
                                        return (
                                            <tr key={delivery.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-lg">
                                                            👶
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-frost-100">{delivery.child?.name || 'Unknown'}</p>
                                                            <p className="text-xs text-north-pole-400 font-mono">ID: {delivery.child?.id?.substring(0, 8) || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">🌍</span>
                                                        <span className="font-medium text-frost-200">{delivery.region}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-north-pole-300 text-sm max-w-xs truncate">
                                                    {delivery.address}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {delivery.giftItems.slice(0, 3).map((gift, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] uppercase font-bold text-north-pole-300 tracking-wider"
                                                            >
                                                                {gift}
                                                            </span>
                                                        ))}
                                                        {delivery.giftItems.length > 3 && (
                                                            <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-stardust-400">
                                                                +{delivery.giftItems.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${delivery.status === 'delivered'
                                                                ? 'bg-evergreen-900/30 text-evergreen-400 border-evergreen-500/30 shadow-glow-sm'
                                                                : delivery.status === 'in_transit'
                                                                    ? 'bg-festive-red-900/30 text-festive-red-400 border-festive-red-500/30 shadow-neon-red'
                                                                    : 'bg-stardust-900/30 text-stardust-400 border-stardust-500/30 shadow-neon-gold'
                                                            }`}
                                                    >
                                                        {delivery.status === 'delivered' && <span className="animate-pulse">✅</span>}
                                                        {delivery.status === 'in_transit' && <span className="animate-float">🚚</span>}
                                                        {delivery.status === 'pending' && <span>⏱️</span>}
                                                        {delivery.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {nextStatus && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(delivery.id, nextStatus)}
                                                                disabled={updatingDeliveryId === delivery.id}
                                                                className={`px-3 py-1.5 bg-stardust-400/10 hover:bg-stardust-400/20 text-stardust-400 border border-stardust-400/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:shadow-neon-gold ${updatingDeliveryId === delivery.id ? 'opacity-50 cursor-wait' : ''
                                                                    }`}
                                                            >
                                                                {updatingDeliveryId === delivery.id ? '...' : `→ ${nextStatus.replace('_', ' ')}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredDeliveries.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-6 opacity-50 grayscale">📦</div>
                                <p className="text-frost-200/60 text-xl font-light">No deliveries found matching your criteria.</p>
                                <p className="text-sm text-north-pole-400 mt-2">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>

                    {/* Deliveries Cards - Mobile */}
                    <div className="lg:hidden space-y-4">
                        {filteredDeliveries.map((delivery) => {
                            const nextStatus = getNextStatus(delivery.status);
                            return (
                                <div key={delivery.id} className="glass-card p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-lg">
                                                👶
                                            </div>
                                            <div>
                                                <p className="font-semibold text-frost-100">{delivery.child?.name || 'Unknown'}</p>
                                                <p className="text-xs text-north-pole-400">🌍 {delivery.region}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${delivery.status === 'delivered'
                                                    ? 'bg-evergreen-900/30 text-evergreen-400'
                                                    : delivery.status === 'in_transit'
                                                        ? 'bg-festive-red-900/30 text-festive-red-400'
                                                        : 'bg-stardust-900/30 text-stardust-400'
                                                }`}
                                        >
                                            {delivery.status === 'delivered' && '✅'}
                                            {delivery.status === 'in_transit' && '🚚'}
                                            {delivery.status === 'pending' && '⏱️'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <p className="text-north-pole-300 truncate">📍 {delivery.address}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {delivery.giftItems.map((gift, index) => (
                                                <span key={index} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-north-pole-300">
                                                    {gift}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {nextStatus && (
                                        <button
                                            onClick={() => handleUpdateStatus(delivery.id, nextStatus)}
                                            disabled={updatingDeliveryId === delivery.id}
                                            className={`w-full px-3 py-2 bg-stardust-400/10 text-stardust-400 border border-stardust-400/20 rounded-lg text-xs font-bold uppercase ${updatingDeliveryId === delivery.id ? 'opacity-50' : ''
                                                }`}
                                        >
                                            {updatingDeliveryId === delivery.id ? 'Updating...' : `Update to ${nextStatus.replace('_', ' ')}`}
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {filteredDeliveries.length === 0 && (
                            <div className="glass-card p-12 text-center">
                                <div className="text-6xl mb-6 opacity-50">📦</div>
                                <p className="text-frost-200/60">No deliveries found</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Create Delivery Modal */}
            {isModalOpen && (
                <CreateDeliveryModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchDeliveries}
                    children={children}
                />
            )}
        </div>
    );
};

// Create Delivery Modal Component
interface CreateDeliveryModalProps {
    onClose: () => void;
    onSuccess: () => void;
    children: Child[];
}

const CreateDeliveryModal = ({ onClose, onSuccess, children }: CreateDeliveryModalProps) => {
    const [formData, setFormData] = useState({
        childId: '',
        region: '',
        address: '',
        giftItems: '',
        deliveryDate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const giftItemsArray = formData.giftItems.split(',').map(item => item.trim()).filter(Boolean);

            if (giftItemsArray.length === 0) {
                throw new Error('Please enter at least one gift item');
            }

            const response = await fetch('http://localhost:3000/api/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    childId: formData.childId || undefined,
                    region: formData.region,
                    address: formData.address,
                    giftItems: giftItemsArray,
                    deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate).toISOString() : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create delivery');
            }

            // Success!
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error creating delivery:', err);
            setError(err.message || 'Failed to create delivery');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-in border border-stardust-400/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-north-pole-900/90 backdrop-blur-md border-b border-white/10 p-6 md:p-8 flex items-center justify-between z-10">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-gradient-gold">Create New Delivery</h2>
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
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Select Child (Optional)</label>
                        <select
                            value={formData.childId}
                            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                            className="glass-input w-full px-4 py-3 rounded-xl"
                        >
                            <option value="" className="bg-north-pole-900">No specific child</option>
                            {children.map((child) => (
                                <option key={child.id} value={child.id} className="bg-north-pole-900">
                                    {child.name} - {child.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Region *</label>
                            <input
                                type="text"
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                placeholder="e.g., North America"
                                required
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Delivery Date</label>
                            <input
                                type="date"
                                value={formData.deliveryDate}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Address *</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="e.g., 123 Main St, New York, NY"
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stardust-400 mb-2 uppercase tracking-wide">Gift Items *</label>
                        <textarea
                            value={formData.giftItems}
                            onChange={(e) => setFormData({ ...formData, giftItems: e.target.value })}
                            placeholder="Enter gift items separated by commas (e.g., Toy Car, Doll, Book)"
                            rows={3}
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl resize-none"
                        />
                        <p className="text-xs text-north-pole-400 mt-2">Separate multiple items with commas</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 btn-gold ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Creating Delivery...' : 'Create Delivery'}
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

export default DeliveryTracking;
