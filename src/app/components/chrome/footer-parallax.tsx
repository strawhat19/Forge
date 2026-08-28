'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import RevealReplayContext from '@/app/components/effects/reveal-replay-context';

export default function FooterParallax({ children }: { children: ReactNode }) {
  const [replayKey, setReplayKey] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    const sentinel = sentinelRef.current;
    if (!footer || !sentinel) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (reducedMotion) {
      footer.style.setProperty(`--footer-parallax-offset`, `0px`);
      footer.style.setProperty(`--footer-parallax-backdrop`, `0px`);
      footer.style.setProperty(`--footer-parallax-scale`, `1`);
      footer.style.setProperty(`--footer-parallax-grid-scale`, `1`);
      footer.style.setProperty(`--footer-parallax-lead-x`, `0px`);
      footer.style.setProperty(`--footer-parallax-signal-x`, `0px`);
      footer.style.setProperty(`--footer-parallax-utility-x`, `0px`);
      footer.style.setProperty(`--footer-parallax-utility-y`, `0px`);
      footer.style.setProperty(`--footer-parallax-orbit-rotation`, `0deg`);
      return;
    }

    let frame: number | null = null;
    let sentinelInView = false;
    let orbitRotation = 0;
    let previousScrollY = window.scrollY;

    const updateParallax = () => {
      frame = null;
      const sentinelBounds = sentinel.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY;
      const viewportHeight = window.innerHeight;

      previousScrollY = currentScrollY;
      if (sentinelBounds.top > viewportHeight * 1.5) return;

      const revealDistance = Math.max(Math.min(viewportHeight, footer.offsetHeight), 1);
      const progress = Math.min(Math.max((viewportHeight - sentinelBounds.top) / revealDistance, 0), 1);
      const offset = (1 - progress) * 112;

      if (Math.abs(scrollDelta) > 0.1) orbitRotation += scrollDelta * 0.085;

      footer.style.setProperty(`--footer-parallax-offset`, `${offset}px`);
      footer.style.setProperty(`--footer-parallax-backdrop`, `${offset * -0.55}px`);
      footer.style.setProperty(`--footer-parallax-scale`, `${0.94 + progress * 0.06}`);
      footer.style.setProperty(`--footer-parallax-grid-scale`, `${1 + progress * 0.075}`);
      footer.style.setProperty(`--footer-parallax-lead-x`, `${(1 - progress) * -28}px`);
      footer.style.setProperty(`--footer-parallax-signal-x`, `${(1 - progress) * 20}px`);
      footer.style.setProperty(`--footer-parallax-utility-x`, `${(1 - progress) * 24}px`);
      footer.style.setProperty(`--footer-parallax-utility-y`, `${offset * 0.16}px`);
      footer.style.setProperty(`--footer-parallax-orbit-rotation`, `${orbitRotation}deg`);
    };

    const scheduleParallax = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    const entryObserver = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry?.isIntersecting ?? false;
        if (isInView && !sentinelInView) setReplayKey(key => key + 1);
        sentinelInView = isInView;
      },
      { threshold: 0, rootMargin: `0px 0px -8%` },
    );

    entryObserver.observe(sentinel);
    updateParallax();
    window.addEventListener(`scroll`, scheduleParallax, { passive: true });
    window.addEventListener(`resize`, scheduleParallax);

    return () => {
      entryObserver.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener(`scroll`, scheduleParallax);
      window.removeEventListener(`resize`, scheduleParallax);
    };
  }, []);

  return (
    <>
      <span ref={sentinelRef} className="footerParallaxSentinel" aria-hidden="true" />
      <footer ref={footerRef} className="siteFooter siteProductFooter siteFooterParallax">
        <RevealReplayContext.Provider value={replayKey}>{children}</RevealReplayContext.Provider>
      </footer>
    </>
  );
}
