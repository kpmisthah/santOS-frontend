import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Mail, Phone, MapPin, Clock, Send, CheckCircle, HelpCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative flex items-center justify-center p-4">
                {/* Animated background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 max-w-2xl w-full text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg shadow-green-900/50">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Message Sent!
                        </span>
                    </h1>
                    <p className="text-2xl text-slate-300 mb-8">
                        Thank you for reaching out! Santa and his team will get back to you soon! 🎅
                    </p>

                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl mb-8">
                        <p className="text-slate-400 leading-relaxed">
                            We typically respond within 24 hours (North Pole time). During the busy Christmas season,
                            it might take a little longer, but we promise to get back to you!
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
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
                <div className="flex-1 px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>We're Here to Help</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Contact Santa
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Have a question or need help? Send us a message and we'll get back to you! 🎄
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                        <Send className="w-6 h-6 text-cyan-400" />
                                        <span>Send Us a Message</span>
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g., Emma Johnson"
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="e.g., you@example.com"
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all cursor-pointer"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="wishlist">Wishlist Question</option>
                                                <option value="tracking">Tracking Issue</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Tell us how we can help you..."
                                                rows={6}
                                                required
                                                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-[1.02] transition-all"
                                        >
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                {/* Direct Contact */}
                                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-6 text-white">Direct Contact</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Email</p>
                                                <a href="mailto:santa@northpole.com" className="text-white hover:text-cyan-400 transition-colors">
                                                    santa@northpole.com
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Phone</p>
                                                <a href="tel:+1-800-SANTA-OS" className="text-white hover:text-cyan-400 transition-colors">
                                                    +1-800-SANTA-OS
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Address</p>
                                                <p className="text-slate-400 text-sm leading-relaxed">
                                                    North Pole Headquarters<br />
                                                    Arctic Circle, 99705
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Office Hours */}
                                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-cyan-400" />
                                        <span>Office Hours</span>
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                                            <span className="text-slate-400">Monday - Friday</span>
                                            <span className="text-white font-semibold">9 AM - 6 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                                            <span className="text-slate-400">Saturday</span>
                                            <span className="text-white font-semibold">10 AM - 4 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-400">Sunday</span>
                                            <span className="text-red-400 font-semibold">Closed</span>
                                        </div>
                                        <div className="pt-4 mt-2 border-t border-slate-700/50">
                                            <p className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                                                * North Pole Time (NPT)<br />
                                                * 24/7 during December
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ Link */}
                                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20">
                                    <HelpCircle className="w-12 h-12 mb-4 text-cyan-400" />
                                    <h4 className="font-bold text-lg mb-2 text-white">Quick Answers</h4>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                        Check our FAQ page for instant answers to common questions!
                                    </p>
                                    <Link
                                        to="/user/faq"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all text-white"
                                    >
                                        <span>View FAQ</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
