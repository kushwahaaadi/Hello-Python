import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '../data/chapterData';

interface FlyThroughTunnelProps {
  onSelectProject: (project: ShowcaseProject) => void;
  onJumpToArchive: () => void;
}

const CARD_SLOTS = [
  { xPct: -16, yPct: -4, rotY: 6 },
  { xPct: 18, yPct: 5, rotY: -6 },
  { xPct: -18, yPct: 4, rotY: 5 },
  { xPct: 16, yPct: -5, rotY: -5 },
  { xPct: -14, yPct: -3, rotY: 6 },
  { xPct: 15, yPct: 4, rotY: -6 },
];

interface TunnelCardProps {
  project: ShowcaseProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
  slot: { xPct: number; yPct: number; rotY: number };
  onSelect: (project: ShowcaseProject) => void;
}

const TunnelCard: React.FC<TunnelCardProps> = ({
  project,
  index,
  total,
  progress,
  slot,
  onSelect,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(index === 0);

  // Distribute milestones cleanly from 0.09 to 0.89
  const center = 0.09 + (index / Math.max(1, total - 1)) * 0.8;
  const enterStart = center - 0.22;
  const focusStart = center - 0.05;
  const focusEnd = center + 0.05;
  const exitEnd = center + 0.2;

  const scale = useTransform(
    progress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [0.24, 0.96, 1.04, 1.72]
  );

  const opacity = useTransform(
    progress,
    [enterStart, center - 0.11, focusStart, focusEnd, center + 0.12, exitEnd],
    [0, 0.72, 1, 1, 0.65, 0]
  );

  const x = useTransform(
    progress,
    [enterStart, center, exitEnd],
    [`${slot.xPct * 0.35}vw`, `${slot.xPct}vw`, `${slot.xPct * 2.25}vw`]
  );

  const y = useTransform(
    progress,
    [enterStart, center, exitEnd],
    [`${slot.yPct * 0.4}vh`, `${slot.yPct}vh`, `${slot.yPct * 2.1}vh`]
  );

  const rotateY = useTransform(
    progress,
    [enterStart, center, exitEnd],
    [slot.rotY, 0, -slot.rotY * 1.4]
  );

  useMotionValueEvent(progress, 'change', (latest) => {
    const active = latest >= center - 0.12 && latest <= center + 0.12;
    if (active !== isInteractive) {
      setIsInteractive(active);
    }
  });

  return (
    <motion.div
      style={{
        scale,
        opacity,
        x,
        y,
        rotateY,
        zIndex: Math.round((1 - Math.abs(index)) * 10) + (isInteractive ? 30 : 10),
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
      className="absolute left-1/2 top-1/2 w-[84vw] max-w-[540px] -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      <button
        type="button"
        onClick={() => onSelect(project)}
        tabIndex={isInteractive ? 0 : -1}
        aria-hidden={!isInteractive}
        className="group block w-full overflow-hidden rounded-2xl border border-white/15 bg-[#09090C]/95 text-left shadow-[0_32px_90px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors duration-200 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <div
          className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${project.fallbackTone}`}
        >
          {!imgFailed ? (
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6">
              <span className="font-editorial text-2xl italic text-zinc-300">
                {project.title}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090C] via-black/15 to-transparent" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
            <span className="tabular-nums font-mono-code">0{index + 1}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{project.year}</span>
          </div>

          <div className="mt-2 flex items-start justify-between gap-4">
            <h3 className="font-editorial text-2xl font-normal italic text-white sm:text-3xl">
              {project.title}
            </h3>
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-zinc-300 transition-colors group-hover:border-white/60 group-hover:text-white">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#f2f2f2]/75 sm:text-sm font-sans">
            {project.summary}
          </p>
        </div>
      </button>
    </motion.div>
  );
};

export const FlyThroughTunnel: React.FC<FlyThroughTunnelProps> = ({
  onSelectProject,
  onJumpToArchive,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.0005,
  });

  const progressBarScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Track which project milestone is currently centered
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const total = SHOWCASE_PROJECTS.length;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < total; i++) {
      const center = 0.09 + (i / Math.max(1, total - 1)) * 0.8;
      const d = Math.abs(latest - center);
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    }
    if (closest !== activeIndex) {
      setActiveIndex(closest);
    }
  });

  // 3D Starfield depth tunnel driven by scroll velocity & progress
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;
    let lastProgress = smoothProgress.get();

    const stars = Array.from({ length: 220 }, (_, i) => {
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const seed2 = Math.sin(i * 78.233) * 23421.631;
      const seed3 = Math.sin(i * 39.425) * 19283.141;
      return {
        x: (seed1 - Math.floor(seed1) - 0.5) * 2,
        y: (seed2 - Math.floor(seed2) - 0.5) * 2,
        z: seed3 - Math.floor(seed3),
      };
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    const render = () => {
      const current = smoothProgress.get();
      const delta = current - lastProgress;
      lastProgress = current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const speedBoost = Math.min(0.08, Math.abs(delta) * 2.5);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Continuous depth position wrapped cleanly in [0.05, 1]
        const rawZ = (s.z - current * 2.6) % 1;
        const z = rawZ < 0 ? rawZ + 1 : rawZ;
        const depth = Math.max(0.04, z);

        const sx = cx + (s.x / depth) * width * 0.42;
        const sy = cy + (s.y / depth) * height * 0.42;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        const alpha = Math.min(0.85, (1 - depth) * 0.9);
        const size = Math.max(1, (1 - depth) * 2.4);

        ctx.globalAlpha = alpha;
        if (!prefersReducedMotion && speedBoost > 0.004) {
          const prevDepth = Math.min(1, depth + speedBoost * 1.4);
          const px = cx + (s.x / prevDepth) * width * 0.42;
          const py = cy + (s.y / prevDepth) * height * 0.42;
          ctx.beginPath();
          ctx.strokeStyle = '#D4D4D8';
          ctx.lineWidth = size * 0.8;
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#D4D4D8';
          ctx.fillRect(sx, sy, size, size);
        }
      }

      ctx.restore();
      if (!prefersReducedMotion) {
        animId = window.requestAnimationFrame(render);
      }
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion, smoothProgress]);

  const jumpToMilestone = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const total = SHOWCASE_PROJECTS.length;
    const targetProgress = 0.09 + (index / Math.max(1, total - 1)) * 0.8;
    const rect = container.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollable = Math.max(1, container.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: containerTop + scrollable * targetProgress,
      behavior: 'smooth',
    });
  };

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <section
      id="fly-through"
      ref={containerRef}
      aria-label="Interactive 3D work fly-through"
      className="relative h-[400vh] w-full bg-[#030304]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden [perspective:1200px]">
        <canvas
          ref={starCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Top ambient tunnel caption */}
        <div className="pointer-events-none relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-20 sm:px-10">
          <div className="text-xs text-zinc-400">
            <span>Fly-Through Archive</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="tabular-nums text-zinc-200">
              0{activeIndex + 1} / 0{SHOWCASE_PROJECTS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onJumpToArchive}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Jump to index</span>
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>

        {/* 3D Z-Space Floating Project Planes */}
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {SHOWCASE_PROJECTS.map((project, index) => (
            <TunnelCard
              key={project.id}
              project={project}
              index={index}
              total={SHOWCASE_PROJECTS.length}
              progress={smoothProgress}
              slot={CARD_SLOTS[index % CARD_SLOTS.length]}
              onSelect={onSelectProject}
            />
          ))}
        </div>

        {/* Bottom Scrubber & Active Milestone Bar */}
        <div className="absolute inset-x-0 bottom-6 z-30 mx-auto max-w-[920px] px-6">
          <div className="rounded-2xl border border-white/12 bg-[#09090C]/80 px-5 py-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[11px] text-zinc-400">
                  {SHOWCASE_PROJECTS[activeIndex]?.category} · {SHOWCASE_PROJECTS[activeIndex]?.year}
                </span>
                <p className="font-editorial truncate text-base italic text-white sm:text-lg">
                  {SHOWCASE_PROJECTS[activeIndex]?.title}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {SHOWCASE_PROJECTS.map((proj, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => jumpToMilestone(idx)}
                      aria-label={`Fly to ${proj.title}`}
                      className={`rounded-md px-2 py-1 font-mono-code text-xs tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        active
                          ? 'bg-white text-black font-medium'
                          : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2.5 h-[1px] w-full overflow-hidden bg-white/10">
              <motion.div
                style={{ scaleX: progressBarScaleX, transformOrigin: '0% 50%' }}
                className="h-full w-full bg-white/80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
