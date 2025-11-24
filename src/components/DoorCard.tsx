import { motion } from 'framer-motion';
import { CalendarEntry } from '../types';
import { isDoorUnlocked } from '../utils/dateUtils';

interface DoorCardProps {
  entry: CalendarEntry;
  isOpened: boolean;
  onOpen: () => void;
  previewMode: boolean;
}

const palette = {
  deepRed: '#5C1F1A',
  ember: '#8B2E2E',
  copper: '#B4653A',
  russet: '#9C4C2F',
  pine: '#2C5F2D',
  spruce: '#1F3A2B',
  moss: '#4C6B40',
  cedar: '#3E2723',
  walnut: '#5B4636',
  gold: '#D4AF37',
  softGold: '#E2C079',
  cream: '#FFF8DC',
  parchment: '#F5E6D3'
} as const;

type GradientStops = { from: string; via: string; to: string };
type ThemePattern = 'guadalupe' | 'posada' | 'nicholas' | 'navidad' | 'maria' | 'advent' | 'default';
type ThemeState = { gradient: GradientStops; border: string; pattern?: ThemePattern };

const createGradient = (from: string, via: string, to: string): GradientStops => ({ from, via, to });

const createLockedTheme = (pattern?: ThemePattern): ThemeState => ({
  gradient: createGradient('#4B3B31', '#3B2C24', '#231915'),
  border: '#5F4C3F',
  pattern: pattern ?? 'default'
});

