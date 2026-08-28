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
  title: `Download`,
  description: `Download the current cfn-forge source version from GitHub and install the Python 3.12+ CLI in an isolated environment.`,
};

const downloadSnippets = [
  {
    label: `Clone + install`,
    language: `shell`,
    code: `$ git clone https://github.com/MJ66GA-Projects/cfn-forge.git\n$ cd cfn-forge\n$ python3 -m venv .venv\n$ source .venv/bin/activate\n$ pip install -r requirements.txt\n$ pip install -e .`,
  },
  {
    label: `First stage`,
    language: `shell`,
    code: `$ forge -h\n$ forge stage infra -e dev1-us\n$ forge inspect infra -e dev1-us`,
  },
] as const;

export default function DownloadPage() {
  return (
    <div className="productPage productPageDownload">
      <ProductPageHero
        icon="download"
        eyebrow="Download / 05"
        title="Pull From Source."
        accent="Release Visibility."
        description="The current cfn-forge developer preview is available directly from GitHub. Clone the server repository, install its declared requirements, and expose the local forge command in a Python virtual environment."
        metrics={[
          { value: `v${productConfig.version}`, label: `Current package` },
          { value: productConfig.runtime, label: `Required runtime` },
          { value: `Source`, label: `Distribution format` },
        ]}
        actions={(
          <>
            <a className="productButton productButtonPrimary" href="https://github.com/MJ66GA-Projects/cfn-forge" target="_blank" rel="noreferrer">Get cfn-forge<span aria-hidden="true">↗</span></a>
            <Link className="productButton" href="/docs">Installation guide<span aria-hidden="true">→</span></Link>
          </>
        )}
      />

      <section className="productSection productDownloadRelease">
        <ElementReveal className="productReleaseCard">
          <div><span className="eyebrow">Current version</span><strong>0.1.0</strong><small>Developer Preview</small></div>
          <dl>
            <div><dt>Runtime</dt><dd>Python 3.12+</dd></div>
            <div><dt>Delivery</dt><dd>Git source</dd></div>
            <div><dt>Targets</dt><dd>Infrastructure / Pipeline</dd></div>
            <div><dt>Provider</dt><dd>AWS CloudFormation</dd></div>
          </dl>
          <a href="https://github.com/MJ66GA-Projects/cfn-forge" target="_blank" rel="noreferrer"><ForgeIcon name="github" />Open server repository<span aria-hidden="true">↗</span></a>
        </ElementReveal>
        <ElementReveal className="productRevealPanel"><CodeBlock title="Source installation" snippets={downloadSnippets} /></ElementReveal>
      </section>

      <section className="productSection productPrerequisites">
        <div className="productSectionHeading productSectionHeadingCompact">
          <span className="eyebrow">Before you install</span>
          <SplitHeading text="A small runtime.<br /><em>A serious boundary.</em>" />
        </div>
        <div className="productPrerequisiteGrid">
          <ElementReveal as="article"><ForgeIcon name="terminal" /><span>01</span><h3>Python 3.12+</h3><p>Create an isolated virtual environment for the CLI and its declared requirements.</p></ElementReveal>
          <ElementReveal as="article" delay={0.04}><ForgeIcon name="cloud" /><span>02</span><h3>AWS credentials</h3><p>Use the configured profile for each environment or override it explicitly with <code>--profile</code>.</p></ElementReveal>
          <ElementReveal as="article" delay={0.08}><ForgeIcon name="docs" /><span>03</span><h3>Project topology</h3><p>Run Forge from a deployment project that owns <code>deployment.yaml</code> and its environment configs.</p></ElementReveal>
          <ElementReveal as="article" delay={0.12}><ForgeIcon name="shield" /><span>04</span><h3>Operator review</h3><p>Treat preview capabilities as review tools and inspect every Change Set before release.</p></ElementReveal>
        </div>
      </section>

      <section className="productSection productDownloadRepositories">
        <div><span className="eyebrow">Two repositories</span><SplitHeading text="The product surface<br />and the engine." /><p>The client markets and documents Forge. The server contains the CloudFormation orchestration CLI.</p></div>
        <ElementReveal><GitHubLinks /></ElementReveal>
      </section>
    </div>
  );
}
