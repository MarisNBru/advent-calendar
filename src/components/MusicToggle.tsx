import { motion } from 'framer-motion';
import { useHolidayMusic } from '../hooks/useHolidayMusic';

export default function MusicToggle() {
  const { volume, setVolume } = useHolidayMusic();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute top-6 right-6 z-20"
    >
      <div
        className="w-64 rounded-2xl px-5 py-4 shadow-xl border"
        style={{
          background: 'rgba(38, 20, 10, 0.75)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
          boxShadow: '0 15px 30px rgba(0,0,0,0.5), inset 0 1px 6px rgba(255, 255, 255, 0.15)'
        }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Music</p>

        <div className="mt-4">
          <input
            aria-label="Music volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-full"
            style={{ accentColor: '#D4AF37' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
