import { motion } from 'framer-motion';
import { CalendarEntry } from '../types';
import { isDoorUnlocked } from '../utils/dateUtils';

interface DoorCardProps {
  entry: CalendarEntry;
  isOpened: boolean;
  onOpen: () => void;
  previewMode: boolean;
}

// Storybook illustrated themes with warm Christmas colors
const getThemeForDay = (day: number, unlocked: boolean) => {
  const themes: Record<number, {
    unlocked: { gradient: string; emoji: string; pattern?: string; border: string };
    locked: { gradient: string; emoji: string; pattern?: string; border: string };
  }> = {
    1: {
      unlocked: { gradient: 'from-orange-700 via-red-800 to-orange-900', emoji: '🎄', pattern: 'advent', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎄', pattern: 'advent', border: '#8B7355' }
    },
    6: { // St. Nicholas Day - German tradition
      unlocked: { gradient: 'from-red-700 via-orange-800 to-red-900', emoji: '🎅', pattern: 'nicholas', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎅', pattern: 'nicholas', border: '#8B7355' }
    },
    8: { // Día de la Inmaculada Concepción - Mexican tradition
      unlocked: { gradient: 'from-amber-700 via-orange-700 to-red-800', emoji: '🙏', pattern: 'maria', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🙏', pattern: 'maria', border: '#8B7355' }
    },
    12: { // Día de la Virgen de Guadalupe - Most important Mexican holiday!
      unlocked: { gradient: 'from-red-800 via-rose-700 to-orange-800', emoji: '🌹', pattern: 'guadalupe', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🌹', pattern: 'guadalupe', border: '#8B7355' }
    },
    16: { // Las Posadas begin - HIGHLIGHTED
      unlocked: { gradient: 'from-amber-600 via-orange-700 to-red-700', emoji: '🏠', pattern: 'posada', border: '#FFB347' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🏠', pattern: 'posada', border: '#8B7355' }
    },
    17: { // Las Posadas
      unlocked: { gradient: 'from-orange-800 via-red-700 to-amber-800', emoji: '🕯️', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🕯️', pattern: 'posada', border: '#8B7355' }
    },
    18: { // Las Posadas
      unlocked: { gradient: 'from-red-800 via-orange-700 to-amber-700', emoji: '⭐', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '⭐', pattern: 'posada', border: '#8B7355' }
    },
    19: { // Las Posadas
      unlocked: { gradient: 'from-orange-900 via-red-800 to-orange-800', emoji: '🎊', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎊', pattern: 'posada', border: '#8B7355' }
    },
    20: { // Las Posadas
      unlocked: { gradient: 'from-red-800 via-orange-800 to-amber-700', emoji: '🎉', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎉', pattern: 'posada', border: '#8B7355' }
    },
    21: { // Las Posadas
      unlocked: { gradient: 'from-amber-800 via-orange-800 to-red-800', emoji: '🎶', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎶', pattern: 'posada', border: '#8B7355' }
    },
    22: { // Las Posadas
      unlocked: { gradient: 'from-orange-700 via-red-800 to-amber-800', emoji: '🌮', pattern: 'posada', border: '#FF8C42' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🌮', pattern: 'posada', border: '#8B7355' }
    },
    23: { // Noche Buena Eve - Las Posadas last night - HIGHLIGHTED
      unlocked: { gradient: 'from-red-800 via-orange-700 to-amber-700', emoji: '🎺', pattern: 'posada', border: '#FFB347' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎺', pattern: 'posada', border: '#8B7355' }
    },
    24: { // Noche Buena - Christmas Eve - MOST IMPORTANT!
      unlocked: { gradient: 'from-red-900 via-orange-700 to-amber-600', emoji: '🎁', pattern: 'navidad', border: '#FFD700' },
      locked: { gradient: 'from-gray-700 via-gray-600 to-gray-700', emoji: '🎁', pattern: 'navidad', border: '#8B7355' }
    }
  };

  const theme = themes[day];
  if (!theme) {
    // Default theme for regular days - warm fireplace colors
    const isEven = day % 2 === 0;
    return unlocked
      ? { 
          gradient: isEven ? 'from-orange-700 via-red-800 to-orange-900' : 'from-red-800 via-orange-800 to-amber-800', 
          emoji: isEven ? '✨' : '⭐',
          pattern: 'default',
          border: '#FF8C42'
        }
      : { 
          gradient: 'from-gray-700 via-gray-600 to-gray-700', 
          emoji: isEven ? '✨' : '⭐',
          pattern: 'default',
          border: '#8B7355'
        };
  }

  return unlocked ? theme.unlocked : theme.locked;
};

// Get decorative pattern based on theme - Christmas-themed with CSS effects
const getPattern = (pattern?: string) => {
  switch (pattern) {
    case 'guadalupe':
      // Virgen de Guadalupe - elegant roses border with golden glow
      return (
        <>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-rose-300 blur-sm animate-pulse"></div>
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-300 blur-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-rose-300 blur-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-rose-300 blur-sm animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          </div>
          <div className="absolute top-1 left-1 text-xs opacity-30">🌹</div>
          <div className="absolute top-1 right-1 text-xs opacity-30">🌹</div>
          <div className="absolute bottom-1 left-1 text-xs opacity-30">🌹</div>
          <div className="absolute bottom-1 right-1 text-xs opacity-30">🌹</div>
          {/* Golden rays */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/10 via-transparent to-transparent"></div>
        </>
      );
    case 'posada':
      // Las Posadas - candlelight warmth with flickering effect
      return (
        <>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300 rounded-full blur-lg opacity-40 animate-pulse"></div>
          <div className="absolute top-3 left-3 text-xs opacity-40">🕯️</div>
          <div className="absolute top-3 right-3 text-xs opacity-40">🕯️</div>
          {/* Warm candlelight glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-200/20 via-transparent to-transparent"></div>
        </>
      );
    case 'nicholas':
      // St. Nicholas - festive boot prints in snow
      return (
        <>
          <div className="absolute bottom-2 left-2 text-sm opacity-35">🥾</div>
          <div className="absolute bottom-2 right-2 text-sm opacity-35">🥾</div>
          {/* Snow sparkles */}
          <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-8 left-1/2 w-1 h-1 bg-white rounded-full opacity-60"></div>
        </>
      );
    case 'navidad':
      // Christmas Eve - magical starry night with falling snow
      return (
        <>
          {/* Twinkling stars */}
          <div className="absolute top-2 left-4 text-xs opacity-60 animate-pulse">⭐</div>
          <div className="absolute top-4 right-6 text-xs opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute top-6 left-1/2 text-xs opacity-70 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
          {/* Christmas trees */}
          <div className="absolute bottom-2 left-3 text-sm opacity-40">🎄</div>
          <div className="absolute bottom-2 right-3 text-sm opacity-40">🎄</div>
          {/* Magical glow */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-100/20 via-red-100/10 to-green-100/10"></div>
          {/* Falling snow effect */}
          <div className="absolute top-8 left-6 w-1 h-1 bg-white rounded-full opacity-80 animate-bounce"></div>
          <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </>
      );
    case 'maria':
      // Inmaculada Concepción - heavenly divine light
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div className="w-20 h-20 bg-sky-200 rounded-full blur-xl animate-pulse"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-sky-100/5 to-transparent"></div>
          {/* Divine sparkles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-70"></div>
        </>
      );
    case 'advent':
      // First day - classic Christmas beginning with pine branches
      return (
        <>
          <div className="absolute top-2 left-2 text-sm opacity-40">🎄</div>
          <div className="absolute top-2 right-2 text-sm opacity-40">🎄</div>
          {/* Pine scent visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/10 via-transparent to-red-100/10"></div>
        </>
      );
    default:
      // Regular days - subtle winter wonderland sparkle
      return (
        <>
          <div className="absolute top-3 left-4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-5 right-5 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-4 left-1/3 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      );
  }
};

export default function DoorCard({ entry, isOpened, onOpen, previewMode }: DoorCardProps) {
  const unlocked = isDoorUnlocked(entry.day, previewMode);
  const theme = getThemeForDay(entry.day, unlocked);

  const handleClick = () => {
    if (unlocked) {
      onOpen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: entry.day * 0.02,
        type: 'spring',
        stiffness: 120
      }}
      className="relative aspect-square"
      style={{ perspective: '1000px' }}
    >
      {/* Door with flip/open effect for opened doors */}
      <motion.div
        className="relative w-full h-full"
        animate={isOpened && unlocked ? {
          rotateY: 15,
          scale: 0.92,
          opacity: 0.75,
          transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 18 }
        } : {
          rotateY: 0,
          scale: 1,
          opacity: 1
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={!unlocked}
          whileHover={unlocked && !isOpened ? { 
            scale: 1.08,
            y: -5,
            boxShadow: '0 15px 40px rgba(255, 140, 66, 0.6), 0 0 30px rgba(255, 140, 66, 0.4)',
            transition: { duration: 0.3, ease: "easeOut" }
          } : {}}
          whileTap={unlocked && !isOpened ? { 
            scale: 0.92,
            y: 0,
            transition: { duration: 0.1, ease: "easeInOut" }
          } : {}}
          className={`
            relative w-full h-full rounded-2xl transition-all duration-200
            flex items-center justify-center overflow-hidden
            bg-gradient-to-br ${theme.gradient}
            ${unlocked 
              ? 'cursor-pointer text-white' 
              : 'cursor-not-allowed text-gray-400'
            }
            ${isOpened && unlocked ? 'opacity-70' : 'opacity-100'}
            focus:outline-none
          `}
          style={{
            border: `4px solid ${theme.border}`,
            boxShadow: unlocked 
              ? isOpened 
                ? '0 2px 10px rgba(0,0,0,0.5), inset 0 6px 12px rgba(0,0,0,0.5)'
                : `0 8px 25px rgba(0,0,0,0.5), 0 4px 15px rgba(255, 140, 66, 0.3), inset 0 2px 8px rgba(255,248,220,0.3), inset 0 -2px 5px rgba(0,0,0,0.2)`
              : '0 4px 10px rgba(0,0,0,0.4)',
            filter: isOpened && unlocked ? 'brightness(0.6) saturate(0.7) blur(0.5px)' : 'brightness(1.05)',
            transformStyle: 'preserve-3d',
          }}
          aria-label={`Door ${entry.day}${!unlocked ? ' (still locked)' : ''}${isOpened ? ' (already opened)' : ''}`}
          aria-disabled={!unlocked}
        >
          {/* Paper/Cardboard texture - storybook style */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div 
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px, rgba(0,0,0,0.1) 4px),
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 3px, rgba(255,255,255,0.05) 4px)
                `,
                width: '100%',
                height: '100%'
              }}
            />
          </div>

          {/* Decorative corners - illustrated book style */}
          {unlocked && !isOpened && (
            <>
              <div className="absolute top-2 left-2 w-6 h-6 opacity-30" style={{
                borderTop: `3px solid ${theme.border}`,
                borderLeft: `3px solid ${theme.border}`,
                borderRadius: '4px 0 0 0'
              }} />
              <div className="absolute top-2 right-2 w-6 h-6 opacity-30" style={{
                borderTop: `3px solid ${theme.border}`,
                borderRight: `3px solid ${theme.border}`,
                borderRadius: '0 4px 0 0'
              }} />
              <div className="absolute bottom-2 left-2 w-6 h-6 opacity-30" style={{
                borderBottom: `3px solid ${theme.border}`,
                borderLeft: `3px solid ${theme.border}`,
                borderRadius: '0 0 0 4px'
              }} />
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-30" style={{
                borderBottom: `3px solid ${theme.border}`,
                borderRight: `3px solid ${theme.border}`,
                borderRadius: '0 0 4px 0'
              }} />
            </>
          )}

          {/* Warm fireplace glow effect */}
          {unlocked && !isOpened && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  'inset 0 0 25px rgba(255, 140, 66, 0.4)',
                  'inset 0 0 40px rgba(255, 100, 50, 0.6)',
                  'inset 0 0 25px rgba(255, 140, 66, 0.4)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          
          {/* Opening animation sparkle effect */}
          {isOpened && unlocked && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 140, 66, 0.6), transparent 70%)',
              }}
            />
          )}
        
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
          {/* Decorative pattern */}
          {getPattern(theme.pattern)}
          
          {/* Day number - handwritten style */}
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: entry.day * 0.03, type: 'spring', stiffness: 200 }}
            className="text-6xl font-bold relative z-10"
            style={{
              fontFamily: "'Caveat', cursive",
              color: '#FFF8DC',
              textShadow: `3px 3px 6px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.4), -1px -1px 0 ${theme.border}`,
              WebkitTextStroke: '1px rgba(62,39,35,0.3)',
            }}
          >
            {entry.day}
          </motion.span>
          
          {/* Small December label */}
          {unlocked && !isOpened && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: entry.day * 0.03 + 0.4 }}
              className="text-xs font-serif uppercase tracking-wider relative z-10 mt-1"
              style={{
                color: '#FFF8DC',
                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              December
            </motion.span>
          )}
          
          {isOpened && unlocked && (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.3, 1], 
                rotate: [180, -10, 0],
                opacity: 1 
              }}
              transition={{ 
                duration: 0.6,
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-20"
              style={{
                background: 'linear-gradient(135deg, #FF8C42, #FFB347)',
                border: '3px solid rgba(101, 67, 33, 0.8)',
                boxShadow: '0 4px 15px rgba(255, 140, 66, 0.6), inset 0 2px 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              <motion.svg 
                className="w-7 h-7" 
                style={{ color: '#FFF8DC' }} 
                fill="currentColor" 
                viewBox="0 0 20 20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
            </motion.div>
          )}
          
          {!unlocked && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: entry.day * 0.03 + 0.3 }}
              className="absolute top-3 right-3 z-10"
            >
              <svg className="w-8 h-8 drop-shadow-lg" style={{ color: '#9E9E9E' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
      </motion.button>
      </motion.div>
    </motion.div>
  );
}
