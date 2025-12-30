import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { MapPin, Package, Clock, CheckCircle, Truck as TruckIcon, Search } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import type { Delivery } from '@/types';

const DeliveriesPage = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingDeliveryId, setUpdatingDeliveryId] = useState<string | null>(null);

    // Fetch deliveries from API
    const fetchDeliveries = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setIsLoading(true);
            setError(null);
            const data = await apiClient.get('/deliveries');
            setDeliveries(data);
        } catch (err: any) {
            console.error('Error fetching deliveries:', err);
            setError(err.message || 'Failed to load deliveries');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDeliveries, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredDeliveries = deliveries.filter((delivery) => {
        const matchesFilter = filter === 'all' || delivery.status === filter;
        const matchesSearch =
            delivery.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (delivery.country && delivery.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (delivery.child?.name && delivery.child.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending').length,
        inTransit: deliveries.filter(d => d.status === 'in_transit').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        totalPackages: deliveries.reduce((sum, d) => sum + (d.giftItems?.length || 0), 0),
        deliveredPackages: deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + (d.giftItems?.length || 0), 0),
    };

    const getStatusConfig = (status: Delivery['status']) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock };
            case 'in_transit':
                return { label: 'In Transit', class: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: TruckIcon };
            case 'delivered':
                return { label: 'Delivered', class: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle };
        }
    };

    const updateDeliveryStatus = async (deliveryId: string, newStatus: Delivery['status']) => {
        try {
            setUpdatingDeliveryId(deliveryId);
            setUpdatingDeliveryId(deliveryId);
            await apiClient.patch(`/deliveries/${deliveryId}/status`, { status: newStatus });
            await fetchDeliveries();
        } catch (err: any) {
            console.error('Error updating delivery:', err);
            alert('Failed to update delivery status: ' + err.message);
        } finally {
            setUpdatingDeliveryId(null);
        }
    };

    const getNextStatus = (currentStatus: Delivery['status']): Delivery['status'] | null => {
        if (currentStatus === 'pending') return 'in_transit';
        if (currentStatus === 'in_transit') return 'delivered';
        return null;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-300 animate-pulse font-medium">Loading deliveries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/50 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">Error Loading Deliveries</h3>
                    <p className="text-slate-300 mb-4">{error}</p>
                    <button
                        onClick={() => fetchDeliveries()}
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
                    icon: <TruckIcon className="w-4 h-4" />,
                    text: 'Global Delivery Network'
                }}
                title="Delivery Tracking"
                description="Monitor real-time delivery status across all regions. Track packages and ensure timely Christmas deliveries worldwide."
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Total Routes</p>
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
                        <TruckIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">In Transit</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">{stats.inTransit}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Delivered</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{stats.delivered}</p>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    Global Delivery Progress
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-slate-900/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalPackages > 0 ? (stats.deliveredPackages / stats.totalPackages) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-lg font-bold text-white whitespace-nowrap">
                        {stats.deliveredPackages} / {stats.totalPackages}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                    {stats.totalPackages > 0 ? Math.round((stats.deliveredPackages / stats.totalPackages) * 100) : 0}% of all packages delivered
                </p>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by region, country, or child name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-12 py-4 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                        {(['all', 'pending', 'in_transit', 'delivered'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${filter === status
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/50'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50 bg-slate-800/50'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status === 'in_transit' ? 'In Transit' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deliveries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeliveries.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.status);
                    const nextStatus = getNextStatus(delivery.status);
                    const giftCount = delivery.giftItems?.length || 0;

                    return (
                        <div key={delivery.id} className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {delivery.region}
                                    </h3>
                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {delivery.child?.location || delivery.country || 'Unknown'}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.class}`}>
                                    <statusConfig.icon className="w-3 h-3" />
                                    {statusConfig.label}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {delivery.child && (
                                    <div className="text-sm">
                                        <p className="text-slate-400">Recipient:</p>
                                        <p className="text-white font-semibold">{delivery.child.name}</p>
                                    </div>
                                )}

                                {delivery.address && (
                                    <div className="text-sm">
                                        <p className="text-slate-400">Address:</p>
                                        <p className="text-white truncate">{delivery.address}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-400">Packages</p>
                                        <p className="text-white font-semibold">{giftCount} items</p>
                                    </div>
                                    {delivery.deliveryDate && (
                                        <div>
                                            <p className="text-slate-400">Delivery Date</p>
                                            <p className="text-white font-semibold text-xs">
                                                {new Date(delivery.deliveryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {delivery.giftItems && delivery.giftItems.length > 0 && (
                                    <div className="pt-4 border-t border-slate-700/30">
                                        <p className="text-xs text-slate-400 mb-2">Gift Items:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {delivery.giftItems.slice(0, 3).map((gift, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-slate-900/50 text-slate-300 rounded-lg border border-slate-700/30">
                                                    {gift}
                                                </span>
                                            ))}
                                            {delivery.giftItems.length > 3 && (
                                                <span className="text-xs px-2 py-1 text-cyan-400">
                                                    +{delivery.giftItems.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {nextStatus && (
                                    <button
                                        onClick={() => updateDeliveryStatus(delivery.id, nextStatus)}
                                        disabled={updatingDeliveryId === delivery.id}
                                        className="w-full mt-4 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-medium transition-all text-sm disabled:opacity-50"
                                    >
                                        {updatingDeliveryId === delivery.id
                                            ? 'Updating...'
                                            : `Mark as ${nextStatus === 'in_transit' ? 'In Transit' : 'Delivered'}`
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredDeliveries.length === 0 && (
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-12 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-6 opacity-50">🚚</div>
                    <p className="text-slate-400 text-xl">No deliveries match your search.</p>
                </div>
            )}
        </div>
    );
};

export default DeliveriesPage;
