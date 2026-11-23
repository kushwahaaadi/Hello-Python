import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';

export const RegistrationSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Ambient particles effect with clean monochrome tones
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.4,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: -Math.random() * 0.3 - 0.08,
      color: 'rgba(255, 255, 255,',
      opacity: Math.random() * 0.35 + 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="register"
      aria-label="CSI Student Registration"
      className="relative z-10 min-h-screen w-full border-t border-white/10 bg-[#050505] py-24 sm:py-32 text-[#F4F4F5] overflow-hidden"
    >
      {/* Background ambient particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      />

      {/* Subtle atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[800px] rounded-full bg-gradient-to-b from-white/[0.03] via-transparent to-transparent blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#f2f2f2]/75 backdrop-blur-md font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              <span>Official Event Registration</span>
            </div>

            <h2 className="font-editorial mt-5 text-4xl sm:text-6xl lg:text-7xl font-normal italic tracking-[-0.02em] text-[#F4F4F5] leading-[1.04] [text-wrap:balance]">
              Reserve Your Spot.
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-300 font-sans font-light max-w-2xl mx-auto">
              Join us for an unforgettable chapter experience. Register via Luma for instant confirmation, access passes, and calendar synchronization.
            </p>
          </motion.div>
        </div>

        {/* Luma Event Embed Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-20 mx-auto max-w-[920px]"
        >
          <div className="relative rounded-2xl border border-white/15 bg-[#0a0a0c]/85 p-4 sm:p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            {/* Top Bar / Event Badge */}
            <div className="mb-4 flex items-center justify-between px-2 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-200">
                <Calendar className="h-3.5 w-3.5" />
                <span>Luma Event Portal</span>
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Verified Admission</span>
              </span>
            </div>

            {/* Responsive Iframe Container */}
            <div className="w-full overflow-hidden rounded-xl bg-black/60 shadow-inner">
              <iframe
                src="https://luma.com/embed/event/evt-dmCG5tCmR6K01vB/simple"
                width="100%"
                height="540"
                frameBorder="0"
                style={{ border: '1px solid rgba(191, 203, 218, 0.25)', borderRadius: '8px' }}
                allow="fullscreen; payment"
                aria-hidden="false"
                tabIndex={0}
                title="Luma Event Registration"
                className="w-full min-h-[520px] sm:min-h-[560px]"
              />
            </div>

            {/* Direct Fallback Link */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-3 border-t border-white/10 text-xs text-zinc-400">
              <span>Trouble viewing the embed widget?</span>
              <a
                href="https://lu.ma/event/evt-dmCG5tCmR6K01vB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-200 hover:text-white underline underline-offset-4 font-medium transition-colors"
              >
                <span>Open event directly on Luma</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Sentinel marking the exact end/bottom of the registration section */}
        <div
          id="registration-end-sentinel"
          aria-hidden="true"
          className="pointer-events-none h-px w-full mt-10"
        />
      </div>
    </section>
  );
};
