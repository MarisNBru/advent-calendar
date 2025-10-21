import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { CalendarEntry } from '../types';

interface ContentRendererProps {
  entry: CalendarEntry;
}

export default function ContentRenderer({ entry }: ContentRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const voucherRef = useRef<HTMLDivElement>(null);

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
    <div className="space-y-6 animate-fadeIn">
      <motion.h3 
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {entry.title}
      </motion.h3>

      {entry.type === 'text' && (
        <motion.p 
          className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap"
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
            <p className="text-gray-700 dark:text-gray-300 text-lg">
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
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {entry.content}
          </p>
          <motion.a
            href={entry.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl"
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
          className="space-y-4 p-8 bg-gradient-to-br from-red-50 via-white to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-4 border-dashed border-red-300 dark:border-red-700 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 text-3xl">🎁</div>
          <div className="absolute top-2 right-2 text-3xl">🎀</div>
          <div className="absolute bottom-2 left-2 text-3xl">✨</div>
          <div className="absolute bottom-2 right-2 text-3xl">🎊</div>

          <p className="text-gray-800 dark:text-gray-100 text-xl font-semibold text-center relative z-10">
            {entry.content}
          </p>
          
          {entry.voucherCode && (
            <div className="space-y-3 relative z-10">
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium text-center">Voucher Code:</p>
                <p className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 tracking-widest text-center">
                  {entry.voucherCode}
                </p>
              </motion.div>
              
              {!qrGenerated && (
                <motion.button
                  onClick={generateQR}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black dark:from-gray-700 dark:to-gray-800 text-white font-semibold rounded-xl transition-all shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📱 Show QR Code
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
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💾 Save as Image
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}

          {entry.voucherValidUntil && (
            <p className="text-sm text-gray-700 dark:text-gray-300 italic text-center font-medium relative z-10">
              ⏰ Valid until: {entry.voucherValidUntil}
            </p>
          )}
        </motion.div>
      )}

      {entry.audioUrl && (
        <motion.div 
          className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">🎵 Play Audio:</p>
          <audio controls className="w-full">
            <source src={entry.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </motion.div>
      )}
    </div>
  );
}
