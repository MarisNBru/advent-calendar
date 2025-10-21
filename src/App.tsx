import { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarEntry } from './types';
import { useAdventState } from './hooks/useAdventState';
import DoorCard from './components/DoorCard';
import DayModal from './components/DayModal';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [secretMode, setSecretMode] = useState(false);

  const { isDoorOpened, toggleDoor } = useAdventState();

  useEffect(() => {
    // Check for preview mode in URL
    const params = new URLSearchParams(window.location.search);
    setPreviewMode(params.get('preview') === 'true');

    // Secret key listener for "#" key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '#') {
        setSecretMode(prev => !prev);
        console.log('🎄 Secret mode toggled!');
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    // Load calendar data
    const loadData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}data/calendar.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load calendar data: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data) || data.length !== 24) {
          throw new Error('Invalid calendar data format');
        }

        setCalendarData(data);
      } catch (err) {
        console.error('Error loading calendar data:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Daten');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const handleDoorClick = (entry: CalendarEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
    if (!isDoorOpened(entry.day)) {
      toggleDoor(entry.day);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEntry(null), 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading Advent Calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative overflow-hidden">
        {/* Animated winter wonderland background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Falling snowflakes across entire page */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              className="absolute text-white opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
              }}
              initial={{ y: -50, rotate: 0 }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [0, 360],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            >
              ❄️
            </motion.div>
          ))}
          
          {/* Christmas decorations in corners */}
          <motion.div 
            className="absolute top-20 left-10 text-6xl opacity-15 dark:opacity-10"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎅
          </motion.div>
          <motion.div 
            className="absolute top-40 right-20 text-5xl opacity-15 dark:opacity-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⛄
          </motion.div>
          <motion.div 
            className="absolute bottom-40 left-20 text-7xl opacity-15 dark:opacity-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎁
          </motion.div>
          <motion.div 
            className="absolute bottom-20 right-32 text-6xl opacity-15 dark:opacity-10"
            animate={{ 
              rotate: [0, 20, -20, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⭐
          </motion.div>
          
          {/* Subtle sparkles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Magical gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-red-100/20 dark:to-red-950/20 pointer-events-none"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Header />

          {(previewMode || secretMode) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-6 p-5 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl shadow-2xl text-center relative overflow-hidden"
            >
              {/* Animated sparkles inside banner */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-xl"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
              
              <p className="text-yellow-900 dark:text-yellow-200 font-bold text-lg flex items-center justify-center gap-2 relative z-10">
                {secretMode ? 'Secret Mode Active!' : 'Preview Mode Active'}
              </p>
              <p className="text-yellow-800 dark:text-yellow-300 mt-2 relative z-10">
                All doors are unlocked for you
              </p>
              {secretMode && (
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2 italic relative z-10">
                  Press "#" again to return to normal mode
                </p>
              )}
            </motion.div>
          )}

          <main className="max-w-6xl mx-auto">
            <motion.div 
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-5 lg:gap-6 p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {calendarData.map((entry) => (
                <DoorCard
                  key={entry.day}
                  entry={entry}
                  isOpened={isDoorOpened(entry.day)}
                  onOpen={() => handleDoorClick(entry)}
                  previewMode={previewMode || secretMode}
                />
              ))}
            </motion.div>
          </main>

          <Footer />
        </div>

        <DayModal
          entry={selectedEntry}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </Router>
  );
}

export default App;
