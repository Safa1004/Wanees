import { useEffect, useRef } from "react";
/** Decorative marine canvas; the bubbles remain semantic keyboard-operable buttons. */
export function SeaCanvas({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (time = 0) => {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      if (
        canvas.width !== Math.round(w * ratio) ||
        canvas.height !== Math.round(h * ratio)
      ) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const water = ctx.createLinearGradient(0, 0, 0, h);
      water.addColorStop(0, "#c9e4df");
      water.addColorStop(1, "#74aaa7");
      ctx.fillStyle = water;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#d9c9a4";
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(w * 0.3, h - 85, w * 0.6, h - 12, w, h - 46);
      ctx.lineTo(w, h);
      ctx.fill();
      ctx.strokeStyle = "#4b8172";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      for (let i = 0; i < 8; i++) {
        const x = 18 + i * 18;
        ctx.beginPath();
        ctx.moveTo(x, h - 16);
        ctx.bezierCurveTo(
          x - 18,
          h - 70,
          x + 20,
          h - 85,
          x + Math.sin(time * 0.0005 + i) * 9,
          h - 115 - (i % 3) * 16,
        );
        ctx.stroke();
      }
      ctx.fillStyle = "#c39665";
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.ellipse(
          w * (0.5 + i * 0.075),
          h - 18 - (i % 2) * 9,
          12,
          5,
          0.3,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      if (!paused && !reduced && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      draw();
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(canvas);
    document.addEventListener("visibilitychange", refresh);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [paused]);
  return <canvas className="sea-canvas" ref={ref} aria-hidden="true" />;
}
