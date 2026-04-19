import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingView from './components/LandingView';
import OpsDashboardView from './components/OpsDashboardView';
import FanAppView from './components/FanAppView';
import EmergencyModeView from './components/EmergencyModeView';

export type ViewState = 'landing' | 'ops' | 'fan' | 'emergency';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isEmergency, setIsEmergency] = useState(false);

  // Global monitoring for emergency trigger
  useEffect(() => {
    if (isEmergency) {
      setCurrentView('emergency');
    } else if (currentView === 'emergency') {
      setCurrentView('ops');
    }
  }, [isEmergency]);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView onEnterApp={() => setCurrentView('ops')} onEnterFan={() => setCurrentView('fan')} />;
      case 'ops':
        return <OpsDashboardView onToggleEmergency={() => setIsEmergency(!isEmergency)} onBack={() => setCurrentView('landing')} />;
      case 'fan':
        return <FanAppView onBack={() => setCurrentView('landing')} />;
      case 'emergency':
        return <EmergencyModeView onDeactivate={() => setIsEmergency(false)} />;
      default:
        return <LandingView onEnterApp={() => setCurrentView('ops')} onEnterFan={() => setCurrentView('fan')} />;
    }
  };

  return (
    <div className="min-h-screen bg-stadium-navy selection:bg-brand-blue/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
           key={currentView}
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 1.02 }}
           transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
           className="w-full min-h-screen"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      
      {/* Perspective Switcher (Meta-Control for Demo) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full z-50">
        <button 
          onClick={() => { setCurrentView('landing'); setIsEmergency(false); }}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${currentView === 'landing' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Landing
        </button>
        <button 
          onClick={() => { setCurrentView('ops'); setIsEmergency(false); }}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${currentView === 'ops' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Operations
        </button>
        <button 
          onClick={() => { setCurrentView('fan'); setIsEmergency(false); }}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${currentView === 'fan' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Fan App
        </button>
        <button 
          onClick={() => setIsEmergency(!isEmergency)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${isEmergency ? 'bg-brand-alert animate-pulse text-white' : 'text-brand-alert/70 hover:text-brand-alert'}`}
        >
          {isEmergency ? 'Deactivate Alert' : 'Trigger Alert'}
        </button>
      </div>
    </div>
  );
}
