import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SignatureProps {
  className?: string;
  play?: boolean;
  rotation?: number;
}

export const HailCsiSignature: React.FC<SignatureProps> = ({
  className = '',
  play = true,
  rotation = -28,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldDraw = play || prefersReducedMotion;

  const t0 = 0.85;

  return (
    <svg
      viewBox="0 0 1280 680"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hail CSI!"
    >
      <defs>
        <linearGradient id="autograph-ink" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4D4D8" stopOpacity="0.88" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#D4D4D8" stopOpacity="0.88" />
        </linearGradient>

        {/* Continuous pen reveal for enlarged "Hail" (left half) */}
        <clipPath id="hail-one-go-clip">
          <motion.rect
            x="0"
            y="10"
            height="660"
            initial={prefersReducedMotion ? { width: 520 } : { width: 0 }}
            animate={shouldDraw ? { width: 520 } : { width: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.52,
                    delay: t0 + 0.08,
                    ease: 'linear',
                  }
            }
          />
        </clipPath>

        {/* Continuous pen reveal for enlarged "CSI!" (right half) */}
        <clipPath id="csi-one-go-clip">
          <motion.rect
            x="760"
            y="10"
            height="660"
            initial={prefersReducedMotion ? { width: 540 } : { width: 0 }}
            animate={shouldDraw ? { width: 540 } : { width: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.52,
                    delay: t0 + 0.82,
                    ease: 'linear',
                  }
            }
          />
        </clipPath>
      </defs>

      {/* Tilted along diagonal from top of Hello to below Aman Raj */}
      <g transform={`rotate(${rotation} 640 340)`}>
        <motion.g
          animate={
            !shouldDraw || prefersReducedMotion
              ? undefined
              : {
                  opacity: [0.85, 1, 0.85],
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: 5.5,
            delay: t0 + 1.9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* 1. Expressive lead-in pen loop into enlarged H */}
          <motion.path
            d="M 54 388 C 86 362, 126 320, 146 276 C 160 250, 130 246, 120 278"
            stroke="url(#autograph-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={shouldDraw ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: { duration: 0.22, delay: t0, ease: 'easeIn' },
                    opacity: { duration: 0.08, delay: t0 },
                  }
            }
          />

          {/* 2. Enlarged "Hail" in Herr Von Muellerhoff */}
          <text
            x="275"
            y="382"
            textAnchor="middle"
            fontFamily="'Herr Von Muellerhoff', cursive"
            fontSize="278"
            fontWeight="400"
            letterSpacing="2"
            fill="url(#autograph-ink)"
            clipPath="url(#hail-one-go-clip)"
          >
            Hail
          </text>

          {/* 3. Unbroken cursive bridge sweeping from "l" behind portrait straight into "C" */}
          <motion.path
            d="M 426 368 C 530 408, 735 402, 845 326"
            stroke="url(#autograph-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={shouldDraw ? { pathLength: 1, opacity: 0.82 } : { pathLength: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: { duration: 0.36, delay: t0 + 0.52, ease: 'linear' },
                    opacity: { duration: 0.08, delay: t0 + 0.52 },
                  }
            }
          />

          {/* 4. Enlarged "CSI!" in Herr Von Muellerhoff */}
          <text
            x="1005"
            y="382"
            textAnchor="middle"
            fontFamily="'Herr Von Muellerhoff', cursive"
            fontSize="268"
            fontWeight="400"
            letterSpacing="4"
            fill="url(#autograph-ink)"
            clipPath="url(#csi-one-go-clip)"
          >
            CSI!
          </text>

          {/* 5. Unbroken whip-back autograph tail sweeping off "!" underneath Hail CSI! */}
          <motion.path
            d="M 1168 370 C 1245 356, 1262 380, 1185 400 C 920 426, 390 442, 95 452"
            stroke="url(#autograph-ink)"
            strokeWidth="3.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={shouldDraw ? { pathLength: 1, opacity: 0.86 } : { pathLength: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: { duration: 0.48, delay: t0 + 1.28, ease: 'easeOut' },
                    opacity: { duration: 0.08, delay: t0 + 1.28 },
                  }
            }
          />
        </motion.g>
      </g>
    </svg>
  );
};
