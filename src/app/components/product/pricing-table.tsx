'use client';

import Link from 'next/link';
import { useState } from 'react';
import ForgeIcon from '@/app/components/brand/forge-icon';
import { productConfig, type BillingCycle, type PricingPlan } from '@/shared/config/product';

type PricingTableProps = {
  plans?: readonly PricingPlan[];
  defaultBillingCycle?: BillingCycle;
};

export default function PricingTable({
  plans = productConfig.plans,
  defaultBillingCycle = `monthly`,
}: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(defaultBillingCycle);

  return (
    <section className="pricingTable" aria-label="Forge plans">
      <div className="pricingControls" role="group" aria-label="Billing cycle">
        <span>Billing</span>
        {([`monthly`, `annual`] as const).map((cycle) => (
          <button
            key={cycle}
            type="button"
            aria-pressed={billingCycle === cycle}
            className={billingCycle === cycle ? `active` : ``}
            onClick={() => setBillingCycle(cycle)}
          >
            {cycle}
            {cycle === `annual` ? <small>2 months free</small> : null}
          </button>
        ))}
      </div>

      <div className="pricingGrid">
        {plans.map((plan, index) => {
          const external = plan.href.startsWith(`http`);
          const billingPeriod = plan.price[billingCycle] === `Custom` || plan.price.monthly === `$0`
            ? ``
            : ` / ${billingCycle === `annual` ? `year` : `month`}`;
          const actionContent = <>{plan.cta}<span aria-hidden="true">↗</span></>;

          return (
            <article className={`pricingCard${plan.featured ? ` pricingCardFeatured` : ``}`} key={plan.name}>
              <div className="pricingCardTopline">
                <span>{String(index + 1).padStart(2, `0`)}</span>
                <span>{plan.availability}</span>
              </div>
              <div className="pricingCardHeading">
                <span className="eyebrow">{plan.eyebrow}</span>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
              <div className="pricingValue">
                <strong>{plan.price[billingCycle]}</strong>
                <span>{plan.suffix}{billingPeriod}</span>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><ForgeIcon name="shield" />{feature}</li>
                ))}
              </ul>
              {external ? (
                <a className="pricingCta" href={plan.href} target="_blank" rel="noreferrer">{actionContent}</a>
              ) : plan.href.startsWith(`mailto:`) ? (
                <a className="pricingCta" href={plan.href}>{actionContent}</a>
              ) : (
                <Link className="pricingCta" href={plan.href}>{actionContent}</Link>
              )}
            </article>
          );
        })}
      </div>

      <p className="pricingDisclosure">
        Starter is available from the public source repository. Paid plans, member downloads, checkout, and access control are product previews until the account portal is connected.
      </p>
    </section>
  );
}
