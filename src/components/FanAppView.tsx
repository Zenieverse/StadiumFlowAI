import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Navigation, Clock, Utensils, Beer, 
  Trash2, MessageCircle, Home, Search, Ticket, 
  ChevronRight, ArrowLeft, Send, Sparkles, User,
  Map as MapIcon, Flag
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

export default function FanAppView({ onBack }: { onBack: () => void }) {
  const [activeScreen, setActiveScreen] = useState<'home' | 'map' | 'food' | 'chat' | 'waits'>('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: "Hello! I'm your StadiumFlow assistant. Need help finding Gate D or the shortest beer line?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    const context = {
      userSeat: "Section 112, Row 4",
      nearestGate: "Gate A",
      eventStatus: "Halftime - 10:00 remaining"
    };
    
    const response = await geminiService.getFanAssistantResponse(userMsg, "Section 112", context);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: response || "I'm having trouble connecting right now." }]);
  };

  return (
    <div className="min-h-screen bg-stadium-navy flex items-center justify-center p-4">
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-black rounded-[3rem] border-[8px] border-stadium-card shadow-2xl overflow-hidden flex flex-col">
        {/* Notch / Status Bar */}
        <div className="h-10 w-full flex justify-between items-center px-8 pt-4">
           <span className="text-xs font-bold">9:41</span>
           <div className="w-16 h-5 bg-black rounded-full" />
           <div className="flex gap-1.5 items-center">
              <div className="w-4 h-2.5 border border-white/40 rounded-sm" />
              <div className="w-3 h-3 bg-white/40 rounded-full" />
           </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 relative custom-scrollbar">
           <AnimatePresence mode="wait">
              {activeScreen === 'home' && (
                <motion.div 
                  key="home"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-center">
                     <div>
                        <h2 className="text-2xl font-black font-display tracking-tight uppercase">Hello, Alex</h2>
                        <div className="text-[10px] uppercase font-bold text-brand-blue tracking-widest flex items-center gap-1">
                           <MapPin size={10} /> Section 112, Seat 14A
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <User size={20} className="text-gray-400" />
                     </div>
                  </header>

                  <div className="glass-card p-4 space-y-3 border-brand-blue/30 bg-brand-blue/5">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue flex items-center gap-2">
                           <Sparkles size={12} /> Smart Arrival
                        </span>
                        <Clock size={12} className="text-gray-500" />
                     </div>
                     <h3 className="text-lg font-bold leading-tight uppercase">Ready for Halftime?</h3>
                     <p className="text-[11px] text-gray-400 leading-relaxed">
                        Exit via <span className="text-white">Gate B</span> for 15m faster departure. 
                        Parking Lot C is currently clearing.
                     </p>
                  </div>

                  <div className="space-y-3">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Services</h4>
                     <div className="grid grid-cols-2 gap-3">
                        <ServiceCard icon={<Navigation size={18} />} label="Find Gate" color="bg-blue-500" onClick={() => setActiveScreen('map')} />
                        <ServiceCard icon={<Utensils size={18} />} label="Order Food" color="bg-orange-500" onClick={() => setActiveScreen('food')} />
                        <ServiceCard icon={<Clock size={18} />} label="Wait Times" color="bg-teal-500" onClick={() => setActiveScreen('waits')} />
                        <ServiceCard icon={<Flag size={18} />} label="Assistance" color="bg-purple-500" onClick={() => setChatOpen(true)} />
                     </div>
                  </div>

                  <section className="space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fastest Lines Near You</h4>
                        <button onClick={() => setActiveScreen('waits')} className="text-[9px] text-brand-blue font-bold uppercase hover:underline">View All</button>
                     </div>
                     <div className="space-y-2">
                        <QueueCard name="Bratwurst Zone" type="Food" wait="2m" location="Sec 114" onClick={() => setActiveScreen('food')} />
                        <QueueCard name="Draft Beer A" type="Beverage" wait="4m" location="Sec 108" trend="up" onClick={() => setActiveScreen('food')} />
                        <QueueCard name="Restroom 204" type="Service" wait="1m" location="Level 2" onClick={() => setActiveScreen('waits')} />
                     </div>
                  </section>
                </motion.div>
              )}

              {activeScreen === 'map' && (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-x-0 bottom-16 top-0 flex flex-col p-6 items-center"
                >
                   <div className="w-full h-full bg-blue-900/10 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent" 
                      />
                      <MapIcon size={48} className="text-brand-blue/30 relative z-10" />
                      <div className="mt-4 text-center px-8 relative z-10">
                         <h3 className="font-bold text-sm uppercase">Interactive Venue Map</h3>
                         <p className="text-[10px] text-gray-500 mt-1 uppercase font-black">Gate B congestion index: 0.12 (Optimal)</p>
                      </div>

                      {[...Array(12)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                            y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{ repeat: Infinity, duration: 5 + Math.random() * 10, ease: 'linear' }}
                          className="absolute w-1.5 h-1.5 rounded-full bg-brand-neon/40"
                        />
                      ))}
                   </div>
                   
                   <div className="w-full space-y-2 mt-4">
                      <button onClick={() => showToast("Calculating path to Restroom 204...")} className="w-full bg-brand-blue p-4 rounded-2xl font-bold flex justify-between items-center text-xs">
                         Nearest Restroom
                         <ChevronRight size={16} />
                      </button>
                      <button onClick={() => showToast("Navigating to Block 112, Row 4...")} className="w-full bg-white/5 p-4 rounded-2xl font-bold flex justify-between items-center border border-white/10 text-xs text-left">
                         Route to Seat 14A
                         <Navigation size={16} />
                      </button>
                   </div>
                </motion.div>
              )}

              {activeScreen === 'food' && (
                <motion.div 
                  key="food"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <header className="flex items-center gap-3">
                      <button onClick={() => setActiveScreen('home')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={16} /></button>
                      <h2 className="text-xl font-bold tracking-tight uppercase">Concessions</h2>
                   </header>

                   <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                         <h4 className="text-sm font-bold uppercase text-orange-500 tracking-tight">Flash Sale</h4>
                         <p className="text-[10px] text-gray-400 uppercase font-black mt-0.5">25% off all beverages until KO</p>
                      </div>
                      <Sparkles size={20} className="text-orange-500" />
                   </div>

                   <div className="space-y-4">
                      <FoodItem name="Premium Bratwurst" price="$12.00" cal="450 kcal" onAdd={() => showToast("Added to basket")} />
                      <FoodItem name="Stadium Nachos" price="$9.50" cal="520 kcal" onAdd={() => showToast("Added to basket")} />
                      <FoodItem name="Draft Beer 24oz" price="$14.00" cal="210 kcal" onAdd={() => showToast("Added to basket")} />
                      <FoodItem name="Mineral Water" price="$6.00" cal="0 kcal" onAdd={() => showToast("Added to basket")} />
                   </div>
                </motion.div>
              )}

              {activeScreen === 'waits' && (
                <motion.div 
                  key="waits"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                   <header className="flex items-center gap-3">
                      <button onClick={() => setActiveScreen('home')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={16} /></button>
                      <h2 className="text-xl font-bold tracking-tight uppercase">Wait Times</h2>
                   </header>

                   <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-gray-500">Service Nodes Near Block 112</h4>
                      <WaitTimeCard name="Gate B Entry" wait="12m" status="heavy" />
                      <WaitTimeCard name="Gate A Entry" wait="3m" status="light" />
                      <WaitTimeCard name="Section 112 Restroom" wait="1m" status="light" />
                      <WaitTimeCard name="Main Merch Store" wait="18m" status="heavy" />
                      <WaitTimeCard name="Premium Lounge Bar" wait="6m" status="moderate" />
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <AnimatePresence>
              {toast && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -10, x: '-50%' }}
                  className="absolute bottom-24 left-1/2 bg-brand-neon text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest z-[100] shadow-xl whitespace-nowrap"
                >
                   {toast}
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="h-20 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-2 z-10">
           <TabIcon active={activeScreen === 'home'} onClick={() => setActiveScreen('home')} icon={<Home size={20} />} />
           <TabIcon active={activeScreen === 'map'} onClick={() => setActiveScreen('map')} icon={<MapIcon size={20} />} />
           <TabIcon active={activeScreen === 'food'} onClick={() => setActiveScreen('food')} icon={<Utensils size={20} />} />
           <TabIcon active={activeScreen === 'waits'} onClick={() => setActiveScreen('waits')} icon={<Clock size={20} />} />
           <TabIcon active={false} onClick={() => setChatOpen(true)} icon={<MessageCircle size={20} />} />
        </nav>

        {/* Chat Drawer Overlay */}
        <AnimatePresence>
           {chatOpen && (
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className="absolute inset-0 z-50 bg-stadium-card rounded-t-[3rem] flex flex-col pt-4 overflow-hidden shadow-2xl"
             >
                <header className="px-8 py-4 border-b border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
                         <Sparkles size={14} />
                      </div>
                      <div>
                         <h3 className="font-bold text-xs uppercase">SF Assistant</h3>
                         <div className="text-[8px] font-bold text-brand-neon uppercase tracking-widest">Active Intelligence</div>
                      </div>
                   </div>
                   <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-white p-2 transition-colors"><ArrowLeft size={18} /></button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                   {messages.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${m.role === 'user' ? 'bg-brand-blue text-white shadow-lg' : 'bg-white/5 border border-white/10 text-gray-300'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isTyping && (
                     <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1">
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                           <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        </div>
                     </div>
                   )}
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                   <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                      <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask anything..." 
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-xs focus:outline-none focus:border-brand-blue transition-all"
                      />
                      <button className="absolute right-2 top-1.5 w-9 h-9 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg">
                         <Send size={14} />
                      </button>
                   </form>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      {/* External Controls */}
      <div className="fixed top-8 left-8">
         <button 
           onClick={onBack}
           className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all"
         >
           <ArrowLeft size={14} /> Exit App
         </button>
      </div>
    </div>
  );
}

function TabIcon({ active, icon, onClick }: { active: boolean, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? 'bg-white/10 text-brand-blue' : 'text-gray-500 hover:text-white'}`}>
       {icon}
    </button>
  );
}

function ServiceCard({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="glass-card p-3 flex flex-col gap-3 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
       <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </div>
  );
}

function WaitTimeCard({ name, wait, status }: { name: string, wait: string, status: 'light' | 'moderate' | 'heavy' }) {
  const statusColors = {
    light: 'bg-brand-neon',
    moderate: 'bg-yellow-500',
    heavy: 'bg-brand-alert'
  };

  return (
    <div className="glass-card p-4 flex justify-between items-center border-white/5 hover:bg-white/10 transition-all cursor-pointer">
       <div className="flex gap-4 items-center">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} pulse-point`} />
          <span className="text-xs font-bold uppercase tracking-tight">{name}</span>
       </div>
       <div className="text-right">
          <div className={`text-sm font-black font-display ${status === 'light' ? 'text-brand-neon' : status === 'moderate' ? 'text-yellow-500' : 'text-brand-alert'}`}>{wait}</div>
       </div>
    </div>
  );
}

