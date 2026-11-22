import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PYTHON_LOGO_POINTS } from '../data/pythonLogoPoints';
import pythonHeroImg from '../assets/images/python-3d-hero.png';

interface PythonLogoParticleIntroProps {
  active: boolean;
  onComplete: () => void;
}

interface Particle {
  // Initial random position
  initX: number;
  initY: number;
  initAngle: number;
  initDist: number;

  // Target logo position
  targetNormX: number;
  targetNormY: number;

  // Particle characteristics
  size: number;
  targetSize: number;
  alpha: number;
  targetAlpha: number;

  // Colors
  initRgb: [number, number, number];
  targetRgb: [number, number, number];

  // Animation dynamics
  speed: number;
  phase: number;
  swirlDir: number;
  delayOffset: number;

  // Dispersal vector
  dispAngle: number;
  dispSpeed: number;
}

const INITIAL_PALETTE: [number, number, number][] = [
  [255, 255, 255], // White
  [226, 232, 240], // Silver / Slate
  [147, 197, 253], // Blue
  [103, 232, 249], // Cyan
  [192, 132, 252], // Purple
  [252, 211, 77],  // Subtle Gold
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export const PythonLogoParticleIntro: React.FC<PythonLogoParticleIntroProps> = ({
  active,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [showSkip, setShowSkip] = useState(false);
  const [logoAlpha, setLogoAlpha] = useState(0);

  // Quick skip option for user convenience
  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Show subtle skip button after 1.5s
    const skipTimer = window.setTimeout(() => setShowSkip(true), 1500);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Load reference logo image for the crisp climax hold phase
    const refImg = new Image();
    refImg.src = pythonHeroImg;

    // Responsive logo span size
    const getLogoSpan = (w: number, h: number) => {
      const minDimension = Math.min(w, h);
      return Math.min(520, Math.max(260, minDimension * 0.58));
    };

    let logoSpan = getLogoSpan(width, height);
    let centerX = width / 2;
    let centerY = height / 2;

    // Initialize particles from the sampled Python logo grid
    const particles: Particle[] = PYTHON_LOGO_POINTS.map((pt, idx) => {
      const [nx, ny, r, g, b, targetAlpha] = pt;

      // Random position across the screen
      const initX = (Math.random() - 0.5) * width * 1.25;
      const initY = (Math.random() - 0.5) * height * 1.25;
      const initDist = Math.hypot(initX, initY);
      const initAngle = Math.atan2(initY, initX);

      // Random color from initial palette
      const colorIdx = Math.floor(Math.random() * INITIAL_PALETTE.length);
      const initRgb = INITIAL_PALETTE[colorIdx];

      // Normalized distance from center (0 to 1) for staggered arrival
      const normDist = Math.hypot(nx, ny);

      return {
        initX,
        initY,
        initAngle,
        initDist,
        targetNormX: nx,
        targetNormY: ny,
        size: 1.5 + Math.random() * 2.2,
        targetSize: 2.8 + Math.random() * 1.1,
        alpha: 0.25 + Math.random() * 0.65,
        targetAlpha: Math.max(0.65, targetAlpha),
        initRgb,
        targetRgb: [r, g, b],
        speed: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        swirlDir: Math.random() > 0.5 ? 1 : -1,
        delayOffset: clamp(normDist * 0.45 + Math.random() * 0.15, 0, 0.45),
        dispAngle: Math.random() * Math.PI * 2,
        dispSpeed: 180 + Math.random() * 420,
      };
    });

    // Ambient background floating particles (120 extra dust particles)
    const ambientCount = 110;
    const ambientDust = Array.from({ length: ambientCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.0 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.5,
      rgb: INITIAL_PALETTE[Math.floor(Math.random() * INITIAL_PALETTE.length)],
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18,
    }));

    const startTime = performance.now();
    let animId = 0;
    let completed = false;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      logoSpan = getLogoSpan(width, height);
      centerX = width / 2;
      centerY = height / 2;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // TIMELINE PHASES:
      // 0.0s - 1.3s: Phase 1 (Initial Random Floating)
      // 1.3s - 4.1s: Phase 2 (Swirling Particle Attraction & Logo Formation)
      // 4.1s - 5.6s: Phase 3 (Crisp Completed Logo Hold ~1.5s)
      // 5.6s - 6.8s: Phase 4 (Gentle Dissolution & Dispersal)
      // 6.8s+: Transition Complete
      // ==========================================

      let formProgress = 0;
      let holdAlpha = 0;
      let disperseProgress = 0;
      let overlayAlpha = 1;

      if (elapsed < 1.3) {
        // Phase 1: Pure floating
        formProgress = 0;
      } else if (elapsed < 4.1) {
        // Phase 2: Assembling
        const t = (elapsed - 1.3) / 2.8;
        formProgress = clamp(t, 0, 1);
      } else if (elapsed < 5.6) {
        // Phase 3: Completed hold
        formProgress = 1;
        const holdT = (elapsed - 4.1) / 0.45;
        holdAlpha = clamp(holdT, 0, 1);
      } else if (elapsed < 6.8) {
        // Phase 4: Dissolving & dispersing
        formProgress = 1;
        const dispT = (elapsed - 5.6) / 1.2;
        disperseProgress = clamp(dispT, 0, 1);
        holdAlpha = Math.max(0, 1 - disperseProgress * 2.5);
        if (elapsed > 6.1) {
          overlayAlpha = Math.max(0, 1 - (elapsed - 6.1) / 0.7);
        }
      } else {
        if (!completed) {
          completed = true;
          onComplete();
        }
        ctx.restore();
        return;
      }

      setLogoAlpha(holdAlpha);

      // 1. Render Ambient Background Stardust
      const ambientFade = 1 - disperseProgress;
      if (ambientFade > 0.01) {
        for (let i = 0; i < ambientDust.length; i++) {
          const d = ambientDust[i];
          const shimmer = 0.75 + 0.25 * Math.sin(elapsed * 1.8 + d.phase);
          const px = (d.x + Math.sin(elapsed * 0.4 + d.phase) * d.vx) % width;
          const py = (d.y + Math.cos(elapsed * 0.4 + d.phase) * d.vy) % height;
          const sx = px < 0 ? px + width : px;
          const sy = py < 0 ? py + height : py;

          ctx.fillStyle = `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`;
          ctx.globalAlpha = d.alpha * shimmer * ambientFade * overlayAlpha;
          ctx.fillRect(sx - d.size * 0.5, sy - d.size * 0.5, d.size, d.size);
        }
      }

      // 2. Render Assembling Logo Particles
      const particleScale = logoSpan;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Individual progressive arrival timing
        let localT = 0;
        if (formProgress > 0) {
          const rawT = (formProgress - p.delayOffset) / (1 - p.delayOffset);
          localT = clamp(rawT, 0, 1);
        }

        const easedLocal = easeOutCubic(localT);

        // Target coordinates in screen space
        const targetX = centerX + p.targetNormX * particleScale;
        const targetY = centerY + p.targetNormY * particleScale;
        const targetDist = Math.hypot(targetX - centerX, targetY - centerY);
        const targetAngle = Math.atan2(targetY - centerY, targetX - centerX);

        let curX = 0;
        let curY = 0;

        if (disperseProgress > 0) {
          // Phase 4: Dispersing outward
          const dispEased = disperseProgress * disperseProgress;
          curX = targetX + Math.cos(p.dispAngle) * p.dispSpeed * dispEased;
          curY = targetY + Math.sin(p.dispAngle) * p.dispSpeed * dispEased;
        } else if (localT < 1) {
          // Phase 1 & 2: Floating and swirling towards target
          // Harmonic drift
          const driftX = Math.sin(elapsed * p.speed + p.phase) * 18;
          const driftY = Math.cos(elapsed * p.speed + p.phase) * 14;

          const startX = centerX + p.initX + driftX;
          const startY = centerY + p.initY + driftY;
          const startDist = Math.hypot(startX - centerX, startY - centerY);
          const startAngle = Math.atan2(startY - centerY, startX - centerX);

          // Swirl effect: angular velocity vortex peak at midpoint
          const swirlMagnitude = Math.sin(localT * Math.PI) * 1.45 * p.swirlDir;
          const curAngle = startAngle + (targetAngle - startAngle) * easedLocal + swirlMagnitude;
          const curDist = startDist + (targetDist - startDist) * easedLocal;

          curX = centerX + curDist * Math.cos(curAngle);
          curY = centerY + curDist * Math.sin(curAngle);
        } else {
          // Phase 3: Snapped into exact position
          curX = targetX;
          curY = targetY;
        }

        // Color interpolation from cosmic palette to exact logo pixel color
        const r = Math.round(p.initRgb[0] + (p.targetRgb[0] - p.initRgb[0]) * easedLocal);
        const g = Math.round(p.initRgb[1] + (p.targetRgb[1] - p.initRgb[1]) * easedLocal);
        const b = Math.round(p.initRgb[2] + (p.targetRgb[2] - p.initRgb[2]) * easedLocal);

        // Size & opacity interpolation
        const curSize = p.size + (p.targetSize - p.size) * easedLocal;
        const alphaFade = disperseProgress > 0 ? Math.max(0, 1 - disperseProgress * 1.5) : 1;
        const curAlpha = (p.alpha + (p.targetAlpha - p.alpha) * easedLocal) * alphaFade * overlayAlpha;

        if (curAlpha > 0.01) {
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.globalAlpha = curAlpha;
          ctx.fillRect(curX - curSize * 0.5, curY - curSize * 0.5, curSize, curSize);
        }
      }

      // 3. Crisp Logo Texture Blend at Climax (Clean, Minimalist, No Glow)
      if (holdAlpha > 0.01 && refImg.complete && refImg.naturalWidth > 0) {
        ctx.globalAlpha = holdAlpha * 0.88 * overlayAlpha;
        const imgW = logoSpan * 1.15;
        const imgH = (imgW * refImg.naturalHeight) / refImg.naturalWidth;
        const imgX = centerX - imgW * 0.5;
        const imgY = centerY - imgH * 0.5;
        ctx.drawImage(refImg, imgX, imgY, imgW, imgH);
      }

      ctx.restore();

      if (!completed) {
        animId = window.requestAnimationFrame(render);
      }
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.clearTimeout(skipTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, prefersReducedMotion, onComplete]);

  return (
    <AnimatePresence>
      {active && !prefersReducedMotion && (
        <motion.div
          key="python-particle-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#030304] select-none overflow-hidden"
          aria-label="Python Logo Particle Formation"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
          />

          {/* Minimal Skip Intro Button */}
          {showSkip && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 z-10 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase text-white/50 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Skip Intro
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
