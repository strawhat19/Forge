'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import AnvilMark from '@/app/components/brand/anvil-mark';
import { markForgeLoaderDone } from './forge-loader-events';

const MAX_BLUR = 7;

export default function ForgeLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const core = coreRef.current;
    const ring = ringRef.current;
    const count = countRef.current;
    const status = statusRef.current;
    const blurNode = blurRef.current;
    const tail = tailRef.current;

    if (!overlay || !core || !ring || !count || !status || !blurNode || !tail) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = { value: 0 };
    let lastValue = 0;
    let lastTime = performance.now();
    let blur = 0;

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

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        progress.value = 100;
        renderProgress();
        status.textContent = 'Ready';
        gsap.timeline({ onComplete: markForgeLoaderDone })
          .to(overlay, { autoAlpha: 0, duration: 0.18, delay: 0.08 })
          .set(overlay, { display: 'none' });
        return;
      }

      gsap.timeline({ onComplete: markForgeLoaderDone })
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
        .to(overlay, { yPercent: -100, duration: 1.15, ease: 'power3.inOut' }, 'lift')
        .to(tail, { scaleY: 0, duration: 1.15, ease: 'power2.in' }, 'lift')
        .set(overlay, { display: 'none' });
    }, overlay);

    return () => ctx.revert();
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

      <span className="forgeLoaderRail forgeLoaderRailTop">Forged in the dark</span>

      <div ref={coreRef} className="forgeLoaderCore">
        <div ref={ringRef} className="forgeLoaderRing">
          <div className="forgeLoaderRingInner">
            <span className="forgeLoaderTrail forgeLoaderTrailOne"><AnvilMark /></span>
            <span className="forgeLoaderTrail forgeLoaderTrailTwo"><AnvilMark /></span>
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

      <span className="forgeLoaderRail forgeLoaderRailBottom">Heat / Shape / Strike</span>
      <div ref={tailRef} className="forgeLoaderTail" aria-hidden="true" />
    </div>
  );
}
