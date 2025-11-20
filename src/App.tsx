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
      // Check for # key (works with different keyboard layouts)
      if (e.key === '#' || e.key === 'Shift+3' || (e.shiftKey && e.key === '3')) {
        e.preventDefault();
        setSecretMode(prev => {
          const newMode = !prev;
          console.log('🎄 Secret mode:', newMode ? 'ACTIVATED' : 'DEACTIVATED');
          return newMode;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Additional check with keydown event for better compatibility
      if (e.shiftKey && e.code === 'Digit3') {
        e.preventDefault();
        setSecretMode(prev => {
          const newMode = !prev;
          console.log('🎄 Secret mode:', newMode ? 'ACTIVATED' : 'DEACTIVATED');
          return newMode;
        });
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);

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

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url("/pics/fireplace-room.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center p-10 rounded-3xl" style={{
          background: 'rgba(255, 248, 220, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 2px 20px rgba(212, 175, 55, 0.3)'
        }}>
          <motion.div
            className="w-24 h-24 mx-auto mb-8 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full" style={{
              border: '6px solid rgba(212, 175, 55, 0.4)',
            }}></div>
            <div className="absolute inset-0 rounded-full" style={{
              borderTop: '6px solid #D4AF37',
              filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))'
            }}></div>
          </motion.div>
          <p className="text-3xl font-bold mb-3" style={{
            fontFamily: "'Crimson Text', serif",
            color: '#8B2E2E',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3), 0 0 20px rgba(212, 175, 55, 0.5)'
          }}>Loading Your Advent Calendar...</p>
          <p className="text-lg italic" style={{
            fontFamily: "'Merriweather', serif",
            color: '#6B5B4C',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>Preparing the magic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url("/pics/fireplace-room.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center max-w-md p-12 rounded-3xl" style={{
          background: 'rgba(255, 248, 220, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 2px 20px rgba(212, 175, 55, 0.3)',
          border: '5px solid #D4AF37'
        }}>
          <div className="text-7xl mb-6" style={{
            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))'
          }}>🎄</div>
          <h2 className="text-4xl font-bold mb-4" style={{
            fontFamily: "'Crimson Text', serif",
            color: '#8B2E2E',
            textShadow: '2px 2px 0 #D4AF37, 4px 4px 8px rgba(139, 46, 46, 0.3)'
          }}>Oops!</h2>
          <p className="text-xl leading-relaxed mb-4" style={{
            fontFamily: "'Merriweather', serif",
            color: '#6B5B4C'
          }}>{error}</p>
          <div className="text-base italic" style={{
            fontFamily: "'Merriweather', serif",
            color: '#8B7355'
          }}>Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden" style={{
        backgroundImage: 'url("/pics/fireplace-room.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Header />

          {(previewMode || secretMode) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-6 p-6 rounded-2xl shadow-2xl text-center relative overflow-hidden"
              style={{
                background: 'rgba(255, 248, 220, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '4px solid #D4AF37',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(212, 175, 55, 0.3)'
              }}
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
              
              <p className="font-bold text-xl flex items-center justify-center gap-2 relative z-10" style={{
                fontFamily: "'Crimson Text', serif",
                color: '#8B2E2E',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                {secretMode ? '✨ Secret Mode Active ✨' : '🎁 Preview Mode Active 🎁'}
              </p>
              <p className="mt-3 relative z-10 text-lg" style={{
                fontFamily: "'Merriweather', serif",
                color: '#6B5B4C'
              }}>
                All doors are unlocked for you
              </p>
              {secretMode && (
                <p className="text-sm mt-3 italic relative z-10" style={{
                  fontFamily: "'Merriweather', serif",
                  color: '#8B7355'
                }}>
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
