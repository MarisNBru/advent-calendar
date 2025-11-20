export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 py-12 border-t-4 relative overflow-hidden rounded-2xl" style={{
      borderColor: 'rgba(212, 175, 55, 0.4)',
      background: 'rgba(101, 67, 33, 0.75)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(255, 150, 50, 0.2)',
      borderTop: '2px solid rgba(255, 140, 66, 0.4)'
    }}>

      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-3xl md:text-4xl font-bold mb-4" style={{
          fontFamily: "'Crimson Text', serif",
          color: '#FFE4B5',
          textShadow: '2px 2px 0 #D2691E, 4px 4px 10px rgba(255, 100, 0, 0.5)',
        }}>
          ¡Feliz Navidad, mi amor!
        </p>
        
        {/* Decorative divider */}
        <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-4"></div>
        
        <p className="text-xl md:text-2xl mb-3" style={{
          fontFamily: "'Merriweather', serif",
          color: '#FFF8DC',
          fontWeight: 400,
        }}>
          Merry Christmas to the most wonderful person in my life
        </p>
        
        <p className="text-lg md:text-xl mb-6 italic" style={{
          fontFamily: "'Caveat', cursive",
          color: '#FFB347',
          fontWeight: 600,
        }}>
          Every day with you is a gift. Te amo con todo mi corazón
        </p>
        
        <div className="border-t-2 pt-6 mt-8" style={{ borderColor: 'rgba(255, 140, 66, 0.4)' }}>
          <p className="text-sm" style={{
            fontFamily: "'Merriweather', serif",
            color: '#F5DEB3',
          }}>
            © {currentYear} • Crafted with endless love by Maris
          </p>
          <p className="text-xs mt-2" style={{
            fontFamily: "'Merriweather', serif",
            color: '#DEB887',
            fontStyle: 'italic',
          }}>
            For Aleida Pérez Méndez
          </p>
        </div>
      </div>
    </footer>
  );
}
