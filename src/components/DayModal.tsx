import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEntry } from '../types';
import ContentRenderer from './ContentRenderer';

interface DayModalProps {
  entry: CalendarEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DayModal({ entry, isOpen, onClose }: DayModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-red-50/30 to-green-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Subtle snowflake decorations in modal */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`modal-snow-${i}`}
                  className="absolute text-lg opacity-15"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, 360],
                    opacity: [0.05, 0.2, 0.05],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ❄️
                </motion.div>
              ))}
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-red-100/80 via-white/80 to-green-100/80 dark:from-gray-800/90 dark:via-gray-800/90 dark:to-gray-800/90 border-b-2 border-red-300 dark:border-gray-700 backdrop-blur-md">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 
                  id="modal-title" 
                  className="text-3xl font-black bg-gradient-to-r from-red-600 to-green-600 dark:from-red-400 dark:to-green-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 2px 10px rgba(220, 38, 38, 0.2)',
                  }}
                >
                  December {entry.day}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                  A special gift just for you
                </p>
              </motion.div>
              
              <motion.button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-3 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 group shadow-lg"
                aria-label="Close modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6 text-red-600 dark:text-gray-300 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="p-6 relative z-10">
              <ContentRenderer entry={entry} />
            </div>
            
            {/* Bottom decoration */}
            <div className="h-4 bg-gradient-to-r from-red-200 via-green-200 to-red-200 dark:from-red-900/50 dark:via-green-900/50 dark:to-red-900/50"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
