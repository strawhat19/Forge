import Link from 'next/link';
import type { Metadata } from 'next';
import { productConfig } from '@/shared/config/product';
import CodeBlock from '@/app/components/product/code-block';
import ForgeIcon from '@/app/components/brand/forge-icon';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Features`,
  description: `Explore Forge staging, nested template intelligence, parameter impact, release lifecycle, history, and advanced preview capabilities.`,
};

const inspectSnippets = [
  {
    label: `Template tree`,
    language: `text`,
    code: `$ forge inspect infra -e dev1-us\n\nCurrent CloudFormation Template Tree:\n  Networking.yaml: 178a26f9b781\n  Root.yaml: 75c9be241ac4\n  Telemetry.yaml: 0ce33d7fae61\n\nDesired Template Tree:\n  Networking.yaml: 61ac7e128bd2\n  Root.yaml: 75c9be241ac4\n  Telemetry.yaml: dca14502bcd8`,
  },
  {
    label: `Body diff`,
    language: `diff`,
    code: `Template Body Differences\n\nTEMPLATE: Telemetry.yaml\n------------------------------------------------------------\n--- DEPLOYED/Telemetry.yaml\n+++ DESIRED/Telemetry.yaml\n@@ -18,7 +18,7 @@\n-  InstanceType: t3.small\n+  InstanceType: t3.medium`,
  },
  {
    label: `Lifecycle`,
    language: `shell`,
    code: `$ forge status infra -e dev1-us\nCommand = Infrastructure status\nEnvironment = dev1-us\n\nSTAGED      dev1-us-infrastructure\nCreated     2026-08-27T01:40:12Z\nChange Set  forge-dev1-us-20260827\n\n$ forge history infra\nRELEASED / DISCARDED / SUPERSEDED / FAILED`,
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="productPage productPageFeatures">
      <ProductPageHero
        icon="diff"
        eyebrow="Features / 02"
        title="Change Sets."
        accent="Forge Builds."
        description="Combine CloudFormation resource actions with nested template trees, body-level diffs, parameter provenance, dependencies, lifecycle state, and release readiness."
        metrics={[
          { value: `6`, label: `Core capability lanes` },
          { value: `4`, label: `Advanced previews` },
          { value: `2`, label: `Target-specific orchestrators` },
        ]}
        actions={(
          <>
            <Link className="productButton productButtonPrimary" href="/workflows">See the workflow<span aria-hidden="true">↗</span></Link>
            <Link className="productButton" href="/docs">Read the docs<span aria-hidden="true">→</span></Link>
          </>
        )}
      />

      <section className="productSection productFeatureCatalog">
        <div className="productSectionHeading">
          <span className="eyebrow">Core capability map</span>
          <SplitHeading text="Built around the<br /><em>release decision.</em>" />
          <p>These capabilities are present in the current source and form the product’s core marketing surface.</p>
        </div>
        <div className="productFeatureGrid productFeatureGridWide">
          {productConfig.coreCapabilities.map((capability, index) => (
            <ElementReveal as="article" className="productFeatureCard" delay={(index % 3) * 0.045} key={capability.index}>
              <div><span>{capability.index}</span><small>{capability.status}</small></div>
              <ForgeIcon name={capability.icon} />
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <span className="productFeatureDetail">{capability.detail}</span>
            </ElementReveal>
          ))}
        </div>
      </section>

      <section className="productSection productInspectionSection">
        <ElementReveal className="productRevealPanel"><CodeBlock title="The evidence behind the release" snippets={inspectSnippets} /></ElementReveal>
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Change intelligence</span>
          <SplitHeading text="File. Body.<br /><em>Resource. Cause.</em>" />
          <p>Forge hashes every template in the deployed and desired trees, emits unified body diffs, retains CloudFormation actions, and connects changed parameters to affected nested stacks.</p>
          <ElementReveal as="ul" className="productCheckList" delay={0.08}>
            <li><ForgeIcon name="diff" />Added, removed, and modified templates</li>
            <li><ForgeIcon name="parameter" />Old and new parameter values</li>
            <li><ForgeIcon name="workflow" />Nested-stack dependency outputs</li>
            <li><ForgeIcon name="release" />Add, modify, replace, and delete counts</li>
          </ElementReveal>
        </div>
      </section>

      <section className="productSection productPreviewSection">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Advanced tooling</span>
          <SplitHeading text="Useful now.<br /><em>Marked preview.</em>" />
          <p>These systems exist in the current engine but remain intentionally labeled preview while their policies and supported strategies expand.</p>
        </div>
        <div className="productPreviewGrid">
          {productConfig.previewCapabilities.map((capability, index) => (
            <ElementReveal as="article" delay={index * 0.045} key={capability.title}>
              <span><ForgeIcon name={capability.icon} />{capability.label}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </ElementReveal>
          ))}
        </div>
        <ElementReveal className="productTruthNote"><ForgeIcon name="shield" /><p><strong>Truthful by default.</strong> Promotion, provider-independent deployment, hosted API access, and automatic broad reconciliation are roadmap directions—not current product claims.</p></ElementReveal>
      </section>
    </div>
  );
}
