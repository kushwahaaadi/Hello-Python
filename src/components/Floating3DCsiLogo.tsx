import React, { useEffect, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

interface Floating3DCsiLogoProps {
  onClick?: () => void;
  visible?: boolean;
}

const NAVY_LOGO_SRC = './assets/csi_logo_navy.png';
const GOLD_LOGO_SRC = './assets/csi_logo_gold.png';

export const Floating3DCsiLogo: React.FC<Floating3DCsiLogoProps> = ({
  onClick,
  visible = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [boostCount, setBoostCount] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const [isGold, setIsGold] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 22,
    restDelta: 0.0005,
  });

  // Stay completely still at the starting screen; begin 3D floating & spinning once scrolled
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const shouldFloat = latest > 0.02;
    if (shouldFloat !== isFloating) {
      setIsFloating(shouldFloat);
    }
  });

  // IntersectionObserver & scroll tracking with sentinel at the END of the registration section
  useEffect(() => {
    const checkScrollPosition = () => {
      const sentinel = document.getElementById('registration-end-sentinel');
      if (sentinel) {
        const rect = sentinel.getBoundingClientRect();
        // The user reaches the END of the registration section
        // rect.top <= window.innerHeight means the bottom of the registration form is visible/reached
        setIsGold(rect.top <= window.innerHeight * 0.85);
      } else {
        // Fallback: check registration section bottom edge
        const regSection = document.getElementById('register');
        if (regSection) {
          const rect = regSection.getBoundingClientRect();
          setIsGold(rect.bottom <= window.innerHeight * 1.15);
        }
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition, { passive: true });
    checkScrollPosition();

    let observer: IntersectionObserver | null = null;
    const sentinelEl = document.getElementById('registration-end-sentinel');
    if (sentinelEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If the bottom sentinel has passed above the bottom of the viewport
            if (entry.boundingClientRect.top <= window.innerHeight) {
              setIsGold(true);
            } else {
              setIsGold(false);
            }
          });
        },
        { threshold: [0, 0.5, 1], rootMargin: '0px 0px -10% 0px' }
      );
      observer.observe(sentinelEl);
    }

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
      observer?.disconnect();
    };
  }, []);

  // Organic orbital flight path once scrolled past start (0.02 -> 1)
  const posX = useTransform(
    smoothScroll,
    [0, 0.02, 0.14, 0.3, 0.52, 0.74, 0.92, 1],
    isMobile
      ? ['16px', '16px', '6vw', '62vw', '65vw', '6vw', '62vw', '65vw']
      : ['2.2vw', '2.2vw', '10vw', '74vw', '78vw', '8vw', '76vw', '78vw']
  );
  const posY = useTransform(
    smoothScroll,
    [0, 0.02, 0.14, 0.3, 0.52, 0.74, 0.92, 1],
    isMobile
      ? ['16px', '16px', '10vh', '15vh', '38vh', '52vh', '64vh', '66vh']
      : ['2.2vh', '2.2vh', '14vh', '18vh', '42vh', '56vh', '68vh', '70vh']
  );
  const floatScale = useTransform(
    smoothScroll,
    [0, 0.02, 0.1, 0.24, 1],
    isMobile ? [1, 1, 1.35, 1.75, 1.75] : [1, 1, 1.85, 3, 3]
  );
  const scrollSpin = useTransform(smoothScroll, [0, 0.02, 1], [0, 0, 540]);
  const scrollTiltZ = useTransform(smoothScroll, [0, 0.02, 0.3, 0.65, 1], [0, 0, 12, -10, 0]);
  const scrollOpacity = useTransform(smoothScroll, [0, 0.015, 0.04], [0, 0, 1]);

  const handleClick = () => {
    if (isFloating) {
      setBoostCount((c) => c + 1);
    }
    onClick?.();
  };

  const activeFloat = isFloating && !prefersReducedMotion;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <motion.div
        style={
          prefersReducedMotion
            ? { left: '24px', top: '20px' }
            : {
                left: posX,
                top: posY,
                scale: floatScale,
                opacity: scrollOpacity,
              }
        }
        className="pointer-events-auto absolute [perspective:800px]"
      >
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="CSI 3D Emblem — Return to top"
          title="Computer Society of India"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.12 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          className="group relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {/* Subtle refined silver outshine */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-1 rounded-full blur-md transition-all duration-700 ease-out ${
              isGold
                ? 'opacity-35 bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,rgba(200,215,235,0.12)_50%,transparent_70%)]'
                : 'opacity-0'
            }`}
          />

          {/* Weightless 3D floating bobbing (disabled at start) */}
          <motion.div
            animate={
              activeFloat
                ? {
                    y: [-6, 6, -6],
                    rotateX: [10, -10, 10],
                    rotateZ: [-3, 3, -3],
                  }
                : {
                    y: 0,
                    rotateX: 0,
                    rotateZ: 0,
                  }
            }
            transition={
              activeFloat
                ? {
                    duration: 4.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : { duration: 0.35, ease: 'easeOut' }
            }
            style={
              prefersReducedMotion
                ? undefined
                : { rotateY: scrollSpin, rotateZ: scrollTiltZ }
            }
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* Click spin boost wrapper */}
            <motion.div
              animate={{ rotateY: boostCount * 360 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-full [transform-style:preserve-3d]"
            >
              {/* Continuous 360deg 3d turntable spin (paused flat at 0deg at start) */}
              <motion.div
                animate={
                  activeFloat
                    ? {
                        rotateY: [0, 360],
                      }
                    : {
                        rotateY: 0,
                      }
                }
                transition={
                  activeFloat
                    ? {
                        duration: 5.2,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                    : { duration: 0.35, ease: 'easeOut' }
                }
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                {/* Visual Emblem Implementation: Cross-fading 600ms transition between Original Navy/White and Gold/White */}
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Variant 1: Original Navy & White (#002868) */}
                  <img
                    src={NAVY_LOGO_SRC}
                    alt="Computer Society of India - ESTD 1965"
                    className={`absolute inset-0 h-full w-full object-contain rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-opacity duration-600 ease-in-out ${
                      isGold ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  />

                  {/* Variant 2: Polished Metallic Silver with Pure White Lettering */}
                  <img
                    src={GOLD_LOGO_SRC}
                    alt="Computer Society of India (Silver Edition)"
                    style={isGold ? { filter: 'grayscale(100%) brightness(1.1) contrast(1.05)' } : undefined}
                    className={`absolute inset-0 h-full w-full object-contain rounded-full shadow-[0_2px_12px_rgba(255,255,255,0.2)] transition-all duration-600 ease-in-out ${
                      isGold ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};
