import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Plus, X } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  intro?: string;
  bullets?: string[];
  footer?: string;
  paragraphs?: string[];
  suitableFor?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'departments-available',
    question: 'Which departments are available in CSI?',
    intro:
      "CSI has eight departments, each contributing to different aspects of the organization's events, initiatives, and activities:",
    bullets: [
      'Tech',
      'PR & Outreach',
      'Management',
      'Content',
      'Design',
      'Multimedia',
      'Research',
      'Sponsorship',
    ],
    footer:
      'Students can choose a department based on their interests, skills, and the kind of experience they want to gain.',
  },
  {
    id: 'tech-dept',
    question: 'What does the Tech Department do?',
    intro:
      'The Tech Department handles the technical requirements of CSI. Members work on websites, digital platforms, technical systems, development projects, and other technology-driven initiatives. The team also supports the technical requirements of major events and hackathons.',
    suitableFor:
      'Students interested in programming, web development, software development, databases, and technology.',
  },
  {
    id: 'pr-outreach-dept',
    question: 'What does the PR & Outreach Department do?',
    intro:
      "The PR & Outreach Department focuses on communication, networking, collaborations, and expanding CSI's reach. Members connect with students, organizations, speakers, communities, and potential collaborators while promoting CSI's events and initiatives.",
    suitableFor:
      'Students who enjoy communication, networking, relationship building, and outreach.',
  },
  {
    id: 'management-dept',
    question: 'What does the Management Department do?',
    intro:
      'The Management Department handles the planning and execution of CSI activities. Members coordinate teams, manage logistics, organize events, handle volunteers, maintain timelines, and ensure that activities run smoothly.',
    suitableFor:
      'Students who are organized, responsible, good at coordination, and enjoy managing events.',
  },
  {
    id: 'content-dept',
    question: 'What does the Content Department do?',
    intro:
      "The Content Department is responsible for CSI's written communication. Members create captions, announcements, event descriptions, scripts, emails, articles, promotional copy, and other written content.",
    suitableFor:
      'Students interested in writing, storytelling, communication, social media, and creative thinking.',
  },
  {
    id: 'design-dept',
    question: 'What does the Design Department do?',
    intro:
      'The Design Department focuses on the visual design and branding of CSI and its events. Members create posters, social media creatives, banners, presentations, event graphics, and other visual assets while maintaining a consistent visual identity.',
    suitableFor:
      'Students interested in graphic design, Canva, Figma, Photoshop, branding, typography, and visual creativity.',
  },
  {
    id: 'multimedia-dept',
    question: 'What does the Multimedia Department do?',
    intro:
      "The Multimedia Department focuses on visual storytelling through photography, videography, video editing, reels, event coverage, and other multimedia content. Members capture and document CSI's events and transform the footage into engaging digital content.",
    suitableFor:
      'Students interested in photography, videography, video editing, filmmaking, reels, cinematography, and visual storytelling.',
  },
  {
    id: 'research-dept',
    question: 'What does the Research Department do?',
    intro:
      "The Research Department explores emerging technologies, trends, ideas, and opportunities relevant to CSI. Members conduct research, gather information, analyze topics, and provide insights that can support CSI's events, initiatives, and technical activities.",
    suitableFor:
      'Students who enjoy researching, analyzing information, learning new technologies, and exploring innovative ideas.',
  },
  {
    id: 'sponsorship-dept',
    question: 'What does the Sponsorship Department do?',
    intro:
      'The Sponsorship Department works on building professional relationships with companies, startups, organizations, and potential sponsors. Members prepare sponsorship proposals, communicate with potential partners, pitch CSI initiatives, and work toward securing sponsorships and collaborations.',
    suitableFor:
      'Students interested in business development, communication, pitching, negotiation, networking, and professional relationship building.',
  },
  {
    id: 'design-vs-multimedia',
    question: 'What is the difference between Design and Multimedia?',
    paragraphs: [
      'Design focuses on creating graphics and visual assets, while Multimedia focuses on capturing and producing dynamic visual content.',
      'Design: Posters, banners, social media creatives, branding, presentations, typography, and graphic design.',
      'Multimedia: Photography, videography, video editing, reels, event coverage, cinematography, and visual storytelling.',
      'Both departments work closely together but have different responsibilities.',
    ],
  },
  {
    id: 'need-technical-skills',
    question: 'Do I need technical skills to join CSI?',
    intro:
      'No. CSI has departments covering technology, communication, management, creativity, research, outreach, and business development. You can choose a department according to your interests and strengths. Programming skills are primarily relevant to the Tech Department.',
  },
  {
    id: 'work-on-hackaccino',
    question: 'Can I work on Hackaccino after joining CSI?',
    paragraphs: [
      'CSI members can get opportunities to contribute to major initiatives such as Hackaccino, one of the biggest hackathons witnessed at Bennett University. The event brings together around 1,200 participants for a 24-hour hackathon, requiring collaboration between multiple CSI departments.',
      'Different departments contribute in different ways — from technology and event management to PR, content, design, multimedia, research, and sponsorship.',
    ],
  },
  {
    id: 'which-dept-choose',
    question: 'Which department should I choose?',
    intro: 'Think about the type of work you enjoy:',
    bullets: [
      'Tech → Coding & development',
      'PR & Outreach → Networking & communication',
      'Management → Planning & coordination',
      'Content → Writing & storytelling',
      'Design → Graphics & visual design',
      'Multimedia → Photography, videography & video editing',
      'Research → Research & exploring new technologies',
      'Sponsorship → Pitching, partnerships & business communication',
    ],
    footer:
      'Choose the department where you are most interested in learning, contributing, and developing your skills.',
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
      className="relative z-10 w-full min-h-screen flex items-center justify-center border-t border-white/10 bg-[#030304] py-24 sm:py-32 overflow-hidden text-[#F4F4F5]"
    >
      <div className="relative mx-auto w-full max-w-4xl px-6 sm:px-10">
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
          className="text-center font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal italic tracking-[-0.015em] text-white [text-wrap:balance]"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 text-center text-xs sm:text-sm font-normal text-purple-200/70"
        >
          Everything you need to know to join the team
        </motion.p>

        {/* FAQ Items with slightly reduced text size */}
        <div className="mt-10 sm:mt-12 space-y-3.5">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{
                  duration: 0.6,
                  delay: 0.18 + idx * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                    isOpen
                      ? 'border-purple-500/40 bg-[#0e0a16]/95 shadow-[0_16px_50px_rgba(147,51,234,0.15)]'
                      : 'border-white/10 bg-[#0a0711]/70 hover:border-white/20 hover:bg-[#120d1e]/85 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left cursor-pointer transition-colors"
                  >
                    <span className="text-sm sm:text-base lg:text-lg font-medium text-white/95 tracking-[-0.01em]">
                      {item.question}
                    </span>

                    <div
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                          : 'border-white/15 bg-white/5 text-purple-300/80 group-hover:border-white/30 group-hover:text-white'
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
                          <div className="px-5 sm:px-7 pb-5 pt-1.5 space-y-3.5 text-xs sm:text-sm font-light leading-relaxed text-[#ede9fe]/90 border-t border-white/5">
                            {item.intro && <p>{item.intro}</p>}

                            {item.bullets && (
                              <ul className="space-y-1.5 pl-2">
                                {item.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {item.footer && <p>{item.footer}</p>}

                            {item.paragraphs &&
                              item.paragraphs.map((para, pIdx) => (
                                <p key={pIdx}>{para}</p>
                              ))}

                            {item.suitableFor && (
                              <p className="pt-1 text-[#ede9fe]/95">
                                <span className="font-semibold text-purple-300">
                                  Suitable for:
                                </span>{' '}
                                {item.suitableFor}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle bottom chapter tag */}
        <div className="mt-12 text-center text-[10px] font-medium tracking-[0.2em] text-purple-300/40 uppercase">
          CSI · Bennett University
        </div>
      </div>
    </section>
  );
};
