import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Shield, Zap, Globe, TrendingUp, CreditCard, Wallet } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-30"></div>
        <div 
          className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen transition-transform duration-75"
          style={{ 
            left: mousePosition.x - 400, 
            top: mousePosition.y - 400,
            opacity: 0.15
          }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Wallet className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Budgeify
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Log In
          </button>
          <button 
            onClick={onEnter}
            className="group relative px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2 text-sm font-semibold">
              Enter Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-fade-in opacity-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">AI-Powered Financial Intelligence v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight tracking-tight mb-8 animate-fade-in opacity-0 [animation-delay:200ms]">
            <span className="block text-white text-glow">Financial Clarity</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-secondary via-white to-primary">
              Beyond Limits
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in opacity-0 [animation-delay:400ms]">
            Experience the next generation of wealth management. Budgeify leverages quantum-ready algorithms to predict, optimize, and grow your assets in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in opacity-0 [animation-delay:600ms]">
            <button 
              onClick={onEnter}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-current border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating Cards Graphic */}
        <div className="mt-24 relative max-w-6xl mx-auto h-[400px] md:h-[600px] perspective-1000 animate-fade-in opacity-0 [animation-delay:800ms]">
            {/* Main Dashboard Preview (Tilted) */}
            <div className="absolute inset-x-0 top-0 mx-auto w-full md:w-[80%] aspect-[16/9] bg-surface rounded-2xl border border-white/10 shadow-2xl transform rotate-x-12 scale-90 opacity-90 transition-transform duration-700 hover:rotate-x-0 hover:scale-100 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                {/* Mock UI Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                {/* Mock UI Content */}
                <div className="p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                         <div className="h-40 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/20 to-transparent"></div>
                             <svg className="w-full h-full p-4" viewBox="0 0 100 40">
                                 <path d="M0 35 Q 20 30 40 20 T 100 10" fill="none" stroke="#7c3aed" strokeWidth="2" />
                             </svg>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="h-24 rounded-xl bg-white/5 border border-white/5"></div>
                             <div className="h-24 rounded-xl bg-white/5 border border-white/5"></div>
                         </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                        <div className="h-full rounded-xl bg-white/5 border border-white/5"></div>
                    </div>
                </div>
                {/* Spotlight Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -left-4 md:left-0 top-20 md:top-40 w-64 p-4 glass-card rounded-2xl animate-float">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="text-green-400 w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Total Yield</p>
                        <p className="text-lg font-bold text-white">+24.5%</p>
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-green-500 rounded-full"></div>
                </div>
            </div>

            <div className="absolute -right-4 md:right-10 top-40 md:top-60 w-56 p-4 glass-card rounded-2xl animate-float [animation-delay:1.5s]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CreditCard className="text-blue-400 w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Metal Card</p>
                        <p className="text-xs text-gray-400">**** 4291</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 max-w-7xl mx-auto py-24">
            <h2 className="text-3xl font-display font-bold text-center mb-16">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                    Engineered for Growth
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Military-Grade Encryption</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Your financial data is protected by AES-256 encryption and biometric authentication layers.
                    </p>
                </div>
                <div className="glass-card p-8 rounded-2xl hover:border-secondary/50 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="text-secondary w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Global Asset Tracking</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Sync accounts from over 40 countries. Real-time currency conversion and market updates.
                    </p>
                </div>
                <div className="glass-card p-8 rounded-2xl hover:border-accent/50 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="text-accent w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Predictive AI Insights</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Our Oracle AI analyzes your spending habits to forecast future wealth and suggest optimizations.
                    </p>
                </div>
            </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                  <Wallet className="text-white w-5 h-5" />
                  <span className="font-bold text-gray-300">Budgeify</span>
              </div>
              <p className="text-gray-500 text-sm">© 2024 Budgeify Financial Technologies. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;