"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = 'a, button, input, [role="button"], [data-cursor="hover"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;
    setEnabled(true);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let target: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const el = (e.target as HTMLElement)?.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (el !== target) {
        target = el;
        setHovering(!!el);
      }

      if (dotRef.current) {
        let dx = mouseX;
        let dy = mouseY;
        if (target) {
          const r = target.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          dx = cx + (mouseX - cx) * 0.35;
          dy = cy + (mouseY - cy) * 0.35;
        }
        dotRef.current.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      }
    };

    let frameId: number;
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      }
      frameId = requestAnimationFrame(animateRing);
    };
    frameId = requestAnimationFrame(animateRing);

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-primary transition-transform duration-100 ease-out will-change-transform"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-primary/40 transition-[width,height,opacity,background-color] duration-200 ease-out will-change-transform"
        style={
          hovering
            ? { width: 56, height: 56, backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.5)" }
            : undefined
        }
      />
    </>
  );
}
