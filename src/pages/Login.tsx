import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { LoginCredentials } from '../types';
import { useAuthStore } from '../store/authStore';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
        role: 'admin',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user info via Zustand
            login(data.user);

            // Navigate based on role
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/worker/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-north-pole-950 relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-festive-red-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-evergreen-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stardust-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Snowflakes */}
            <Snowflakes />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md animate-scale-in">
                {/* Back to Home Link */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-stardust-400 hover:text-frost-100 transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-medium tracking-wide uppercase text-sm">Back to Home</span>
                    </Link>
                </div>

                <div className="glass-card p-8 md:p-10 shadow-2xl shadow-north-pole-900/50 border-t border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-7xl mb-4 animate-bounce-slow drop-shadow-lg">🎅</div>
                        <h1 className="text-4xl font-display font-bold mb-2 text-gradient-gold">
                            SantaOS
                        </h1>
                        <p className="text-frost-200/60 font-light tracking-wide uppercase text-sm">Staff Login Portal</p>
                    </div>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${formData.role === 'admin'
                                ? 'bg-stardust-500/20 border-stardust-500 shadow-neon-gold'
                                : 'bg-north-pole-900/50 border-white/5 hover:border-stardust-500/50 hover:bg-north-pole-800'
                                }`}
                        >
                            <span className="text-4xl group-hover:scale-110 transition-transform">🎅</span>
                            <span className={`font-bold uppercase tracking-wider text-sm ${formData.role === 'admin' ? 'text-stardust-400' : 'text-north-pole-400 group-hover:text-frost-100'}`}>Santa</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'worker' })}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${formData.role === 'worker'
                                ? 'bg-evergreen-500/20 border-evergreen-500 shadow-glow-sm'
                                : 'bg-north-pole-900/50 border-white/5 hover:border-evergreen-500/50 hover:bg-north-pole-800'
                                }`}
                        >
                            <span className="text-4xl group-hover:scale-110 transition-transform">🧝</span>
                            <span className={`font-bold uppercase tracking-wider text-sm ${formData.role === 'worker' ? 'text-evergreen-400' : 'text-north-pole-400 group-hover:text-frost-100'}`}>Elf</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <span className="text-xs font-bold text-north-pole-400 uppercase tracking-widest">Credentials</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-festive-red-500/20 border border-festive-red-500 rounded-lg text-festive-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="santa@northpole.com"
                                required
                                className="glass-input w-full px-4 py-3 rounded-xl"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-stardust-400 mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter your password"
                                    required
                                    className="glass-input w-full px-4 py-3 rounded-xl pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-north-pole-400 hover:text-frost-100 transition-colors p-1"
                                >
                                    {showPassword ? '🐵' : '🙈'}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/20 bg-north-pole-900 text-stardust-500 focus:ring-stardust-500 focus:ring-offset-0 transition-all"
                                />
                                <span className="text-north-pole-400 group-hover:text-frost-200 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-stardust-400 hover:text-stardust-300 font-medium transition-colors text-xs uppercase tracking-wide">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${formData.role === 'admin'
                                ? 'btn-gold shadow-neon-gold'
                                : 'bg-evergreen-500 hover:bg-evergreen-400 text-white shadow-glow-sm'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="uppercase tracking-wide text-sm">Accessing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">✨</span>
                                    <span className="uppercase tracking-wide text-sm">Enter Portal</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Christmas Message */}
                    <div className="mt-8 p-4 bg-north-pole-800/50 border border-white/5 rounded-xl text-center">
                        <p className="text-sm text-frost-200/60 font-serif italic">
                            "Making spirits bright, one login at a time"
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-north-pole-500 font-mono uppercase tracking-widest">
                        <p>&copy; 2024 SantaOS. Spreading joy worldwide. 🌍❤️</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Snowflakes Component
const Snowflakes = () => {
    const snowflakes = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        fontSize: `${Math.random() * 10 + 10}px`,
        opacity: Math.random() * 0.5 + 0.3,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute text-white animate-fall"
                    style={{
                        left: flake.left,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        fontSize: flake.fontSize,
                        opacity: flake.opacity,
                    }}
                >
                    ❄️
                </div>
            ))}
            <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
        </div>
    );
};

export default Login;
