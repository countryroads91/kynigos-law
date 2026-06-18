"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  words: string[];
  intervalMs?: number;
  spinDurationMs?: number;
};

export default function HeadlineReel({
  words,
  intervalMs = 3200,
  spinDurationMs = 2200,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const indexRef = useRef(0);
  const spinningRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const tripled = [...words, ...words, ...words];

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(spin, intervalMs);
    return () => {
      window.clearInterval(id);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, intervalMs, spinDurationMs]);

  function getItemHeight(): number {
    const first = itemsRef.current[0];
    return first ? first.offsetHeight : 0;
  }

  function spin() {
    if (spinningRef.current || !trackRef.current) return;
    spinningRef.current = true;
    setIsSpinning(true);

    const itemHeight = getItemHeight();
    if (itemHeight === 0) {
      spinningRef.current = false;
      setIsSpinning(false);
      return;
    }
    const total = words.length;
    const current = indexRef.current;
    const next = (current + 1) % total;
    const startOffset = current * itemHeight;
    const targetOffset = (2 * total + next) * itemHeight;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const offset = startOffset + (targetOffset - startOffset) * ease;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(-${
          offset % (total * itemHeight)
        }px)`;
      }
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(-${
            next * itemHeight
          }px)`;
        }
        indexRef.current = next;
        spinningRef.current = false;
        setIsSpinning(false);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
  }

  return (
    <div className="reel-container">
      <div
        className={isSpinning ? "reel-window is-spinning" : "reel-window"}
        aria-live="polite"
      >
        <div
          className="reel-track"
          ref={trackRef}
          style={{ transform: "translateY(0)" }}
        >
          {tripled.map((word, i) => (
            <div
              key={i}
              className="reel-item"
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
            >
              <span>{word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
