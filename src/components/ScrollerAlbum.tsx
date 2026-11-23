import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '../data/chapterData';

interface ScrollerAlbumProps {
  id?: string;
  onSelectProject?: (project: ShowcaseProject) => void;
}

export const ScrollerAlbum: React.FC<ScrollerAlbumProps> = ({
  id = 'showcase-album',
  onSelectProject,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = SHOWCASE_PROJECTS;
  const count = projects.length;

  const [cardStep, setCardStep] = useState(540);
  const [centerOffset, setCenterOffset] = useState(0);

  // Keep a mutable ref of activeIndex for synchronous wheel decision-making
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Compute exact pixel geometry so active card is precisely centered
  const updateGeometry = useCallback(() => {
    if (containerRef.current && cardRef.current) {
      const parentWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth;
      const gap = 20; // clean gap between cards
      setCardStep(cardWidth + gap);
      setCenterOffset((parentWidth - cardWidth) / 2);
    }
  }, []);

  useEffect(() => {
    updateGeometry();
    window.addEventListener('resize', updateGeometry);
    return () => window.removeEventListener('resize', updateGeometry);
  }, [updateGeometry]);

  // WHEEL INTERCEPTION & NATURAL BOUNDARY ESCAPE
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulator = 0;
    let lastStepTime = 0;
    let boundaryArrivalTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const currentIdx = activeIndexRef.current;
      const dominantDelta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      const now = Date.now();
      const isAtEnd = currentIdx === count - 1;
      const isAtStart = currentIdx === 0;

      // 1. If at the last photo and scrolling down:
      if (isAtEnd && dominantDelta > 0) {
        if (now - boundaryArrivalTime > 220) {
          return;
        }
        e.preventDefault();
        return;
      }

      // 2. If at the first photo and scrolling up:
      if (isAtStart && dominantDelta < 0) {
        if (now - boundaryArrivalTime > 220) {
          return;
        }
        e.preventDefault();
        return;
      }

      // 3. Inside the album range: prevent document page scroll and drive carousel
      e.preventDefault();
      e.stopPropagation();

      accumulator += dominantDelta;
      const THRESHOLD = 35;

      if (Math.abs(accumulator) >= THRESHOLD) {
        if (now - lastStepTime > 240) {
          if (accumulator > 0) {
            setActiveIndex((prev) => {
              const next = Math.min(count - 1, prev + 1);
              if (next === count - 1) {
                boundaryArrivalTime = Date.now();
              }
              return next;
            });
          } else {
            setActiveIndex((prev) => {
              const prevIdx = Math.max(0, prev - 1);
              if (prevIdx === 0) {
                boundaryArrivalTime = Date.now();
              }
              return prevIdx;
            });
          }
          lastStepTime = now;
        }
        accumulator = 0;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [count]);

  // Touch swipe support for mobile/tablet
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => Math.min(count - 1, prev + 1));
      } else {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    }
    touchStartX.current = null;
  };

  const trackX = centerOffset - activeIndex * cardStep;

  return (
    <section
      id={id}
      ref={containerRef}
      aria-label="CSI Selected Works Album"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-[#030304] border-t border-white/10 py-10 sm:py-14 overflow-hidden flex flex-col justify-center select-none"
    >
      {/* Subtle background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.02)_0%,transparent_60%)]"
      />

      {/* Top Header & Section Index */}
      <div className="relative z-20 mx-auto w-full max-w-[1280px] px-6 sm:px-12 flex items-center justify-between mb-6">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f2f2f2]/55">
            Selected Works · Chapter Archive
          </p>
          <h2 className="font-editorial text-xl sm:text-2xl font-normal italic text-white mt-0.5">
            Curated Engineering
          </h2>
        </div>

        {/* Minimal indicator */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span className="text-white font-bold">0{activeIndex + 1}</span>
          <span>/</span>
          <span>0{count}</span>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="relative z-10 w-full overflow-visible py-2">
        <motion.div
          animate={prefersReducedMotion ? undefined : { x: trackX }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 28,
            mass: 0.7,
          }}
          className="flex items-center gap-5 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {projects.map((project, idx) => {
            const isActive = idx === activeIndex;

            return (
              <motion.article
                key={project.id}
                ref={idx === 0 ? cardRef : undefined}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(idx);
                  } else {
                    onSelectProject?.(project);
                  }
                }}
                whileHover={prefersReducedMotion ? undefined : { scale: isActive ? 1.01 : 0.94 }}
                className={`group relative shrink-0 w-[82vw] sm:w-[440px] md:w-[500px] max-w-[520px] rounded-2xl border transition-all duration-500 ease-out cursor-pointer overflow-hidden backdrop-blur-xl ${
                  isActive
                    ? 'border-white/25 bg-[#0a0a0d]/95 shadow-[0_16px_50px_rgba(0,0,0,0.85)] scale-100 opacity-100'
                    : 'border-white/10 bg-[#08080a]/60 shadow-[0_12px_40px_rgba(0,0,0,0.5)] scale-[0.93] opacity-35 hover:opacity-60'
                }`}
              >
                {/* Card Artwork Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-black/20" />
                </div>

                {/* Card Content Footer with decreased font size */}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#f2f2f2]/60">
                      <span>0{idx + 1}</span>
                      <span className="mx-1.5">·</span>
                      <span>{project.category}</span>
                      <span className="mx-1.5">·</span>
                      <span>{project.year}</span>
                    </div>

                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 group-hover:border-white/70 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </div>
                  </div>

                  <h3 className="font-editorial mt-1 text-lg sm:text-xl font-normal italic text-white transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#f2f2f2]/60 font-sans font-light line-clamp-1 max-w-lg">
                    {project.summary}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
