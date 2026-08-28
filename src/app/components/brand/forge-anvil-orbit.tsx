import type { ReactNode, Ref } from 'react';
import AnvilMark from '@/app/components/brand/anvil-mark';

type ForgeAnvilOrbitProps = {
  children?: ReactNode;
  className?: string;
  ringRef?: Ref<HTMLDivElement>;
};

export default function ForgeAnvilOrbit({
  children,
  className = ``,
  ringRef,
}: ForgeAnvilOrbitProps) {
  return (
    <div ref={ringRef} className={`forgeAnvilOrbit ${className}`.trim()}>
      <div className="forgeAnvilOrbitInner">
        <span className="forgeAnvilOrbitTrail forgeAnvilOrbitTrailOne">
          <AnvilMark />
        </span>
        <span className="forgeAnvilOrbitTrail forgeAnvilOrbitTrailTwo">
          <AnvilMark />
        </span>
        <AnvilMark className="forgeAnvilOrbitMark" />
        {children}
      </div>
    </div>
  );
}
