import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { PythonLogoParticleCanvas } from './PythonLogoParticleCanvas';
import { HailCsiSignature } from './SignatureCalligraphy';
import { CHAPTER_LEADERS, LeaderProfile } from '../data/chapterData';

interface HeroSectionProps {
  introReady: boolean;
  introIteration: number;
  scrollProgress: number;
  onFormationComplete?: () => void;
  onSelectLeader: (leader: LeaderProfile) => void;
  onExploreWork: () => void;
}

const HELLO_CHARS = ['H', 'e', 'l', 'l', 'o'];
const PYTHON_CHARS = ['P', 'y', 't', 'h', 'o', 'n'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  introReady,
  introIteration,
  scrollProgress,
  onFormationComplete,
  onSelectLeader,
  onExploreWork,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const springMagX = useSpring(magX, { stiffness: 260, damping: 20 });
  const springMagY = useSpring(magY, { stiffness: 260, damping: 20 });

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
  const copyOpacity = useTransform(smoothHeroScroll, [0, 0.45], [1, 0]);
  const copyY = useTransform(smoothHeroScroll, [0, 0.45], [0, -24]);

  const handleCtaMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.24;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.24;
    magX.set(dx);
    magY.set(dy);
  };

  const handleCtaLeave = () => {
    magX.set(0);
    magY.set(0);
  };

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

      {/* Top Bar: Spacer for CSI Emblem + Staggered Chapter Leadership Credits */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <div aria-hidden="true" className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />

        <div className="grid flex-1 grid-cols-3 gap-3 pl-4 sm:gap-8 sm:pl-16 md:pl-24">
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
                idx === 2 ? 'justify-self-end text-left' : 'justify-self-start text-left'
              }
            >
              <button
                type="button"
                onClick={() => onSelectLeader(leader)}
                className="group rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="block text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                  {leader.role}:
                </span>
                <span className="mt-0.5 block text-[13px] font-medium text-[#f2f2f2] transition-colors group-hover:underline group-hover:underline-offset-4">
                  {leader.name}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Signature Layer (z-[1]): Spanning from top of Hello to below Aman Raj */}
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
          className="relative w-full max-w-[1440px] px-3 sm:px-6 select-none -translate-y-9 sm:-translate-y-11"
        >
          <HailCsiSignature play={introReady} rotation={-28} className="h-auto w-full" />
        </motion.div>
      </div>

      {/* Center Spacer preserving vertical spacing between top bar and lower hero */}
      <div aria-hidden="true" className="pointer-events-none relative flex-1" />

      {/* Lower Hero Block: Magnetic CTA + Hello Python */}
      <div className="relative z-20 mx-auto w-full max-w-full px-2 pb-2 sm:px-4 sm:pb-3">
        {/* Top Row: Right-aligned Magnetic CTA */}
        <div className="mb-3 flex justify-end px-4 sm:mb-5 sm:px-6">
          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: copyOpacity, y: copyY }}
            className="flex justify-end shrink-0"
          >
            <motion.button
              key={`cta-${introIteration}`}
              type="button"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={
                prefersReducedMotion
                  ? undefined
                  : { x: springMagX, y: springMagY }
              }
              onMouseMove={handleCtaMove}
              onMouseLeave={handleCtaLeave}
              onClick={onExploreWork}
              className="group inline-flex w-fit items-center gap-3.5 rounded-full border border-white/20 bg-[#0a0a0b]/80 py-2.5 pl-6 pr-3 text-[12px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/60 hover:bg-white/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Join CSI</span>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 transition-colors duration-200 group-hover:border-white/60 animate-nudge"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
            </motion.button>
          </motion.div>
        </div>

        <h1
          aria-label="Hello Python"
          className="font-editorial flex w-full items-baseline justify-between font-normal italic tracking-[-0.025em] text-[#F4F4F5] select-none"
          style={{
            fontSize: 'clamp(4.8rem, 18vw, 17.5rem)',
            lineHeight: 0.82,
          }}
        >
          <motion.span
            style={
              prefersReducedMotion
                ? undefined
                : { x: helloX, opacity: heroTitleOpacity }
            }
            className="inline-flex overflow-hidden py-1 will-change-transform pl-0 text-left"
          >
            {HELLO_CHARS.map((ch, idx) => (
              <motion.span
                key={`hello-${introIteration}-${idx}`}
                initial={prefersReducedMotion ? false : { y: '110%', opacity: 0 }}
                animate={introReady ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
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
            className="inline-flex overflow-hidden py-1 will-change-transform pr-0 text-right ml-auto"
          >
            {PYTHON_CHARS.map((ch, idx) => (
              <motion.span
                key={`python-${introIteration}-${idx}`}
                initial={prefersReducedMotion ? false : { y: '110%', opacity: 0 }}
                animate={introReady ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
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
