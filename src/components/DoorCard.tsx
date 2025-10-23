import { motion } from 'framer-motion';
import { CalendarEntry } from '../types';
import { isDoorUnlocked } from '../utils/dateUtils';

interface DoorCardProps {
  entry: CalendarEntry;
  isOpened: boolean;
  onOpen: () => void;
  previewMode: boolean;
}

// Special day themes with PASTEL COLORS and Mexican traditions prioritized
const getThemeForDay = (day: number, unlocked: boolean) => {
  const themes: Record<number, {
    unlocked: { gradient: string; emoji: string; pattern?: string };
    locked: { gradient: string; emoji: string; pattern?: string };
  }> = {
    1: {
      unlocked: { gradient: 'from-rose-300 via-emerald-300 to-rose-300', emoji: '🎄', pattern: 'advent' },
      locked: { gradient: 'from-gray-300 via-gray-350 to-gray-400', emoji: '🎄', pattern: 'advent' }
    },
    6: { // St. Nicholas Day - German tradition
      unlocked: { gradient: 'from-amber-300 via-rose-300 to-amber-300', emoji: '🎅', pattern: 'nicholas' },
      locked: { gradient: 'from-gray-300 via-gray-350 to-gray-400', emoji: '🎅', pattern: 'nicholas' }
    },
    8: { // Día de la Inmaculada Concepción - Mexican tradition
      unlocked: { gradient: 'from-sky-300 via-blue-200 to-sky-300', emoji: '🙏', pattern: 'maria' },
      locked: { gradient: 'from-gray-300 via-blue-200 to-gray-400', emoji: '🙏', pattern: 'maria' }
    },
    12: { // Día de la Virgen de Guadalupe - Most important Mexican holiday!
      unlocked: { gradient: 'from-rose-400 via-pink-300 to-rose-400', emoji: '🌹', pattern: 'guadalupe' },
      locked: { gradient: 'from-gray-300 via-pink-200 to-gray-400', emoji: '🌹', pattern: 'guadalupe' }
    },
    16: { // Las Posadas begin - HIGHLIGHTED
      unlocked: { gradient: 'from-yellow-300 via-orange-300 to-yellow-300', emoji: '🏠', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-orange-200 to-gray-400', emoji: '🏠', pattern: 'posada' }
    },
    17: { // Las Posadas
      unlocked: { gradient: 'from-orange-300 via-rose-300 to-orange-300', emoji: '🕯️', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-orange-200 to-gray-400', emoji: '🕯️', pattern: 'posada' }
    },
    18: { // Las Posadas
      unlocked: { gradient: 'from-purple-300 via-pink-300 to-purple-300', emoji: '⭐', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-purple-200 to-gray-400', emoji: '⭐', pattern: 'posada' }
    },
    19: { // Las Posadas
      unlocked: { gradient: 'from-indigo-300 via-purple-300 to-indigo-300', emoji: '🎊', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-purple-200 to-gray-400', emoji: '🎊', pattern: 'posada' }
    },
    20: { // Las Posadas
      unlocked: { gradient: 'from-blue-300 via-indigo-300 to-blue-300', emoji: '🎉', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-blue-200 to-gray-400', emoji: '🎉', pattern: 'posada' }
    },
    21: { // Las Posadas
      unlocked: { gradient: 'from-teal-300 via-emerald-300 to-teal-300', emoji: '🎶', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-teal-200 to-gray-400', emoji: '🎶', pattern: 'posada' }
    },
    22: { // Las Posadas
      unlocked: { gradient: 'from-lime-300 via-emerald-300 to-lime-300', emoji: '🌮', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-green-200 to-gray-400', emoji: '🌮', pattern: 'posada' }
    },
    23: { // Noche Buena Eve - Las Posadas last night - HIGHLIGHTED
      unlocked: { gradient: 'from-rose-300 via-amber-300 to-rose-300', emoji: '🎺', pattern: 'posada' },
      locked: { gradient: 'from-gray-300 via-amber-200 to-gray-400', emoji: '🎺', pattern: 'posada' }
    },
    24: { // Noche Buena - Christmas Eve - MOST IMPORTANT!
      unlocked: { gradient: 'from-rose-400 via-amber-300 to-emerald-400', emoji: '🎁', pattern: 'navidad' },
      locked: { gradient: 'from-gray-300 via-rose-200 to-gray-400', emoji: '🎁', pattern: 'navidad' }
    }
  };

  const theme = themes[day];
  if (!theme) {
    // Default theme for regular days - alternate between pastel colors
    const isEven = day % 2 === 0;
    return unlocked
      ? { 
          gradient: isEven ? 'from-rose-300 via-rose-300 to-emerald-300' : 'from-emerald-300 via-emerald-300 to-rose-300', 
          emoji: isEven ? '✨' : '⭐',
          pattern: 'default' 
        }
      : { 
          gradient: 'from-gray-300 via-gray-350 to-gray-400', 
          emoji: isEven ? '✨' : '⭐',
          pattern: 'default' 
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
  
  // Check if this is a special highlighted day
  const isSpecialDay = [6, 8, 12, 16, 23, 24].includes(entry.day);

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
      {/* Door with tilt effect for opened doors */}
      <motion.div
        className="relative w-full h-full"
        animate={isOpened && unlocked ? {
          rotate: -8,
          scale: 0.95,
          y: 2,
          transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }
        } : {
          rotate: 0,
          scale: 1,
          y: 0
        }}
      >
        <motion.button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={!unlocked}
          whileHover={unlocked && !isOpened ? { 
            scale: 1.02,
            y: -1,
            transition: { duration: 0.3, ease: "easeOut" }
          } : {}}
          whileTap={unlocked && !isOpened ? { 
            scale: 0.98,
            transition: { duration: 0.15, ease: "easeInOut" }
          } : {}}
          className={`
            relative w-full h-full rounded-lg transition-all duration-200
            flex items-center justify-center overflow-hidden
            bg-gradient-to-br ${theme.gradient}
            ${unlocked 
              ? 'cursor-pointer text-white shadow-md' 
              : 'cursor-not-allowed dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 shadow-sm'
            }
            ${isSpecialDay && unlocked && !isOpened ? 'ring-2 ring-white/40 ring-offset-1' : ''}
            ${isOpened && unlocked ? 'opacity-60' : 'opacity-100'}
            focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-2
          `}
          style={{
            border: isOpened && unlocked 
              ? '3px dashed rgba(255, 255, 255, 0.6)' 
              : '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: unlocked 
              ? isOpened 
                ? '0 2px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.15)'
                : '0 4px 10px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)'
              : '0 2px 5px rgba(0,0,0,0.1)',
            filter: isOpened && unlocked ? 'brightness(0.85)' : 'brightness(1)',
          }}
          aria-label={`Door ${entry.day}${!unlocked ? ' (still locked)' : ''}${isOpened ? ' (already opened)' : ''}`}
          aria-disabled={!unlocked}
        >
          {/* Paper/Cardboard texture */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div 
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px),
                  repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px)
                `,
                width: '100%',
                height: '100%'
              }}
            />
          </div>

          {/* Subtle paper grain for closed doors */}
          {unlocked && !isOpened && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/15 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          )}

          {/* Frost/Snow overlay effect for winter atmosphere */}
          {unlocked && !isOpened && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60 blur-sm"></div>
              <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-white rounded-full opacity-50 blur-sm"></div>
              <div className="absolute top-2 left-1/2 w-1 h-1 bg-white rounded-full opacity-70 blur-sm"></div>
            </div>
          )}
        
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
          {/* Decorative pattern */}
          {getPattern(theme.pattern)}
          
          {/* Day number */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: entry.day * 0.02, type: 'spring', stiffness: 200 }}
            className="text-5xl font-black relative z-10"
            style={{
              textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
              WebkitTextStroke: '1px rgba(255,255,255,0.3)',
            }}
          >
            {entry.day}
          </motion.span>
          
          {/* Subtle day label for extra detail */}
          {unlocked && !isOpened && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: entry.day * 0.02 + 0.2 }}
              className="text-xs font-semibold tracking-wider uppercase relative z-10"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              December
            </motion.span>
          )}
          
          {isOpened && unlocked && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800"
            >
              <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
          
          {!unlocked && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: entry.day * 0.02 + 0.2 }}
              className="absolute top-2 right-2"
            >
              <svg className="w-7 h-7 text-gray-400 dark:text-gray-500 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
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
