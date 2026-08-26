'use client';

import { type MouseEvent, useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 240;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateVisibility = () => {
      animationFrame = 0;
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener(`scroll`, handleScroll, { passive: true });

    return () => {
      window.removeEventListener(`scroll`, handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    const behavior = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth`;

    event.currentTarget.blur();
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
      className={`scrollToTop ${isVisible ? `visible` : ``}`.trim()}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m6.5 14.5 5.5-5.5 5.5 5.5" />
      </svg>
    </button>
  );
}
