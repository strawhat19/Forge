'use client';

import gsap from 'gsap';
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  forgeLoaderDoneEvent,
  forgeLoaderStartEvent,
  isForgeLoaderDone,
  isForgeLoaderReady,
} from '@/app/components/loaders/forge-loader/forge-loader-events';

export type CounterSetOptions = {
  force?: boolean;
  settle?: boolean;
};

export type CounterHandle = {
  animateTo: (number: number, speed?: number) => void;
  reset: () => void;
  setValue: (value: number, options?: CounterSetOptions) => void;
  settle: () => void;
};

export type CounterProps = {
  /** Target value. */
  number: number;
  /** Initial value. */
  start?: number;
  /** Count-up duration in seconds. */
  speed?: number;
  /** Minimum time in milliseconds between painted number updates. */
  interval?: number;
  /** Maximum horizontal SVG motion blur. */
  blurIntensity?: number;
  /** Converts counting velocity into blur strength. */
  blurVelocity?: number;
  /** Blend factor used when easing between blur strengths. */
  blurSmoothing?: number;
  decimals?: number;
  padStart?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  ease?: string;
  replay?: boolean;
  autoplay?: boolean;
  threshold?: number;
  waitForLoader?: boolean;
  className?: string;
  valueClassName?: string;
  suppressValueHydrationWarning?: boolean;
  prefixClassName?: string;
  suffixClassName?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  onUpdate?: (value: number) => void;
};

type CounterState = {
  blur: number;
  lastPaintTime: number;
  lastTime: number;
  lastValue: number;
};

const formatValue = (value: number, decimals: number, padLength: number) => {
  const safeDecimals = Math.max(0, Math.floor(decimals));
  const fixedValue = Math.abs(value).toFixed(safeDecimals);
  const [integer, fraction] = fixedValue.split(`.`);
  const sign = value < 0 ? `-` : ``;
  const paddedInteger = integer.padStart(Math.max(0, padLength), `0`);
  return `${sign}${paddedInteger}${fraction === undefined ? `` : `.${fraction}`}`;
};

