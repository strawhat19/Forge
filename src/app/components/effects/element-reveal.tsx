'use client';

import gsap from 'gsap';
import RevealReplayContext from '@/app/components/effects/reveal-replay-context';
import { createElement, useContext, useLayoutEffect, useRef, type AriaRole, type ElementType, type ReactNode } from 'react';
import {
  forgeLoaderDoneEvent,
  forgeLoaderStartEvent,
  isForgeLoaderDone,
  isForgeLoaderReady,
} from '@/app/components/loaders/forge-loader/forge-loader-events';

type ElementRevealProps = {
  x?: number;
  y?: number;
  as?: ElementType;
  role?: AriaRole;
  blur?: boolean;
  delay?: number;
  scale?: number;
  slide?: boolean;
  href?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  duration?: number;
};

const pendingClass = `elementRevealPending`;

export default function ElementReveal({
  x = 0,
  y = 18,
  children,
  delay = 0,
  as = `div`,
  role,
  blur = false,
  scale = 0.985,
  slide = false,
  href,
  ariaHidden,
  ariaLabel,
  className = ``,
  duration = 0.62,
}: ElementRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const revealReplayKey = useContext(RevealReplayContext);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.classList.add(pendingClass);

    const showElement = () => element.classList.remove(pendingClass);

    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      showElement();
      return;
    }

    let inView = false;
    let revealTween: gsap.core.Tween | null = null;
    const loaderIsFinished = () => isForgeLoaderReady() && isForgeLoaderDone();
    const hiddenState: gsap.TweenVars = {
      x,
      y,
      scale,
      autoAlpha: slide ? 1 : 0,
      filter: blur ? `blur(3px)` : `none`,
      clipPath: slide ? `inset(100% 0 0 0)` : `inset(0 0 0 0)`,
      transformOrigin: `50% 100%`,
    };

    const resetReveal = () => {
      revealTween?.kill();
      gsap.set(element, hiddenState);
    };

    const playReveal = () => {
      if (!inView || !loaderIsFinished()) return;
      revealTween?.kill();
      gsap.set(element, hiddenState);
      showElement();
      revealTween = gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        delay,
        duration,
        autoAlpha: 1,
        filter: `none`,
        clipPath: `inset(0 0 0 0)`,
        ease: `power3.out`,
        overwrite: true,
        onComplete: () => gsap.set(element, { clearProps: `opacity,visibility,filter,transform,clipPath` }),
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) playReveal();
        else resetReveal();
      },
      { threshold: 0.12, rootMargin: `0px 0px -6%` },
    );

    const handleLoaderStart = () => resetReveal();
    const handleLoaderDone = () => playReveal();

    observer.observe(element);
    window.addEventListener(forgeLoaderStartEvent, handleLoaderStart);
    window.addEventListener(forgeLoaderDoneEvent, handleLoaderDone);

    return () => {
      observer.disconnect();
      window.removeEventListener(forgeLoaderStartEvent, handleLoaderStart);
      window.removeEventListener(forgeLoaderDoneEvent, handleLoaderDone);
      revealTween?.kill();
    };
  }, [x, y, blur, delay, scale, slide, duration, revealReplayKey]);

  return createElement(as, {
    ref: elementRef,
    href,
    role,
    'aria-hidden': ariaHidden,
    'aria-label': ariaLabel,
    className: `elementReveal ${pendingClass} ${className}`.trim(),
  }, children);
}
