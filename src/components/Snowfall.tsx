import { useMemo, type CSSProperties } from 'react';

interface FlakeConfig {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  blur: number;
  drift: number;
}

const FLAKE_COUNT = 80;

export default function Snowfall() {
  const flakes = useMemo<FlakeConfig[]>(() => {
    return Array.from({ length: FLAKE_COUNT }).map((_, index) => {
      const depth = Math.random();
      return {
        id: index,
        size: 2 + depth * 3,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + depth * 14,
        opacity: 0.25 + depth * 0.45,
        blur: depth * 1.5,
        drift: (Math.random() - 0.5) * 40,
      } satisfies FlakeConfig;
    });
  }, []);

  return (
    <div className="snowfall" aria-hidden="true">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            filter: `blur(${flake.blur}px)`,
            '--flake-opacity': flake.opacity,
            '--snow-drift': `${flake.drift}px`,
          } as CSSProperties & {
            '--flake-opacity': number;
            '--snow-drift': string;
          }}
        />
      ))}
    </div>
  );
}
