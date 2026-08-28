'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import ForgeAnvilOrbit from '@/app/components/brand/forge-anvil-orbit';
import Counter, { type CounterHandle } from '@/app/components/effects/counter';
import {
  isForgeLoaderDone,
  markForgeLoaderLoading,
  markForgeLoaderDone,
} from './forge-loader-events';

const NAVIGATION_COVER_DELAY_MS = 620;
const NAVIGATION_FALLBACK_MS = 5000;

const loaderStatusSteps = [
  `Heating forge`,
  `Reading templates`,
  `Resolving inputs`,
  `Comparing diffs`,
  `Tracing stacks`,
  `Staging changes`,
  `Inspecting impact`,
  `Checking drift`,
  `Setting guardrails`,
  `Recording history`,
] as const;

const routeLabels: Record<string, string> = {
  '/': `Forge`,
  '/product': `Product`,
  '/features': `Features`,
  '/workflows': `Workflows`,
  '/notifications': `Notifications`,
  '/docs': `Documentation`,
  '/download': `Download`,
  '/plans': `Plans`,
  '/sign-in': `Sign in`,
  '/sign-up': `Sign up`,
  '/profile': `Profile`,
  '/dashboard': `Dashboard`,
  '/api': `API`,
};

const getRouteLabel = (path: string) => {
  const normalizedPath = path.length > 1 ? path.replace(/\/$/, ``) : path;
  const configuredLabel = routeLabels[normalizedPath];
  if (configuredLabel) return configuredLabel;

  const finalSegment = normalizedPath.split(`/`).filter(Boolean).at(-1);
  if (!finalSegment) return `Forge`;

  return decodeURIComponent(finalSegment)
    .replaceAll(`-`, ` `)
    .replace(/\b\w/g, character => character.toUpperCase());
};