const Counter = forwardRef<CounterHandle, CounterProps>(function Counter({
  number,
  start = 0,
  speed = 1.2,
  interval = 16,
  blurIntensity = 3.5,
  blurVelocity = 0.045,
  blurSmoothing = 0.3,
  decimals = 0,
  padStart = 0,
  prefix = ``,
  suffix = ``,
  delay = 0,
  ease = `power3.out`,
  replay = true,
  autoplay = true,
  threshold = 0.18,
  waitForLoader = true,
  className = ``,
  valueClassName = ``,
  suppressValueHydrationWarning = false,
  prefixClassName = ``,
  suffixClassName = ``,
  ariaLabel,
  ariaHidden = false,
  onUpdate,
}, forwardedRef) {
  const filterId = `forge-counter-blur-${useId().replaceAll(`:`, ``)}`;
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const driverRef = useRef({ value: start });
  const onUpdateRef = useRef(onUpdate);
  const stateRef = useRef<CounterState>({
    blur: 0,
    lastPaintTime: 0,
    lastTime: 0,
    lastValue: start,
  });
  onUpdateRef.current = onUpdate;

  const writeValue = useCallback((value: number, options: CounterSetOptions = {}) => {
    const valueNode = valueRef.current;
    const blurNode = blurRef.current;
    if (!valueNode || !blurNode) return;

    const now = performance.now();
    const state = stateRef.current;
    const elapsed = state.lastTime === 0 ? 0 : Math.max(now - state.lastTime, 1) / 1000;
    const velocity = elapsed === 0 ? 0 : Math.abs(value - state.lastValue) / elapsed;
    const minimumInterval = Math.max(0, interval);

    onUpdateRef.current?.(value);
    state.lastValue = value;
    state.lastTime = now;

    if (!options.force && minimumInterval > 0 && now - state.lastPaintTime < minimumInterval) return;

    const nextBlur = options.settle
      ? 0
      : gsap.utils.clamp(0, Math.max(0, blurIntensity), velocity * Math.max(0, blurVelocity));
    state.blur = options.settle
      ? 0
      : state.blur + (nextBlur - state.blur) * gsap.utils.clamp(0, 1, blurSmoothing);
    state.lastPaintTime = now;

    valueNode.textContent = formatValue(value, decimals, padStart);
    blurNode.setAttribute(`stdDeviation`, `${state.blur.toFixed(2)} 0.35`);
  }, [blurIntensity, blurSmoothing, blurVelocity, decimals, interval, padStart]);

  const reset = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    driverRef.current.value = start;
    stateRef.current = {
      blur: 0,
      lastPaintTime: 0,
      lastTime: 0,
      lastValue: start,
    };
    writeValue(start, { force: true, settle: true });
  }, [start, writeValue]);

  const animateTo = useCallback((targetNumber: number, targetSpeed = speed) => {
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(driverRef.current, {
      value: targetNumber,
      duration: Math.max(0, targetSpeed),
      delay: Math.max(0, delay),
      ease,
      overwrite: true,
      onUpdate: () => writeValue(driverRef.current.value),
      onComplete: () => writeValue(targetNumber, { force: true, settle: true }),
    });
  }, [delay, ease, speed, writeValue]);

  const settle = useCallback(() => {
    writeValue(driverRef.current.value, { force: true, settle: true });
  }, [writeValue]);

  useImperativeHandle(forwardedRef, () => ({
    animateTo,
    reset,
    setValue: (value, options) => {
      driverRef.current.value = value;
      writeValue(value, options);
    },
    settle,
  }), [animateTo, reset, settle, writeValue]);

  useLayoutEffect(() => {
    reset();
    if (!autoplay) return;

    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    let inView = false;

    const loaderIsFinished = () => !waitForLoader || isForgeLoaderReady() && isForgeLoaderDone();
    const play = () => {
      if (!inView || !loaderIsFinished()) return;
      if (reducedMotion) {
        driverRef.current.value = number;
        writeValue(number, { force: true, settle: true });
        return;
      }
      reset();
      animateTo(number);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) play();
        else if (replay) reset();
      },
      { threshold, rootMargin: `0px 0px -5%` },
    );

    const handleLoaderStart = () => {
      if (replay) reset();
    };
    const handleLoaderDone = () => play();

    observer.observe(root);
    window.addEventListener(forgeLoaderStartEvent, handleLoaderStart);
    window.addEventListener(forgeLoaderDoneEvent, handleLoaderDone);

    return () => {
      observer.disconnect();
      window.removeEventListener(forgeLoaderStartEvent, handleLoaderStart);
      window.removeEventListener(forgeLoaderDoneEvent, handleLoaderDone);
      tweenRef.current?.kill();
    };
  }, [animateTo, autoplay, number, replay, reset, threshold, waitForLoader, writeValue]);

  const initialValue = formatValue(start, decimals, padStart);
  const targetValue = formatValue(number, decimals, padStart);
  const finalLabel = `${prefix}${targetValue}${suffix}`;

  return (
    <span
      ref={rootRef}
      className={`counter ${className}`.trim()}
      aria-label={ariaHidden ? undefined : ariaLabel ?? finalLabel}
      aria-hidden={ariaHidden || undefined}
    >
      <svg className="counterFilter" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>
      {prefix ? <span className={`counterPrefix ${prefixClassName}`.trim()} aria-hidden="true">{prefix}</span> : null}
      <span
        ref={valueRef}
        className={`counterValue ${valueClassName}`.trim()}
        style={{ filter: `url(#${filterId})`, minWidth: `${Math.max(initialValue.length, targetValue.length)}ch` }}
        suppressHydrationWarning={suppressValueHydrationWarning}
        aria-hidden="true"
      >
        {initialValue}
      </span>
      {suffix ? <span className={`counterSuffix ${suffixClassName}`.trim()} aria-hidden="true">{suffix}</span> : null}
    </span>
  );
});

export default Counter;
