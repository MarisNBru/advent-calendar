import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEntry } from '../types';
import ContentRenderer from './ContentRenderer';

interface DayModalProps {
  entry: CalendarEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const modalPalette = {
  parchment: '#F7EFE1',
  parchmentDeep: '#E6D4BE',
  parchmentGlow: '#F4E5CB',
  deepRed: '#5C1F1A',
  ember: '#8B2E2E',
  pine: '#2F4F3E',
  cocoa: '#6B5B4C',
  gold: '#D4AF37',
  brass: '#B08034'
} as const;

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
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl paper-texture overflow-hidden flex flex-col"
            style={{
              background: `linear-gradient(145deg, rgba(247, 239, 225, 0.98), rgba(233, 220, 198, 0.96))`,
              backdropFilter: 'blur(18px)',
              border: `5px solid ${modalPalette.gold}`,
              boxShadow: '0 25px 70px rgba(12, 7, 4, 0.75), inset 0 2px 10px rgba(212, 175, 55, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="absolute inset-0 pointer-events-none opacity-15">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.15) 100%)'
                }}
              ></div>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 25% 20%, rgba(212, 175, 55, 0.18), transparent 55%), radial-gradient(circle at 80% 15%, rgba(141, 99, 46, 0.15), transparent 45%)'
                }}
              ></div>
            </div>
            {/* Decorative corner ornaments - storybook style */}
            <div className="absolute top-3 left-3 w-12 h-12 opacity-20 pointer-events-none">
              <svg viewBox="0 0 50 50" style={{ fill: modalPalette.deepRed }}>
                <path d="M 0,0 L 0,20 Q 0,0 20,0 Z" />
              </svg>
            </div>
            <div className="absolute top-3 right-3 w-12 h-12 opacity-20 pointer-events-none">
              <svg viewBox="0 0 50 50" style={{ fill: modalPalette.deepRed }}>
                <path d="M 50,0 L 50,20 Q 50,0 30,0 Z" />
              </svg>
            </div>

            <div className="modal-scroll-area flex-1 overflow-y-auto relative z-10">
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 rounded-t-3xl backdrop-blur-sm" style={{
                background: `linear-gradient(90deg, rgba(92, 31, 26, 0.95), rgba(139, 46, 46, 0.85), rgba(92, 31, 26, 0.95))`,
                borderBottom: `3px solid ${modalPalette.gold}`,
                boxShadow: '0 6px 18px rgba(15, 7, 2, 0.35)'
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
                      color: modalPalette.parchment,
                      textShadow: '2px 2px 6px rgba(0,0,0,0.45), 0 0 18px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    December {entry.day}
                  </h2>
                  <p className="text-sm mt-1 italic" style={{
                    fontFamily: "'Merriweather', serif",
                    color: modalPalette.parchmentGlow,
                  }}>
                    A special gift just for you
                  </p>
                </motion.div>
                
                <motion.button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-3 rounded-xl transition-all duration-200 group"
                  style={{
                    background: `linear-gradient(135deg, ${modalPalette.deepRed}, ${modalPalette.ember})`,
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.45)',
                    border: `1px solid ${modalPalette.gold}`,
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

              <div className="p-8" style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)',
                color: modalPalette.cocoa
              }}>
                <ContentRenderer entry={entry} />
              </div>
              
              {/* Bottom decoration - ornamental border */}
              <div className="h-6 rounded-b-3xl" style={{
                background: `linear-gradient(to right, ${modalPalette.gold}, #F4E4A6, ${modalPalette.gold})`,
                boxShadow: 'inset 0 2px 8px rgba(139, 46, 46, 0.25)',
              }}></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
