import type { ReactNode } from 'react';
import ForgeIcon from '@/app/components/brand/forge-icon';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';

type ProductPageMetric = {
  value: string;
  label: string;
};

type ProductPageHeroProps = {
  icon: string;
  title: string;
  accent: string;
  eyebrow: string;
  description: string;
  actions?: ReactNode;
  metrics?: readonly ProductPageMetric[];
};

export default function ProductPageHero({
  icon,
  title,
  accent,
  eyebrow,
  actions,
  description,
  metrics = [],
}: ProductPageHeroProps) {
  return (
    <section className="productHero">
      <div className="productHeroGrid" aria-hidden="true" />
      <div className="productHeroCopy">
        <TextReveal as="span" className="eyebrow" text={eyebrow} />
        <SplitHeading as="h1" text={`${title}<em>${accent}</em>`} />
        <TextReveal as="p" text={description} delay={0.06} />
        {actions ? <ElementReveal className="productHeroActions" delay={0.12}>{actions}</ElementReveal> : null}
      </div>
      <ElementReveal className="productHeroSignal" delay={0.08} scale={0.96} ariaHidden>
        <span className="productHeroSignalRing" />
        <span className="productHeroSignalCore"><ForgeIcon name={icon} /></span>
        <span className="productHeroSignalLabel">FORGE / {eyebrow}</span>
      </ElementReveal>
      {metrics.length ? (
        <ElementReveal className="productHeroMetrics" delay={0.18}>
          {metrics.map((metric) => (
            <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
          ))}
        </ElementReveal>
      ) : null}
    </section>
  );
}
