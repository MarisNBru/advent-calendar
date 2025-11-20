import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="text-center py-16 px-4 relative overflow-hidden rounded-2xl mb-8" style={{
      background: 'rgba(101, 67, 33, 0.75)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(255, 150, 50, 0.2)',
      border: '2px solid rgba(212, 175, 55, 0.3)'
    }}>
      {/* Ornamental divider top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-600/50 to-transparent"></div>

      <motion.h1 
        className="font-bold relative z-10 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 150, 
          damping: 12,
          duration: 0.9
        }}
        style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          color: '#FFE4B5',
          textShadow: `
            2px 2px 0 #D2691E,
            4px 4px 20px rgba(255, 100, 0, 0.6),
            0 0 40px rgba(255, 150, 50, 0.3)
          `,
          letterSpacing: '0.02em',
        }}
      >
        Aleida's Advent Calendar
      </motion.h1>

      {/* Handdrawn underline */}
      <motion.div
        className="w-64 h-1 mx-auto mb-8 relative"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path
            d="M 0,5 Q 50,2 100,5 T 200,5"
            stroke="#FF8C42"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      
      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <p className="text-2xl md:text-3xl font-medium mb-4" style={{
          fontFamily: "'Merriweather', serif",
          color: '#FFF8DC',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
        }}>
          24 Days of Love, Surprises & Christmas Magic
        </p>
        <p className="text-xl md:text-2xl font-semibold mb-2" style={{
          fontFamily: "'Caveat', cursive",
          color: '#FFB347',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
        }}>
          Para mi amor, mein Schatz, my baby
        </p>
        <p className="text-lg md:text-xl italic" style={{
          fontFamily: "'Merriweather', serif",
          color: '#F5DEB3',
          fontWeight: 300
        }}>
          Con todo mi corazón, de tu niño que te ama
        </p>
      </motion.div>
    </header>
  );
}
