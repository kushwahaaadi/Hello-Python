import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface PreloaderOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export const PreloaderOverlay: React.FC<PreloaderOverlayProps> = ({ active, onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<'drawing' | 'docking'>('drawing');

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    setPercent(0);
    setPhase('drawing');

    const start = performance.now();
    const drawDuration = 1450;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / drawDuration);
      // Smooth ease-out counter 0 -> 100
      const eased = 1 - Math.pow(1 - t, 3);
      setPercent(Math.round(eased * 100));

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setPhase('docking');
      }
    };

    rafId = window.requestAnimationFrame(tick);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 2050);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(completeTimer);
    };
  }, [active, prefersReducedMotion, onComplete]);

  return (
    <AnimatePresence>
      {active && !prefersReducedMotion && (
        <motion.div
          key="csi-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#030304] select-none"
          aria-label="Loading Hail CSI!"
        >
          {/* Center Stage: Self-Drawing CSI Emblem + Signature Stroke */}
          <motion.div
            animate={
              phase === 'docking'
                ? {
                    x: 'calc(-50vw + 48px)',
                    y: 'calc(-50vh + 44px)',
                    scale: 0.46,
                    opacity: 0,
                  }
                : { x: 0, y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Self-Drawing Circular CSI Emblem */}
            <div className="relative h-24 w-24 sm:h-28 sm:w-28">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-[#F4F4F5]"
              >
                {/* Outer Ring draws first */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Middle Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeOpacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Inner Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Inner geometric CSI triangle + bar */}
                <motion.path
                  d="M 34 50 L 58 35 L 58 65 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="currentColor"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.5, delay: 0.45 },
                    fillOpacity: { duration: 0.35, delay: 0.8 },
                  }}
                />
                <motion.rect
                  x="61"
                  y="44"
                  width="6"
                  height="12"
                  fill="currentColor"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.75 }}
                />
              </svg>
            </div>

            {/* Handwritten Signature-Making Flourish underneath logo */}
            <svg
              viewBox="0 0 320 90"
              fill="none"
              overflow="visible"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-3 h-16 w-60 text-zinc-200"
            >
              <defs>
                <clipPath id="preloader-sign-clip">
                  <motion.rect
                    x="0"
                    y="0"
                    height="90"
                    initial={{ width: 0 }}
                    animate={{ width: 320 }}
                    transition={{ duration: 0.68, delay: 0.25, ease: 'linear' }}
                  />
                </clipPath>
              </defs>
              <text
                x="160"
                y="56"
                textAnchor="middle"
                fontFamily="'Herr Von Muellerhoff', cursive"
                fontSize="64"
                fill="currentColor"
                clipPath="url(#preloader-sign-clip)"
              >
                Hail CSI!
              </text>
              <motion.path
                d="M 272 52 C 294 48, 286 60, 232 64 C 168 68, 92 70, 44 72"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.78 }}
                transition={{ duration: 0.36, delay: 0.88, ease: 'easeOut' }}
              />
            </svg>

            {/* Minimal Editorial Percentage Counter */}
            <motion.div
              animate={{ opacity: phase === 'docking' ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center gap-2 text-[11px] tracking-widest text-zinc-400"
            >
              <span>CSI CHAPTER</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-code tabular-nums text-zinc-200">
                {String(percent).padStart(3, '0')}%
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
