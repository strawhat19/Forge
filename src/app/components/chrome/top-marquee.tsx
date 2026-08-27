'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { siteConfig } from '@/shared/config/site';

type TopMarqueeProps = {
  id?: string;
  speed?: number;
  autoplay?: boolean;
  fadeSides?: boolean;
  pauseonhover?: boolean;
  direction?: 'rtl' | 'ltr';
};

type MarqueeIconProps = {
  name: string;
};

const dragThreshold = 6;

function MarqueeIcon({ name }: MarqueeIconProps) {
  const icon = (() => {
    switch (name) {
      case 'applications':
        return <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 12h3v3H7zM14 12h3v3h-3z" /></>;
      case 'cloud':
        return <><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 8.7 4.7 4.7 0 0 0 7 18Z" /><path d="m10 12-2 2 2 2m4-4 2 2-2 2" /></>;
      case 'devops':
        return <><path d="M8.2 7.1A5.5 5.5 0 0 1 17 8l1.5 2.2M15.8 16.9A5.5 5.5 0 0 1 7 16l-1.5-2.2" /><path d="M18.5 6.5v3.7h-3.7M5.5 17.5v-3.7h3.7" /></>;
      case 'build':
        return <><path d="m14.5 5.5 4 4M13 7l4 4M5 19l8.8-8.8" /><path d="m3.8 17.2 3 3-3.8.8zM13.8 4.2l2.7-1.2 4.5 4.5-1.2 2.7" /></>;
      case 'pipeline':
        return <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="5" cy="18" r="2" /><path d="M7 6h3a4 4 0 0 1 4 4v0a2 2 0 0 0 2 2h1M7 18h3a4 4 0 0 0 4-4v0" /></>;
      case 'cloudformation':
        return <><path d="m12 3 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" /><path d="M8 9v5m8-5v5" /></>;
      case 'terraform':
        return <><path d="m4 5 6 3.5V15l-6-3.5zM11 9l6 3.5V19l-6-3.5zM11 3l6 3.5V11l-6-3.5z" /><path d="m18 12 2-1.2v6.5L18 19z" /></>;
      case 'iac':
        return <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 17h8m-5-7-2 2 2 2m2-4 2 2-2 2" /></>;
      default:
        return <><path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14" /></>;
    }
  })();

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icon}
    </svg>
  );
}

