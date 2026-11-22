import React, { useEffect, useRef } from 'react';

interface StarParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
}

interface CyberDustParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rgb: [number, number, number];
  vx: number;
  vy: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

interface CosmicStarfieldCanvasProps {
  scrollProgress: number;
  ready?: boolean;
}

function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

const CYBER_PALETTE: [number, number, number][] = [
  [167, 243, 208], // Mint / emerald
  [103, 232, 249], // Cyan
  [165, 180, 252], // Indigo
  [196, 181, 253], // Lavender
  [253, 230, 138], // Gold
  [216, 180, 254], // Violet
  [248, 250, 252], // Silver white
];

export const CosmicStarfieldCanvas: React.FC<CosmicStarfieldCanvasProps> = ({
  scrollProgress,
  ready = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef(scrollProgress);
  const readyRef = useRef(ready);
  const readyTimeRef = useRef<number | null>(ready ? performance.now() : null);
  const smoothScrollRef = useRef(scrollProgress);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false, smoothX: 0.5, smoothY: 0.5 });
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) {
      readyTimeRef.current = performance.now();
    } else {
      readyTimeRef.current = null;
    }
  }, [ready]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stars: StarParticle[] = [];
    let dust: CyberDustParticle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const buildScene = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      stars = [];
      dust = [];

      const starCount = width < 768 ? 160 : 320;
      for (let i = 0; i < starCount; i++) {
        const rx = hash2d(i * 3.1, 7.2);
        const ry = hash2d(11.4, i * 2.7);
        const rs = hash2d(i, i * 1.3);
        stars.push({
          x: rx * width,
          y: ry * height,
          size: rs < 0.85 ? 1.0 : 1.8,
          alpha: 0.14 + rs * 0.52,
          speed: 0.15 + rs * 0.4,
          phase: rs * Math.PI * 2,
        });
      }

      // Cyber pixel dust floating around center space
      const dustCount = width < 768 ? 45 : 90;
      for (let i = 0; i < dustCount; i++) {
        const r1 = hash2d(i * 5.7, 13.9);
        const r2 = hash2d(i * 9.3, 21.1);
        const r3 = hash2d(i * 4.1, 8.5);
        const colorIdx = Math.floor(r3 * CYBER_PALETTE.length);

        dust.push({
          x: (0.2 + r1 * 0.6) * width,
          y: (0.2 + r2 * 0.6) * height,
          size: 1.5 + r3 * 2.2,
          alpha: 0.2 + r1 * 0.5,
          rgb: CYBER_PALETTE[colorIdx],
          vx: (r1 - 0.5) * 8,
          vy: (r2 - 0.5) * 8 - 4,
          phase: r2 * Math.PI * 2,
        });
      }
    };

    const drawFrame = (now: number) => {
      const t = now * 0.001;
      const elapsed =
        readyRef.current && readyTimeRef.current !== null
          ? Math.max(0, (now - readyTimeRef.current) * 0.001)
          : 0;
      const introProgress = prefersReducedMotion ? 1 : Math.min(1, elapsed / 1.3);
      const introEase = 1 - Math.pow(1 - introProgress, 3);

      const prevSmooth = smoothScrollRef.current;
      smoothScrollRef.current += (scrollRef.current - smoothScrollRef.current) * 0.12;
      const fly = Math.min(1, Math.max(0, smoothScrollRef.current));
      const scrollVelocity = Math.min(0.12, Math.abs(smoothScrollRef.current - prevSmooth) * 4);

      pointerRef.current.smoothX += (pointerRef.current.x - pointerRef.current.smoothX) * 0.08;
      pointerRef.current.smoothY += (pointerRef.current.y - pointerRef.current.smoothY) * 0.08;

      const offsetX = (pointerRef.current.smoothX - 0.5) * 36;
      const offsetY = (pointerRef.current.smoothY - 0.5) * 24;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.54;

      // 1. Ambient Cosmic Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = prefersReducedMotion ? 1 : 0.72 + 0.28 * Math.sin(t * 1.4 + s.phase);
        const starFly = 1 + fly * (0.95 + s.speed * 1.4);
        const sx = centerX + (s.x - centerX) * starFly - offsetX * s.speed * 0.45;
        const sy = centerY + (s.y - centerY) * starFly - offsetY * s.speed * 0.45;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;
        ctx.globalAlpha = s.alpha * twinkle * (1 - fly * 0.55) * (0.35 + introEase * 0.65);
        ctx.fillStyle = '#E4E4E7';

        if (!prefersReducedMotion && (fly > 0.05 || scrollVelocity > 0.005)) {
          const streak = (fly * 10 + scrollVelocity * 160) * s.speed;
          const angle = Math.atan2(sy - centerY, sx - centerX);
          ctx.beginPath();
          ctx.strokeStyle = '#E4E4E7';
          ctx.lineWidth = s.size;
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - Math.cos(angle) * streak, sy - Math.sin(angle) * streak);
          ctx.stroke();
        } else {
          ctx.fillRect(sx, sy, s.size, s.size);
        }
      }

      // 2. Interactive Click Ripples
      ripplesRef.current = ripplesRef.current.filter((rp) => now - rp.startTime < 1400);
      for (let r = 0; r < ripplesRef.current.length; r++) {
        const rp = ripplesRef.current[r];
        const age = (now - rp.startTime) / 1000;
        const waveR = age * 460;
        const alpha = Math.max(0, 1 - age / 1.4) * 0.35;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, waveR * 0.68, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(103, 232, 249, ${alpha * 0.65})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Cyber Floating Pixel Dust
      const dustAlpha = (1 - fly * 1.1) * introEase;
      if (dustAlpha > 0.01) {
        for (let i = 0; i < dust.length; i++) {
          const d = dust[i];
          const shimmer = prefersReducedMotion ? 1 : 0.75 + 0.25 * Math.sin(t * 2 + d.phase);
          const px = d.x + Math.sin(t * 0.6 + d.phase) * 16 - offsetX * 0.35;
          const py = d.y + Math.cos(t * 0.5 + d.phase) * 12 - offsetY * 0.35;

          ctx.globalAlpha = d.alpha * shimmer * dustAlpha;
          ctx.fillStyle = `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`;
          ctx.fillRect(px - d.size * 0.5, py - d.size * 0.5, d.size, d.size);
        }
      }

      ctx.restore();

      if (!prefersReducedMotion) {
        animId = window.requestAnimationFrame(drawFrame);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) / Math.max(1, rect.width);
      pointerRef.current.y = (e.clientY - rect.top) / Math.max(1, rect.height);
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = 0.5;
      pointerRef.current.y = 0.5;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startTime: performance.now(),
      });
    };

    buildScene();
    drawFrame(performance.now());

    window.addEventListener('resize', buildScene);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', buildScene);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-0 h-full w-full cursor-crosshair"
      aria-hidden="true"
    />
  );
};
