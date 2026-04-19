import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, TrendingUp, Users, Play, Calendar, Globe, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
  onEnterFan: () => void;
}

export default function LandingView({ onEnterApp, onEnterFan }: LandingViewProps) {
  return (
    <div className="relative isolate">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-stadium-navy">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.1),transparent_70%)]" />
        <StadiumHeatmapBG />
      </div>

      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-xl italic tracking-tighter">
            SF
          </div>
          <span className="font-display font-bold text-2xl tracking-tight uppercase">StadiumFlow <span className="text-brand-blue">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Case Studies</a>
          <a href="#" className="hover:text-white transition-colors">Safety</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onEnterApp}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md"
        >
          Book Demo
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue text-xs font-bold uppercase tracking-widest"
            >
              <Zap size={14} className="fill-brand-blue" />
              Trusted by 40+ FIFA World Cup Venues
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase"
            >
              The AI Operating System for <span className="text-white/50">Modern Stadiums</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-lg leading-relaxed"
            >
              Reduce congestion, eliminate long lines, increase fan spending, and coordinate every event in real time with predictive intelligence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={onEnterApp}
                className="group relative flex items-center gap-3 bg-brand-blue hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all blue-glow"
              >
                Launch Simulation
                <Play size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onEnterFan}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-xl"
              >
                Fan Experience
              </button>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <MetricItem value="35%" label="Faster Entry" />
              <MetricItem value="42%" label="Lower Queues" />
              <MetricItem value="28%" label="Higher Spend" />
              <MetricItem value="60%" label="Safety Response" />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-brand-blue/20 blur-3xl rounded-full" />
            <div className="relative glass-card border-white/20 p-4 aspect-square max-w-md mx-auto flex items-center justify-center overflow-hidden">
               <StadiumVisual3D />
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-12 grayscale opacity-40">
             <Globe size={32} />
             <div className="font-black text-2xl tracking-tighter">NIKE</div>
             <div className="font-black text-2xl tracking-tighter">EMIRATES</div>
             <div className="font-black text-2xl tracking-tighter">SAMSUNG</div>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>© 2026 StadiumFlow AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-black text-brand-neon font-display tracking-tight leading-none">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</div>
    </div>
  );
}

function StadiumHeatmapBG() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
      <defs>
        <radialGradient id="heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {[...Array(20)].map((_, i) => (
        <motion.circle
          key={i}
          cx={Math.random() * 1000}
          cy={Math.random() * 1000}
          r={50 + Math.random() * 150}
          fill="url(#heat)"
          animate={{
            cx: [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000],
            cy: [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

function StadiumVisual3D() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
       {/* High-tech stadium wireframe simulation */}
       <div className="w-64 h-40 border-4 border-brand-blue/30 rounded-[3rem] relative flex items-center justify-center transform -rotate-[25deg] skew-x-[15deg] shadow-[0_0_50px_rgba(0,102,255,0.2)]">
          <div className="absolute inset-2 border border-brand-blue/20 rounded-[2.5rem] bg-brand-blue/5" />
          <div className="absolute inset-8 border-2 border-brand-neon/40 rounded-[1.5rem]" />
          <div className="w-4 h-4 bg-brand-neon rounded-full pulse-point" />
          
          {/* Moving dots (Staff/Attendees) */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
       </div>
       
       {/* Scanner lines */}
       <motion.div 
         animate={{ top: ['0%', '100%', '0%'] }}
         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
         className="absolute left-0 right-0 h-px bg-brand-neon/50 shadow-[0_0_10px_#00FF94] z-10"
       />
       
       <div className="absolute bottom-4 left-4 font-mono text-[8px] text-brand-neon/60 space-y-1">
          <div>LOC_ALPHA: 104.92</div>
          <div>DENSITY_IDX: 0.81</div>
          <div>SCAN_MODE: ACTIVE</div>
       </div>
    </div>
  );
}
