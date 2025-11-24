import { motion } from 'framer-motion';
import { useHolidayMusic } from '../hooks/useHolidayMusic';

export default function MusicToggle() {
  const { isPlaying, togglePlayback, volume, setVolume } = useHolidayMusic();

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Klang</p>
            <p className="font-semibold text-amber-100 text-lg -mt-1">Festive Carols</p>
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              isPlaying
                ? 'bg-amber-100 text-red-800'
                : 'bg-red-700/70 text-amber-100 hover:bg-red-600'
            }`}
            style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.35)' }}
          >
            <span aria-hidden="true">{isPlaying ? '⏸' : '▶️'}</span>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="music-volume" className="text-xs font-medium text-amber-100/80 flex items-center justify-between">
            <span>Leise rieselt...</span>
            <span className="tabular-nums">{Math.round(volume * 100)}%</span>
          </label>
          <input
            id="music-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="mt-2 w-full"
            style={{ accentColor: '#D4AF37' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
