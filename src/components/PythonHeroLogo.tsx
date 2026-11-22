import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import pythonHeroImg from '../assets/images/python-3d-hero.png';

interface PythonHeroLogoProps {
  ready?: boolean;
  scrollProgress: number;
}

export const PythonHeroLogo: React.FC<PythonHeroLogoProps> = ({
  ready = true,
  scrollProgress,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D parallax tilt
  const springTiltX = useSpring(mouseY, { stiffness: 120, damping: 18 });
  const springTiltY = useSpring(mouseX, { stiffness: 120, damping: 18 });

  // Scroll reactions
  const fly = Math.min(1, Math.max(0, scrollProgress));
  const scrollOpacity = Math.max(0, 1 - fly * 1.85);
  const scrollScale = 1 + fly * 0.22;
  const scrollY = -fly * 45;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const normX = (e.clientX - cx) / cx;
      const normY = (e.clientY - cy) / cy;

      // Subtle tilt angles (-8 to +8 degrees)
      mouseX.set(normX * 8.5);
      mouseY.set(-normY * 7.5);
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[10] flex items-center justify-center pb-10 sm:pb-14 md:pb-16 overflow-hidden [perspective:1200px]"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 28 }}
        animate={
          ready
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.88, y: 28 }
        }
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        style={
          prefersReducedMotion
            ? { opacity: scrollOpacity }
            : {
                rotateX: springTiltX,
                rotateY: springTiltY,
                scale: scrollScale,
                y: scrollY,
                opacity: scrollOpacity,
              }
        }
        className="relative flex items-center justify-center select-none will-change-transform"
      >
        {/* Soft Cosmic Ambient Aura beneath pedestal */}
        <div
          className="absolute -inset-10 -bottom-16 rounded-full opacity-65 blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(168, 85, 247, 0.20) 0%, rgba(103, 232, 249, 0.12) 40%, transparent 75%)',
          }}
        />

        {/* Floating Levitation Wrapper */}
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [-7, 7, -7],
                }
          }
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <img
            src={pythonHeroImg}
            alt="3D Python Logo"
            loading="eager"
            decoding="async"
            className="h-auto w-[280px] sm:w-[390px] md:w-[490px] lg:w-[590px] xl:w-[650px] max-w-[86vw] drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] filter pointer-events-auto cursor-pointer"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
