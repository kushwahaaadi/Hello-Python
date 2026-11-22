import React, { useEffect, useRef } from 'react';

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

interface MosaicPortraitCanvasProps {
  scrollProgress: number;
  ready?: boolean;
}

const MOSAIC_PALETTE_RGB: [number, number, number][] = [
  [248, 250, 252], // #F8FAFC
  [226, 232, 240], // #E2E8F0
  [167, 243, 208], // #A7F3D0
  [110, 231, 183], // #6EE7B7
  [103, 232, 249], // #67E8F9
  [147, 197, 253], // #93C5FD
  [165, 180, 252], // #A5B4FC
  [196, 181, 253], // #C4B5FD
  [253, 230, 138], // #FDE68A
  [216, 180, 254], // #D8B4FE
];

function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function samplePortraitSurface(
  px: number,
  py: number
): { inside: boolean; nx: number; ny: number; nz: number; edgeSoftness: number } {
  const jawNarrow = py > -0.18 ? 1 + (py + 0.18) * 0.52 : 1;
  const jx = (px * jawNarrow) / 0.245;
  const jy = (py + 0.24) / 0.345;
  const headField = jx * jx + jy * jy;

  const neckW = 0.118 + Math.max(0, py - 0.08) * 0.14;
  const inNeckY = py >= 0.02 && py <= 0.34;
  const neckField = inNeckY ? (px / neckW) ** 2 : 99;

  const sx = px / 0.56;
  const sy = (py - 0.64) / 0.42;
  const shoulderField = py > 0.22 ? sx * sx + sy * sy : 99;

  const minField = Math.min(headField, Math.min(neckField, shoulderField));

  if (minField > 1.18) {
    return { inside: false, nx: 0, ny: 0, nz: 0, edgeSoftness: 0 };
  }

  let nx = 0;
  let ny = 0;
  if (headField <= neckField && headField <= shoulderField) {
    nx = jx * 0.92;
    ny = jy * 0.72;
    const noseDist = Math.abs(px - 0.015) / 0.045;
    if (py > -0.27 && py < -0.06 && noseDist < 1) {
      nx += (px > 0.015 ? 0.22 : -0.22) * (1 - noseDist);
    }
    if (px > 0.04 && py > -0.22 && py < -0.08) {
      nx += 0.12;
    }
  } else if (neckField <= shoulderField) {
    nx = (px / neckW) * 0.95;
    ny = 0.1;
  } else {
    nx = sx * 0.85;
    ny = sy * 0.8;
  }

  const nz = Math.sqrt(Math.max(0.05, 1 - Math.min(0.95, nx * nx + ny * ny)));
  const edgeSoftness = Math.max(0, Math.min(1, (1.18 - minField) / 0.26));

  return { inside: true, nx, ny, nz, edgeSoftness };
}

