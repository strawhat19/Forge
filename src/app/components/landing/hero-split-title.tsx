'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useLayoutEffect, useRef } from 'react';
import {
  forgeLoaderDoneEvent,
  isForgeLoaderDone,
} from '@/app/components/loaders/forge-loader/forge-loader-events';

export default function HeroSplitTitle() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;

    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(SplitText);

    const split = SplitText.create(title, {
      type: 'words',
      mask: 'words',
      wordsClass: 'heroTitleWord',
      tag: 'span',
      aria: 'auto',
    });
    let tween: ReturnType<typeof gsap.to> | undefined;
    let revealed = false;

    gsap.set(split.words, {
      autoAlpha: 0,
      rotateX: -72,
      transformOrigin: '50% 100%',
      yPercent: 115,
    });

    const revealTitle = () => {
      if (revealed) return;

      revealed = true;
      window.removeEventListener(forgeLoaderDoneEvent, revealTitle);
      tween = gsap.to(split.words, {
        autoAlpha: 1,
        rotateX: 0,
        yPercent: 0,
        duration: 0.88,
        delay: 0.1,
        ease: 'power4.out',
        stagger: 0.09,
        clearProps: 'opacity,transform,visibility',
      });
    };

    if (isForgeLoaderDone()) {
      revealTitle();
    } else {
      window.addEventListener(forgeLoaderDoneEvent, revealTitle);
    }

    return () => {
      window.removeEventListener(forgeLoaderDoneEvent, revealTitle);
      tween?.kill();
      split.revert();
    };
  }, []);

  return (
    <h1 ref={titleRef} className="heroTitle heroReveal">
      <span className="heroTitleLine">Ideas enter.</span>{' '}
      <span className="heroTitleLine heroTitleAccent">Products emerge.</span>
    </h1>
  );
}
