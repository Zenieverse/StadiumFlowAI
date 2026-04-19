import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const colors = {
    success: 'bg-brand-neon text-black',
    info: 'bg-brand-blue text-white',
    error: 'bg-brand-alert text-white'
  };

  const icons = {
    success: <CheckCircle2 size={16} />,
    info: <Info size={16} />,
    error: <AlertTriangle size={16} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-24 left-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border border-white/20 ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-bold tracking-tight">{message}</span>
    </motion.div>
  );
}
