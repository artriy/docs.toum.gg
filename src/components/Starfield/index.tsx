import {useEffect, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const LAYERS = [
  {count: 140, speed: 5, radius: 0.6, alpha: 0.4, parallax: 5, streak: 0},
  {count: 70, speed: 15, radius: 1, alpha: 0.65, parallax: 12, streak: 0},
  {count: 22, speed: 42, radius: 1.5, alpha: 0.95, parallax: 26, streak: 0.5},
];

const POINTER_DAMPING = 4;

export default function Starfield({className}: {className?: string}): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    const stars = LAYERS.flatMap((layer, depth) =>
      Array.from({length: layer.count}, () => ({
        x: Math.random(),
        y: Math.random(),
        depth,
        phase: Math.random() * Math.PI * 2,
      })),
    );
    const pointer = {x: 0, y: 0, targetX: 0, targetY: 0};
    let width = 0;
    let height = 0;
    let ratio = 1;
    let onScreen = true;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
      last = now;
      const ease = 1 - Math.exp(-POINTER_DAMPING * dt);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#eaf2ff';

      for (const star of stars) {
        const layer = LAYERS[star.depth];
        star.x -= (layer.speed * dt) / Math.max(width, 1);
        if (star.x < -0.03) {
          star.x += 1.06;
          star.y = Math.random();
        }
        const x = star.x * width - pointer.x * layer.parallax;
        const y = star.y * height - pointer.y * layer.parallax;
        context.globalAlpha = layer.alpha * (0.72 + 0.28 * Math.sin(now / 1100 + star.phase));
        if (layer.streak) {
          const tail = context.createLinearGradient(x, y, x + layer.speed * layer.streak, y);
          tail.addColorStop(0, 'rgb(234 242 255 / 0.55)');
          tail.addColorStop(1, 'rgb(234 242 255 / 0)');
          context.strokeStyle = tail;
          context.lineWidth = layer.radius * 1.2;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + layer.speed * layer.streak, y);
          context.stroke();
        }
        context.beginPath();
        context.arc(x, y, layer.radius, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (onScreen && document.visibilityState === 'visible') {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth - 0.5;
      pointer.targetY = event.clientY / window.innerHeight - 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });

    resize();
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, {passive: true});
    document.addEventListener('visibilitychange', start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', start);
    };
  }, []);

  return <canvas ref={canvasRef} className={clsx(styles.canvas, className)} aria-hidden="true" />;
}
