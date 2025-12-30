import { Link } from 'react-router-dom';
import { Globe2, TrendingUp, Package, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main content */}
      <div className="h-full flex flex-col relative z-10">
        {/* Navbar */}
        <nav className="px-8 py-6 flex items-center justify-between backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
              <span className="text-xl">🎅</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SantaOS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/user/about" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/user/faq" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link to="/user/contact" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/login" className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-400 transition-colors">
              Staff Login
            </Link>
          </div>
        </nav>

        {/* Hero section */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>Smart Gift Management</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  Smart Gift Planning
                </span>
                <br />
                <span className="text-slate-300">
                  for Santa's Workshop
                </span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                Create your magical wishlist and let Santa know what you'd love this Christmas! Track your gifts every step of the way from the North Pole to your home.
              </p>

              <div className="flex gap-4">
                <Link
                  to="/user/wishlist"
                  className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:scale-105 transition-all"
                >
                  <span>Create Wishlist</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/user/track"
                  className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold hover:bg-slate-800/80 hover:border-slate-600/50 transition-all"
                >
                  <Package className="w-5 h-5" />
                  <span>Track Your Gift</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">2.5B+</div>
                  <div className="text-sm text-slate-500">Gifts Delivered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">195+</div>
                  <div className="text-sm text-slate-500">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-slate-500">Joy Rate</div>
                </div>
              </div>
            </div>

            {/* Right content - Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="col-span-2 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-900/50">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Smart Wishlist Management</h3>
                <p className="text-slate-400 text-sm">
                  Tell Santa exactly what you want! Create your wishlist and Santa will see it right away at the North Pole 🎄
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/50">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-1 text-white">Global Coverage</h3>
                <p className="text-slate-400 text-xs">
                  Track demand across all regions
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-green-900/50">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-1 text-white">Smart Inventory</h3>
                <p className="text-slate-400 text-xs">
                  Reduce waste & overproduction
                </p>
              </div>

              {/* Card 4 */}
              <div className="col-span-2 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-md rounded-3xl p-6 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400 mb-1">🎄 Christmas 2024</div>
                    <p className="text-slate-400 text-sm">Production deadline approaching</p>
                  </div>
                  <Zap className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom features bar */}
        <div className="px-8 py-6 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Smart System</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Real-Time Updates</span>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 SantaOS • Made with ❤️ at the North Pole
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Home;