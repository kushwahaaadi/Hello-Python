import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { LeaderProfile } from '../data/chapterData';

interface LeaderModalProps {
  leader: LeaderProfile | null;
  onClose: () => void;
  onJumpToWork: () => void;
}

export const LeaderModal: React.FC<LeaderModalProps> = ({ leader, onClose, onJumpToWork }) => {
  useEffect(() => {
    if (!leader) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leader, onClose]);

  return (
    <AnimatePresence>
      {leader && (
        <motion.div
          key="leader-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leader-modal-name"
          onClick={onClose}
        >
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl rounded-2xl border border-white/12 bg-[#0e0e10]/95 p-6 text-[#f2f2f2] shadow-2xl backdrop-blur-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close leader monograph"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-300 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 overflow-hidden font-editorial text-2xl italic text-white">
                {leader.image ? (
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  leader.initials
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                  <span>{leader.role}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono-code">{leader.tenure}</span>
                </div>
                <h2 id="leader-modal-name" className="font-editorial mt-1 text-3xl font-normal italic text-white sm:text-4xl leading-tight">
                  {leader.name}
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-[#f2f2f2]/82 sm:text-base">
              {leader.bio}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Focus & Contributions</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#f2f2f2]/85">
                {leader.highlights.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5">
                    <span className="text-zinc-500" aria-hidden="true">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                <span>Lead Artifact</span>
                <p className="mt-0.5 text-sm font-medium text-white">{leader.featuredProject}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onJumpToWork();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.05em] text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/60 hover:bg-white/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>View Chapter Work</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
