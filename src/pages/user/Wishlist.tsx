import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

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

    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (childName && age && wishes.length > 0) {
            setIsSubmitting(true);
            try {
                // Construct the payload for the backend
                const payload = {
                    name: childName,
                    age: parseInt(age),
                    location: location || "Unknown Region", // Default if not provided
                    // We assume new children are "nice" by default, or random? Let's default to 'nice'.
                    status: 'nice',
                    wishes: wishes.map(w => ({
                        item: w.item,
                        priority: w.priority
                    }))
                };

                const response = await fetch('http://localhost:3000/api/wishlists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Failed to send wishlist to Santa');
                }

                // Generate a tracking code
                const code = `SANTA-${Date.now().toString(36).toUpperCase()}`;
                setTrackingCode(code);
                setSubmitted(true);

                // Reset form optionally or just show success screen (current behavior)
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
            case 'high': return 'from-festive-red-500 to-festive-red-700 shadow-neon-red';
            case 'medium': return 'from-stardust-500 to-stardust-700 shadow-neon-gold';
            case 'low': return 'from-evergreen-500 to-evergreen-700 shadow-glow-sm';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getPriorityEmoji = (priority: string) => {
        switch (priority) {
            case 'high': return '⭐';
            case 'medium': return '✨';
            case 'low': return '💫';
            default: return '🌟';
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-north-pole-950 text-white py-20 px-6 font-sans">
                <div className="max-w-3xl mx-auto text-center animate-scale-in">
                    <div className="mb-8 animate-bounce-slow">
                        <span className="text-9xl drop-shadow-2xl filter shadow-gold/20">🎉</span>
                    </div>

                    <h1 className="text-6xl font-display font-bold mb-6 text-gradient-gold drop-shadow-lg">
                        Wishlist Received!
                    </h1>

                    <p className="text-2xl text-frost-100 mb-8 font-light">
                        Ho Ho Ho! Santa has received your wishlist, {childName}! 🎅
                    </p>

                    <div className="glass-card p-10 mb-8 border-stardust-400/30">
                        <p className="text-frost-200/60 mb-4 uppercase tracking-wider text-sm font-bold">Your tracking code:</p>
                        <div className="bg-gradient-to-r from-festive-red-500 via-stardust-500 to-evergreen-500 p-1 rounded-2xl mb-6 shadow-glow">
                            <div className="bg-north-pole-900 rounded-2xl px-8 py-6">
                                <p className="text-4xl font-mono font-bold text-gradient-gold tracking-wider">
                                    {trackingCode}
                                </p>
                            </div>
                        </div>
                        <p className="text-frost-200/60 text-sm font-light">
                            Save this code to track your gifts! You can also check your email for confirmation.
                        </p>
                    </div>

                    <div className="glass-card p-8 mb-12 text-left">
                        <h3 className="text-2xl font-display font-bold mb-6 text-frost-100 border-b border-white/10 pb-4">Your Wishes:</h3>
                        <div className="space-y-4">
                            {wishes.map((wish, index) => (
                                <div key={wish.id} className="flex items-center gap-4 group">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{getPriorityEmoji(wish.priority)}</span>
                                    <span className="text-lg text-frost-100 font-medium">
                                        <span className="text-stardust-400 mr-2">{index + 1}.</span> {wish.item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/user/track"
                            className="btn-primary px-8 py-4 text-lg shadow-glow-sm hover:scale-105 transform"
                        >
                            🎁 Track Your Gifts
                        </Link>
                        <Link
                            to="/"
                            className="px-8 py-4 glass-card hover:bg-white/10 rounded-xl font-bold text-lg text-frost-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>🏠</span> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-north-pole-950 text-white py-20 px-6 font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-96 h-96 bg-festive-red-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-evergreen-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-stardust-400 hover:text-frost-100 transition-colors mb-8 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-medium tracking-wide uppercase text-sm">Back to Home</span>
                    </Link>
                    <div className="mb-6">
                        <span className="text-7xl animate-bounce-slow inline-block drop-shadow-xl">🎅</span>
                    </div>
                    <h1 className="text-6xl font-display font-bold mb-4 text-gradient-gold drop-shadow-sm">
                        Create Your Wishlist
                    </h1>
                    <p className="text-xl text-frost-200/60 max-w-2xl mx-auto font-light">
                        Tell Santa what you'd love to receive this Christmas! Be specific and don't forget to be good! 🎄
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="glass-card p-8 md:p-10">
                        <h2 className="text-3xl font-display font-bold mb-8 text-stardust-100 flex items-center gap-3 pb-4 border-b border-white/5">
                            <span>👤</span> About You
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    placeholder="e.g., Emma Johnson"
                                    required
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:shadow-neon-gold transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    Your Age *
                                </label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="e.g., 8"
                                    min="1"
                                    max="99"
                                    required
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:shadow-neon-gold transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    Your City / Country *
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., London, UK"
                                    required
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:shadow-neon-gold transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    Email (Optional - for tracking updates)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g., parent@example.com"
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:shadow-neon-gold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Wishes */}
                    <div className="glass-card p-8 md:p-10 border-festive-red-500/20">
                        <h2 className="text-3xl font-display font-bold mb-8 text-festive-red-100 flex items-center gap-3 pb-4 border-b border-white/5">
                            <span>🎁</span> Your Wishes
                        </h2>

                        <div className="space-y-6 mb-8 bg-north-pole-900/30 p-6 rounded-2xl border border-white/5">
                            <div>
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    What would you like? *
                                </label>
                                <input
                                    type="text"
                                    value={currentWish}
                                    onChange={(e) => setCurrentWish(e.target.value)}
                                    placeholder="e.g., LEGO Star Wars Set"
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:shadow-neon-red transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                    Tell Santa more about it (Optional)
                                </label>
                                <textarea
                                    value={currentDescription}
                                    onChange={(e) => setCurrentDescription(e.target.value)}
                                    placeholder="e.g., The big Millennium Falcon set with 1000 pieces"
                                    rows={3}
                                    className="glass-input w-full px-4 py-3 rounded-xl resize-none focus:shadow-neon-red transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stardust-400 mb-3 uppercase tracking-wide">
                                    How important is this wish?
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPriority('high')}
                                        className={`px-4 py-4 rounded-xl font-bold uppercase tracking-wide text-xs transition-all duration-300 transform hover:-translate-y-1 ${currentPriority === 'high'
                                            ? 'bg-gradient-to-r from-festive-red-500 to-festive-red-600 text-white shadow-neon-red'
                                            : 'bg-north-pole-800 text-north-pole-400 hover:bg-north-pole-700 hover:text-frost-100 border border-white/5'
                                            }`}
                                    >
                                        ⭐ Most Wanted
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPriority('medium')}
                                        className={`px-4 py-4 rounded-xl font-bold uppercase tracking-wide text-xs transition-all duration-300 transform hover:-translate-y-1 ${currentPriority === 'medium'
                                            ? 'bg-gradient-to-r from-stardust-500 to-stardust-600 text-white shadow-neon-gold'
                                            : 'bg-north-pole-800 text-north-pole-400 hover:bg-north-pole-700 hover:text-frost-100 border border-white/5'
                                            }`}
                                    >
                                        ✨ Would Love
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPriority('low')}
                                        className={`px-4 py-4 rounded-xl font-bold uppercase tracking-wide text-xs transition-all duration-300 transform hover:-translate-y-1 ${currentPriority === 'low'
                                            ? 'bg-gradient-to-r from-evergreen-500 to-evergreen-600 text-white shadow-glow-sm'
                                            : 'bg-north-pole-800 text-north-pole-400 hover:bg-north-pole-700 hover:text-frost-100 border border-white/5'
                                            }`}
                                    >
                                        💫 Nice to Have
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addWish}
                                className="w-full px-6 py-4 btn-secondary text-sm"
                            >
                                ➕ Add to Wishlist
                            </button>
                        </div>

                        {/* Wishes List */}
                        {wishes.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-frost-100 mb-4 flex items-center gap-2">
                                    Your Wishlist <span className="text-sm font-normal text-frost-200/60 bg-white/10 px-2 py-0.5 rounded-full">{wishes.length} {wishes.length === 1 ? 'item' : 'items'}</span>
                                </h3>
                                {wishes.map((wish, index) => (
                                    <div
                                        key={wish.id}
                                        className="bg-north-pole-800/50 border border-white/5 rounded-xl p-5 flex items-start gap-5 hover:bg-north-pole-800 transition-all group hover:border-white/10 hover:shadow-lg"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPriorityColor(wish.priority)} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                                            {getPriorityEmoji(wish.priority)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-frost-100 mb-1 group-hover:text-white transition-colors">
                                                        <span className="text-stardust-400 mr-2">{index + 1}.</span> {wish.item}
                                                    </h4>
                                                    {wish.description && (
                                                        <p className="text-frost-200/60 text-sm leading-relaxed">{wish.description}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeWish(wish.id)}
                                                    className="bg-festive-red-500/10 text-festive-red-400 hover:bg-festive-red-500 hover:text-white transition-all p-2 rounded-lg"
                                                    title="Remove wish"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {wishes.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-7xl mb-6 opacity-20 grayscale">🎁</div>
                                <p className="text-frost-200/40 text-lg">No wishes added yet. Start adding your Christmas wishes above!</p>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-festive-red-500/20 border border-festive-red-500 text-center text-festive-red-200">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={!childName || !age || !location || wishes.length === 0 || isSubmitting}
                            className={`btn-primary px-16 py-6 text-2xl transition-all ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Sending to North Pole...' : '🎅 Send to Santa'}
                        </button>
                        <p className="text-frost-200/40 text-xs mt-4 font-mono uppercase tracking-widest">
                            {wishes.length === 0 ? 'Add at least one wish to submit' : 'Ready to send your wishlist!'}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Wishlist;
