import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { ArrowLeft, Plus, X, Sparkles, Gift, MapPin, User, Calendar, Copy, Check } from 'lucide-react';

interface WishItem {
    id: string;
    item: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

const Wishlist = () => {
    const [childName, setChildName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [wishes, setWishes] = useState<WishItem[]>([]);
    const [currentWish, setCurrentWish] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');
    const [currentPriority, setCurrentPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [submitted, setSubmitted] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const addWish = () => {
        if (currentWish.trim()) {
            const newWish: WishItem = {
                id: Date.now().toString(),
                item: currentWish,
                description: currentDescription,
                priority: currentPriority
            };
            setWishes([...wishes, newWish]);
            setCurrentWish('');
            setCurrentDescription('');
            setCurrentPriority('medium');
        }
    };

    const removeWish = (id: string) => {
        setWishes(wishes.filter(wish => wish.id !== id));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (childName && age && wishes.length > 0) {
            setIsSubmitting(true);
            try {
                const payload = {
                    name: childName,
                    age: parseInt(age),
                    location: location || "Unknown Region",
                    status: 'nice',
                    wishes: wishes.map(w => ({
                        item: w.item,
                        priority: w.priority
                    }))
                };

                const data = await apiClient.post('/wishlists', payload);
                setTrackingCode(data.trackingCode || `SANTA-${Date.now().toString(36).toUpperCase()}`);
                setSubmitted(true);
            } catch (err: any) {
                console.error("Submission error:", err);
                setError(err.message || 'Something went wrong. Santa could not receive your list.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'from-red-500 to-red-600';
            case 'medium': return 'from-cyan-500 to-blue-600';
            case 'low': return 'from-green-500 to-emerald-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getPriorityBorder = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-500/50';
            case 'medium': return 'border-cyan-500/50';
            case 'low': return 'border-green-500/50';
            default: return 'border-slate-500/50';
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative flex items-center justify-center p-4">
                {/* Animated background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg shadow-green-900/50">
                            <Check className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Wishlist Received!
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400">
                            Ho Ho Ho! Santa has received your wishlist, {childName}! 🎅
                        </p>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl mb-6">
                        <p className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Your Tracking Code</p>
                        <div className="bg-slate-900/50 rounded-2xl p-6 mb-4 border border-cyan-500/30">
                            <p className="text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center tracking-wider">
                                {trackingCode}
                            </p>
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${copied
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-900/50'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-900/50 hover:scale-[1.02]'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    <span>Copy Tracking Code</span>
                                </>
                            )}
                        </button>

                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                            <p className="text-yellow-400 text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Save this code to track your gifts later!</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl mb-6">
                        <h3 className="text-xl font-bold mb-4 text-slate-200">Your Wishes:</h3>
                        <div className="space-y-3">
                            {wishes.map((wish, index) => (
                                <div key={wish.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getPriorityColor(wish.priority)} flex items-center justify-center text-sm font-bold shadow-lg`}>
                                        {index + 1}
                                    </div>
                                    <span className="text-slate-200 flex-1">{wish.item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/user/track"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <Gift className="w-5 h-5" />
                            <span>Track Your Gifts</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold hover:bg-slate-800/80 hover:border-slate-600/50 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                                <span>Smart Wishlist System</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Create Your Wishlist
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Tell Santa what you'd love to receive this Christmas! Be specific and don't forget to be good! 🎄
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <User className="w-6 h-6 text-cyan-400" />
                                    <span>About You</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name *</label>
                                        <input
                                            type="text"
                                            value={childName}
                                            onChange={(e) => setChildName(e.target.value)}
                                            placeholder="e.g., Emma Johnson"
                                            required
                                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Your Age *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="e.g., 8"
                                                min="1"
                                                max="99"
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Your City / Country *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g., London, UK"
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add Wishes */}
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Gift className="w-6 h-6 text-cyan-400" />
                                    <span>Your Wishes</span>
                                </h2>

                                <div className="space-y-4 mb-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">What would you like? *</label>
                                        <input
                                            type="text"
                                            value={currentWish}
                                            onChange={(e) => setCurrentWish(e.target.value)}
                                            placeholder="e.g., LEGO Star Wars Set"
                                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">Tell Santa more (Optional)</label>
                                        <textarea
                                            value={currentDescription}
                                            onChange={(e) => setCurrentDescription(e.target.value)}
                                            placeholder="e.g., The big Millennium Falcon set with 1000 pieces"
                                            rows={3}
                                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 resize-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-3">Priority Level</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPriority('high')}
                                                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${currentPriority === 'high'
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-900/50 scale-105'
                                                        : 'bg-slate-900/50 border border-slate-700/50 hover:border-red-500/30 hover:bg-slate-900/80'
                                                    }`}
                                            >
                                                ⭐ High
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPriority('medium')}
                                                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${currentPriority === 'medium'
                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/50 scale-105'
                                                        : 'bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-900/80'
                                                    }`}
                                            >
                                                ✨ Medium
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPriority('low')}
                                                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${currentPriority === 'low'
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-900/50 scale-105'
                                                        : 'bg-slate-900/50 border border-slate-700/50 hover:border-green-500/30 hover:bg-slate-900/80'
                                                    }`}
                                            >
                                                💫 Low
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addWish}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Add to Wishlist</span>
                                    </button>
                                </div>

                                {/* Wishes List */}
                                {wishes.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                            Your Wishlist
                                            <span className="text-sm font-normal text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
                                                {wishes.length} {wishes.length === 1 ? 'item' : 'items'}
                                            </span>
                                        </h3>
                                        {wishes.map((wish, index) => (
                                            <div
                                                key={wish.id}
                                                className={`bg-slate-900/50 border ${getPriorityBorder(wish.priority)} rounded-xl p-4 flex items-start gap-4 hover:bg-slate-900 transition-all group`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getPriorityColor(wish.priority)} flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-100 mb-1">{wish.item}</h4>
                                                    {wish.description && (
                                                        <p className="text-slate-400 text-sm">{wish.description}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeWish(wish.id)}
                                                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all p-2 rounded-lg opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {wishes.length === 0 && (
                                    <div className="text-center py-12 opacity-50">
                                        <Gift className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                        <p className="text-slate-500">No wishes added yet. Start adding your Christmas wishes above!</p>
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={!childName || !age || !location || wishes.length === 0 || isSubmitting}
                                    className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-lg ${isSubmitting
                                            ? 'bg-slate-700 cursor-wait'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02]'
                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending to North Pole...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Send to Santa</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-slate-500 text-sm mt-4">
                                    {wishes.length === 0 ? 'Add at least one wish to submit' : 'Ready to send your wishlist!'}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
