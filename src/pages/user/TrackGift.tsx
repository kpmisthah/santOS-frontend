import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

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
    } | null>(null);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setSearchPerformed(true);
        setIsLoading(true);
        setDeliveryInfo(null);

        try {
            // Extract the actual tracking ID from the code (remove SANTA- prefix)
            const trackingId = trackingCode.replace('SANTA-', '').toLowerCase();

            const response = await fetch(`http://localhost:3000/api/deliveries/track/${trackingId}`);

            if (!response.ok) {
                throw new Error('Tracking code not found');
            }

            const data = await response.json();

            // Map backend status to frontend status
            let currentStatus: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered' = 'preparing';
            if (data.status === 'in_transit' || data.status === 'in-transit') {
                currentStatus = 'in_transit';
            } else if (data.status === 'delivered') {
                currentStatus = 'delivered';
            }

            // Create timeline based on status
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
                childName: 'Friend', // We don't expose child name for privacy
                currentStatus,
                estimatedDelivery: data.deliveryDate
                    ? new Date(data.deliveryDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })
                    : 'December 25, 2025',
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
            case 'preparing': return '🎁';
            case 'in_transit': return '🚀';
            case 'out_for_delivery': return '🎅';
            case 'delivered': return '✅';
            default: return '📦';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'preparing': return 'from-stardust-500 to-stardust-700 shadow-neon-gold';
            case 'in_transit': return 'from-blue-500 to-cyan-500 shadow-glow-sm';
            case 'out_for_delivery': return 'from-festive-red-500 to-festive-red-700 shadow-neon-red';
            case 'delivered': return 'from-evergreen-500 to-evergreen-700 shadow-glow-sm';
            default: return 'from-gray-500 to-gray-600';
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
        <div className="min-h-screen bg-north-pole-950 text-white py-20 px-6 font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-stardust-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-festive-red-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-stardust-400 hover:text-frost-100 transition-colors mb-8 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-medium tracking-wide uppercase text-sm">Back to Home</span>
                    </Link>
                    <div className="mb-6">
                        <span className="text-7xl animate-bounce-slow inline-block drop-shadow-xl">🎁</span>
                    </div>
                    <h1 className="text-6xl font-display font-bold mb-4 text-gradient-gold drop-shadow-sm">
                        Track Your Gifts
                    </h1>
                    <p className="text-xl text-frost-200/60 max-w-2xl mx-auto font-light">
                        Enter your tracking code to see where your Christmas gifts are on their magical journey! ✨
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-12">
                    <div className="glass-card p-8 md:p-10 border-stardust-500/30 shadow-neon-gold/20">
                        <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                            Tracking Code
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                placeholder="SANTA-XXXXXXXX"
                                className="glass-input flex-1 px-6 py-4 font-mono text-lg tracking-wider"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`btn-primary px-8 py-4 text-lg shadow-neon-gold hover:scale-105 transform transition-all duration-300 ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
                            >
                                {isLoading ? '🔄 Tracking...' : '🔍 Track'}
                            </button>
                        </div>
                        <p className="text-frost-200/40 text-xs mt-4 font-light">
                            You received this code when you submitted your wishlist
                        </p>
                    </div>
                </form>

                {/* Results */}
                {searchPerformed && deliveryInfo && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Status Overview */}
                        <div className="glass-card p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-frost-100 mb-2">
                                        Hello, <span className="text-festive-red-400">{deliveryInfo.childName}</span>! 👋
                                    </h2>
                                    <p className="text-frost-200/60">
                                        Estimated Delivery: <span className="text-stardust-400 font-semibold">{deliveryInfo.estimatedDelivery}</span>
                                    </p>
                                </div>
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getStatusColor(deliveryInfo.currentStatus)} flex items-center justify-center text-4xl shadow-lg animate-float`}>
                                    {getStatusIcon(deliveryInfo.currentStatus)}
                                </div>
                            </div>

                            {/* Visualization of Production vs Delivery */}
                            <div className="mb-10 p-6 bg-north-pole-900/50 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-stardust-400 mb-4 flex items-center gap-2">
                                    <span>🏭</span> Toy Factory Status
                                </h3>

                                {/* Production Progress Bar */}
                                <div className="mb-2 flex justify-between text-xs text-frost-200/60 uppercase tracking-wide">
                                    <span>Elves Building</span>
                                    <span>{(deliveryInfo as any).productionProgress || 0}% Complete</span>
                                </div>
                                <div className="h-3 bg-north-pole-800 rounded-full overflow-hidden border border-white/5 relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative"
                                        style={{ width: `${(deliveryInfo as any).productionProgress || 0}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                    </div>
                                </div>

                                {(deliveryInfo as any).productionProgress === 100 ? (
                                    <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1">
                                        <span>✅</span> Toy is ready for shipping!
                                    </p>
                                ) : (
                                    <p className="text-frost-200/40 text-xs mt-2 font-mono">
                                        Elves are hard at work...
                                    </p>
                                )}
                            </div>

                            {/* Delivery Progress Bar */}
                            <h3 className="text-lg font-bold text-stardust-400 mb-4 flex items-center gap-2">
                                <span>🚚</span> Delivery Status
                            </h3>
                            <div className="relative pt-4">
                                <div className="h-4 bg-north-pole-900 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full bg-gradient-to-r ${getStatusColor(deliveryInfo.currentStatus)} transition-all duration-1000 ease-out relative overflow-hidden`}
                                        style={{ width: `${getProgressPercentage(deliveryInfo.currentStatus)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4 text-xs font-bold text-frost-200/40 uppercase tracking-widest">
                                    <span className={deliveryInfo.currentStatus === 'preparing' ? 'text-stardust-400' : ''}>Preparing</span>
                                    <span className={deliveryInfo.currentStatus === 'in_transit' ? 'text-stardust-400' : ''}>In Transit</span>
                                    <span className={deliveryInfo.currentStatus === 'out_for_delivery' ? 'text-stardust-400' : ''}>Out for Delivery</span>
                                    <span className={deliveryInfo.currentStatus === 'delivered' ? 'text-stardust-400' : ''}>Delivered</span>
                                </div>
                            </div>

                            {/* Production Status Badge */}
                            {(deliveryInfo as any).productionStatus === 'completed' && deliveryInfo.currentStatus === 'preparing' && (
                                <div className="mt-6 flex items-center justify-center animate-bounce-slow">
                                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                        <span>🛠️</span>
                                        <span>Toy Production Complete! Awaiting Sleigh...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="glass-card p-8 md:p-10">
                            <h3 className="text-2xl font-display font-bold mb-8 text-stardust-100 border-b border-white/5 pb-4">
                                Delivery Timeline
                            </h3>

                            <div className="space-y-8">
                                {deliveryInfo.status.map((item, index) => (
                                    <div key={index} className="relative pl-10 pb-8 border-l-2 border-white/10 last:border-l-0 last:pb-0">
                                        <div className={`absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-gradient-to-br ${getStatusColor(item.status)} flex items-center justify-center text-lg shadow-lg ring-4 ring-north-pole-800`}>
                                            {getStatusIcon(item.status)}
                                        </div>
                                        <div className="bg-north-pole-800/50 border border-white/5 rounded-xl p-5 hover:bg-north-pole-800 transition-all group hover:border-stardust-500/30">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h4 className="font-bold text-lg text-frost-100 group-hover:text-white transition-colors">
                                                    {item.location}
                                                </h4>
                                                <span className="text-xs font-mono text-stardust-400 whitespace-nowrap bg-north-pole-900 px-2 py-1 rounded">
                                                    {item.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-frost-200/60 text-sm leading-relaxed">
                                                {item.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Future Steps */}
                                {deliveryInfo.currentStatus !== 'delivered' && (
                                    <>
                                        {deliveryInfo.currentStatus !== 'out_for_delivery' && (
                                            <div className="relative pl-10 pb-8 border-l-2 border-dashed border-white/5 opacity-40 grayscale">
                                                <div className="absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-north-pole-700 flex items-center justify-center text-lg ring-4 ring-north-pole-800">
                                                    🎅
                                                </div>
                                                <div className="bg-north-pole-900/50 rounded-xl p-5 border border-white/5">
                                                    <h4 className="font-bold text-lg text-frost-200/60 mb-2">
                                                        Out for Delivery
                                                    </h4>
                                                    <p className="text-frost-200/40 text-sm">
                                                        Santa is on his way to your house!
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="relative pl-10 opacity-40 grayscale">
                                            <div className="absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-north-pole-700 flex items-center justify-center text-lg ring-4 ring-north-pole-800">
                                                ✅
                                            </div>
                                            <div className="bg-north-pole-900/50 rounded-xl p-5 border border-white/5">
                                                <h4 className="font-bold text-lg text-frost-200/60 mb-2">
                                                    Delivered
                                                </h4>
                                                <p className="text-frost-200/40 text-sm">
                                                    Your gifts will be under the tree on Christmas morning!
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="glass-card p-6 bg-gradient-to-r from-stardust-900/20 to-festive-red-900/20 border-stardust-500/20">
                            <div className="flex gap-5 items-start">
                                <div className="text-4xl animate-pulse">ℹ️</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-frost-100">Tracking Information</h4>
                                    <p className="text-frost-200/60 text-sm leading-relaxed">
                                        Your gifts are being carefully monitored throughout their journey.
                                        Updates are provided in real-time as your gifts move from the North Pole to your home.
                                        Remember to leave out cookies and milk for Santa! 🍪🥛
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {searchPerformed && !deliveryInfo && (
                    <div className="glass-card p-12 text-center animate-shake">
                        <div className="text-7xl mb-6 opacity-50 grayscale">😕</div>
                        <h3 className="text-3xl font-display font-bold mb-4 text-frost-100">
                            Tracking Code Not Found
                        </h3>
                        <p className="text-frost-200/60 mb-8 max-w-lg mx-auto">
                            We couldn't find any gifts with that tracking code. Please check your code and try again.
                        </p>
                        <Link
                            to="/user/wishlist"
                            className="btn-primary px-8 py-4 text-lg inline-block"
                        >
                            Create a Wishlist
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackGift;
