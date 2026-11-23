import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface AboutSectionProps {
  id?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ id = 'about' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px 0px' });
  const prefersReducedMotion = useReducedMotion();

  const textLines = [
    'Computer Society of India (CSI), Bennett University is a student-led technical chapter',
    'promoting technology, innovation, research, and professional development. We create',
    'opportunities for students to learn beyond the classroom — strengthening both',
    'technical and soft skills while encouraging collaboration, creativity, and problem-solving.',
  ];

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="About CSI, Bennett University"
      className="relative z-10 w-full min-h-[85vh] flex items-center justify-center border-t border-white/10 bg-[#030304] py-24 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 text-center">
        {/* Eyebrow Label */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#f2f2f2]/60 font-mono">
            Chapter Overview · Established 2017
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal italic tracking-[-0.02em] text-[#F4F4F5] [text-wrap:balance]"
        >
          About CSI, Bennett University
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-xs sm:text-sm font-light uppercase tracking-[0.08em] text-[#f2f2f2]/60 font-mono"
        >
          School of Computer Science & Engineering
        </motion.p>

        {/* Body Text */}
        <div className="mt-8 sm:mt-10 space-y-3 font-sans max-w-3xl mx-auto">
          {textLines.map((line, idx) => (
            <div key={idx} className="overflow-hidden">
              <motion.p
                initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : { y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25 + idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#f2f2f2]/85 tracking-[-0.01em]"
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Minimal Editorial Badges */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[#f2f2f2]/80 backdrop-blur-md">
            Student-Led
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[#f2f2f2]/80 backdrop-blur-md">
            Technical Chapter
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[#f2f2f2]/80 backdrop-blur-md">
            Since 2017
          </span>
        </motion.div>
      </div>
    </section>
  );
};
