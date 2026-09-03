import type { Metadata } from 'next';
import PricingTable from '@/app/components/product/pricing-table';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Plans`,
  description: `Start with the public cfn-forge source and preview planned Operator, Team, and Enterprise membership tiers.`,
};

export default function PlansPage() {
  return (
    <div className="productPage productPagePlans">
      <ProductPageHero
        icon="plans"
        eyebrow="Plans / 06"
        title="Source Start."
        accent="Control Scale."
        description="Use the public source today. Operator, Team, and Enterprise tiers show the intended subscription direction while member downloads, billing, role-based access, and checkout are still being built."
        metrics={[
          { value: `$0`, label: `Starter source access` },
          { value: `3`, label: `Planned paid paths` },
          { value: `Clear`, label: `Availability labels` },
        ]}
      />

      <section className="productSection productPlansSection">
        <div className="productSectionHeading">
          <span className="eyebrow">Preview pricing</span>
          <SplitHeading text="Choose Level of<br /><em>Operational Support.</em>" />
          <p>The pricing component is ready for the future member portal. For now, Starter links to the public server source and paid-plan calls to action open a direct conversation.</p>
        </div>
        <ElementReveal><PricingTable /></ElementReveal>
      </section>

      <section className="productSection productPlanFaq">
        <ElementReveal><span>01</span><h3>Can I download Forge now?</h3><p>Yes. Starter points to the current public cfn-forge source repository and its v0.1.0 Python package.</p></ElementReveal>
        <ElementReveal delay={0.04}><span>02</span><h3>Are paid plans live?</h3><p>No. They are clearly marked planned until Firebase membership, role-based access, billing, and a gated build channel are connected.</p></ElementReveal>
        <ElementReveal delay={0.08}><span>03</span><h3>Is Forge multi-cloud?</h3><p>No. The current implementation targets AWS CloudFormation. Provider-independent lifecycle concepts remain a future direction.</p></ElementReveal>
        <ElementReveal delay={0.12}><span>04</span><h3>Is support included?</h3><p>The public source is available as-is. Commercial support terms are part of the planned plan structure and require a direct agreement.</p></ElementReveal>
      </section>
    </div>
  );
}
