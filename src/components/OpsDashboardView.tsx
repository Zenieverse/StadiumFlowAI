import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Map as MapIcon, Users, ShieldAlert, 
  Settings, Bell, Search, Activity, CornerDownRight,
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  ChevronRight, BrainCircuit, Wrench, UserCheck, MessageSquare,
  BarChart3, PieChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { geminiService } from '../services/geminiService';
import Toast, { ToastType } from './Toast';

const mockChartData = [
  { time: '18:00', crowd: 12000, trend: 10000 },
  { time: '18:15', crowd: 24000, trend: 22000 },
  { time: '18:30', crowd: 45000, trend: 40000 },
  { time: '18:45', crowd: 68000, trend: 55000 },
  { time: '19:00', crowd: 71000, trend: 70000 },
  { time: '19:15', crowd: 72000, trend: 72000 },
];

export default function OpsDashboardView({ onToggleEmergency, onBack }: { onToggleEmergency: () => void, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('map');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [mapMode, setMapMode] = useState<'3d' | 'heatmap'>('heatmap');
  const [attendance, setAttendance] = useState(72042);
  
  const [alerts, setAlerts] = useState([
    { id: '1', severity: 'critical' as const, title: "Crowd Surge: Gate A", time: "2m ago", desc: "Density exceeds safety threshold (0.92). Overflow required.", icon: <AlertTriangle size={14} />, status: 'active' },
    { id: '2', severity: 'medium' as const, title: "Section 112 Spill", time: "8m ago", desc: "Liquid spill detected by Vision Node 42. Janitorial dispatched.", icon: <Wrench size={14} />, status: 'active' },
    { id: '3', severity: 'low' as const, title: "Wait Time Alarm", time: "12m ago", desc: "Burger Stand 3 exceeds 10m wait SLA. Recommendation: Push mobile deal.", icon: <Clock size={14} />, status: 'active' },
    { id: '4', severity: 'medium' as const, title: "Medical Assistance", time: "15m ago", desc: "User reported chest pain in Section 208. Medic 4 responding.", icon: <ShieldAlert size={14} />, status: 'active' },
  ]);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAlertAction = (id: string, action: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a));
    showToast(`Alert ${id} ${action}ed successfully`, 'success');
  };

  const fetchAIInsight = async () => {
    setIsLoadingInsight(true);
    const insight = await geminiService.getOperatorInsights(
      "Analyze the current stadium flow. We are at peak capacity. Suggest optimizations for exit flow in 20 minutes.",
      { attendance: 72000, capacity: 75000, gateStatus: 'All Open', weather: 'Rain starting' }
    );
    setAiInsight(insight);
    setIsLoadingInsight(false);
    showToast("AI Analysis Updated", "info");
  };

  useEffect(() => {
    fetchAIInsight();
    const interval = setInterval(() => {
      setAttendance(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (activeTab === 'map') {
      return (
        <div className="space-y-6">
          <div className="glass-card h-[500px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-900/5 transition-opacity duration-700" style={{ opacity: mapMode === '3d' ? 0.3 : 0.05 }} />
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button 
                onClick={() => setMapMode('3d')}
                className={`${mapMode === '3d' ? 'bg-brand-blue border-brand-blue/30' : 'bg-black/60 border-white/10'} hover:bg-black/80 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all`}
              >
                3D Overlay
              </button>
              <button 
                onClick={() => setMapMode('heatmap')}
                className={`${mapMode === 'heatmap' ? 'bg-brand-blue border-brand-blue/30' : 'bg-black/60 border-white/10'} hover:bg-black/80 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all`}
              >
                Heatmap Mode
              </button>
            </div>
            
            <div className="w-full h-full p-10 flex items-center justify-center">
              <StadiumMap mode={mapMode} />
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-3 pointer-events-auto w-64">
                <h4 className="text-xs font-bold uppercase text-gray-400">Sector 4 Insight</h4>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-black font-mono">82%</div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Congestion Index</div>
                  </div>
                  <div className="w-24 h-8 bg-gray-800 rounded-lg overflow-hidden flex items-center px-2">
                    <div className="w-full h-1 bg-gray-700 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '82%' }}
                        className="h-full bg-brand-blue rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest pointer-events-auto">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-blue" /> Normal</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-neon" /> Efficient</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-alert" /> Critical</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-neon" />
                  Crowd Ingress Forecast
                </h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Next 60 Mins</span>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorCrowd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#151B2E', border: '1px solid #ffffff10', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="crowd" stroke="#0066FF" fillOpacity={1} fill="url(#colorCrowd)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                  <BrainCircuit size={16} className="text-brand-blue" />
                  Halftime Prediction
                </h3>
                <button onClick={fetchAIInsight} className="text-brand-blue hover:text-blue-400 transition-colors">
                  <motion.div animate={{ rotate: isLoadingInsight ? 360 : 0 }} transition={{ repeat: isLoadingInsight ? Infinity : 0, duration: 1, ease: 'linear' }}>
                    <Activity size={14} />
                  </motion.div>
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar">
                {isLoadingInsight ? (
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-brand-blue w-1/2" animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                    </div>
                    <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-brand-blue w-1/2" animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-brand-blue pl-4 py-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={aiInsight}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                      >
                         {aiInsight || "Analyzing vendor patterns and historic peaks..."}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
                {!isLoadingInsight && aiInsight && (
                   <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest pt-2">
                      <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col gap-1">
                         <span className="text-gray-500">Wait Peak</span>
                         <span className="text-brand-alert">8.2 min @ 19:42</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col gap-1">
                         <span className="text-gray-500">Staff Offset</span>
                         <span className="text-brand-neon">+12 Units req.</span>
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-card flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 min-h-[500px]">
        <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
           {activeTab === 'analytics' ? <BarChart3 size={40} /> : activeTab === 'roi' ? <PieChart size={40} /> : <Activity size={40} />}
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-display font-bold uppercase tracking-tight">{activeTab.replace('-', ' ')} Hub</h2>
           <p className="text-gray-400 max-w-sm">This module is aggregating cross-sector data. Live ingestion active for {attendance} attendees.</p>
        </div>
        <button onClick={() => showToast(`Synchronizing ${activeTab} data...`, 'info')} className="bg-brand-blue px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Initialize Sync</button>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-stadium-navy text-white overflow-hidden">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-3xl flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={onBack}>
          <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center font-bold italic tracking-tighter group-hover:scale-110 transition-transform">ST</div>
          <span className="font-display font-bold text-lg tracking-tight uppercase">Flow <span className="text-brand-blue">AI</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<MapIcon size={18} />} label="Live Venue Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <NavItem icon={<Activity size={18} />} label="Analytics Hub" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<ShieldAlert size={18} />} label="Security Ops" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <NavItem icon={<Users size={18} />} label="Workforce Sync" active={activeTab === 'workforce'} onClick={() => setActiveTab('workforce')} />
          <NavItem icon={<LayoutDashboard size={18} />} label="Executive ROI" active={activeTab === 'roi'} onClick={() => setActiveTab('roi')} />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={onToggleEmergency}
            className="w-full flex items-center justify-center gap-3 bg-brand-alert/10 hover:bg-brand-alert/20 text-brand-alert border border-brand-alert/20 p-3 rounded-lg transition-all font-bold text-xs uppercase tracking-wider relative overflow-hidden group"
          >
            <ShieldAlert size={16} className="group-hover:scale-125 transition-transform" />
            EMERGENCY PROTOCOL
            <motion.div animate={{ opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-brand-alert/20 pointer-events-none" />
          </button>
          <div className="flex items-center gap-3 px-2 text-gray-400">
            <Settings size={18} className="hover:text-white cursor-pointer transition-colors" onClick={() => showToast("Settings Module Locked to Root Admin", "error")} />
            <Bell size={18} className="hover:text-white cursor-pointer transition-colors" onClick={() => showToast("Active Alerts Notification Service Initialized", "success")} />
            <div className="ml-auto w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-neon p-px cursor-pointer" onClick={() => showToast("Operator Profile: Level A Access")}>
               <div className="w-full h-full rounded-full bg-stadium-navy flex items-center justify-center text-[10px] font-bold">ST</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-stadium-navy/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-display font-bold uppercase tracking-tight">Intelligence <span className="text-brand-blue">LIVE</span></h2>
             <div className="flex items-center gap-2 px-2 py-0.5 bg-brand-neon/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-neon pulse-point" />
                <span className="text-[10px] font-bold text-brand-neon uppercase tracking-widest">Operational Ready</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <MetricHeader label="Attendance" value={attendance.toLocaleString()} trend="+0.4%" />
             <MetricHeader label="Avg Wait" value="4.2m" trend="-12%" good />
             <MetricHeader label="Revenue/Hr" value="$184K" trend="+22%" good />
          </div>
        </header>

        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
           {/* Center Panel (Map/Main Content) */}
           <div className="col-span-12 lg:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div 
                   key={activeTab}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Right Panel (Alerts & Workforce) */}
           <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="glass-card flex-1 flex flex-col min-h-0 h-[450px]">
                 <div className="p-4 border-b border-white/5 flex justify-between items-center sticky top-0 bg-stadium-card/80 backdrop-blur-md z-10 rounded-t-xl">
                    <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                       <Bell size={14} className="text-brand-blue" />
                       Active Alerts
                    </h3>
                    <span className="bg-brand-alert px-1.5 rounded text-[8px] font-black">{alerts.filter(a => a.status === 'active').length} NEW</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence>
                      {alerts.filter(a => a.status === 'active').map(alert => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCard 
                            {...alert} 
                            onAcknowledge={() => handleAlertAction(alert.id, 'acknowledge')}
                            onDispatch={() => handleAlertAction(alert.id, 'dispatch')}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {alerts.filter(a => a.status === 'active').length === 0 && (
                       <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 opacity-50">
                          <CheckCircle2 size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">All Clear</span>
                       </div>
                    )}
                 </div>
              </div>

              <div className="glass-card p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                       <UserCheck size={16} className="text-brand-neon" />
                       Workforce Sync
                    </h3>
                    <button 
                      onClick={() => showToast("Broadcasting directive to all staff...", "info")}
                      className="text-[9px] text-brand-blue border border-brand-blue/30 px-2 py-0.5 rounded hover:bg-brand-blue/10 transition-colors"
                    >
                      Broadcast
                    </button>
                  </div>
                  <div className="space-y-4">
                     <StaffStatusItem role="Security Alpha" available={14} busy={6} trend="up" />
                     <StaffStatusItem role="Medical Unit" available={4} busy={2} trend="stable" />
                     <StaffStatusItem role="Facility Care" available={8} busy={12} trend="down" color="#00FF94" />
                  </div>
                  <button 
                    onClick={() => showToast("Opening Full Stack Command Center...", "success")}
                    className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group transition-all"
                  >
                     Open Global Control
                     <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${active ? 'bg-brand-blue text-white blue-glow shadow-[0_0_20px_rgba(0,102,255,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <div className={active ? 'text-white' : 'text-gray-500 group-hover:text-brand-blue transition-colors'}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function MetricHeader({ label, value, trend, good }: { label: string, value: string, trend: string, good?: boolean }) {
  return (
    <div className="flex flex-col items-end">
       <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{label}</span>
       <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-display">{value}</span>
          <span className={`text-[10px] font-bold ${good ? 'text-brand-neon' : 'text-brand-alert'}`}>{trend}</span>
       </div>
    </div>
  );
}

function AlertCard({ severity, title, time, desc, icon, onAcknowledge, onDispatch }: { 
  severity: 'low' | 'medium' | 'critical', 
  title: string, 
  time: string, 
  desc: string, 
  icon: any,
  onAcknowledge?: () => void,
  onDispatch?: () => void 
}) {
  const colors = {
    low: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    medium: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500',
    critical: 'border-brand-alert/50 bg-brand-alert/10 text-brand-alert'
  };
  
  return (
    <div className={`p-4 rounded-xl border ${colors[severity]} space-y-3 relative overflow-hidden group`}>
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-tight">
             {icon}
             {title}
          </div>
          <span className="text-[9px] opacity-60 font-mono tracking-tighter">{time}</span>
       </div>
       <p className="text-[10px] leading-relaxed opacity-80 font-medium">{desc}</p>
       <div className="flex gap-2">
          <button 
            onClick={onAcknowledge}
            className="flex-1 bg-white/10 hover:bg-white/20 px-2 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider border border-white/5 transition-colors"
          >
            Acknowledge
          </button>
          <button 
            onClick={onDispatch}
            className="flex-1 bg-white/10 hover:bg-white/20 px-2 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider border border-white/5 transition-colors"
          >
            Dispatch
          </button>
       </div>
    </div>
  );
}

function StaffStatusItem({ role, available, busy, trend, color = '#0066FF' }: { role: string, available: number, busy: number, trend: 'up' | 'down' | 'stable', color?: string }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <span>{role}</span>
          <span className="text-gray-500">{available + busy} Active</span>
       </div>
       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
          <div style={{ width: `${(available/(available+busy))*100}%`, backgroundColor: color }} className="h-full" />
       </div>
       <div className="flex justify-between text-[9px] font-mono text-gray-500">
          <span style={{ color: color }}>{available} Available</span>
          <span>{busy} Busy</span>
       </div>
    </div>
  );
}

function StadiumMap({ mode }: { mode: '3d' | 'heatmap' }) {
  return (
    <div className="relative w-full max-w-[400px] aspect-square transition-all duration-700" style={{ transform: mode === '3d' ? 'rotateX(45deg) rotateZ(-15deg) scale(0.9)' : 'none', perspective: '1000px' }}>
       <div className={`absolute inset-0 border-[20px] rounded-[5rem] transition-all duration-700 shadow-2xl ${mode === '3d' ? 'border-brand-blue/30 bg-blue-900/10' : 'border-brand-blue/15 shadow-[inset_0_0_50px_rgba(0,102,255,0.1)]'}`} />
       <div className="absolute inset-8 border-[10px] border-brand-blue/5 rounded-[4rem]" />
       <div className="absolute inset-[6rem] border border-brand-blue/5 rounded-[3rem] bg-brand-blue/5 flex items-center justify-center">
          <div className="text-[12px] font-black text-brand-blue/20 tracking-[0.5em] uppercase -rotate-45">Field Ingest</div>
       </div>
       
       <MapCluster x="25%" y="20%" size={60} color="#FF3B30" opacity={0.5} />
       <MapCluster x="75%" y="25%" size={50} color="#0066FF" opacity={0.3} />
       <MapCluster x="40%" y="80%" size={70} color="#00FF94" opacity={0.4} />
       <MapCluster x="85%" y="70%" size={45} color="#FF3B30" opacity={0.4} />
       
       {[...Array(mode === '3d' ? 20 : 10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/50"
            initial={{ 
              width: mode === '3d' ? 3 : 2, 
              height: mode === '3d' ? 3 : 2,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`
            }}
            animate={{ 
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`
            }}
            transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: 'linear' }}
          />
       ))}

       <StaffPoint x="28%" y="22%" label="SEC_1" />
       <StaffPoint x="75%" y="28%" label="SEC_2" />
       <StaffPoint x="50%" y="65%" label="MED_1" type="medical" />
    </div>
  );
}

function MapCluster({ x, y, size, color, opacity }: { x: string, y: string, size: number, color: string, opacity: number }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [1, 1.1, 1], opacity: [opacity, opacity * 1.5, opacity] }}
      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute rounded-full blur-xl pointer-events-none"
      style={{
        width: size,
        height: size,
        top: y,
        left: x,
        backgroundColor: color
      }}
    />
  );
}

function StaffPoint({ x, y, label, type = 'security' }: { x: string, y: string, label: string, type?: 'security' | 'medical' }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.2 }}
      className="absolute w-4 h-4 cursor-pointer z-20 flex items-center justify-center group"
      style={{ top: y, left: x }}
    >
       <div className={`w-2.5 h-2.5 rounded-full ${type === 'security' ? 'bg-brand-blue' : 'bg-red-500'} pulse-point relative z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
       <div className="absolute -top-6 bg-black/90 rounded-md px-1.5 py-0.5 text-[7px] font-bold border border-white/10 text-white leading-none tracking-tighter shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
         {label}
       </div>
    </motion.div>
  );
}