export default function ForgeLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathnameRef = useRef(pathname);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const topRailRef = useRef<HTMLSpanElement | null>(null);
  const destinationShellRef = useRef<HTMLSpanElement | null>(null);
  const destinationRef = useRef<HTMLSpanElement | null>(null);
  const counterRef = useRef<CounterHandle | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const bottomRailRef = useRef<HTMLSpanElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startReplayRef = useRef<() => void>(() => undefined);
  const finishReplayRef = useRef<() => void>(() => undefined);
  const replayActiveRef = useRef(false);
  const replayFinishingRef = useRef(false);
  const finishRequestedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const destinationPathRef = useRef(pathname);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const core = coreRef.current;
    const ring = ringRef.current;
    const topRail = topRailRef.current;
    const destinationShell = destinationShellRef.current;
    const destination = destinationRef.current;
    const status = statusRef.current;
    const bottomRail = bottomRailRef.current;
    const tail = tailRef.current;

    if (!overlay || !core || !ring || !topRail || !destinationShell || !destination || !status || !bottomRail || !tail) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(SplitText);

    const progress = { value: 0 };
    let topRailSplit: SplitText | null = null;
    let destinationSplit: SplitText | null = null;
    let statusSplit: SplitText | null = null;
    let bottomRailSplit: SplitText | null = null;
    let statusTween: gsap.core.Tween | null = null;
    let activeStatusIndex = 0;

    const revertLoaderText = () => {
      statusTween?.kill();
      statusTween = null;
      topRailSplit?.revert();
      destinationSplit?.revert();
      statusSplit?.revert();
      bottomRailSplit?.revert();
      topRailSplit = null;
      destinationSplit = null;
      statusSplit = null;
      bottomRailSplit = null;
    };

    const setStatusText = (text: string, animate = false) => {
      statusTween?.kill();
      statusTween = null;
      statusSplit?.revert();
      statusSplit = null;
      status.textContent = text;

      if (!animate || reducedMotion) return;

      statusTween = gsap.fromTo(
        status,
        { autoAlpha: 0, rotateX: -24, yPercent: 65, transformOrigin: `50% 100%` },
        { autoAlpha: 1, rotateX: 0, yPercent: 0, duration: 0.3, ease: `power3.out`, overwrite: true },
      );
    };

    const prepareLoaderText = (statusText: string) => {
      revertLoaderText();
      status.textContent = statusText;
      destination.textContent = getRouteLabel(destinationPathRef.current);
      overlay.setAttribute(`aria-label`, `Loading ${destination.textContent}`);

      if (reducedMotion) {
        return { top: [], destination: [], status: [], bottom: [] };
      }

      gsap.set(destinationShell, { autoAlpha: 0, y: 8 });

      const splitOptions = {
        type: 'chars',
        mask: 'chars',
        charsClass: 'forgeLoaderTextChar',
        tag: 'span',
        aria: 'auto',
      } as const;

      topRailSplit = SplitText.create(topRail, splitOptions);
      destinationSplit = SplitText.create(destination, splitOptions);
      statusSplit = SplitText.create(status, splitOptions);
      bottomRailSplit = SplitText.create(bottomRail, splitOptions);

      const targets = {
        top: topRailSplit.chars,
        destination: destinationSplit.chars,
        status: statusSplit.chars,
        bottom: bottomRailSplit.chars,
      };

      gsap.set([...targets.top, ...targets.destination, ...targets.status, ...targets.bottom], {
        autoAlpha: 0,
        rotateX: -62,
        transformOrigin: '50% 100%',
        yPercent: 120,
      });

      return targets;
    };

    const addLoaderTextReveal = (
      timeline: gsap.core.Timeline,
      targets: ReturnType<typeof prepareLoaderText>,
    ) => {
      timeline
        .to(destinationShell, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        }, 0.12)
        .to(targets.top, {
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0,
          duration: 0.52,
          ease: 'power4.out',
          stagger: 0.025,
        }, 0.08)
        .to(targets.status, {
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0,
          duration: 0.46,
          ease: 'power4.out',
          stagger: 0.018,
        }, 0.16)
        .to(targets.destination, {
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0,
          duration: 0.42,
          ease: 'power4.out',
          stagger: 0.025,
        }, 0.2)
        .to(targets.bottom, {
          autoAlpha: 1,
          rotateX: 0,
          yPercent: 0,
          duration: 0.48,
          ease: 'power4.out',
          stagger: 0.018,
        }, 0.24);
    };

    const clearFallbackTimer = () => {
      if (fallbackTimerRef.current === null) return;
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    };

    const renderProgress = () => {
      const rounded = Math.round(progress.value);
      const nextStatusIndex = Math.min(Math.floor(rounded / 10), loaderStatusSteps.length - 1);

      if (nextStatusIndex !== activeStatusIndex) {
        activeStatusIndex = nextStatusIndex;
        setStatusText(loaderStatusSteps[nextStatusIndex], true);
      }

      ring.style.setProperty('--forge-anvil-progress', `${progress.value * 3.6}deg`);
      counterRef.current?.setValue(progress.value);
      overlay.setAttribute('aria-valuenow', String(rounded));
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
      counterRef.current?.reset();
      activeStatusIndex = 0;
      const replayTextTargets = prepareLoaderText(loaderStatusSteps[0]);
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
          .to(core, { scale: 1, y: 0, duration: 0.42, ease: 'power3.out' }, '-=0.22');

        addLoaderTextReveal(replayTimeline, replayTextTargets);

        replayTimeline
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
                counterRef.current?.settle();
                setStatusText('Ready to strike', true);
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
      activeStatusIndex = 0;
      const initialTextTargets = prepareLoaderText(loaderStatusSteps[0]);

      if (reducedMotion) {
        progress.value = 100;
        renderProgress();
        setStatusText('Ready');
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

      const initialSequence = gsap.timeline({
        onComplete: () => {
          hideOverlay();
          markForgeLoaderDone();
        },
      });
      timelineRef.current = initialSequence;

      initialSequence.fromTo(
        core,
        { scale: 0.92, y: 12 },
        { scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      );

      addLoaderTextReveal(initialSequence, initialTextTargets);

      initialSequence
        .to(
          progress,
          {
            value: 100,
            duration: 2.05,
            ease: 'power3.inOut',
            onUpdate: renderProgress,
            onComplete: () => {
              counterRef.current?.settle();
              setStatusText('Ready to strike', true);
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
      statusTween?.kill();
      startReplayRef.current = () => undefined;
      finishReplayRef.current = () => undefined;
      initialTimeline.revert();
      revertLoaderText();
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    destinationPathRef.current = pathname;

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
      destinationPathRef.current = url.pathname;
      startReplayRef.current();

      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }

      const destination = `${url.pathname}${url.search}${url.hash}`;
      const nativeNavigation = url.pathname === `/api` || url.pathname.startsWith(`/api/`);
      navigationTimerRef.current = window.setTimeout(() => {
        navigationTimerRef.current = null;
        if (nativeNavigation) window.location.assign(url.href);
        else router.push(destination);
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
      destinationPathRef.current = window.location.pathname;
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
      <span ref={topRailRef} className="forgeLoaderRail forgeLoaderRailTop">
        Forged in Fire
      </span>

      <div ref={coreRef} className="forgeLoaderCore">
        <ForgeAnvilOrbit ringRef={ringRef}>
          <span ref={destinationShellRef} className="forgeLoaderDestination">
            <small aria-hidden="true">Loading</small>
            <span ref={destinationRef}>{getRouteLabel(pathname)}</span>
          </span>
        </ForgeAnvilOrbit>

        <div className="forgeLoaderReadout">
          <span ref={statusRef} className="forgeLoaderStatus">Heating the forge</span>
          <Counter
            ref={counterRef}
            number={100}
            autoplay={false}
            interval={16}
            blurIntensity={7}
            blurVelocity={0.045}
            blurSmoothing={0.3}
            padStart={2}
            suffix="%"
            className="forgeLoaderPercent"
            valueClassName="forgeLoaderNumber"
            suffixClassName="forgeLoaderUnit"
            ariaHidden
          />
        </div>
      </div>

      <span ref={bottomRailRef} className="forgeLoaderRail forgeLoaderRailBottom">Heat / Shape / Strike</span>
      <div ref={tailRef} className="forgeLoaderTail" aria-hidden="true" />
    </div>
  );
}
