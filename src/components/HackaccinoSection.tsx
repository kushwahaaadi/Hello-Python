import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface HackaccinoSectionProps {
  id?: string;
}

export const HackaccinoSection: React.FC<HackaccinoSectionProps> = ({ id = 'hackaccino' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const block2Ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isContainerInView = useInView(containerRef, { once: true, margin: '-40px 0px' });
  const isBlock2InView = useInView(block2Ref, { once: true, margin: '-40px 0px' });

  const firstBlockLines = [
    "Hackaccino is one of Bennett University's biggest hackathons, organized by the",
    'Computer Society of India (CSI), Bennett University. With 1,200+ participants and an',
    'intense 24-hour building experience, Hackaccino brings together developers,',
    'designers, innovators, and problem-solvers to transform ideas into technology-driven',
    'solutions for real-world challenges.',
    'But Hackaccino is more than just a hackathon — it is a massive collaborative experience',
    'powered by an equally passionate organizing team.',
  ];

  const secondBlockLines = [
    'Do you want to be part of the team that organizes one of the biggest hackathons',
    'Bennett University witnesses?',
    'From planning and management to technology, design, outreach, sponsorships, and on-',
    'ground execution, the organizing team works behind the scenes to bring Hackaccino to',
    'life.',
    'Join CSI and become a part of the team that plans, builds, and executes an experience',
    'for 1,200+ innovators over 24 hours.',
    'Be a part of the team that makes it happen.',
    'Think. Build. Innovate. Organize.',
  ];

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="Hackaccino - Where Ideas Turn Into Innovation"
      className="relative z-10 w-full min-h-screen flex items-center justify-center border-t border-white/10 bg-[#030304] py-24 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 text-center">
        {/* Accent top purple pill indicator */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={isContainerInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-5 h-1 w-12 rounded-full bg-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
        />

        {/* Main Header */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial text-3xl sm:text-5xl font-normal italic tracking-[-0.015em] text-white uppercase"
        >
          HACKACCINO
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 text-[11px] sm:text-xs font-medium tracking-wide text-purple-200/70 uppercase"
        >
          Where Ideas Turn Into Innovation
        </motion.p>

        {/* First Paragraph Block */}
        <div className="mt-8 sm:mt-10 space-y-2 sm:space-y-2.5 font-sans max-w-3xl mx-auto">
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
                className="text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-[#ede9fe]/90 tracking-[-0.01em]"
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Section Subheading & Second Block */}
        <div ref={block2Ref} className="mt-12 sm:mt-14">
          <motion.h3
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={isBlock2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial text-xl sm:text-3xl font-normal italic text-white tracking-[-0.01em]"
          >
            Be Part of the Team Behind Hackaccino
          </motion.h3>

          <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-2.5 font-sans max-w-3xl mx-auto">
            {secondBlockLines.map((line, idx) => (
              <div key={idx} className="overflow-hidden">
                <motion.p
                  initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                  animate={isBlock2InView ? { y: '0%', opacity: 1 } : { y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + idx * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`text-sm sm:text-base lg:text-lg font-normal leading-relaxed tracking-[-0.01em] ${
                    idx === secondBlockLines.length - 1
                      ? 'text-white font-medium italic pt-2 font-editorial text-lg sm:text-xl'
                      : 'text-[#ede9fe]/90'
                  }`}
                >
                  {line}
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
