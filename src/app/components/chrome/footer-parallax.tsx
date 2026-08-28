'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

export default function FooterParallax({ children }: { children: ReactNode }) {
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (reducedMotion) {
      footer.style.setProperty(`--footer-parallax-offset`, `0px`);
      footer.style.setProperty(`--footer-parallax-backdrop`, `0px`);
      return;
    }

    let frame: number | null = null;

    const updateParallax = () => {
      frame = null;
      const bounds = footer.getBoundingClientRect();
      const revealDistance = Math.min(window.innerHeight, bounds.height);
      const progress = Math.min(Math.max((window.innerHeight - bounds.top) / revealDistance, 0), 1);
      const offset = (1 - progress) * 72;

      footer.style.setProperty(`--footer-parallax-offset`, `${offset}px`);
      footer.style.setProperty(`--footer-parallax-backdrop`, `${offset * -0.42}px`);
    };

    const scheduleParallax = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener(`scroll`, scheduleParallax, { passive: true });
    window.addEventListener(`resize`, scheduleParallax);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener(`scroll`, scheduleParallax);
      window.removeEventListener(`resize`, scheduleParallax);
    };
  }, []);

  return <footer ref={footerRef} className="siteFooter siteProductFooter siteFooterParallax">{children}</footer>;
}