export const MosaicPortraitCanvas: React.FC<MosaicPortraitCanvasProps> = ({
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

      const portraitHeight = Math.min(height * 0.98, 920);
      const step = Math.max(6, Math.round(portraitHeight / 92));
      const cols = Math.floor((portraitHeight * 1.25) / step);
      const rows = Math.floor(portraitHeight / step);

      // Build opaque silhouette mask so the pixel portrait cleanly occludes the background signature
      maskW = Math.ceil((cols + 4) * step);
      maskH = Math.ceil((rows + 4) * step);
      maskCanvas = document.createElement('canvas');
      maskCanvas.width = maskW;
      maskCanvas.height = maskH;
      const mctx = maskCanvas.getContext('2d');

      const lx = 0.78;
      const ly = -0.18;
      const lz = 0.6;

      for (let r = -rows / 2; r <= rows / 2; r++) {
        for (let c = -cols / 2; c <= cols / 2; c++) {
          const px = (c / (cols / 2)) * 0.62;
          const py = (r / (rows / 2)) * 0.68;

          const sample = samplePortraitSurface(px, py);
          if (!sample.inside) continue;

          // Fill solid dark pixel cell into silhouette mask inside the core body/head contour
          if (mctx && sample.edgeSoftness > 0.28) {
            mctx.fillStyle = '#030304';
            mctx.fillRect(
              maskW * 0.5 + c * step - step * 0.58,
              maskH * 0.5 + r * step - step * 0.58,
              step * 1.16,
              step * 1.16
            );
          }

          const rand = hash2d(c, r);
          const rand2 = hash2d(c + 41, r - 17);
          const rand3 = hash2d(c - 19, r + 53);

          const dot = sample.nx * lx + sample.ny * ly + sample.nz * lz;
          const lit = Math.max(0, dot);
          const isShadowContour =
            dot <= 0.14 && sample.edgeSoftness > 0.18 && sample.edgeSoftness < 0.78;

          if (lit < 0.08 && !isShadowContour && rand < 0.94) continue;
          if (lit >= 0.08 && rand > 0.42 + lit * 0.68 * sample.edgeSoftness) continue;
          if (isShadowContour && rand > 0.45) continue;

          const colorIdx = Math.floor(rand2 * MOSAIC_PALETTE_RGB.length);
          const rgb: [number, number, number] =
            lit > 0.22 ? MOSAIC_PALETTE_RGB[colorIdx] : [228, 228, 231];
          const isDust = lit < 0.18 || sample.edgeSoftness < 0.35;

          const baseSize = isDust
            ? Math.max(1.4, step * (0.22 + rand * 0.22))
            : Math.max(2.5, step * (0.56 + lit * 0.28));

          const alpha = isDust
            ? 0.28 + rand * 0.45
            : Math.min(0.98, 0.36 + lit * 0.72) * sample.edgeSoftness;

          tiles.push({
            nx: c * step,
            ny: r * step,
            baseSize,
            lum: lit,
            depth: 0.4 + sample.nz * 0.8 + rand * 0.35,
            rgb,
            alpha,
            phase: rand * Math.PI * 2,
            isDust,
            scatterX: (rand2 - 0.5) * 420,
            scatterY: (rand3 - 0.5) * 320,
            scatterZ: 0.3 + rand * 1.4,
          });
        }
      }

      const starCount = width < 768 ? 190 : 380;
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

      const offsetX = (pointerRef.current.smoothX - 0.5) * 32;
      const offsetY = (pointerRef.current.smoothY - 0.5) * 22;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.58;

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

      // 2. Opaque silhouette occluder mask so background signature stays cleanly behind portrait
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

      ripplesRef.current = ripplesRef.current.filter((rp) => now - rp.startTime < 1400);

      const pointerScreenX = pointerRef.current.smoothX * width;
      const pointerScreenY = pointerRef.current.smoothY * height;

      // 3. Render opaque pre-blended mosaic portrait tiles above the background layer
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
          offsetX * tile.depth * 0.5;
        let y =
          centerY +
          tile.ny * flyScale * introScale +
          tile.scatterY * scatterFactor +
          offsetY * tile.depth * 0.5;

        let boost = 0;
        if (!prefersReducedMotion && pointerRef.current.active) {
          const dx = x - pointerScreenX;
          const dy = y - pointerScreenY;
          const dist2 = dx * dx + dy * dy;
          const radius = 145;
          if (dist2 < radius * radius) {
            const dist = Math.sqrt(dist2);
            const force = 1 - dist / radius;
            boost = force * 0.5;
            x += (dx / (dist + 1)) * force * 10;
            y += (dy / (dist + 1)) * force * 10;
          }
        }

        for (let r = 0; r < ripplesRef.current.length; r++) {
          const rp = ripplesRef.current[r];
          const age = (now - rp.startTime) / 1000;
          const waveR = age * 480;
          const dist = Math.hypot(x - rp.x, y - rp.y);
          const band = Math.abs(dist - waveR);
          if (band < 52) {
            const w = (1 - band / 52) * Math.max(0, 1 - age / 1.4);
            boost += w * 0.7;
          }
        }

        const shimmer = prefersReducedMotion
          ? 1
          : 0.84 + 0.16 * Math.sin(t * 2.1 + tile.phase);

        const size = tile.baseSize * (1 + fly * 0.55 + boost * 0.4) * (0.65 + introEase * 0.35);
        const shade = Math.min(1, tile.alpha * shimmer + boost * 0.5);
        const canvasAlpha = flyAlpha * introEase;
        if (canvasAlpha <= 0.01) continue;

        // Pre-blend against #030304 so each solid mosaic pixel tile completely occludes behind it
        const rCol = boost > 0.28 ? 255 : Math.round(3 + (tile.rgb[0] - 3) * shade);
        const gCol = boost > 0.28 ? 255 : Math.round(3 + (tile.rgb[1] - 3) * shade);
        const bCol = boost > 0.28 ? 255 : Math.round(4 + (tile.rgb[2] - 4) * shade);

        ctx.globalAlpha = tile.isDust ? shade * canvasAlpha : canvasAlpha;
        ctx.fillStyle = `rgb(${rCol},${gCol},${bCol})`;
        ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
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
