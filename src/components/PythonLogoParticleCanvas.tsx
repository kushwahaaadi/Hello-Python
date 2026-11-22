import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { PYTHON_LOGO_POINTS } from '../data/pythonLogoPoints';
import pythonHeroImg from '../assets/images/python-3d-hero.png';

interface PythonLogoParticleCanvasProps {
  scrollProgress: number;
  onFormationComplete?: () => void;
  replayKey?: number;
}

interface Particle {
  // Initial scatter position
  initX: number;
  initY: number;
  initAngle: number;
  initDist: number;

  // Target logo position (normalized -0.5 to 0.5)
  targetNormX: number;
  targetNormY: number;

  // Visuals
  size: number;
  targetSize: number;
  alpha: number;
  targetAlpha: number;

  // Colors
  initRgb: [number, number, number];
  targetRgb: [number, number, number];

  // Motion physics
  speed: number;
  phase: number;
  swirlDir: number;
  delayOffset: number;
}

interface AmbientDust {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rgb: [number, number, number];
  phase: number;
  speed: number;
}

// Particle colors as specified: white, silver, cyan, blue, purple, green, and subtle golden
const COLOR_PALETTE: [number, number, number][] = [
  [255, 255, 255], // White
  [226, 232, 240], // Silver / Slate
  [103, 232, 249], // Cyan
  [96, 165, 250],  // Blue
  [192, 132, 252], // Purple
  [52, 211, 153],  // Vibrant Green / Emerald
  [251, 191, 36],  // Subtle Gold
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export const PythonLogoParticleCanvas: React.FC<PythonLogoParticleCanvasProps> = ({
  scrollProgress,
  onFormationComplete,
  replayKey = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef(scrollProgress);
  const onCompleteRef = useRef(onFormationComplete);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    onCompleteRef.current = onFormationComplete;
  }, [onFormationComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;
    let hasNotifiedComplete = false;

    // Load reference image for the permanent high-definition layer
    const refImg = new Image();
    refImg.src = pythonHeroImg;

    const getLogoSpan = (w: number, h: number) => {
      if (w < 640) {
        return Math.min(320, w * 0.82, h * 0.46);
      }
      if (w < 1024) {
        return Math.min(440, w * 0.58, h * 0.52);
      }
      return Math.min(540, w * 0.45, h * 0.60);
    };

    let logoSpan = getLogoSpan(window.innerWidth, window.innerHeight);
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight * 0.46; // Elegantly positioned above Hello Python

    // Initialize particles
    const particles: Particle[] = PYTHON_LOGO_POINTS.map((pt) => {
      const [nx, ny, r, g, b, targetAlpha] = pt;

      const initX = (Math.random() - 0.5) * window.innerWidth * 1.3;
      const initY = (Math.random() - 0.5) * window.innerHeight * 1.3;
      const initDist = Math.hypot(initX, initY);
      const initAngle = Math.atan2(initY, initX);

      const colorIdx = Math.floor(Math.random() * COLOR_PALETTE.length);
      const initRgb = COLOR_PALETTE[colorIdx];

      const normDist = Math.hypot(nx, ny);

      return {
        initX,
        initY,
        initAngle,
        initDist,
        targetNormX: nx,
        targetNormY: ny,
        size: 1.4 + Math.random() * 2.2,
        targetSize: 2.8 + Math.random() * 0.9,
        alpha: 0.25 + Math.random() * 0.65,
        targetAlpha: Math.max(0.7, targetAlpha),
        initRgb,
        targetRgb: [r, g, b],
        speed: 0.7 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        swirlDir: Math.random() > 0.5 ? 1 : -1,
        delayOffset: clamp(normDist * 0.38 + Math.random() * 0.12, 0, 0.42),
      };
    });

    // Ambient floating stardust around the background
    const ambientDust: AmbientDust[] = Array.from({ length: 95 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1.0 + Math.random() * 1.6,
      alpha: 0.15 + Math.random() * 0.45,
      rgb: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.35,
    }));

    const startTime = performance.now();

    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      logoSpan = getLogoSpan(width, height);
      centerX = width / 2;
      centerY = height * 0.46;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const elapsed = prefersReducedMotion ? 999 : (now - startTime) / 1000;

      // ==========================================
      // TIMELINE (As Specified):
      // 0–3s: Particles appear and gather towards center
      // 3–5s: Python logo forms completely
      // 5s+: Completed logo remains PERMANENTLY VISIBLE
      // ==========================================

      let formProgress = 0;
      let crispImageBlend = 0;

      if (elapsed < 1.2) {
        // Initial floating particles
        formProgress = 0;
      } else if (elapsed < 3.0) {
        // Swirling attraction
        const t = (elapsed - 1.2) / 1.8;
        formProgress = clamp(t * 0.45, 0, 0.45);
      } else if (elapsed < 5.0) {
        // Final assembly into crisp logo
        const t = (elapsed - 3.0) / 2.0;
        formProgress = clamp(0.45 + t * 0.55, 0, 1);
        if (t > 0.6) {
          crispImageBlend = clamp((t - 0.6) / 0.4, 0, 1);
        }
      } else {
        // 5s ONWARDS: PERMANENTLY FULLY FORMED
        formProgress = 1;
        crispImageBlend = 1;

        if (!hasNotifiedComplete) {
          hasNotifiedComplete = true;
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }

      // Early notification at 4.8s so hero text transitions gracefully with the settling particles
      if (elapsed >= 4.8 && !hasNotifiedComplete) {
        hasNotifiedComplete = true;
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }

      // Scroll reactions
      const fly = Math.min(1, Math.max(0, scrollRef.current));
      const scrollScale = 1 + fly * 0.26;
      const scrollYOffset = -fly * 48;
      const scrollOpacity = Math.max(0, 1 - fly * 1.55);

      if (scrollOpacity <= 0.005) {
        animId = window.requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Stardust (Continues drifting smoothly in the background)
      const stardustAlpha = scrollOpacity * (0.35 + Math.min(1, elapsed / 2.5) * 0.65);
      for (let i = 0; i < ambientDust.length; i++) {
        const d = ambientDust[i];
        const twinkle = 0.75 + 0.25 * Math.sin(elapsed * 1.6 + d.phase);
        const px = (d.x + Math.sin(elapsed * 0.3 + d.phase) * 16) % width;
        const py = (d.y + Math.cos(elapsed * 0.25 + d.phase) * 12) % height;
        const sx = px < 0 ? px + width : px;
        const sy = py < 0 ? py + height : py;

        ctx.fillStyle = `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`;
        ctx.globalAlpha = d.alpha * twinkle * stardustAlpha;
        ctx.fillRect(sx - d.size * 0.5, sy - d.size * 0.5, d.size, d.size);
      }

      // 2. Python Logo Particle Assembly
      const currentSpan = logoSpan * scrollScale;
      const currentCenterY = centerY + scrollYOffset;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let localT = 0;
        if (formProgress > 0) {
          const rawT = (formProgress - p.delayOffset) / (1 - p.delayOffset);
          localT = clamp(rawT, 0, 1);
        }

        const easedLocal = easeOutCubic(localT);

        // Exact destination coordinates
        const targetX = centerX + p.targetNormX * currentSpan;
        const targetY = currentCenterY + p.targetNormY * currentSpan;

        let curX = targetX;
        let curY = targetY;

        if (localT < 1) {
          // Swirling towards target
          const driftX = Math.sin(elapsed * p.speed + p.phase) * 16;
          const driftY = Math.cos(elapsed * p.speed + p.phase) * 12;

          const startX = centerX + p.initX + driftX;
          const startY = currentCenterY + p.initY + driftY;
          const startDist = Math.hypot(startX - centerX, startY - currentCenterY);
          const startAngle = Math.atan2(startY - currentCenterY, startX - centerX);

          const targetDist = Math.hypot(targetX - centerX, targetY - currentCenterY);
          const targetAngle = Math.atan2(targetY - currentCenterY, targetX - centerX);

          // Vortex swirl
          const swirl = Math.sin(localT * Math.PI) * 1.5 * p.swirlDir;
          const curAngle = startAngle + (targetAngle - startAngle) * easedLocal + swirl;
          const curDist = startDist + (targetDist - startDist) * easedLocal;

          curX = centerX + curDist * Math.cos(curAngle);
          curY = currentCenterY + curDist * Math.sin(curAngle);
        }

        // Color transition
        const r = Math.round(p.initRgb[0] + (p.targetRgb[0] - p.initRgb[0]) * easedLocal);
        const g = Math.round(p.initRgb[1] + (p.targetRgb[1] - p.initRgb[1]) * easedLocal);
        const b = Math.round(p.initRgb[2] + (p.targetRgb[2] - p.initRgb[2]) * easedLocal);

        // Size & opacity
        const curSize = (p.size + (p.targetSize - p.size) * easedLocal) * scrollScale;
        const curAlpha = (p.alpha + (p.targetAlpha - p.alpha) * easedLocal) * scrollOpacity;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.globalAlpha = curAlpha;
        ctx.fillRect(curX - curSize * 0.5, curY - curSize * 0.5, curSize, curSize);
      }

      // 3. Crisp Reference Texture Blend (Permits 100% stable, razor-sharp permanent logo)
      if (crispImageBlend > 0 && refImg.complete && refImg.naturalWidth > 0) {
        ctx.globalAlpha = crispImageBlend * 0.94 * scrollOpacity;
        const imgW = currentSpan * 1.15;
        const imgH = (imgW * refImg.naturalHeight) / refImg.naturalWidth;
        const imgX = centerX - imgW * 0.5;
        const imgY = currentCenterY - imgH * 0.5;
        ctx.drawImage(refImg, imgX, imgY, imgW, imgH);
      }

      ctx.restore();

      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [replayKey, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[10] h-full w-full select-none"
      aria-hidden="true"
    />
  );
};
