import React, { useEffect, useRef } from 'react';
import { PYTHON_LOGO_RAW_TILES, RawPythonTile } from '../data/pythonLogoTiles';

interface MosaicTile {
  nx: number;
  ny: number;
  baseSize: number;
  lum: number;
  depth: number;
  rgb: [number, number, number];
  alpha: number;
  phase: number;
  isDust: boolean;
  scatterX: number;
  scatterY: number;
  scatterZ: number;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

interface PythonMosaicCanvasProps {
  scrollProgress: number;
  ready?: boolean;
}

function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export const PythonMosaicCanvas: React.FC<PythonMosaicCanvasProps> = ({
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

    let tiles: MosaicTile[] = [];
    let stars: StarParticle[] = [];
    let maskCanvas: HTMLCanvasElement | null = null;
    let maskW = 0;
    let maskH = 0;
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

      tiles = [];
      stars = [];

      // Scale Python logo based on viewport width and height
      const logoWidth = Math.min(width * 0.88, Math.min(height * 0.95, 680));
      const step = Math.max(3.8, Math.round(logoWidth / 70));
      const radius = logoWidth * 0.5;

      // Build opaque silhouette mask so Python logo cleanly occludes background signature
      maskW = Math.ceil(logoWidth * 1.08);
      maskH = Math.ceil(logoWidth * 0.76);
      maskCanvas = document.createElement('canvas');
      maskCanvas.width = maskW;
      maskCanvas.height = maskH;
      const mctx = maskCanvas.getContext('2d');

      const rawTiles = PYTHON_LOGO_RAW_TILES;
      for (let i = 0; i < rawTiles.length; i++) {
        const raw = rawTiles[i];
        const px = raw.nx * radius;
        const py = raw.ny * radius;

        // Solid mask cell for opaque body occluder
        if (mctx && raw.a > 0.45 && !raw.isDust) {
          mctx.fillStyle = '#030304';
          mctx.fillRect(
            maskW * 0.5 + px - step * 0.6,
            maskH * 0.5 + py - step * 0.6,
            step * 1.2,
            step * 1.2
          );
        }

        const rand1 = hash2d(raw.nx * 100, raw.ny * 100);
        const rand2 = hash2d(raw.nx * 53 + 7, raw.ny * 41 - 13);
        const rand3 = hash2d(raw.nx * 29 - 3, raw.ny * 67 + 19);

        const baseSize = raw.isDust
          ? Math.max(1.8, step * (0.35 + rand1 * 0.35))
          : Math.max(3.0, step * (0.75 + raw.lum * 0.28));

        tiles.push({
          nx: px,
          ny: py,
          baseSize,
          lum: raw.lum,
          depth: raw.depth,
          rgb: raw.rgb,
          alpha: raw.a,
          phase: rand1 * Math.PI * 2,
          isDust: raw.isDust,
          scatterX: (rand2 - 0.5) * 440,
          scatterY: (rand3 - 0.5) * 360,
          scatterZ: 0.3 + rand1 * 1.5,
        });
      }

      // Starfield
      const starCount = width < 768 ? 180 : 360;
      for (let i = 0; i < starCount; i++) {
        const rx = hash2d(i * 3.1, 7.2);
        const ry = hash2d(11.4, i * 2.7);
        const rs = hash2d(i, i * 1.3);
        stars.push({
          x: rx * width,
          y: ry * height,
          size: rs < 0.85 ? 1.1 : 2.0,
          alpha: 0.15 + rs * 0.55,
          speed: 0.15 + rs * 0.4,
          phase: rs * Math.PI * 2,
        });
      }
    };

    const drawFrame = (now: number) => {
      const t = now * 0.001;
      const elapsed =
        readyRef.current && readyTimeRef.current !== null
          ? Math.max(0, (now - readyTimeRef.current) * 0.001)
          : 0;
      const introProgress = prefersReducedMotion ? 1 : Math.min(1, elapsed / 1.45);
      const introEase = easeOutQuart(introProgress);
      const scatterFactor = 1 - introEase;

      const prevSmooth = smoothScrollRef.current;
      smoothScrollRef.current += (scrollRef.current - smoothScrollRef.current) * 0.12;
      const fly = Math.min(1, Math.max(0, smoothScrollRef.current));
      const scrollVelocity = Math.min(0.12, Math.abs(smoothScrollRef.current - prevSmooth) * 4);

      pointerRef.current.smoothX += (pointerRef.current.x - pointerRef.current.smoothX) * 0.08;
      pointerRef.current.smoothY += (pointerRef.current.y - pointerRef.current.smoothY) * 0.08;

      const offsetX = (pointerRef.current.smoothX - 0.5) * 38;
      const offsetY = (pointerRef.current.smoothY - 0.5) * 26;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.48; // Centered above Hello Python

      // 1. Ambient starfield
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

      // 2. Opaque silhouette occluder mask so background signature stays cleanly behind Python logo
      if (maskCanvas && fly < 0.72 && introEase > 0.55) {
        const maskScale = 1 + fly * 1.85;
        const maskAlpha = Math.max(0, 1 - fly * 1.45) * Math.min(1, (introEase - 0.55) / 0.45);
        const dw = maskW * maskScale;
        const dh = maskH * maskScale;
        const dx = centerX + offsetX * 0.55 - dw * 0.5;
        const dy = centerY + offsetY * 0.55 - dh * 0.5;
        ctx.globalAlpha = maskAlpha;
        ctx.drawImage(maskCanvas, dx, dy, dw, dh);
      }

      // 3. Interactive shockwave ripples
      ripplesRef.current = ripplesRef.current.filter((rp) => now - rp.startTime < 1400);

      const pointerScreenX = pointerRef.current.smoothX * width;
      const pointerScreenY = pointerRef.current.smoothY * height;

      // 4. Render animated pixel mosaic tiles of the Python Logo
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        const flyScale = 1 + fly * (1.35 + tile.depth * 2.4);
        const flyAlpha = Math.max(0, 1 - fly * 1.15);
        if (flyAlpha <= 0.01) continue;

        const introScale = 1 + scatterFactor * tile.scatterZ * 0.9;
        let x =
          centerX +
          tile.nx * flyScale * introScale +
          tile.scatterX * scatterFactor +
          offsetX * tile.depth * 0.55;
        let y =
          centerY +
          tile.ny * flyScale * introScale +
          tile.scatterY * scatterFactor +
          offsetY * tile.depth * 0.55;

        // Interactive mouse cursor repulsion
        let boost = 0;
        if (!prefersReducedMotion && pointerRef.current.active) {
          const dx = x - pointerScreenX;
          const dy = y - pointerScreenY;
          const dist2 = dx * dx + dy * dy;
          const radius = 135;
          if (dist2 < radius * radius) {
            const dist = Math.sqrt(dist2);
            const force = 1 - dist / radius;
            boost = force * 0.55;
            x += (dx / (dist + 1)) * force * 12;
            y += (dy / (dist + 1)) * force * 12;
          }
        }

        // Interactive shockwave waves from click
        for (let r = 0; r < ripplesRef.current.length; r++) {
          const rp = ripplesRef.current[r];
          const age = (now - rp.startTime) / 1000;
          const waveR = age * 480;
          const dist = Math.hypot(x - rp.x, y - rp.y);
          const band = Math.abs(dist - waveR);
          if (band < 52) {
            const w = (1 - band / 52) * Math.max(0, 1 - age / 1.4);
            boost += w * 0.75;
          }
        }

        const shimmer = prefersReducedMotion
          ? 1
          : 0.82 + 0.18 * Math.sin(t * 2.2 + tile.phase);

        // Tile size with crisp pixel block gaps (0.90 size ratio)
        const size = tile.baseSize * (1 + fly * 0.55 + boost * 0.45) * (0.65 + introEase * 0.35);
        const shade = Math.min(1, tile.alpha * shimmer + boost * 0.5);
        const canvasAlpha = flyAlpha * introEase;
        if (canvasAlpha <= 0.01) continue;

        // Color highlighting with metallic and cyber sparkle
        const rCol = boost > 0.28 ? 255 : Math.round(3 + (tile.rgb[0] - 3) * shade);
        const gCol = boost > 0.28 ? 255 : Math.round(3 + (tile.rgb[1] - 3) * shade);
        const bCol = boost > 0.28 ? 255 : Math.round(4 + (tile.rgb[2] - 4) * shade);

        ctx.globalAlpha = tile.isDust ? shade * canvasAlpha : canvasAlpha;
        ctx.fillStyle = `rgb(${rCol},${gCol},${bCol})`;

        // Crisp square pixel tile
        ctx.fillRect(x - size * 0.5, y - size * 0.5, size * 0.90, size * 0.90);
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
      className="pointer-events-auto absolute inset-0 z-[10] h-full w-full cursor-crosshair"
      aria-hidden="true"
    />
  );
};
