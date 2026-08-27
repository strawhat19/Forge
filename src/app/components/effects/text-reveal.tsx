'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createElement, useLayoutEffect, useRef, type ElementType } from 'react';
import {
  forgeLoaderDoneEvent,
  forgeLoaderStartEvent,
  isForgeLoaderDone,
  isForgeLoaderReady,
} from '@/app/components/loaders/forge-loader/forge-loader-events';

type TextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  html?: boolean;
  byLetter?: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
};

const pendingClass = 'textRevealPending';

export default function TextReveal({
  text,
  as = 'span',
  className,
  html = false,
  byLetter = false,
  delay = 0,
  duration,
  stagger,
}: TextRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const showElement = () => element.classList.remove(pendingClass);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showElement();
      return;
    }

    gsap.registerPlugin(SplitText);

    let cancelled = false;
    let building = false;
    let inView = false;
    let split: SplitText | null = null;
    let revealTween: gsap.core.Tween | null = null;

    const loaderIsFinished = () => isForgeLoaderReady() && isForgeLoaderDone();

    const resetReveal = () => {
      revealTween?.pause(0);
    };

    const buildReveal = async () => {
      if (building || split || cancelled) return;
      building = true;

      if ('fonts' in document) await document.fonts.ready;
      if (cancelled || !elementRef.current) return;

      split = SplitText.create(element, {
        type: byLetter ? 'chars' : 'words',
        mask: byLetter ? 'chars' : 'words',
        wordsClass: 'textRevealWord',
        charsClass: 'textRevealChar',
        tag: 'span',
        aria: 'auto',
      });

      const targets = byLetter ? split.chars : split.words;
      if (!targets.length) {
        showElement();
        return;
      }

      revealTween = gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          rotateX: byLetter ? -58 : -42,
          transformOrigin: '50% 100%',
          yPercent: byLetter ? 120 : 108,
        },
        {
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0,
          duration: duration ?? (byLetter ? 0.72 : 0.82),
          delay,
          ease: 'power4.out',
          stagger: stagger ?? (byLetter ? 0.022 : 0.065),
          paused: true,
        },
      );

      showElement();
      if (inView && loaderIsFinished()) revealTween.restart();
    };

    const playReveal = () => {
      if (!inView || !loaderIsFinished()) return;
      if (revealTween) revealTween.restart();
      else void buildReveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;

        if (inView) playReveal();
        else resetReveal();
      },
      { threshold: 0.12, rootMargin: '0px 0px -6%' },
    );

    const handleLoaderStart = () => resetReveal();
    const handleLoaderDone = () => playReveal();

    observer.observe(element);
    window.addEventListener(forgeLoaderStartEvent, handleLoaderStart);
    window.addEventListener(forgeLoaderDoneEvent, handleLoaderDone);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener(forgeLoaderStartEvent, handleLoaderStart);
      window.removeEventListener(forgeLoaderDoneEvent, handleLoaderDone);
      revealTween?.kill();
      split?.revert();
    };
  }, [text, byLetter, delay, duration, stagger]);

  return createElement(as, {
    ref: elementRef,
    className: `${className ?? ''} ${pendingClass}`.trim(),
    ...(html ? { dangerouslySetInnerHTML: { __html: text } } : { children: text }),
  });
}
