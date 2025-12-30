import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, Eye, Users, Globe2, Package, Shield, Zap } from 'lucide-react';

const About = () => {
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
                <div className="flex-1 px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>Learn More About Us</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    About SantaOS
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                                The most advanced Christmas gift management system in the world! 🌟
                            </p>
                        </div>

                        {/* Story Section */}
                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                <p>
                                    For centuries, Santa Claus and his team of dedicated elves have been spreading joy and magic
                                    around the world every Christmas. But as the world grew and technology advanced, Santa knew
                                    it was time to modernize the North Pole's operations.
                                </p>
                                <p>
                                    In 2020, after consulting with the world's brightest tech elves, Santa launched <span className="text-cyan-400 font-bold">SantaOS</span>
                                    - a state-of-the-art gift management system that combines centuries of Christmas magic with
                                    cutting-edge technology.
                                </p>
                                <p>
                                    Today, SantaOS helps millions of children worldwide share their Christmas wishes, track their
                                    gifts in real-time, and experience the magic of Christmas like never before! 🎄✨
                                </p>
                            </div>
                        </div>

                        {/* Mission & Vision */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl hover:border-cyan-500/50 transition-all group">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-900/50">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    To bring joy, wonder, and the magic of Christmas to every child around the world through
                                    innovative technology and timeless traditions.
                                </p>
                            </div>

                            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl hover:border-purple-500/50 transition-all group">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/50">
                                    <Eye className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    A world where every child experiences the wonder of Christmas, where wishes come true,
                                    and where the spirit of giving connects us all.
                                </p>
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl mb-12">
                            <h2 className="text-3xl font-bold mb-10 text-white text-center">Meet the Team</h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center group">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-6xl shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
                                        🎅
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-white">Santa Claus</h4>
                                    <p className="text-cyan-400 mb-3 text-sm uppercase tracking-wider font-semibold">Chief Executive Officer</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Leading Christmas operations for over 1,700 years with unmatched dedication and joy.
                                    </p>
                                </div>

                                <div className="text-center group">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center text-6xl shadow-lg shadow-pink-900/50 group-hover:scale-110 transition-transform">
                                        🤶
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-white">Mrs. Claus</h4>
                                    <p className="text-cyan-400 mb-3 text-sm uppercase tracking-wider font-semibold">Chief Operations Officer</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Ensuring smooth operations and keeping the North Pole running like clockwork.
                                    </p>
                                </div>

                                <div className="text-center group">
                                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center text-6xl shadow-lg shadow-green-900/50 group-hover:scale-110 transition-transform">
                                        🧝
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-white">Head Elf</h4>
                                    <p className="text-cyan-400 mb-3 text-sm uppercase tracking-wider font-semibold">Chief Technology Officer</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Leading a team of 10,000+ elves in gift production and technology innovation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl mb-12">
                            <h2 className="text-3xl font-bold mb-10 text-center">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    By the Numbers
                                </span>
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:bg-slate-900 hover:border-cyan-500/50 transition-all group">
                                    <Globe2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <div className="text-4xl font-bold text-cyan-400 mb-2">195+</div>
                                    <div className="text-slate-400 text-sm uppercase tracking-wide">Countries</div>
                                </div>
                                <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:bg-slate-900 hover:border-blue-500/50 transition-all group">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <div className="text-4xl font-bold text-blue-400 mb-2">2.5B+</div>
                                    <div className="text-slate-400 text-sm uppercase tracking-wide">Gifts Delivered</div>
                                </div>
                                <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:bg-slate-900 hover:border-green-500/50 transition-all group">
                                    <Users className="w-12 h-12 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
                                    <div className="text-4xl font-bold text-green-400 mb-2">10,000+</div>
                                    <div className="text-slate-400 text-sm uppercase tracking-wide">Elves Working</div>
                                </div>
                                <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:bg-slate-900 hover:border-yellow-500/50 transition-all group">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                                    <div className="text-slate-400 text-sm uppercase tracking-wide">Joy Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Technology */}
                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl mb-12">
                            <h2 className="text-3xl font-bold mb-8 text-white">Our Technology</h2>
                            <p className="text-slate-300 mb-6 text-lg">
                                SantaOS is powered by a unique blend of Christmas magic and modern technology:
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900 hover:border-cyan-500/30 transition-all">
                                    <div className="text-4xl">✨</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Magic-Powered Cloud</h4>
                                        <p className="text-slate-400 text-sm">Our servers run on pure Christmas spirit and renewable North Pole energy</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900 hover:border-cyan-500/30 transition-all">
                                    <div className="text-4xl">🦌</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Reindeer GPS</h4>
                                        <p className="text-slate-400 text-sm">Real-time tracking powered by Rudolph's nose and satellite technology</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900 hover:border-cyan-500/30 transition-all">
                                    <div className="text-4xl">🎁</div>
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Smart Gift Matching</h4>
                                        <p className="text-slate-400 text-sm">Advanced algorithms help match the perfect gift to every child</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900 hover:border-cyan-500/30 transition-all">
                                    <Shield className="w-10 h-10 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-bold mb-2">Elf-Level Security</h4>
                                        <p className="text-slate-400 text-sm">Your wishes are protected by the most secure magic in the world</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center">
                            <h3 className="text-3xl font-bold mb-8">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Ready to Experience the Magic?
                                </span>
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/user/wishlist"
                                    className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Create Your Wishlist</span>
                                </Link>
                                <Link
                                    to="/user/contact"
                                    className="px-10 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold hover:bg-slate-800/80 hover:border-slate-600/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5" />
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
