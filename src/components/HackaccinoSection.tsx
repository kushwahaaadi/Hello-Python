import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface HackaccinoSectionProps {
  id?: string;
}

export const HackaccinoSection: React.FC<HackaccinoSectionProps> = ({ id = 'hackaccino' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isContainerInView = useInView(containerRef, { once: true, margin: '-40px 0px' });

  const firstBlockLines = [
    "Hackaccino is one of Bennett University's biggest hackathons, organized by the",
    'Computer Society of India (CSI), Bennett University. With 1,200+ participants and an',
    'intense 24-hour building experience, Hackaccino brings together developers,',
    'designers, innovators, and problem-solvers to transform ideas into technology-driven',
    'solutions for real-world challenges.',
    'It is a massive collaborative engineering residency powered by an equally passionate organizing team.',
  ];

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="Hackaccino - Flagship Hackathon"
      className="relative z-10 w-full min-h-[85vh] flex items-center justify-center border-t border-white/10 bg-[#030304] py-24 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#f2f2f2]/60 font-mono">
            Flagship Hackathon · 24-Hour Build
          </span>
        </motion.div>

        {/* Main Header */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal italic tracking-[-0.02em] text-[#F4F4F5]"
        >
          Hackaccino
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-zinc-400 font-mono"
        >
          Where Ideas Turn Into Innovation
        </motion.p>

        {/* Quick Highlights / Stats Grid */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto"
        >
          <div className="rounded-xl border border-white/10 bg-[#0a0a0d]/80 p-3 backdrop-blur-md">
            <span className="block text-xl sm:text-2xl font-editorial italic text-white">1,200+</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">Builders</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0a0a0d]/80 p-3 backdrop-blur-md">
            <span className="block text-xl sm:text-2xl font-editorial italic text-white">24 Hours</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">Non-Stop</span>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-[#0a0a0d]/80 p-3 backdrop-blur-md">
            <span className="block text-xl sm:text-2xl font-editorial italic text-white">Infinite</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">Possibilities</span>
          </div>
        </motion.div>

        {/* Narrative Paragraph Block */}
        <div className="mt-8 sm:mt-10 space-y-3 font-sans max-w-3xl mx-auto">
          {firstBlockLines.map((line, idx) => (
            <div key={idx} className="overflow-hidden">
              <motion.p
                initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                animate={isContainerInView ? { y: '0%', opacity: 1 } : { y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25 + idx * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#f2f2f2]/85 tracking-[-0.01em]"
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Minimal Footer Motto */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 pt-4 font-editorial text-xl sm:text-2xl italic text-white"
        >
          Think. Build. Innovate. Organize.
        </motion.p>
      </div>
    </section>
  );
};
