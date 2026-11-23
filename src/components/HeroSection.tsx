import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { PythonLogoParticleCanvas } from './PythonLogoParticleCanvas';
import { HailCsiSignature } from './SignatureCalligraphy';
import { CHAPTER_LEADERS, LeaderProfile } from '../data/chapterData';
import csiNavyLogo from '../assets/images/csi_logo_navy.png';

interface HeroSectionProps {
  introReady: boolean;
  introIteration: number;
  scrollProgress: number;
  onFormationComplete?: () => void;
  onSelectLeader: (leader: LeaderProfile) => void;
  onExploreWork?: () => void;
}

const HELLO_CHARS = ['H', 'e', 'l', 'l', 'o'];
const PYTHON_CHARS = ['P', 'y', 't', 'h', 'o', 'n'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  introReady,
  introIteration,
  scrollProgress,
  onFormationComplete,
  onSelectLeader,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothHeroScroll = useSpring(heroScroll, {
    stiffness: 120,
    damping: 26,
  });

  const helloX = useTransform(smoothHeroScroll, [0, 0.85], ['0vw', '-18vw']);
  const pythonX = useTransform(smoothHeroScroll, [0, 0.85], ['0vw', '18vw']);
  const heroTitleOpacity = useTransform(smoothHeroScroll, [0, 0.75], [1, 0]);
  const signatureScale = useTransform(smoothHeroScroll, [0, 0.7], [1, 1.24]);
  const signatureY = useTransform(smoothHeroScroll, [0, 0.7], [0, -28]);
  const scriptOpacity = useTransform(smoothHeroScroll, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#030304]"
    >
      {/* Permanent Python Logo Particle Formation Canvas (z-[10]) */}
      <PythonLogoParticleCanvas
        scrollProgress={scrollProgress}
        onFormationComplete={onFormationComplete}
        replayKey={introIteration}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#030304] via-[#030304]/45 to-transparent"
      />

      {/* Top Bar: CSI Emblem + "Computer Society of India" Title + Chapter Leadership Credits */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:pt-7">
        {/* Left: CSI Logo + "Computer Society of India" */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={csiNavyLogo}
            alt="Computer Society of India"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-contain shrink-0 shadow-sm"
          />
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
            animate={introReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center"
          >
            <span className="text-xs font-semibold tracking-tight text-[#f2f2f2] sm:text-[14px] whitespace-nowrap">
              Computer Society of India
            </span>
          </motion.div>
        </div>

        {/* Right Columns: Staggered Chapter Leadership Credits Shifted Accordingly */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2.5 sm:border-0 sm:pt-0 sm:flex-1 sm:gap-6 sm:pl-10 md:pl-16">
          {CHAPTER_LEADERS.map((leader, idx) => (
            <motion.div
              key={`${introIteration}-${leader.id}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={
                idx === 2
                  ? 'justify-self-end text-right'
                  : idx === 1
                  ? 'justify-self-center text-center sm:text-left'
                  : 'justify-self-start text-left'
              }
            >
              <button
                type="button"
                onClick={() => onSelectLeader(leader)}
                className={`group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  idx === 2 ? 'text-right' : idx === 1 ? 'text-center sm:text-left' : 'text-left'
                }`}
              >
                <span className="block text-[9px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55 sm:text-[11px]">
                  {leader.role}:
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-[#f2f2f2] transition-colors group-hover:underline group-hover:underline-offset-4 whitespace-nowrap sm:text-[13px]">
                  {leader.name}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Signature Layer (z-[1]): Positioned below logo on mobile, center-tilt on desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          key={`sig-${introIteration}`}
          style={
            prefersReducedMotion
              ? undefined
              : { scale: signatureScale, y: signatureY, opacity: scriptOpacity }
          }
          className="relative w-full max-w-[1220px] px-2 sm:px-4 select-none translate-y-[24.5vh] sm:-translate-y-12"
        >
          <HailCsiSignature play={introReady} rotation={isMobile ? -5 : -9} className="h-auto w-full" />
        </motion.div>
      </div>

      {/* Center Spacer preserving vertical spacing between top bar and lower hero */}
      <div aria-hidden="true" className="pointer-events-none relative flex-1" />

      {/* Lower Hero Block: Hello Python */}
      <div className="relative z-20 mx-auto w-full max-w-full px-3 pb-6 sm:px-8 sm:pb-10 md:pb-14">
        <h1
          aria-label="Hello Python"
          className="font-editorial flex w-full items-baseline justify-between font-normal italic tracking-[-0.025em] text-[#F4F4F5] select-none"
          style={{
            fontSize: 'clamp(2.75rem, 13.5vw, 15.2rem)',
            lineHeight: 0.92,
          }}
        >
          <motion.span
            style={
              prefersReducedMotion
                ? undefined
                : { x: helloX, opacity: heroTitleOpacity }
            }
            className="inline-flex overflow-visible py-2 will-change-transform pl-0 text-left"
          >
            {HELLO_CHARS.map((ch, idx) => (
              <motion.span
                key={`hello-${introIteration}-${idx}`}
                initial={prefersReducedMotion ? false : { y: 32, opacity: 0 }}
                animate={introReady ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.08 + idx * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>

          <motion.span
            style={
              prefersReducedMotion
                ? undefined
                : { x: pythonX, opacity: heroTitleOpacity }
            }
            className="inline-flex overflow-visible py-2 will-change-transform pr-0 text-right ml-auto"
          >
            {PYTHON_CHARS.map((ch, idx) => (
              <motion.span
                key={`python-${introIteration}-${idx}`}
                initial={prefersReducedMotion ? false : { y: 32, opacity: 0 }}
                animate={introReady ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.18 + idx * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>
      </div>
    </section>
  );
};
