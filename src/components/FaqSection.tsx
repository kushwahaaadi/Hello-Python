import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Plus, X } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'prior-coding-experience',
    question: 'Do I need any prior coding experience to attend?',
    answer:
      'Not at all. Hello Python is designed from the ground up for first-year B.Tech students, whether you are writing your very first line of code or just looking to brush up on the basics.',
  },
  {
    id: 'when-and-where',
    question: 'When and where is Hello Python happening?',
    answer:
      'The session is on Thursday, November 26, 2026, from 6:00 PM to 8:30 PM at Bennett University, Greater Noida.',
  },
  {
    id: 'what-to-bring-and-install',
    question: 'What should I bring, and do I need to install anything beforehand?',
    answer:
      'Bring your laptop and charger. Having Python 3 and VS Code pre-installed will help you jump right in—if you run into setup issues, we’ll help you out at the venue or get you started on Google Colab in seconds.',
  },
  {
    id: 'what-will-we-cover',
    question: 'What will we cover during the session?',
    answer:
      'We’ll walk through Python fundamentals hands-on: setting up your environment, variables and data types, conditionals, loops, functions, and building a quick beginner-friendly mini-project by the end of the session.',
  },
  {
    id: 'registration-fee',
    question: 'Is there any registration fee?',
    answer:
      'No, the workshop is completely free to attend. Seats are limited, so make sure you RSVP through the Register button to lock in your spot.',
  },
  {
    id: 'branch-eligibility',
    question: 'Can students from any branch or non-CSI members join?',
    answer:
      'Yes! The workshop is open to all first-year B.Tech students across every branch, regardless of whether you are a CSI member.',
  },
  {
    id: 'coursework-and-exams',
    question: 'Will the session help with first-year coursework and exams?',
    answer:
      'Definitely. The topics align closely with foundational programming logic, helping you get comfortable with writing clean code for labs, assignments, and upcoming hackathons.',
  },
];

interface FaqSectionProps {
  id?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ id = 'faq' }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px 0px' });
  const prefersReducedMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenId((current) => (current === itemId ? null : itemId));
  };

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="Frequently Asked Questions"
      className="relative z-10 w-full min-h-screen flex items-center justify-center border-t border-white/10 bg-[#030304] py-16 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#f2f2f2]/60 font-mono">
            Workshop FAQ · Hello Python
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-editorial text-3xl sm:text-6xl lg:text-7xl font-normal italic tracking-[-0.02em] text-[#F4F4F5] [text-wrap:balance]"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 sm:mt-3 text-center text-xs sm:text-sm font-light text-[#f2f2f2]/70 font-sans"
        >
          Everything you need to know about attending the Hello Python workshop
        </motion.p>

        {/* FAQ Items */}
        <div className="mt-8 sm:mt-12 space-y-3">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + idx * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`rounded-xl sm:rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                    isOpen
                      ? 'border-white/25 bg-[#0e0e13]/95 shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
                      : 'border-white/10 bg-[#08080b]/70 hover:border-white/20 hover:bg-[#0c0c10]/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-7 py-3.5 sm:py-5 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-xs sm:text-base lg:text-lg font-medium text-white/95 tracking-[-0.01em] font-sans">
                      {item.question}
                    </span>

                    <div
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? 'border-white/40 bg-white/15 text-white'
                          : 'border-white/15 bg-white/5 text-zinc-400 group-hover:border-white/30 group-hover:text-white'
                      }`}
                    >
                      {isOpen ? (
                        <X className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-7 pb-4 sm:pb-5 pt-2 text-xs sm:text-sm font-light leading-relaxed text-zinc-300 font-sans border-t border-white/10">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Chapter Tag */}
        <div className="mt-12 text-center text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
          Hello Python · CSI Bennett University
        </div>
      </div>
    </section>
  );
};
