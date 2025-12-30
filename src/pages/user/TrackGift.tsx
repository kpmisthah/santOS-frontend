import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { ArrowLeft, Search, Package, Truck, CheckCircle, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface DeliveryStatus {
    status: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered';
    location: string;
    timestamp: string;
    message: string;
}

const TrackGift = () => {
    const [trackingCode, setTrackingCode] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<{
        childName: string;
        status: DeliveryStatus[];
        estimatedDelivery: string;
        currentStatus: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered';
        productionProgress?: number;
        productionStatus?: string;
    } | null>(null);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setSearchPerformed(true);
        setIsLoading(true);
        setDeliveryInfo(null);

        try {
            const trackingId = trackingCode.replace('SANTA-', '').toLowerCase();
            const data = await apiClient.get(`/deliveries/track/${trackingId}`);

            let currentStatus: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered' = 'preparing';
            if (data.status === 'in_transit' || data.status === 'in-transit') {
                currentStatus = 'in_transit';
            } else if (data.status === 'delivered') {
                currentStatus = 'delivered';
            }

            const timeline: DeliveryStatus[] = [
                {
                    status: 'preparing',
                    location: 'North Pole Workshop',
                    timestamp: new Date(data.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    message: 'Elves are carefully preparing your gifts! 🧝'
                }
            ];

            if (currentStatus === 'in_transit' || currentStatus === 'delivered') {
                timeline.push({
                    status: 'in_transit',
                    location: `Santa's Sleigh - ${data.region}`,
                    timestamp: new Date(data.updatedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    message: 'On the way! Rudolph is leading the team! 🦌'
                });
            }

            if (currentStatus === 'delivered') {
                timeline.push({
                    status: 'delivered',
                    location: data.region,
                    timestamp: new Date(data.deliveryDate || data.updatedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    message: 'Delivered! Merry Christmas! 🎄'
                });
            }

            setDeliveryInfo({
                childName: 'Friend',
                currentStatus,
                estimatedDelivery: data.deliveryDate
                    ? new Date(data.deliveryDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })
                    : 'December 25, 2024',
                status: timeline,
                productionProgress: data.productionProgress || 0,
                productionStatus: data.productionStatus || 'pending'
            });
        } catch (error) {
            console.error('Tracking error:', error);
            setDeliveryInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'preparing': return <Package className="w-6 h-6" />;
            case 'in_transit': return <Truck className="w-6 h-6" />;
            case 'out_for_delivery': return <Truck className="w-6 h-6" />;
            case 'delivered': return <CheckCircle className="w-6 h-6" />;
            default: return <Package className="w-6 h-6" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'preparing': return 'from-yellow-500 to-orange-500';
            case 'in_transit': return 'from-cyan-500 to-blue-600';
            case 'out_for_delivery': return 'from-purple-500 to-purple-600';
            case 'delivered': return 'from-green-500 to-emerald-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getProgressPercentage = (status: string) => {
        switch (status) {
            case 'preparing': return 25;
            case 'in_transit': return 50;
            case 'out_for_delivery': return 75;
            case 'delivered': return 100;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 backdrop-blur-sm border-b border-white/5">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="max-w-4xl w-full">
                        {/* Page Title */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>Real-Time Tracking</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Track Your Gifts
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Enter your tracking code to see where your Christmas gifts are on their magical journey! ✨
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="mb-12">
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                <label className="block text-sm font-semibold text-slate-300 mb-3">Tracking Code</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={trackingCode}
                                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                        placeholder="SANTA-XXXXXXXX"
                                        className="flex-1 bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-6 py-4 font-mono text-lg tracking-wider focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg ${isLoading
                                            ? 'bg-slate-700 cursor-wait'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-900/50 hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Tracking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5" />
                                                <span>Track</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-slate-500 text-sm mt-3">
                                    You received this code when you submitted your wishlist
                                </p>
                            </div>
                        </form>

                        {/* Results */}
                        {searchPerformed && deliveryInfo && (
                            <div className="space-y-6">
                                {/* Status Overview */}
                                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                Hello, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{deliveryInfo.childName}</span>! 👋
                                            </h2>
                                            <p className="text-slate-400">
                                                Estimated Delivery: <span className="text-cyan-400 font-semibold">{deliveryInfo.estimatedDelivery}</span>
                                            </p>
                                        </div>
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStatusColor(deliveryInfo.currentStatus)} flex items-center justify-center shadow-lg`}>
                                            {getStatusIcon(deliveryInfo.currentStatus)}
                                        </div>
                                    </div>

                                    {/* Production Progress */}
                                    <div className="mb-8 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                        <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            <span>Toy Factory Status</span>
                                        </h3>

                                        <div className="mb-2 flex justify-between text-xs text-slate-400 uppercase tracking-wide">
                                            <span>Elves Building</span>
                                            <span>{deliveryInfo.productionProgress || 0}% Complete</span>
                                        </div>
                                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 relative">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative transition-all duration-1000"
                                                style={{ width: `${deliveryInfo.productionProgress || 0}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>

                                        {deliveryInfo.productionProgress === 100 ? (
                                            <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Toy is ready for shipping!</span>
                                            </p>
                                        ) : (
                                            <p className="text-slate-500 text-sm mt-2">
                                                Elves are hard at work...
                                            </p>
                                        )}
                                    </div>

                                    {/* Delivery Progress */}
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        <span>Delivery Status</span>
                                    </h3>
                                    <div className="relative pt-4">
                                        <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                                            <div
                                                className={`h-full bg-gradient-to-r ${getStatusColor(deliveryInfo.currentStatus)} transition-all duration-1000 ease-out relative overflow-hidden`}
                                                style={{ width: `${getProgressPercentage(deliveryInfo.currentStatus)}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <span className={deliveryInfo.currentStatus === 'preparing' ? 'text-cyan-400' : ''}>Preparing</span>
                                            <span className={deliveryInfo.currentStatus === 'in_transit' ? 'text-cyan-400' : ''}>In Transit</span>
                                            <span className={deliveryInfo.currentStatus === 'out_for_delivery' ? 'text-cyan-400' : ''}>Out for Delivery</span>
                                            <span className={deliveryInfo.currentStatus === 'delivered' ? 'text-cyan-400' : ''}>Delivered</span>
                                        </div>
                                    </div>

                                    {deliveryInfo.productionStatus === 'completed' && deliveryInfo.currentStatus === 'preparing' && (
                                        <div className="mt-6 flex items-center justify-center">
                                            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Toy Production Complete! Awaiting Sleigh...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Timeline */}
                                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                    <h3 className="text-2xl font-bold mb-8 text-white">
                                        Delivery Timeline
                                    </h3>

                                    <div className="space-y-8">
                                        {deliveryInfo.status.map((item, index) => (
                                            <div key={index} className="relative pl-10 pb-8 border-l-2 border-slate-700/50 last:border-l-0 last:pb-0">
                                                <div className={`absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-gradient-to-br ${getStatusColor(item.status)} flex items-center justify-center shadow-lg ring-4 ring-slate-900`}>
                                                    {getStatusIcon(item.status)}
                                                </div>
                                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-900 transition-all group hover:border-cyan-500/30">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                                                            {item.location}
                                                        </h4>
                                                        <span className="text-xs font-mono text-cyan-400 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                                                            {item.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 text-sm leading-relaxed">
                                                        {item.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Future Steps */}
                                        {deliveryInfo.currentStatus !== 'delivered' && (
                                            <>
                                                {deliveryInfo.currentStatus !== 'out_for_delivery' && (
                                                    <div className="relative pl-10 pb-8 border-l-2 border-dashed border-slate-700/30 opacity-40">
                                                        <div className="absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center ring-4 ring-slate-900">
                                                            <Truck className="w-5 h-5 text-slate-600" />
                                                        </div>
                                                        <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-700/30">
                                                            <h4 className="font-bold text-lg text-slate-600 mb-2">
                                                                Out for Delivery
                                                            </h4>
                                                            <p className="text-slate-600 text-sm">
                                                                Santa is on his way to your house!
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="relative pl-10 opacity-40">
                                                    <div className="absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center ring-4 ring-slate-900">
                                                        <CheckCircle className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                    <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-700/30">
                                                        <h4 className="font-bold text-lg text-slate-600 mb-2">
                                                            Delivered
                                                        </h4>
                                                        <p className="text-slate-600 text-sm">
                                                            Your gifts will be under the tree on Christmas morning!
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
                                    <div className="flex gap-5 items-start">
                                        <div className="text-4xl">ℹ️</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 text-white">Tracking Information</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                Your gifts are being carefully monitored throughout their journey.
                                                Updates are provided in real-time as your gifts move from the North Pole to your home.
                                                Remember to leave out cookies and milk for Santa! 🍪🥛
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {searchPerformed && !deliveryInfo && !isLoading && (
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
                                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold mb-4 text-white">
                                    Tracking Code Not Found
                                </h3>
                                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                    We couldn't find any gifts with that tracking code. Please check your code and try again.
                                </p>
                                <Link
                                    to="/user/wishlist"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Create a Wishlist</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackGift;
