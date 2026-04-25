'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[201] overflow-hidden flex flex-col"
          >
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-emerald-900">{title}</h2>
              <p className="text-sm text-emerald-600 font-medium">{message}</p>
            </div>
            
            <div className="p-4 bg-emerald-50/50 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white text-emerald-700 font-bold rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 font-bold rounded-xl text-white transition-colors ${
                  isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
