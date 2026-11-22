import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { ShowcaseProject } from '../data/chapterData';

interface ProjectModalProps {
  project: ShowcaseProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    setCopied(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  const handleCopy = () => {
    if (!project) return;
    navigator.clipboard?.writeText(project.codeExcerpt).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={onClose}
        >
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/12 bg-[#0e0e10]/95 text-[#f2f2f2] shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-zinc-200 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br ${project.fallbackTone}`}>
              {!imgFailed ? (
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-center">
                  <span className="font-editorial text-3xl italic text-zinc-300">{project.title}</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-transparent to-black/30" />
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.stack}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{project.year}</span>
              </div>

              <h2 id="project-modal-title" className="font-editorial mt-3 text-3xl sm:text-5xl font-normal italic tracking-[-0.01em] text-white leading-[1.05]">
                {project.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#f2f2f2]/82">
                {project.summary}
              </p>

              <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Architecture & Approach</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#f2f2f2]/82">
                    {project.architecture}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Project Lead</h3>
                    <p className="mt-1 text-sm font-medium text-white">{project.lead}</p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">Measured Outcome</h3>
                    <p className="mt-1 font-mono-code text-sm tabular-nums text-emerald-300">
                      {project.impactMetric}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-[#040406] p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono-code text-xs text-zinc-400">python excerpt</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/12 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono-code mt-3 overflow-x-auto text-xs leading-relaxed text-zinc-200 sm:text-sm">
                  <code>{project.codeExcerpt}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