const themes: Record<number, { unlocked: ThemeState; locked: ThemeState }> = {
  1: {
    unlocked: {
      gradient: createGradient(palette.spruce, palette.pine, palette.moss),
      border: palette.gold,
      pattern: 'advent'
    },
    locked: createLockedTheme('advent')
  },
  6: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.ember, palette.copper),
      border: palette.russet,
      pattern: 'nicholas'
    },
    locked: createLockedTheme('nicholas')
  },
  8: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.russet, palette.softGold),
      border: palette.softGold,
      pattern: 'maria'
    },
    locked: createLockedTheme('maria')
  },
  12: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.ember, palette.copper),
      border: palette.gold,
      pattern: 'guadalupe'
    },
    locked: createLockedTheme('guadalupe')
  },
  16: {
    unlocked: {
      gradient: createGradient(palette.copper, palette.ember, palette.pine),
      border: palette.softGold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  17: {
    unlocked: {
      gradient: createGradient(palette.ember, palette.copper, palette.pine),
      border: palette.gold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  18: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.ember, palette.softGold),
      border: palette.gold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  19: {
    unlocked: {
      gradient: createGradient(palette.russet, palette.ember, palette.copper),
      border: palette.russet,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  20: {
    unlocked: {
      gradient: createGradient(palette.ember, palette.copper, palette.softGold),
      border: palette.gold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  21: {
    unlocked: {
      gradient: createGradient(palette.pine, palette.ember, palette.copper),
      border: palette.softGold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  22: {
    unlocked: {
      gradient: createGradient(palette.ember, palette.russet, palette.pine),
      border: palette.gold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  23: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.ember, palette.copper),
      border: palette.softGold,
      pattern: 'posada'
    },
    locked: createLockedTheme('posada')
  },
  24: {
    unlocked: {
      gradient: createGradient(palette.deepRed, palette.ember, palette.softGold),
      border: palette.gold,
      pattern: 'navidad'
    },
    locked: createLockedTheme('navidad')
  }
};

// Storybook illustrated themes with warm Christmas colors
const getThemeForDay = (day: number, unlocked: boolean): ThemeState => {
  const theme = themes[day];
  if (!theme) {
    const isEven = day % 2 === 0;
    if (unlocked) {
      return isEven
        ? {
            gradient: createGradient(palette.spruce, palette.pine, palette.moss),
            border: palette.gold,
            pattern: 'default'
          }
        : {
            gradient: createGradient(palette.deepRed, palette.ember, palette.copper),
            border: palette.russet,
            pattern: 'default'
          };
    }
    return createLockedTheme('default');
  }

  return unlocked ? theme.unlocked : theme.locked;
};

// Get decorative pattern based on theme - Christmas-themed with CSS effects
const getPattern = (pattern?: ThemePattern) => {
  switch (pattern) {
    case 'guadalupe':
      return (
        <>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full" style={{ border: '1px solid rgba(212, 175, 55, 0.5)' }}></div>
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full" style={{ border: '1px solid rgba(212, 175, 55, 0.35)' }}></div>
            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full" style={{ border: '1px solid rgba(180, 117, 60, 0.4)' }}></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full" style={{ border: '1px solid rgba(212, 175, 55, 0.45)' }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 via-transparent to-transparent"></div>
        </>
      );
    case 'posada':
      return (
        <>
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-x-6 top-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(244, 219, 182, 0.7), transparent)' }}></div>
            <div className="absolute inset-x-8 top-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)' }}></div>
            <div className="absolute inset-x-10 top-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(180, 117, 60, 0.4), transparent)' }}></div>
          </div>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 15%, rgba(244, 219, 182, 0.3), transparent 60%)' }}></div>
        </>
      );
    case 'nicholas':
      return (
        <>
          <div className="absolute bottom-3 left-4 w-6 h-10 rounded-b-full opacity-25" style={{ border: '2px solid rgba(139, 46, 46, 0.6)' }}></div>
          <div className="absolute bottom-3 right-4 w-6 h-10 rounded-b-full opacity-25" style={{ border: '2px solid rgba(139, 46, 46, 0.4)' }}></div>
          <div className="absolute top-4 left-5 w-2 h-2 rounded-full bg-white/40"></div>
          <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-white/30"></div>
        </>
      );
    case 'navidad':
      return (
        <>
          <div className="absolute top-3 left-5 w-2 h-2 rotate-45 bg-white/60"></div>
          <div className="absolute top-6 right-6 w-2 h-2 rotate-45 bg-yellow-200/70"></div>
          <div className="absolute top-10 left-1/2 w-2 h-2 rotate-45 bg-yellow-100/60"></div>
          <div className="absolute bottom-4 left-6 w-10 h-1 bg-gradient-to-r from-green-200/30 via-green-100/40 to-green-200/30"></div>
          <div className="absolute bottom-4 right-6 w-10 h-1 bg-gradient-to-r from-green-200/30 via-green-100/40 to-green-200/30"></div>
          <div className="absolute inset-0 bg-gradient-radial from-yellow-100/15 via-transparent to-transparent"></div>
        </>
      );
    case 'maria':
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div className="w-20 h-20 bg-sky-200 rounded-full blur-xl animate-pulse"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-sky-100/5 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-70"></div>
        </>
      );
    case 'advent':
      return (
        <>
          <div className="absolute top-2 left-3 w-1 h-8 bg-emerald-200/40 rounded-full"></div>
          <div className="absolute top-2 right-3 w-1 h-8 bg-emerald-200/30 rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/10 via-transparent to-red-100/10"></div>
        </>
      );
    default:
      return (
        <>
          <div className="absolute top-3 left-4 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-5 right-5 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-4 left-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      );
  }
};

export default function DoorCard({ entry, isOpened, onOpen, previewMode }: DoorCardProps) {
  const unlocked = isDoorUnlocked(entry.day, previewMode);
  const theme = getThemeForDay(entry.day, unlocked);
  const gradientBackground = `linear-gradient(135deg, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`;
  const openedBackground = 'linear-gradient(135deg, rgba(249, 236, 217, 0.95), rgba(242, 224, 197, 0.92))';
  const cardBackground = isOpened && unlocked ? openedBackground : gradientBackground;
  const dayColor = !unlocked
    ? '#C4B6A7'
    : isOpened
      ? palette.deepRed
      : palette.cream;
  const dayShadow = !unlocked
    ? '2px 2px 5px rgba(0,0,0,0.55)'
    : isOpened
      ? '2px 2px 6px rgba(62,39,35,0.45)'
      : `3px 3px 6px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.35), -1px -1px 0 ${theme.border}`;
  const textStroke = !unlocked ? '1px rgba(34,24,20,0.4)' : '1px rgba(62,39,35,0.3)';

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
          rotateY: 8,
          scale: 0.96,
          opacity: 1,
          transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 20 }
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
            scale: 1.05,
            y: -4,
            boxShadow: '0 18px 32px rgba(17, 10, 8, 0.55), 0 0 24px rgba(212, 175, 55, 0.3)',
            transition: { duration: 0.3, ease: "easeOut" }
          } : {}}
          whileTap={unlocked && !isOpened ? { 
            scale: 0.96,
            y: 0,
            transition: { duration: 0.1, ease: "easeInOut" }
          } : {}}
          className={`
            relative w-full h-full rounded-2xl transition-all duration-200
            flex items-center justify-center overflow-hidden
            ${unlocked 
              ? 'cursor-pointer text-white' 
              : 'cursor-not-allowed text-stone-400'
            }
            ${isOpened && unlocked ? 'opacity-95' : 'opacity-100'}
            focus:outline-none
          `}
          style={{
            border: `4px solid ${theme.border}`,
            background: cardBackground,
            boxShadow: unlocked 
              ? isOpened 
                ? '0 4px 18px rgba(0,0,0,0.45), inset 0 4px 12px rgba(62,39,35,0.55)'
                : '0 12px 28px rgba(17,10,8,0.55), 0 6px 18px rgba(212,175,55,0.25), inset 0 2px 8px rgba(255,248,220,0.35)'
              : '0 4px 10px rgba(0,0,0,0.4)',
            filter: isOpened && unlocked ? 'saturate(0.9)' : 'none',
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
          
          {/* Opened parchment overlay */}
          {isOpened && unlocked && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, rgba(245, 230, 211, 0.4), rgba(255, 248, 220, 0.5))',
                mixBlendMode: 'soft-light'
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
                background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.45), transparent 70%)',
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
              color: dayColor,
              textShadow: dayShadow,
              WebkitTextStroke: textStroke,
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
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{
                scale: [0, 1.15, 1],
                rotate: [10, -4, 0],
                opacity: 1
              }}
              transition={{
                duration: 0.65,
                type: 'spring',
                stiffness: 180,
                damping: 16
              }}
              className="absolute -bottom-4 -right-4 w-16 h-20 z-20 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 rounded-t-md border border-[#5c1f1a] bg-[#b37a2c] shadow-sm"></div>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-8 origin-top bg-gradient-to-b from-[#fbeac8] via-[#e9c982] to-[#c08a39]"
              ></motion.div>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(212,175,55,0.3)), linear-gradient(135deg, ${palette.gold}, ${palette.softGold})`,
                  border: '2px solid rgba(92, 31, 26, 0.6)',
                  boxShadow: '0 8px 18px rgba(33, 18, 12, 0.35), inset 0 4px 10px rgba(255, 255, 255, 0.35)'
                }}
              >
                <motion.svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5c1f1a"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <path
                    fill="#fdf5dd"
                    d="M12 2.5l2.62 5.32 5.88.86-4.24 4.13 1 5.83L12 15.9l-5.26 2.74 1-5.83L3.5 8.68l5.88-.86L12 2.5z"
                  />
                </motion.svg>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(140deg, rgba(255,255,255,0.4), transparent 60%)',
                    mixBlendMode: 'screen'
                  }}
                ></div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <div
                    className="w-3 h-1.5 rounded-full"
                    style={{ background: '#2f5d34', transform: 'rotate(-18deg)' }}
                  ></div>
                  <div className="w-2 h-2 rounded-full bg-[#b4241e] shadow-[0_0_6px_rgba(180,36,30,0.6)]"></div>
                  <div
                    className="w-3 h-1.5 rounded-full"
                    style={{ background: '#2f5d34', transform: 'rotate(18deg)' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
          
          {!unlocked && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: entry.day * 0.03 + 0.3 }}
              className="absolute top-3 right-3 z-10"
            >
              <svg className="w-8 h-8 drop-shadow-lg" style={{ color: '#8C8177' }} fill="currentColor" viewBox="0 0 20 20">
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
