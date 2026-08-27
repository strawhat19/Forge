import Link from 'next/link';
import type { Metadata } from 'next';
import { productConfig } from '@/shared/config/product';
import CodeBlock from '@/app/components/product/code-block';
import ForgeIcon from '@/app/components/brand/forge-icon';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ProductPageHero from '@/app/components/product/product-page-hero';

export const metadata: Metadata = {
  title: `Documentation`,
  description: `Install cfn-forge from source, understand its project topology, and learn the current CLI command surface.`,
};

const installSnippets = [
  {
    label: `macOS / Linux`,
    language: `shell`,
    code: `$ git clone https://github.com/MJ66GA-Projects/cfn-forge.git\n$ cd cfn-forge\n$ python3 -m venv .venv\n$ source .venv/bin/activate\n$ pip install -r requirements.txt\n$ pip install -e .\n$ forge -h`,
  },
  {
    label: `Windows`,
    language: `powershell`,
    code: `> git clone https://github.com/MJ66GA-Projects/cfn-forge.git\n> cd cfn-forge\n> py -3.12 -m venv .venv\n> .\\.venv\\Scripts\\Activate.ps1\n> pip install -r requirements.txt\n> pip install -e .\n> forge -h`,
  },
] as const;

const commandSnippets = [
  {
    label: `Lifecycle`,
    language: `text`,
    code: `stage      Analyze desired state and save a releaseable stage\ninspect    Examine the exact staged deployment\nstatus     Show current lifecycle status\nrelease    Execute the staged CloudFormation Change Set\ndiscard    Delete and abandon the current stage\nrestage    Recreate a stage from current or historical context`,
  },
  {
    label: `Records`,
    language: `text`,
    code: `list       Show currently staged deployments\nhistory    Show historical stage artifacts\ncleanup    Remove eligible old Change Sets and history`,
  },
  {
    label: `Preview`,
    language: `text`,
    code: `drift      Classify nested expected and actionable drift\nreconcile  Plan policy-classified drift correction\nrefactor   Analyze infrastructure template maintainability\nteardown   Plan and confirm stack deletion`,
  },
] as const;

export default function DocsPage() {
  return (
    <div className="productPage productPageDocs">
      <ProductPageHero
        icon="docs"
        eyebrow="Developers / 04"
        title="Install from source."
        accent="Understand every step."
        description="cfn-forge is currently a Python 3.12+ developer preview distributed through its public GitHub repository with a requirements file and an editable package entry point."
        metrics={[
          { value: productConfig.runtime, label: `Runtime` },
          { value: productConfig.version, label: `Package version` },
          { value: `2`, label: `Targets: infra / pipeline` },
        ]}
        actions={(
          <>
            <a className="productButton productButtonPrimary" href="https://github.com/MJ66GA-Projects/cfn-forge" target="_blank" rel="noreferrer">Server<span aria-hidden="true">↗</span></a>
            <Link className="productButton" href="/api/cli">CLI manifest<span aria-hidden="true">→</span></Link>
          </>
        )}
      />

      <section className="productSection productDocsInstall">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Installation</span>
          <SplitHeading text="Six commands.<br /><em>A visible toolchain.</em>" />
          <p>Install the declared requirements before the editable package. The current pyproject exposes the <code>forge</code> command but does not yet declare runtime dependencies itself.</p>
          <ElementReveal className="productTruthNote"><ForgeIcon name="shield" /><p><strong>Current distribution.</strong> There is no packaged binary, PyPI release, license gate, or hosted installer in the repository today.</p></ElementReveal>
        </div>
        <ElementReveal className="productRevealPanel"><CodeBlock title="Install cfn-forge" snippets={installSnippets} /></ElementReveal>
      </section>

      <section className="productSection productDocsTopology">
        <div className="productSectionHeading">
          <span className="eyebrow">Project topology</span>
          <SplitHeading text="Configuration stays<br /><em>with the project.</em>" />
          <p>A project-owned <code>deployment.yaml</code> maps environment names into external infrastructure and pipeline deployment configs. Forge remains the engine, not the owner of your environment definitions.</p>
        </div>
        <div className="productTopologyMap">
          <ElementReveal><ForgeIcon name="product" /><strong>cfn-forge</strong><span>Deployment engine</span></ElementReveal>
          <i>reads</i>
          <ElementReveal delay={0.04}><ForgeIcon name="docs" /><strong>deployment.yaml</strong><span>Environment topology</span></ElementReveal>
          <i>resolves</i>
          <ElementReveal delay={0.08}><ForgeIcon name="cloudformation" /><strong>deployment-configs/</strong><span>Infra + pipeline config</span></ElementReveal>
          <i>writes</i>
          <ElementReveal delay={0.12}><ForgeIcon name="history" /><strong>.forge/</strong><span>Stages + history</span></ElementReveal>
        </div>
      </section>

      <section className="productSection productDocsCommands">
        <ElementReveal className="productRevealPanel"><CodeBlock title="Current command surface" snippets={commandSnippets} showLineNumbers={false} copyable={false} /></ElementReveal>
        <div className="productCommandGroups">
          {productConfig.commandGroups.map((group, index) => (
            <ElementReveal as="article" delay={(index % 2) * 0.05} key={group.label}><span>{group.label}</span>{group.commands.map((command) => <code key={command}>{command}</code>)}</ElementReveal>
          ))}
        </div>
      </section>

      <section className="productSection productDocsNext">
        <div><span className="eyebrow">First release path</span><SplitHeading text="Stage first.<br />Release separately." /></div>
        <ol>
          <ElementReveal as="li"><span>01</span><p>Configure an environment and AWS profile in the consuming deployment project.</p></ElementReveal>
          <ElementReveal as="li" delay={0.04}><span>02</span><p>Run <code>forge stage infra -e ENV</code> to validate, compare, and create the stage.</p></ElementReveal>
          <ElementReveal as="li" delay={0.08}><span>03</span><p>Run <code>forge inspect infra -e ENV</code> and review every artifact lane.</p></ElementReveal>
          <ElementReveal as="li" delay={0.12}><span>04</span><p>Run <code>forge release infra -e ENV</code> only when the staged identity is correct.</p></ElementReveal>
        </ol>
      </section>
    </div>
  );
}
