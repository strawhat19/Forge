'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  forgeGaussianBlurDismissEvent,
  forgeGaussianBlurRequestEvent,
  type GaussianBlurRequest,
} from './gaussian-blur-overlay-events';

type BlurState = {
  open: boolean;
  strength: number;
};

export default function GaussianBlurOverlay() {
  const sourcesRef = useRef(new Map<string, number>());
  const [blurState, setBlurState] = useState<BlurState>({ open: false, strength: 18 });

  useEffect(() => {
    const syncBlurState = () => {
      const strengths = Array.from(sourcesRef.current.values());
      setBlurState((currentState) => ({
        open: strengths.length > 0,
        strength: strengths.length > 0 ? Math.max(...strengths) : currentState.strength,
      }));
    };

    const handleBlurRequest = (event: Event) => {
      const { open, source, strength = 18 } = (event as CustomEvent<GaussianBlurRequest>).detail;

      if (open) sourcesRef.current.set(source, strength);
      else sourcesRef.current.delete(source);
      syncBlurState();
    };

    window.addEventListener(forgeGaussianBlurRequestEvent, handleBlurRequest);
    return () => window.removeEventListener(forgeGaussianBlurRequestEvent, handleBlurRequest);
  }, []);

  const dismissBlur = () => {
    sourcesRef.current.clear();
    setBlurState((currentState) => ({ ...currentState, open: false }));
    window.dispatchEvent(new Event(forgeGaussianBlurDismissEvent));
  };

  const overlayFilter = `blur(${blurState.strength}px) saturate(120%)`;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={dismissBlur}
      className={`gaussianBlurOverlay${blurState.open ? ' gaussianBlurOverlayOpen' : ''}`}
      style={{
        '--forge-gaussian-blur': `${blurState.strength}px`,
        backdropFilter: overlayFilter,
        WebkitBackdropFilter: overlayFilter,
      } as CSSProperties}
    />
  );
}
