import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject, WorkCategory } from '../data/chapterData';

interface WorkShowcaseProps {
  onSelectProject: (project: ShowcaseProject) => void;
}

const CATEGORIES: WorkCategory[] = ['All', 'Python', 'Vision & AI', 'Systems', 'Events'];

export const WorkShowcase: React.FC<WorkShowcaseProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<WorkCategory>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredProjects =
    activeCategory === 'All'
      ? SHOWCASE_PROJECTS
      : SHOWCASE_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="relative z-10 border-t border-white/10 bg-[#0a0a0b] py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
              Complete Index
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-normal italic tracking-[-0.01em] text-white sm:text-5xl [text-wrap:balance]">
              Built with Python & Craft
            </h2>
          </motion.div>

          <div
            className="flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#0e0e10] p-1"
            role="tablist"
            aria-label="Filter projects by discipline"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`relative rounded-lg px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    active ? 'text-black' : 'text-[#f2f2f2]/60 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="work-category-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project, idx) => {
            const isWide = activeCategory === 'All' && project.span === 'wide';
            const imgFailed = failedImages[project.id];

            return (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(idx * 0.07, 0.35),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e10]/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/30 ${
                  isWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="flex h-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <div
                    className={`relative w-full overflow-hidden bg-gradient-to-br ${project.fallbackTone} ${
                      isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    {!imgFailed ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-6">
                        <span className="font-editorial text-2xl italic text-zinc-300">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/20 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-editorial text-3xl italic text-white/80 tabular-nums tracking-[-0.03em] leading-none">
                          0{idx + 1}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                          <span>{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{project.year}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-start justify-between gap-4">
                        <h3 className="font-editorial text-2xl sm:text-3xl font-normal italic text-white transition-colors group-hover:underline underline-offset-4 decoration-1">
                          {project.title}
                        </h3>
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-white/40 group-hover:text-white">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#f2f2f2]/75">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                      <span className="truncate pr-3 font-mono-code lowercase text-xs">{project.stack}</span>
                      <span className="shrink-0 font-medium text-zinc-200">{project.lead}</span>
                    </div>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
