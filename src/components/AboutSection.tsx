import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface AboutSectionProps {
  id?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ id = 'about' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px 0px' });
  const prefersReducedMotion = useReducedMotion();

  // Paragraph broken into animated coming-in lines / phrases
  const textLines = [
    'Computer Society of India (CSI), Bennett University is a student-led technical chapter',
    'promoting technology, innovation, research, and professional development. We create',
    'opportunities for students to learn beyond the classroom — strengthening both',
    'technical and soft skills while encouraging collaboration, creativity, and problem-',
    'solving.',
  ];

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="About CSI, Bennett University"
      className="relative z-10 w-full min-h-[85vh] flex items-center justify-center border-t border-white/10 bg-[#030304] py-24 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 text-center">
        {/* Accent top purple pill indicator */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-5 h-1 w-12 rounded-full bg-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
        />

        {/* Heading */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-3xl sm:text-5xl font-normal italic tracking-[-0.015em] text-white [text-wrap:balance]"
        >
          About CSI, Bennett University
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 text-[11px] sm:text-xs font-medium tracking-wide text-purple-200/70 uppercase"
        >
          Established 2017 · School of Computer Science & Engineering
        </motion.p>

        {/* Body Text */}
        <div className="mt-8 sm:mt-10 space-y-2 sm:space-y-2.5 font-sans max-w-3xl mx-auto">
          {textLines.map((line, idx) => (
            <div key={idx} className="overflow-hidden">
              <motion.p
                initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : { y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-[#ede9fe]/90 tracking-[-0.01em]"
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Pill Tag at Bottom */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.94 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-purple-200 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.18)]"
        >
          <span className="text-purple-400">🌱</span>
          <span>STUDENT-LED SINCE 2017</span>
        </motion.div>
      </div>
    </section>
  );
};
