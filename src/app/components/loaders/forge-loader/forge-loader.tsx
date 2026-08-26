'use client';

import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import AnvilMark from '@/app/components/brand/anvil-mark';
import {
  isForgeLoaderDone,
  markForgeLoaderLoading,
  markForgeLoaderDone,
} from './forge-loader-events';

const MAX_BLUR = 7;
const NAVIGATION_COVER_DELAY_MS = 620;
const NAVIGATION_FALLBACK_MS = 5000;

export default function ForgeLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathnameRef = useRef(pathname);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const bottomRailRef = useRef<HTMLSpanElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startReplayRef = useRef<() => void>(() => undefined);
  const finishReplayRef = useRef<() => void>(() => undefined);
  const replayActiveRef = useRef(false);
  const replayFinishingRef = useRef(false);
  const finishRequestedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const core = coreRef.current;
    const ring = ringRef.current;
    const count = countRef.current;
    const status = statusRef.current;
    const bottomRail = bottomRailRef.current;
    const blurNode = blurRef.current;
    const tail = tailRef.current;

    if (!overlay || !core || !ring || !count || !status || !bottomRail || !blurNode || !tail) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = { value: 0 };
    let lastValue = 0;
    let lastTime = performance.now();
    let blur = 0;

    const clearFallbackTimer = () => {
      if (fallbackTimerRef.current === null) return;
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    };

    const renderProgress = () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 1) / 1000;
      const velocity = Math.abs(progress.value - lastValue) / elapsed;
      const targetBlur = gsap.utils.clamp(0, MAX_BLUR, velocity * 0.045);

      blur += (targetBlur - blur) * 0.3;
      const rounded = Math.round(progress.value);

      ring.style.setProperty('--loader-progress', `${progress.value * 3.6}deg`);
      count.textContent = String(rounded).padStart(2, '0');
      overlay.setAttribute('aria-valuenow', String(rounded));
      blurNode.setAttribute('stdDeviation', `${blur.toFixed(2)} 0.35`);
      lastValue = progress.value;
      lastTime = now;
    };

    const hideOverlay = () => {
      gsap.set(overlay, { autoAlpha: 0, display: 'none', yPercent: -100 });
    };

    const finishReplay = () => {
      if (!replayActiveRef.current || replayFinishingRef.current) return;

      replayFinishingRef.current = true;
      finishRequestedRef.current = true;
      clearFallbackTimer();

      const replayTimeline = timelineRef.current;
      const resumeReplay = () => {
        if (replayTimeline?.paused()) replayTimeline.resume();
      };

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resumeReplay);
      });
    };

    const startReplay = () => {
      if (replayActiveRef.current) return;

      replayActiveRef.current = true;
      replayFinishingRef.current = false;
      finishRequestedRef.current = false;
      clearFallbackTimer();
      timelineRef.current?.kill();
      markForgeLoaderLoading();

      progress.value = 0;
      lastValue = 0;
      lastTime = performance.now();
      blur = 0;
      status.textContent = 'Heating the next view';
      blurNode.setAttribute('stdDeviation', '0 0.35');
      gsap.set(overlay, { autoAlpha: 1, display: 'grid', yPercent: 100 });
      gsap.set(core, { autoAlpha: 1, scale: 0.94, y: 12 });
      gsap.set(bottomRail, { autoAlpha: 1 });
      gsap.set(tail, { scaleY: 1 });
      renderProgress();

      const replayTimeline = gsap.timeline({
        onComplete: () => {
          clearFallbackTimer();
          replayActiveRef.current = false;
          replayFinishingRef.current = false;
          finishRequestedRef.current = false;
          timelineRef.current = null;
          hideOverlay();
          markForgeLoaderDone();
        },
      });
      timelineRef.current = replayTimeline;

      if (reducedMotion) {
        replayTimeline
          .to(overlay, { yPercent: 0, duration: 0.08 })
          .set(progress, { value: 100, onComplete: renderProgress })
          .set(status, { textContent: 'Ready to strike' })
          .to(overlay, { autoAlpha: 0, duration: 0.12, delay: 0.08 });
      } else {
        replayTimeline
          .to(overlay, { yPercent: 0, duration: 0.52, ease: 'power3.out' })
          .to(core, { scale: 1, y: 0, duration: 0.42, ease: 'power3.out' }, '-=0.22')
          .to(
            progress,
            {
              value: 84,
              duration: 1.1,
              ease: 'power2.out',
              onUpdate: renderProgress,
            },
            0.18,
          )
          .addPause(undefined, () => {
            if (finishRequestedRef.current) replayTimeline.resume();
          })
          .to(
            progress,
            {
              value: 100,
              duration: 0.4,
              ease: 'power2.inOut',
              onUpdate: renderProgress,
              onComplete: () => {
                blurNode.setAttribute('stdDeviation', '0 0');
                status.textContent = 'Ready to strike';
              },
            },
          )
          .to(core, { scale: 0.97, autoAlpha: 0, duration: 0.26, ease: 'power2.in' }, '-=0.1')
          .addLabel('lift')
          .to(bottomRail, { autoAlpha: 0, duration: 0.12, ease: 'power2.out' }, 'lift')
          .to(overlay, { yPercent: -100, duration: 0.82, ease: 'power3.inOut' }, 'lift')
          .to(tail, { scaleY: 0, duration: 0.82, ease: 'power2.in' }, 'lift');
      }

      fallbackTimerRef.current = window.setTimeout(finishReplay, NAVIGATION_FALLBACK_MS);
    };

    startReplayRef.current = startReplay;
    finishReplayRef.current = finishReplay;

    const initialTimeline = gsap.context(() => {
      if (reducedMotion) {
        progress.value = 100;
        renderProgress();
        status.textContent = 'Ready';
        gsap.timeline({
          onComplete: () => {
            hideOverlay();
            markForgeLoaderDone();
          },
        })
          .to(bottomRail, { autoAlpha: 0, duration: 0.08 })
          .to(overlay, { autoAlpha: 0, duration: 0.18, delay: 0.08 })
          .set(overlay, { display: 'none' });
        return;
      }

      timelineRef.current = gsap.timeline({
        onComplete: () => {
          hideOverlay();
          markForgeLoaderDone();
        },
      })
        .fromTo(
          core,
          { scale: 0.92, y: 12 },
          { scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        )
        .to(
          progress,
          {
            value: 100,
            duration: 2.05,
            ease: 'power3.inOut',
            onUpdate: renderProgress,
            onComplete: () => {
              blurNode.setAttribute('stdDeviation', '0 0');
              status.textContent = 'Ready to strike';
            },
          },
          0.18,
        )
        .to(core, { scale: 0.97, autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, '+=0.22')
        .addLabel('lift')
        .to(bottomRail, { autoAlpha: 0, duration: 0.12, ease: 'power2.out' }, 'lift')
        .to(overlay, { yPercent: -100, duration: 1.15, ease: 'power3.inOut' }, 'lift')
        .to(tail, { scaleY: 0, duration: 1.15, ease: 'power2.in' }, 'lift')
        .set(overlay, { display: 'none' });
    }, overlay);

    return () => {
      clearFallbackTimer();
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
      timelineRef.current?.kill();
      startReplayRef.current = () => undefined;
      finishReplayRef.current = () => undefined;
      initialTimeline.revert();
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }

    if (!isForgeLoaderDone()) {
      startReplayRef.current();
      return;
    }

    if (replayActiveRef.current) {
      finishReplayRef.current();
      return;
    }

    startReplayRef.current();
    finishReplayRef.current();
  }, [pathname]);

  useEffect(() => {
    const handleLinkIntent = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target && anchor.target !== '_self' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      event.stopPropagation();
      startReplayRef.current();

      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }

      const destination = `${url.pathname}${url.search}${url.hash}`;
      navigationTimerRef.current = window.setTimeout(() => {
        navigationTimerRef.current = null;
        router.push(destination);
      }, NAVIGATION_COVER_DELAY_MS);
    };

    document.addEventListener('click', handleLinkIntent, true);
    return () => document.removeEventListener('click', handleLinkIntent, true);
  }, [router]);

  useEffect(() => {
    const handlePopState = () => {
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
      startReplayRef.current();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="forgeLoader"
      role="progressbar"
      aria-label="Preparing Forge"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <svg className="forgeLoaderFilter" aria-hidden="true" focusable="false">
        <defs>
          <filter id="forgeMotionBlur" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>

      <span className="forgeLoaderRail forgeLoaderRailTop">
        Forged in Fire
      </span>

      <div ref={coreRef} className="forgeLoaderCore">
        <div ref={ringRef} className="forgeLoaderRing">
          <div className="forgeLoaderRingInner">
            <span className="forgeLoaderTrail forgeLoaderTrailOne">
              <AnvilMark />
            </span>
            <span className="forgeLoaderTrail forgeLoaderTrailTwo">
              <AnvilMark />
            </span>
            <AnvilMark className="forgeLoaderAnvil" />
          </div>
        </div>

        <div className="forgeLoaderReadout">
          <span ref={statusRef} className="forgeLoaderStatus">Heating the forge</span>
          <span className="forgeLoaderPercent">
            <span ref={countRef} className="forgeLoaderNumber">00</span>
            <span className="forgeLoaderUnit">%</span>
          </span>
        </div>
      </div>

      <span ref={bottomRailRef} className="forgeLoaderRail forgeLoaderRailBottom">Heat / Shape / Strike</span>
      <div ref={tailRef} className="forgeLoaderTail" aria-hidden="true" />
    </div>
  );
}
