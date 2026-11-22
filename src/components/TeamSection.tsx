import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CHAPTER_LEADERS, LeaderProfile } from '../data/chapterData';

interface TeamSectionProps {
  onSelectLeader: (leader: LeaderProfile) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ onSelectLeader }) => {
  return (
    <section id="leadership" className="relative z-10 border-t border-white/10 bg-[#0a0a0b] py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
              CSI Chapter Leadership
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-normal italic tracking-[-0.01em] text-white sm:text-5xl [text-wrap:balance]">
              Stewards of the Craft
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 lg:col-span-5">
            <div>
              <p className="font-editorial text-3xl sm:text-5xl italic tabular-nums tracking-[-0.03em] text-white">14</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Years active</p>
            </div>
            <div>
              <p className="font-editorial text-3xl sm:text-5xl italic tabular-nums tracking-[-0.03em] text-white">48</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Python sprints</p>
            </div>
            <div>
              <p className="font-editorial text-3xl sm:text-5xl italic tabular-nums tracking-[-0.03em] text-white">420+</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Student fellows</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CHAPTER_LEADERS.map((leader, idx) => (
            <motion.button
              key={leader.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectLeader(leader)}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e0e10]/60 p-6 text-left transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] overflow-hidden font-editorial text-2xl italic text-white transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      leader.initials
                    )}
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-zinc-400 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-white/35 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                  <span>{leader.role}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono-code">{leader.tenure}</span>
                </div>

                <h3 className="font-editorial mt-2 text-2xl font-normal italic text-white group-hover:underline underline-offset-4 decoration-1">
                  {leader.name}
                </h3>

                <p className="mt-1 text-xs text-zinc-400 font-sans">{leader.discipline}</p>

                <p className="mt-4 text-sm leading-relaxed text-[#f2f2f2]/82 font-sans">
                  {leader.bio}
                </p>
              </div>

              <div className="mt-6 border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                <span>Featured: </span>
                <span className="text-zinc-200">{leader.featuredProject}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