export default function TopMarquee({
  speed = 18,
  autoplay = true,
  direction = 'rtl',
  fadeSides = true,
  pauseonhover = false,
  id = 'forge-top-marquee',
}: TopMarqueeProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const inViewRef = useRef(true);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const playStateFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const shouldPlay = () => (
    autoplay
    && inViewRef.current
    && !document.hidden
    && !draggingRef.current
    && !(pauseonhover && hoveringRef.current)
    && !reducedMotionRef.current
  );

  const easeInOutCubic = (value: number) => (
    value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
  );

  const tweenPlaybackRate = (targetRate: number, immediate = false) => {
    const animation = animationRef.current;
    if (!animation) return;

    window.cancelAnimationFrame(playStateFrameRef.current);

    if (immediate) {
      animation.playbackRate = targetRate;
      if (targetRate > 0) animation.play();
      else animation.pause();
      return;
    }

    const visualTargetRate = targetRate === 0 ? 0.001 : targetRate;
    const startRate = Math.max(animation.playbackRate || 0.001, 0.001);
    const startTime = window.performance.now();
    const duration = targetRate === 0 ? 520 : 180;

    if (targetRate > 0) {
      animation.playbackRate = startRate;
      animation.play();
    }

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      animation.playbackRate = startRate + (visualTargetRate - startRate) * easeInOutCubic(progress);

      if (progress < 1) {
        playStateFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      animation.playbackRate = targetRate;
      if (targetRate === 0) animation.pause();
    };

    playStateFrameRef.current = window.requestAnimationFrame(tick);
  };

  const updatePlayState = () => {
    if (!animationRef.current) return;
    tweenPlaybackRate(shouldPlay() ? 1 : 0);
  };

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || typeof track.animate !== 'function') return;

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let builtWidth = 0;
    let rebuildFrame = 0;

    const buildAnimation = () => {
      const setWidth = track.scrollWidth / 2;
      if (setWidth <= 0) return;

      const previous = animationRef.current;
      if (previous && setWidth === builtWidth) {
        updatePlayState();
        return;
      }

      let progress = 0;
      if (previous) {
        const timing = previous.effect?.getComputedTiming();
        const previousDuration = typeof timing?.duration === 'number' ? timing.duration : 0;
        const currentTime = typeof previous.currentTime === 'number' ? previous.currentTime : 0;
        if (previousDuration > 0) progress = (currentTime % previousDuration) / previousDuration;
        previous.cancel();
      }

      builtWidth = setWidth;
      const duration = (setWidth / speed) * 1000;
      const keyframes = direction === 'ltr'
        ? [
            { transform: `translate3d(-${setWidth}px, 0, 0)` },
            { transform: 'translate3d(0, 0, 0)' },
          ]
        : [
            { transform: 'translate3d(0, 0, 0)' },
            { transform: `translate3d(-${setWidth}px, 0, 0)` },
          ];

      const animation = track.animate(keyframes, {
        duration,
        iterations: Infinity,
        easing: 'linear',
      });

      animation.currentTime = progress * duration;
      animationRef.current = animation;
      updatePlayState();
    };

    const scheduleRebuild = () => {
      window.cancelAnimationFrame(rebuildFrame);
      rebuildFrame = window.requestAnimationFrame(buildAnimation);
    };

    buildAnimation();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry?.isIntersecting ?? true;
      updatePlayState();
    });
    intersectionObserver.observe(container);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleRebuild);
    resizeObserver?.observe(track);

    const handleVisibilityChange = () => updatePlayState();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', scheduleRebuild);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', scheduleRebuild);
      window.cancelAnimationFrame(rebuildFrame);
      window.cancelAnimationFrame(playStateFrameRef.current);
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [autoplay, direction, pauseonhover, speed]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!animationRef.current) return;
    pointerActiveRef.current = true;
    dragStartXRef.current = event.clientX;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current) return;

    const animation = animationRef.current;
    const track = trackRef.current;
    if (!animation || !track) return;

    if (!draggingRef.current) {
      if (Math.abs(event.clientX - dragStartXRef.current) < dragThreshold) return;

      draggingRef.current = true;
      setDragging(true);
      dragStartTimeRef.current = typeof animation.currentTime === 'number' ? animation.currentTime : 0;
      dragStartXRef.current = event.clientX;
      tweenPlaybackRate(0, true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    const timing = animation.effect?.getComputedTiming();
    const duration = typeof timing?.duration === 'number' ? timing.duration : 0;
    const setWidth = track.scrollWidth / 2;
    if (duration <= 0 || setWidth <= 0) return;

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaTime = (deltaX / setWidth) * duration;
    let nextTime = direction === 'ltr'
      ? dragStartTimeRef.current + deltaTime
      : dragStartTimeRef.current - deltaTime;
    nextTime = ((nextTime % duration) + duration) % duration;
    animation.currentTime = nextTime;
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;

    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    updatePlayState();
  };

  const handleMouseEnter = () => {
    hoveringRef.current = true;
    updatePlayState();
  };

  const handleMouseLeave = () => {
    hoveringRef.current = false;
    updatePlayState();
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`topMarquee${fadeSides ? ' topMarqueeFadeSides' : ''}`}
      aria-label="Forge cloud and delivery capabilities"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        role="list"
        className={`topMarqueeTrack${dragging ? ' isDragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {[0, 1].map((copy) => siteConfig.marqueeItems.map((item, index) => (
          <span
            role="listitem"
            aria-hidden={copy === 1 ? true : undefined}
            className="topMarqueeItem"
            key={`${copy}-${item.text}-${index}`}
          >
            <span className="topMarqueeIcon">
              <MarqueeIcon name={item.icon} />
            </span>
            <span>{item.text}</span>
          </span>
        )))}
      </div>
    </div>
  );
}
