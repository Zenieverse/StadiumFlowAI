import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertOctagon, ShieldAlert, Phone, Map, 
  ChevronsRight, Lock, Unlock, Zap,
  Wifi, Radio, MessageSquare, Megaphone
} from 'lucide-react';

export default function EmergencyModeView({ onDeactivate }: { onDeactivate: () => void }) {
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 min
  const [confirming, setConfirming] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setSecondsRemaining(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDeactivate = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // Reset after 3 seconds
      return;
    }
    onDeactivate();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-red-950/20 flex flex-col overflow-hidden relative isolate">
      {/* Red Pulse Overlay */}
      <div className="absolute inset-0 bg-brand-alert/5 animate-pulse -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,59,48,0.15),transparent_80%)] -z-10 pointer-events-none" />
      
      {/* Scanning Bar */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-1 bg-brand-alert/50 shadow-[0_0_20px_#FF3B30] z-50 pointer-events-none"
      />

      {/* Emergency Header */}
      <header className="h-20 bg-brand-alert text-white flex items-center justify-between px-8 shadow-2xl z-20">
         <div className="flex items-center gap-4">
            <AlertOctagon size={32} className="animate-bounce" />
            <div>
               <h1 className="font-display font-black text-2xl uppercase tracking-tighter leading-none">Emergency Protocol <span className="opacity-70 italic">Activated</span></h1>
               <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Level 4 Crisis - Crowd Surge North Gate</div>
            </div>
         </div>
         <div className="flex flex-col items-end">
            <div className="text-4xl font-mono font-black italic">{formatTime(secondsRemaining)}</div>
            <div className="text-[8px] font-bold uppercase tracking-widest">Protocol Timer</div>
         </div>
      </header>

      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
         {/* Live Simulation Map */}
         <div className="col-span-12 lg:col-span-7 relative h-full glass-card border-brand-alert/30 bg-black/40 p-0 overflow-hidden">
             <div className="absolute top-4 left-4 z-10 space-y-2">
                <div className="bg-brand-alert px-3 py-1.5 rounded-lg border border-white/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   Live Attendee Evacuation Simulation
                </div>
             </div>
             
             {/* Map Placeholder */}
             <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-[80%] h-[60%] border-4 border-brand-alert/20 rounded-[4rem] relative">
                   {/* Flow arrows */}
                   {[...Array(20)].map((_, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ 
                         opacity: [0, 1, 0], 
                         x: [Math.random() * 200, Math.random() * 200 + 100],
                         y: [Math.random() * 200, Math.random() * 200]
                       }}
                       transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                       className="absolute text-brand-alert"
                     >
                       <ChevronsRight size={24} />
                     </motion.div>
                   ))}
                   
                   {/* Zones */}
                   <div className="absolute top-10 left-10 w-20 h-20 border-2 border-brand-alert/50 bg-brand-alert/10 rounded-2xl flex items-center justify-center p-2 text-[10px] font-black uppercase text-center text-brand-alert">
                      ZONE_A LOCKED
                   </div>
                </div>
             </div>

             <div className="absolute bottom-6 left-6 right-6 flex gap-4 pointer-events-auto">
                <EmergencyAction icon={<Megaphone size={18} />} label="PA Broadcast" count="Active" />
                <EmergencyAction icon={<Phone size={18} />} label="Rescue Dispatch" count="12 Units" />
                <EmergencyAction icon={<Lock size={18} />} label="Seal Perimeter" count="Engaged" />
             </div>
         </div>

         {/* Sidebar Controls */}
         <div className="col-span-12 lg:col-span-5 space-y-6 flex flex-col h-full overflow-hidden">
            <div className="glass-card bg-brand-alert/5 border-brand-alert/30 p-6 space-y-4">
               <h3 className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2 text-brand-alert">
                  <ShieldAlert size={20} />
                  System Lockdown Status
               </h3>
               <div className="space-y-3">
                  <StatusRow label="Ticketing Gates" status="CLOSED/REVERSED" active />
                  <StatusRow label="Smart Navigation" status="EVAC_MODE" active />
                  <StatusRow label="Network Priority" status="EMERGENCY_DATA" active />
                  <StatusRow label="Power Grid" status="REDUNDANT_ON" active />
               </div>
            </div>

            <div className="glass-card flex-1 overflow-y-auto p-6 space-y-4 border-white/5">
                <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500">Multilingual Alerts Pushed</h3>
                <AlertFeedItem lang="ENGLISH" msg="EVACUATE NOW VIA NORTH EXIT UNLOCKING IN 5 SECONDS" />
                <AlertFeedItem lang="SPANISH" msg="EVACUE AHORA POR LA SALIDA NORTE" />
                <AlertFeedItem lang="FRENCH" msg="ÉVACUEZ MAINTENANT PAR LA SORTIE NORD" />
                <AlertFeedItem lang="GERMAN" msg="JETZT ÜBER DEN NÖRDLICHEN AUSGANG EVAKUIEREN" />
            </div>

            <button 
              onClick={handleDeactivate}
              className={`w-full p-5 rounded-2xl font-black text-lg uppercase tracking-tighter transition-all flex items-center justify-center gap-3 ${
                confirming 
                  ? "bg-brand-neon text-black scale-[0.98] ring-4 ring-brand-neon/40" 
                  : "bg-white text-brand-alert hover:bg-gray-200"
              }`}
            >
              {confirming ? <Zap size={24} className="animate-bounce" /> : <Unlock size={24} />}
              {confirming ? "Confirm Deactivation" : "Deactivate Emergency Protocol"}
            </button>
         </div>
      </div>
    </div>
  );
}

function EmergencyAction({ icon, label, count }: { icon: any, label: string, count: string }) {
  return (
    <div className="flex-1 bg-black/60 backdrop-blur-xl border border-brand-alert/30 p-4 rounded-2xl flex flex-col items-center gap-2">
       <div className="text-brand-alert">{icon}</div>
       <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
       <span className="text-[10px] text-gray-500 font-bold uppercase">{count}</span>
    </div>
  );
}

function StatusRow({ label, status, active }: { label: string, status: string, active?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-brand-alert/10">
       <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight">{label}</span>
       <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-brand-alert' : 'text-gray-500'}`}>{status}</span>
    </div>
  );
}

function AlertFeedItem({ lang, msg }: { lang: string, msg: string }) {
  return (
    <div className="p-3 bg-brand-alert/10 rounded-xl border border-brand-alert/20 space-y-1">
       <div className="text-[8px] font-black text-brand-alert uppercase tracking-[0.2em]">{lang}</div>
       <p className="text-[11px] font-bold text-white leading-tight uppercase tracking-tight">{msg}</p>
    </div>
  );
}
