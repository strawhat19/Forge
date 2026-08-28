import Link from 'next/link';
import type { Metadata } from 'next';
import { productConfig } from '@/shared/config/product';
import CodeBlock from '@/app/components/product/code-block';
import ForgeIcon from '@/app/components/brand/forge-icon';
import GitHubLinks from '@/app/components/product/github-links';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Product`,
  description: `Meet Forge, the deployment intelligence and lifecycle layer for existing AWS CloudFormation infrastructure and pipeline definitions.`,
};

const overviewSnippets = [
  {
    label: `Stage`,
    language: `shell`,
    code: `$ forge stage infra -e dev1-us\nLoading template: infrastructure/root.yaml\nValidating parameters...\n✓ Parameter validation passed\n\nStage Summary\n------------------------------\nAdditions:       1\nModifications:   3\nReplacements:    0\nDeletions:       0\n\nChanges detected.\nStaged deployment is releaseable.`,
  },
  {
    label: `Inspect`,
    language: `shell`,
    code: `$ forge inspect infra -e dev1-us\n\nCurrent Stage\n==================================================\nEnvironment: dev1-us\nStatus: STAGED\n\nTemplate File Changes\n  ~ Telemetry.yaml\n  ~ Networking.yaml\n\nParameter Impact\nTelemetryAMI\n  Old: ami-AAA\n  New: ami-BBB\n  Affected Nested Stacks:\n    - BastionRMD\n    - TelemetryRMD`,
  },
  {
    label: `Release`,
    language: `shell`,
    code: `$ forge release infra -e dev1-us\n\nExecute Change Set for 'dev1-us-infrastructure'? (yes/no): yes\n\nExecuting deployment...\nDeployment completed successfully.\n\nStack Outputs\n--------------------------------------------------\nEnvironment = dev1-us\nStatus = RELEASED`,
  },
] as const;

export default function ProductPage() {
  return (
    <div className="productPage productPageOverview">
      <ProductPageHero
        icon="cloudformation"
        eyebrow="Product / 01"
        title="Cloud = What."
        accent="Forge = Why."
        description="Forge sits between the infrastructure definitions you already own and the CloudFormation execution engine—turning every potential deployment into a staged, explainable, operator-controlled artifact."
        metrics={[
          { value: `2`, label: `Deployment targets` },
          { value: `1`, label: `Operator grammar` },
          { value: `0.1.0`, label: `Current source version` },
        ]}
        actions={(
          <>
            <Link className="productButton productButtonPrimary" href="/download">Download Forge<span aria-hidden="true">↗</span></Link>
            <Link className="productButton" href="/features">Explore features<span aria-hidden="true">→</span></Link>
          </>
        )}
      />

      <section className="productSection productPositioningSection">
        <div className="productSectionHeading">
          <span className="eyebrow">A different layer</span>
          <SplitHeading text="Consume infrastructure.<br /><em>Do not reinvent it.</em>" />
          <p>Forge is not another authoring language. Keep CloudFormation YAML where it belongs and add an operational layer focused on understanding, staging, inspection, governance, and release.</p>
        </div>
        <ElementReveal className="productFlow" role="group" ariaLabel="Forge deployment flow">
          <div><ForgeIcon name="docs" /><span>Existing definitions</span><strong>CloudFormation YAML</strong></div>
          <span className="productFlowArrow" aria-hidden="true">→</span>
          <div className="productFlowForge"><ForgeIcon name="product" /><span>Deployment intelligence</span><strong>Forge lifecycle</strong></div>
          <span className="productFlowArrow" aria-hidden="true">→</span>
          <div><ForgeIcon name="cloudformation" /><span>Execution engine</span><strong>AWS CloudFormation</strong></div>
        </ElementReveal>
      </section>

      <section className="productSection productCapabilityPreview">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">The working core</span>
          <SplitHeading text="One release.<br /><em>Every reason visible.</em>" />
        </div>
        <div className="productFeatureGrid">
          {productConfig.coreCapabilities.slice(0, 4).map((capability, index) => (
            <ElementReveal as="article" className="productFeatureCard" delay={index * 0.045} key={capability.index}>
              <div><span>{capability.index}</span><small>{capability.status}</small></div>
              <ForgeIcon name={capability.icon} />
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <span className="productFeatureDetail">{capability.detail}</span>
            </ElementReveal>
          ))}
        </div>
        <Link className="productTextLink" href="/features">View the complete capability map<span aria-hidden="true">↗</span></Link>
      </section>

      <section className="productSection productCodeStory">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Designed for the terminal</span>
          <SplitHeading text="Stage the truth.<br /><em>Then decide.</em>" />
          <p>The CLI makes the release boundary explicit. Analysis and artifact creation happen before execution; release is a separate command with a separate confirmation.</p>
        </div>
        <ElementReveal className="productRevealPanel" delay={0.08}><CodeBlock title="A controlled infrastructure release" snippets={overviewSnippets} /></ElementReveal>
      </section>

      <section className="productSection productClosingPanel">
        <div><span className="eyebrow">Read both sides</span><SplitHeading text="Interface and engine.<br />Visible by design." /></div>
        <ElementReveal><GitHubLinks /></ElementReveal>
      </section>
    </div>
  );
}
