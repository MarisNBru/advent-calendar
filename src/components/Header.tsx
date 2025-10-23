import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="text-center py-12 px-4 relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-transparent to-transparent dark:from-rose-950/15">
      {/* Decorative snowflakes - more winter wonderland feel */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl md:text-2xl opacity-20"
            initial={{ y: -20, x: Math.random() * 100 + '%' }}
            animate={{ 
              y: '100vh',
              rotate: 360,
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            ❄️
          </motion.div>
        ))}
        
        {/* Twinkling stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-sm opacity-30"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {/* Christmas lights decoration */}
      <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none">
        <div className="flex justify-around items-start h-full max-w-6xl mx-auto">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`light-${i}`}
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#ffc9de'][i % 5],
                boxShadow: `0 0 10px ${['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#ffc9de'][i % 5]}`,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>

      <motion.h1 
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-emerald-400 dark:from-rose-300 dark:via-pink-200 dark:to-emerald-300 mb-4 drop-shadow-lg relative z-10 mt-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          duration: 0.8
        }}
        style={{
          textShadow: '0 0 40px rgba(251, 207, 232, 0.4), 0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        Aleida's Advent Calendar
      </motion.h1>
      
      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium mb-2">
          24 Days of Love, Surprises & Christmas Magic
        </p>
        <p className="text-base md:text-lg text-rose-400 dark:text-rose-300 font-semibold mb-1">
          Para mi amor, mein Schatz, my baby
        </p>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 italic">
          Con todo mi corazón, de tu niño que te ama
        </p>
      </motion.div>
    </header>
  );
}
