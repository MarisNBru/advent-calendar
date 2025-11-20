import { useRef, useEffect } from 'react';
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl paper-texture"
            style={{
              background: 'rgba(255, 248, 220, 0.98)',
              backdropFilter: 'blur(15px)',
              border: '6px solid #D4AF37',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 2px 10px rgba(212, 175, 55, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Decorative corner ornaments - storybook style */}
            <div className="absolute top-3 left-3 w-12 h-12 opacity-20 pointer-events-none">
              <svg viewBox="0 0 50 50" style={{ fill: '#8B2E2E' }}>
                <path d="M 0,0 L 0,20 Q 0,0 20,0 Z" />
              </svg>
            </div>
            <div className="absolute top-3 right-3 w-12 h-12 opacity-20 pointer-events-none">
              <svg viewBox="0 0 50 50" style={{ fill: '#8B2E2E' }}>
                <path d="M 50,0 L 50,20 Q 50,0 30,0 Z" />
              </svg>
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between p-6 rounded-t-3xl backdrop-blur-sm" style={{
              background: 'linear-gradient(to right, rgba(212, 175, 55, 0.2), rgba(255, 248, 220, 0.5), rgba(212, 175, 55, 0.2))',
              borderBottom: '3px solid #D4AF37',
            }}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 
                  id="modal-title" 
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    color: '#8B2E2E',
                    textShadow: '2px 2px 0 #D4AF37, 4px 4px 8px rgba(139, 46, 46, 0.3)',
                  }}
                >
                  December {entry.day}
                </h2>
                <p className="text-sm mt-1 italic" style={{
                  fontFamily: "'Merriweather', serif",
                  color: '#6B5B4C',
                }}>
                  A special gift just for you
                </p>
              </motion.div>
              
              <motion.button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: 'linear-gradient(135deg, #8B2E2E, #D4691C)',
                  boxShadow: '0 4px 12px rgba(139, 46, 46, 0.4)',
                }}
                aria-label="Close modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6 text-amber-50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="p-8 relative z-10">
              <ContentRenderer entry={entry} />
            </div>
            
            {/* Bottom decoration - ornamental border */}
            <div className="h-6 rounded-b-3xl" style={{
              background: 'linear-gradient(to right, #D4AF37, #F4E4A6, #D4AF37)',
              boxShadow: 'inset 0 2px 8px rgba(139, 46, 46, 0.2)',
            }}></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
