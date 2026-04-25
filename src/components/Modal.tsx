'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 sm:bottom-auto left-0 right-0 sm:relative sm:max-w-md w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-emerald-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-emerald-900">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 bg-emerald-50 text-emerald-400 rounded-full hover:text-emerald-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
