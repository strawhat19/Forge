import Link from 'next/link';
import type { Metadata } from 'next';
import { productConfig } from '@/shared/config/product';
import CodeBlock from '@/app/components/product/code-block';
import ForgeIcon from '@/app/components/brand/forge-icon';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Workflows`,
  description: `Follow the Forge stage, inspect, release, history, discard, restage, and cleanup lifecycle for infrastructure and pipeline stacks.`,
};

const workflowSnippets = [
  {
    label: `Infrastructure`,
    language: `shell`,
    code: `$ forge stage infra -e dev1-us\n$ forge inspect infra -e dev1-us\n$ forge status infra -e dev1-us\n$ forge release infra -e dev1-us\n$ forge history infra`,
  },
  {
    label: `Pipeline`,
    language: `shell`,
    code: `$ forge stage pipeline -e dev1-us\n$ forge inspect pipeline -e dev1-us\n$ forge status pipeline -e dev1-us\n$ forge release pipeline -e dev1-us\n$ forge history pipeline`,
  },
  {
    label: `Recovery`,
    language: `shell`,
    code: `$ forge discard infra -e dev1-us\n$ forge restage infra -e dev1-us\n$ forge cleanup infra -e dev1-us\n\n# Global inventory\n$ forge list infra\n$ forge history infra`,
  },
] as const;

export default function WorkflowsPage() {
  return (
    <div className="productPage productPageWorkflows">
      <ProductPageHero
        icon="workflow"
        eyebrow="Workflows / 03"
        title="Deploy Cycle."
        accent="CLI Commands."
        description="Forge separates analysis from execution, gives every stage an identity, and preserves the release outcome so operators can inspect the exact artifact they are approving."
        metrics={[
          { value: `STAGED`, label: `Before execution` },
          { value: `RELEASING`, label: `During execution` },
          { value: `RELEASED`, label: `Recorded outcome` },
        ]}
        actions={(
          <>
            <Link className="productButton productButtonPrimary" href="/docs">Run the quickstart<span aria-hidden="true">↗</span></Link>
            <Link className="productButton" href="/download">Get the source<span aria-hidden="true">→</span></Link>
          </>
        )}
      />

      <section className="productSection productLifecycleSection">
        <div className="productSectionHeading">
          <span className="eyebrow">The controlled path</span>
          <SplitHeading text="Four moments.<br /><em>One artifact.</em>" />
          <p>Each command advances or interrogates a durable stage instead of hiding the deployment decision inside one operation.</p>
        </div>
        <ol className="productLifecycleRail">
          {productConfig.lifecycle.map((step, index) => (
            <ElementReveal as="li" delay={index * 0.05} key={step.index}>
              <div><span>{step.index}</span><ForgeIcon name={step.icon} /></div>
              <strong>{step.title}</strong>
              <code>{step.command}</code>
              <p>{step.description}</p>
            </ElementReveal>
          ))}
        </ol>
      </section>

      <section className="productSection productTargetsSection">
        <ElementReveal className="productTargetCard productTargetCardInfra" x={-18}>
          <span className="eyebrow">Target / Infra</span>
          <ForgeIcon name="cloudformation" />
          <h2>Infrastructure</h2>
          <p>Stage and release nested application infrastructure with template-tree, body-diff, parameter-impact, and dependency context.</p>
          <code>forge stage infra -e dev1-us</code>
        </ElementReveal>
        <ElementReveal className="productTargetCard productTargetCardPipeline" x={18} delay={0.05}>
          <span className="eyebrow">Target / Pipeline</span>
          <ForgeIcon name="pipeline" />
          <h2>Pipelines</h2>
          <p>Apply the same lifecycle grammar to pipeline CloudFormation stacks while retaining their separate region, profile, configuration, and stage directories.</p>
          <code>forge stage pipeline -e dev1-us</code>
        </ElementReveal>
      </section>

      <section className="productSection productWorkflowTerminal">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Consistent operator grammar</span>
          <SplitHeading text="Change the target.<br /><em>Keep the verbs.</em>" />
          <p>Infrastructure and pipeline implementations stay separate under the hood while the human interface stays familiar.</p>
        </div>
        <ElementReveal className="productRevealPanel"><CodeBlock title="Lifecycle command sets" snippets={workflowSnippets} /></ElementReveal>
      </section>

      <section className="productSection productStateSection">
        <ElementReveal className="productStateMap" role="group" ariaLabel="Forge lifecycle states">
          <span>STAGED</span><i>→</i><span>RELEASING</span><i>→</i><span>RELEASED</span>
          <div><span>DISCARDED</span><span>SUPERSEDED</span><span>FAILED</span></div>
        </ElementReveal>
        <div><span className="eyebrow">Every exit matters</span><SplitHeading text="Success is not the only history worth keeping." /><p>Discarded, superseded, and failed stages remain part of the operator record and can inform cleanup or restage decisions.</p></div>
      </section>
    </div>
  );
}