function FoodItem({ name, price, cal, onAdd }: { name: string, price: string, cal: string, onAdd: () => void }) {
  return (
    <div className="glass-card p-4 flex justify-between items-center group hover:bg-white/5 transition-all border-white/5">
       <div className="space-y-1">
          <h5 className="text-xs font-bold uppercase tracking-tight">{name}</h5>
          <div className="flex gap-2 text-[8px] font-black uppercase text-gray-500">
             <span>{price}</span>
             <span className="opacity-50">•</span>
             <span>{cal}</span>
          </div>
       </div>
       <button onClick={onAdd} className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all">
          +
       </button>
    </div>
  );
}

function QueueCard({ name, type, wait, location, trend, onClick }: { name: string, type: string, wait: string, location: string, trend?: 'up' | 'down', onClick?: () => void }) {
  return (
    <div onClick={onClick} className="glass-card p-3 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-all border-white/5">
       <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
             {type === 'Food' ? <Utensils size={14} /> : type === 'Beverage' ? <Beer size={14} /> : <Trash2 size={14} />}
          </div>
          <div>
             <h5 className="text-[11px] font-black uppercase tracking-tight">{name}</h5>
             <span className="text-[9px] text-gray-500 font-bold uppercase">{location}</span>
          </div>
       </div>
       <div className="text-right">
          <div className="text-sm font-black text-brand-neon font-display">{wait}</div>
          <div className="text-[8px] text-gray-500 uppercase font-black">Wait</div>
       </div>
    </div>
  );
}
