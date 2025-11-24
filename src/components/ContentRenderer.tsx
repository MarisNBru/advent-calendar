import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { CalendarEntry } from '../types';

interface ContentRendererProps {
  entry: CalendarEntry;
}

const contentPalette = {
  ink: '#3E2A20',
  muted: '#6B5B4C',
  accent: '#5C1F1A',
  ember: '#8B2E2E',
  copper: '#B4653A',
  pine: '#2F4F3E',
  gold: '#D4AF37',
  cream: '#FFF8DC',
  parchment: '#F9F1E3',
  parchmentDeep: '#E6D4BE'
} as const;

export default function ContentRenderer({ entry }: ContentRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const voucherRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const galleryImages = entry.galleryImages ?? [];
  const hasGallery = galleryImages.length > 0;
  const hasStandaloneImage = Boolean(entry.imageUrl && entry.type !== 'image');
  const showGalleryCaption = entry.type === 'gallery';

  useEffect(() => {
    setQrGenerated(false);
    setActiveSlide(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [entry.day]);

  const generateQR = async () => {
    if (canvasRef.current && entry.voucherCode) {
      try {
        await QRCode.toCanvas(canvasRef.current, entry.voucherCode, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrGenerated(true);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    }
  };

  const saveAsImage = async () => {
    if (!voucherRef.current) return;

    try {
      // Use html2canvas if available, or fallback to simple screenshot
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Simple implementation - for production use html2canvas
      const rect = voucherRef.current.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      
      // Create download
      const link = document.createElement('a');
      link.download = `gutschein-${entry.day}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" style={{ color: contentPalette.ink }}>
      <motion.h3 
        className="text-3xl md:text-4xl font-bold"
        style={{
          fontFamily: "'Crimson Text', serif",
          color: contentPalette.accent,
          textShadow: '2px 2px 8px rgba(0,0,0,0.25)'
        }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {entry.title}
      </motion.h3>

      {entry.type === 'text' && (
        <motion.p 
          className="text-lg leading-relaxed whitespace-pre-wrap"
          style={{
            fontFamily: "'Merriweather', serif",
            color: contentPalette.ink
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {entry.content}
        </motion.p>
      )}

      {entry.type === 'image' && entry.imageUrl && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.img
            src={entry.imageUrl}
            alt={entry.title}
            className="w-full rounded-xl shadow-2xl"
            loading="lazy"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          {entry.content && (
            <p className="text-lg" style={{ fontFamily: "'Merriweather', serif", color: contentPalette.ink }}>
              {entry.content}
            </p>
          )}
        </motion.div>
      )}

      {hasStandaloneImage && entry.imageUrl && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.img
            src={entry.imageUrl}
            alt={entry.title}
            className="w-full rounded-xl shadow-2xl"
            loading="lazy"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {hasGallery && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ border: `1px solid ${contentPalette.gold}` }}
          >
            <motion.img
              key={galleryImages[activeSlide]}
              src={galleryImages[activeSlide]}
              alt={`${entry.title} ${activeSlide + 1}`}
              className="w-full object-cover"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    background: 'rgba(0,0,0,0.55)',
                    color: contentPalette.cream,
                    border: `1px solid rgba(255,255,255,0.4)`
                  }}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    background: 'rgba(0,0,0,0.55)',
                    color: contentPalette.cream,
                    border: `1px solid rgba(255,255,255,0.4)`
                  }}
                >
                  Next
                </button>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="flex justify-center gap-3">
              {galleryImages.map((_, index) => (
                <button
                  key={`${entry.day}-dot-${index}`}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className="h-2 w-8 rounded-full transition-all"
                  style={{
                    background: index === activeSlide ? contentPalette.accent : 'rgba(92,31,26,0.25)'
                  }}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          )}
          {showGalleryCaption && entry.content && (
            <p className="text-lg" style={{ fontFamily: "'Merriweather', serif", color: contentPalette.ink }}>
              {entry.content}
            </p>
          )}
        </motion.div>
      )}

      {entry.type === 'link' && entry.linkUrl && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg" style={{ fontFamily: "'Merriweather', serif", color: contentPalette.ink }}>
            {entry.content}
          </p>
          <motion.a
            href={entry.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold tracking-wide transition-all"
            style={{
              background: `linear-gradient(135deg, ${contentPalette.accent}, ${contentPalette.copper})`,
              color: contentPalette.cream,
              boxShadow: '0 12px 26px rgba(18, 9, 6, 0.35)',
              border: `1px solid ${contentPalette.gold}`
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Link
            <motion.svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </motion.svg>
          </motion.a>
        </motion.div>
      )}

      {entry.type === 'voucher' && (
        <motion.div 
          ref={voucherRef} 
          className="space-y-5 p-8 rounded-2xl relative overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(249, 241, 227, 0.95), rgba(230, 212, 190, 0.9))`,
            border: `1px solid ${contentPalette.gold}`,
            boxShadow: '0 18px 40px rgba(14, 8, 4, 0.35), inset 0 2px 15px rgba(255,255,255,0.4)'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Decorative corner elements */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-4 left-4 w-10 h-10" style={{ borderTop: `2px solid ${contentPalette.gold}`, borderLeft: `2px solid ${contentPalette.gold}` }}></div>
            <div className="absolute top-4 right-4 w-10 h-10" style={{ borderTop: `2px solid ${contentPalette.gold}`, borderRight: `2px solid ${contentPalette.gold}` }}></div>
            <div className="absolute bottom-4 left-4 w-10 h-10" style={{ borderBottom: `2px solid ${contentPalette.gold}`, borderLeft: `2px solid ${contentPalette.gold}` }}></div>
            <div className="absolute bottom-4 right-4 w-10 h-10" style={{ borderBottom: `2px solid ${contentPalette.gold}`, borderRight: `2px solid ${contentPalette.gold}` }}></div>
          </div>

          <p className="text-xl font-semibold text-center relative z-10" style={{ fontFamily: "'Merriweather', serif", color: contentPalette.accent }}>
            {entry.content}
          </p>
          
          {entry.voucherCode && (
            <div className="space-y-3 relative z-10">
              <motion.div 
                className="p-6 rounded-xl shadow-lg"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${contentPalette.parchmentDeep}`
                }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm mb-2 font-medium text-center" style={{ color: contentPalette.muted }}>Voucher Code:</p>
                <p className="text-3xl font-mono font-black tracking-widest text-center" style={{
                  color: contentPalette.accent,
                  letterSpacing: '0.35rem'
                }}>
                  {entry.voucherCode}
                </p>
              </motion.div>
              
              {!qrGenerated && (
                <motion.button
                  onClick={generateQR}
                  className="w-full px-6 py-3 rounded-xl font-semibold tracking-wide transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${contentPalette.pine}, ${contentPalette.accent})`,
                    color: contentPalette.cream,
                    boxShadow: '0 10px 24px rgba(16, 10, 6, 0.35)',
                    border: `1px solid ${contentPalette.gold}`
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Show QR Code
                </motion.button>
              )}

              {qrGenerated && (
                <motion.div 
                  className="flex flex-col items-center space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="bg-white p-4 rounded-xl shadow-xl">
                    <canvas ref={canvasRef} />
                  </div>
                  <motion.button
                    onClick={saveAsImage}
                    className="px-6 py-3 rounded-xl font-semibold tracking-wide transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${contentPalette.pine}, ${contentPalette.copper})`,
                      color: contentPalette.cream,
                      boxShadow: '0 10px 24px rgba(16, 10, 6, 0.35)',
                      border: `1px solid ${contentPalette.gold}`
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save as Image
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}

          {entry.voucherValidUntil && (
            <p className="text-sm italic text-center font-medium relative z-10" style={{ color: contentPalette.muted }}>
              Valid until: {entry.voucherValidUntil}
            </p>
          )}
        </motion.div>
      )}

      {entry.audioUrl && (
        <motion.div 
          className="mt-6 p-5 rounded-2xl"
          style={{
            background: `linear-gradient(120deg, rgba(248, 240, 228, 0.9), rgba(233, 218, 198, 0.9))`,
            border: `1px solid ${contentPalette.parchmentDeep}`,
            boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm mb-3 font-medium" style={{ color: contentPalette.muted }}>Play Audio:</p>
          <audio controls className="w-full">
            <source src={entry.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </motion.div>
      )}
    </div>
  );
}
