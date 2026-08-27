'use client';

import { siteConfig } from '@/shared/config/site';
import ForgeIcon from '@/app/components/brand/forge-icon';
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';

type TopMarqueeProps = {
  id?: string;
  style?: CSSProperties;
  speed?: number;
  sticky?: boolean;
  autoplay?: boolean;
  fadeSides?: boolean;
  pauseonhover?: boolean;
  direction?: `rtl` | `ltr`;
};

const dragThreshold = 6;

function MarqueeIcon({ name }: { name: string }) {
  const gradientId = `forge-marquee-icon-${useId().replaceAll(`:`, ``)}`;
  return <ForgeIcon name={name} gradientId={gradientId} />;
}

export default function TopMarquee({
  speed = 18,
  sticky = false,
  autoplay = true,
  direction = `rtl`,
  fadeSides = true,
  pauseonhover = false,
  id = `forge-top-marquee`,
  style,
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
    if (!track || !container || typeof track.animate !== `function`) return;

    reducedMotionRef.current = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
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
        const previousDuration = typeof timing?.duration === `number` ? timing.duration : 0;
        const currentTime = typeof previous.currentTime === `number` ? previous.currentTime : 0;
        if (previousDuration > 0) progress = (currentTime % previousDuration) / previousDuration;
        previous.cancel();
      }

      builtWidth = setWidth;
      const duration = (setWidth / speed) * 1000;
      const keyframes = direction === `ltr`
        ? [
            { transform: `translate3d(-${setWidth}px, 0, 0)` },
            { transform: `translate3d(0, 0, 0)` },
          ]
        : [
            { transform: `translate3d(0, 0, 0)` },
            { transform: `translate3d(-${setWidth}px, 0, 0)` },
          ];

      const animation = track.animate(keyframes, {
        duration,
        iterations: Infinity,
        easing: `linear`,
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

    const resizeObserver = typeof ResizeObserver === `undefined`
      ? null
      : new ResizeObserver(scheduleRebuild);
    resizeObserver?.observe(track);

    const handleVisibilityChange = () => updatePlayState();
    document.addEventListener(`visibilitychange`, handleVisibilityChange);
    window.addEventListener(`resize`, scheduleRebuild);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener(`visibilitychange`, handleVisibilityChange);
      window.removeEventListener(`resize`, scheduleRebuild);
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
      dragStartTimeRef.current = typeof animation.currentTime === `number` ? animation.currentTime : 0;
      dragStartXRef.current = event.clientX;
      tweenPlaybackRate(0, true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    const timing = animation.effect?.getComputedTiming();
    const duration = typeof timing?.duration === `number` ? timing.duration : 0;
    const setWidth = track.scrollWidth / 2;
    if (duration <= 0 || setWidth <= 0) return;

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaTime = (deltaX / setWidth) * duration;
    let nextTime = direction === `ltr`
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
      style={style}
      className={`topMarquee${fadeSides ? ` topMarqueeFadeSides` : ``}${sticky ? ` topMarqueeSticky` : ``}`}
      aria-label="Forge CloudFormation deployment capabilities"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        role="list"
        className={`topMarqueeTrack${dragging ? ` isDragging` : ``}`}
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
