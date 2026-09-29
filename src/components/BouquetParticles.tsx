import React, { useEffect, useRef } from 'react';
import { AmbientParticleType } from '../types/bouquet';

interface BouquetParticlesProps {
  type: AmbientParticleType | 'both';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  kind: 'petal' | 'sakura' | 'sparkle' | 'heart' | 'glow';
  color: string;
}

export const BouquetParticles: React.FC<BouquetParticlesProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const petalColors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#ffe4e6'];
    const sakuraColors = ['#fbcfe8', '#f472b6', '#fdf2f8', '#fda4af', '#ffffff'];
    const sparkleColors = ['#fef08a', '#fde047', '#ffffff', '#e0f2fe'];
    const heartColors = ['#fb7185', '#f43f5e', '#ec4899', '#db2777', '#fda4af'];
    const glowColors = ['#fef08a', '#fed7aa', '#86efac', '#67e8f9'];

    const particleCount = type === 'both' ? 36 : 24;
    const particles: Particle[] = [];

    const getKind = (): 'petal' | 'sakura' | 'sparkle' | 'heart' | 'glow' => {
      if (type === 'sakura') return 'sakura';
      if (type === 'sparkles') return 'sparkle';
      if (type === 'hearts') return 'heart';
      if (type === 'glow') return 'glow';
      if (type === 'both') return Math.random() > 0.4 ? 'petal' : 'sparkle';
      return 'petal';
    };

    for (let i = 0; i < particleCount; i++) {
      const kind = getKind();
      const color =
        kind === 'sakura'
          ? sakuraColors[Math.floor(Math.random() * sakuraColors.length)]
          : kind === 'sparkle'
          ? sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
          : kind === 'heart'
          ? heartColors[Math.floor(Math.random() * heartColors.length)]
          : kind === 'glow'
          ? glowColors[Math.floor(Math.random() * glowColors.length)]
          : petalColors[Math.floor(Math.random() * petalColors.length)];

      const isFalling = kind === 'petal' || kind === 'sakura';
      const isFloatingUp = kind === 'sparkle' || kind === 'heart';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          kind === 'petal' || kind === 'sakura'
            ? 7 + Math.random() * 8
            : kind === 'heart'
            ? 6 + Math.random() * 6
            : kind === 'glow'
            ? 3 + Math.random() * 4
            : 2.5 + Math.random() * 3.5,
        speedY: isFalling
          ? 0.5 + Math.random() * 1.1
          : isFloatingUp
          ? -0.3 - Math.random() * 0.7
          : (Math.random() - 0.5) * 0.6,
        speedX: Math.sin(Math.random() * Math.PI) * 0.8 - 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2.5,
        opacity: 0.35 + Math.random() * 0.55,
        kind,
        color,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.size) * 0.4;
        p.rotation += p.rotSpeed;

        // Wrap around boundaries
        if (p.speedY > 0 && p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.speedY < 0 && p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.kind === 'petal' || p.kind === 'sakura') {
          // Curved petal
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.8, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
          ctx.fill();
        } else if (p.kind === 'heart') {
          // Heart shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const s = p.size * 0.7;
          ctx.moveTo(0, -s * 0.4);
          ctx.bezierCurveTo(-s, -s * 1.3, -s * 1.8, 0, 0, s * 1.5);
          ctx.bezierCurveTo(s * 1.8, 0, s, -s * 1.3, 0, -s * 0.4);
          ctx.fill();
        } else if (p.kind === 'glow') {
          // Firefly glow
          const rad = p.size;
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 2);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 4-point sparkle star
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const s = p.size * 1.5;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[15] w-full h-full"
    />
  );
};
