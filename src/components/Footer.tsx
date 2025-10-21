import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 py-12 border-t-2 border-red-200 dark:border-red-900 bg-gradient-to-b from-transparent via-red-50/30 to-green-50/30 dark:from-transparent dark:via-red-950/20 dark:to-green-950/20 relative overflow-hidden">
      {/* Decorative snow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/40 to-transparent dark:from-white/10 pointer-events-none"></div>
      
      {/* Twinkling lights decoration */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#ef4444', '#22c55e', '#eab308', '#3b82f6'][i % 4],
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 8px ${['#ef4444', '#22c55e', '#eab308', '#3b82f6'][i % 4]}`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 via-green-600 to-red-600 dark:from-red-400 dark:via-green-400 dark:to-red-400 text-transparent bg-clip-text">
          ¡Feliz Navidad, mi amor!
        </p>
        
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-2">
          Merry Christmas to the most wonderful person in my life
        </p>
        
        <p className="text-sm md:text-base text-rose-600 dark:text-rose-400 mb-4 italic">
          Every day with you is a gift. Te amo con todo mi corazón
        </p>
        
        <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} • Crafted with endless love by Maris
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            For Aleida Pérez Méndez
          </p>
        </div>
      </div>
    </footer>
  );
}
