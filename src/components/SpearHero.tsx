"use client";

import { useEffect, useRef, useState } from "react";
import { initSpearGL } from "@/lib/spear-gl";

/**
 * The hero mark, forged: a raw-WebGL spearhead with a diamond cross-section
 * that turns slowly on its vertical axis (the mark stays upright per design
 * system §6). Falls back to the original draw-in SVG when WebGL is
 * unavailable, and renders a single static frame under reduced motion.
 */
export default function SpearHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cleanup = initSpearGL(canvas, { reducedMotion });
    if (!cleanup) {
      setFallback(true);
      return;
    }
    return cleanup;
  }, []);

  return (
    <div className="hero-spear" aria-hidden="true">
      {fallback ? (
        <svg viewBox="0 0 70 175" role="img">
          <path
            className="spear-draw"
            d="M35,0 L33,10 L31,25 L29,38 L27,50 L25,60 L22,75 L19,90 L16,102 L14,112 L12,120 L10,127 L9,132 L13,137 L18,143 L24,150 L27,155 L28,148 L29,138 L30,125 L31,110 L32,92 L33,72 L34,48 L35,42 L36,48 L37,72 L38,92 L39,110 L40,125 L41,138 L42,148 L43,155 L46,150 L52,143 L57,137 L61,132 L60,127 L58,120 L56,112 L54,102 L51,90 L48,75 L45,60 L43,50 L41,38 L39,25 L37,10 Z"
          />
          <path
            className="spear-draw spear-draw-base"
            d="M6,163 L8,169 L62,169 L64,163 Z"
          />
          <path
            className="spear-fill"
            d="M35,0 L33,10 L31,25 L29,38 L27,50 L25,60 L22,75 L19,90 L16,102 L14,112 L12,120 L10,127 L9,132 L13,137 L18,143 L24,150 L27,155 L28,148 L29,138 L30,125 L31,110 L32,92 L33,72 L34,48 L35,42 L36,48 L37,72 L38,92 L39,110 L40,125 L41,138 L42,148 L43,155 L46,150 L52,143 L57,137 L61,132 L60,127 L58,120 L56,112 L54,102 L51,90 L48,75 L45,60 L43,50 L41,38 L39,25 L37,10 Z"
          />
          <path className="spear-fill" d="M6,163 L8,169 L62,169 L64,163 Z" />
        </svg>
      ) : (
        <canvas ref={canvasRef} className="spear-canvas" />
      )}
    </div>
  );
}
