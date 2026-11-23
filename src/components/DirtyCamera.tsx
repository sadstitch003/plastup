"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

/** QR di dalam frame kamera demo (sedikit miring, noise, vignette). */
export function DirtyCamera({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#3a332b";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 80; i += 1) {
      ctx.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 40 + Math.random() * 120, 8);
    }

    void QRCode.toDataURL(value, { width: 300, margin: 1, color: { dark: "#222", light: "#f4f0e6" } }).then((src) => {
      const image = new Image();
      image.onload = () => {
        ctx.save();
        ctx.translate(width / 2 + 18, height / 2 + 10);
        ctx.rotate(-0.12);
        ctx.fillStyle = "#e7e0d2";
        ctx.fillRect(-168, -188, 330, 360);
        ctx.drawImage(image, -132, -132, 264, 264);
        ctx.restore();

        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const i = (y * width + x) * 4;
            const dx = (x - width / 2) / width;
            const dy = (y - height / 2) / height;
            const vignette = Math.min(0.55, (dx * dx + dy * dy) * 1.4);
            const grain = (Math.random() - 0.5) * 36;
            data[i] = data[i] * (1 - vignette) + grain;
            data[i + 1] = data[i + 1] * (1 - vignette) + grain * 0.9;
            data[i + 2] = data[i + 2] * (1 - vignette * 1.1) + grain * 0.7;
          }
        }
        ctx.putImageData(frame, 0, 0);
      };
      image.src = src;
    });
  }, [value]);

  return (
    <canvas
      ref={ref}
      aria-label="Hasil kamera"
      className="dirty-camera-canvas"
    />
  );
}