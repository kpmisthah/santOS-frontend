import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Sparkles, Lock, Mail } from 'lucide-react';
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

    const handleSubmit = async (e: React.FormEvent) => {
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
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative flex items-center justify-center p-4">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Floating snowflakes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-white text-2xl"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    >
                        ❄️
                    </div>
                ))}
            </div>

            {/* Christmas decorations */}
            <div className="absolute top-8 left-8 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🎄</div>
            <div className="absolute top-8 right-8 text-4xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🎁</div>
            <div className="absolute bottom-8 left-8 text-4xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>⭐</div>
            <div className="absolute bottom-8 right-8 text-4xl animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>🔔</div>

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding */}
                    <div className="hidden lg:block space-y-6">
                        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group mb-8">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50">
                                <span className="text-3xl">🎅</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    SantaOS
                                </h1>
                                <p className="text-slate-400 text-sm">Analytics Platform</p>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            Welcome to the<br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                                North Pole Command Center
                            </span>
                        </h2>

                        <p className="text-slate-400 text-lg leading-relaxed">
                            Access your dashboard to manage gift production, track wishlists, and spread joy around the world this Christmas season.
                        </p>

                        <div className="flex items-center gap-6 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-slate-400">System Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-slate-400">AI Powered</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full">
                        {/* Mobile back button */}
                        <button onClick={() => window.history.back()} className="lg:hidden inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group mb-6">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </button>

                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-700/50 shadow-2xl">
                            {/* Mobile header */}
                            <div className="lg:hidden text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50 mx-auto mb-4">
                                    <span className="text-3xl">🎅</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                    SantaOS Login
                                </h2>
                                <p className="text-slate-400 text-sm">Access your dashboard</p>
                            </div>

                            {/* Role Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-300 mb-4">Select Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 group ${formData.role === 'admin'
                                            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-900/50'
                                            : 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-900/80'
                                            }`}
                                    >
                                        <span className="text-4xl group-hover:scale-110 transition-transform">🎅</span>
                                        <span className={`font-bold text-sm ${formData.role === 'admin' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                                            }`}>
                                            Santa Admin
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'worker' })}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 group ${formData.role === 'worker'
                                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-900/50'
                                            : 'bg-slate-900/50 border-slate-700/50 hover:border-green-500/30 hover:bg-slate-900/80'
                                            }`}
                                    >
                                        <span className="text-4xl group-hover:scale-110 transition-transform">🧝</span>
                                        <span className={`font-bold text-sm ${formData.role === 'worker' ? 'text-green-400' : 'text-slate-400 group-hover:text-slate-300'
                                            }`}>
                                            Elf Worker
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Login Form */}
                            <div className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="santa@northpole.com"
                                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-12 py-3.5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Enter your password"
                                            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-12 py-3.5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 transition-all"
                                        />
                                        <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                                    </label>
                                    <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${formData.role === 'admin'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02]'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-900/50 hover:shadow-xl hover:scale-[1.02]'
                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Logging in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Access Dashboard</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                                <p className="text-sm text-slate-500">
                                    🎄 Spreading joy worldwide • © 2024 SantaOS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;