import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface CurriculumSectionProps {
  id?: string;
}

const CURRICULUM_TOPICS = [
  {
    step: '01',
    title: 'Environment & Tooling',
    desc: 'Setting up Python 3, configuring VS Code, terminal essentials, and cloud notebooks with Google Colab.',
  },
  {
    step: '02',
    title: 'Variables & Data Types',
    desc: 'Working with numbers, text strings, booleans, lists, tuples, and key-value dictionaries.',
  },
  {
    step: '03',
    title: 'Conditionals & Logic',
    desc: 'Mastering if-else branching, logical operators, and writing clean decision-making algorithms.',
  },
  {
    step: '04',
    title: 'Loops & Iteration',
    desc: 'Harnessing for and while loops, range iteration, and automating repetitive tasks with ease.',
  },
  {
    step: '05',
    title: 'Functions & Modularity',
    desc: 'Writing reusable functions, passing parameters, returning values, and organizing code cleanly.',
  },
  {
    step: '06',
    title: 'Hands-On Mini Project',
    desc: 'Building an interactive Python mini-project step-by-step from scratch by the end of the workshop.',
  },
];

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ id = 'curriculum' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px 0px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="What You Will Be Taught in the Event"
      className="relative z-10 w-full flex items-center justify-center border-t border-white/10 bg-[#030304] py-16 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto max-w-4xl px-4 sm:px-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#f2f2f2]/60 font-mono">
            Workshop Curriculum · Hands-On Python
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-2xl sm:text-5xl lg:text-6xl font-normal italic text-white tracking-[-0.015em] [text-wrap:balance]"
        >
          What You Will Be Taught in the Event
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-light text-[#f2f2f2]/70 font-sans max-w-xl mx-auto"
        >
          A hands-on, practical curriculum designed to take you from foundational logic to writing working code.
        </motion.p>

        {/* Curriculum Grid */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-left">
          {CURRICULUM_TOPICS.map((topic, idx) => (
            <motion.div
              key={topic.step}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + idx * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0d]/80 p-4 sm:p-5 backdrop-blur-md hover:border-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3 font-mono text-[11px] text-zinc-400">
                <span className="font-bold text-white">{topic.step}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Module</span>
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-normal italic text-white">
                {topic.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#f2f2f2]/75 font-sans font-light">
                {topic.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 pt-4 font-editorial text-xl sm:text-2xl italic text-white"
        >
          Learn. Code. Build. Innovate.
        </motion.p>
      </div>
    </section>
  );
};
