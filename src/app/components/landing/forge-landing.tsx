'use client';

import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';
import AnvilMark from '@/app/components/brand/anvil-mark';
import TextReveal from '@/app/components/effects/text-reveal';
import SplitHeading from '@/app/components/effects/split-heading';
import ElementReveal from '@/app/components/effects/element-reveal';
import ForgeAnvilOrbit from '@/app/components/brand/forge-anvil-orbit';
import HeroSplitTitle from '@/app/components/landing/hero-split-title';
import { scrollToElement } from '@/shared/scripts/functions/navigation/navigation';

export default function ForgeLanding() {
  return (
    <div className="forgeLanding">
      <section id="top" className="heroSection">
        <div className="heroNoise" aria-hidden="true" />
        <div className="heroCopy">
          <TextReveal as="span" className="eyebrow heroReveal" text="Cloud Deployment Intelligence" />
          <HeroSplitTitle />
          <TextReveal as="p" className="heroIntro heroReveal" text="Forge turns existing CloudFormation definitions into inspectable, explainable deployment artifacts before anything reaches release." delay={0.08} />
          <ElementReveal className="heroActions heroReveal" delay={0.14}>
            <button className="button buttonPrimary" onClick={() => scrollToElement(`#explore`)}>
              See what changes <span aria-hidden="true">↗</span>
            </button>
            <a className="headerAuthLink" href="#process">
              Explore the lifecycle <span aria-hidden="true">↓</span>
            </a>
          </ElementReveal>
        </div>

        <ElementReveal className="heroVisual heroReveal" role="img" ariaLabel="Forge brand mark" delay={0.04} scale={0.96}>
          <div className="heroOrbit heroOrbitOuter" aria-hidden="true" />
          <div className="heroOrbit heroOrbitInner" aria-hidden="true" />
          <span className="heroCoordinate heroCoordinateTop">AWS / CFN</span>
          <span className="heroCoordinate heroCoordinateBottom">BUILD / 001</span>
          <div className="heroLogoPlate">
            <Image
              priority
              width={356}
              height={433}
              src={`/${siteConfig.logo}`}
              className="heroLogoPlateMark"
              alt="Forge flame and gear logo"
              sizes="(max-width: 720px) 62vw, 340px"
            />
          </div>
          <div className="heroHeatLine" aria-hidden="true" />
        </ElementReveal>

        <ElementReveal className="heroMetrics heroReveal" role="group" ariaLabel="Forge principles" delay={0.18}>
          <div><strong>01</strong><span>Stage Artifacts</span></div>
          <div><strong>02</strong><span>Nested Templates</span></div>
          <div><strong>03</strong><span>Release History</span></div>
        </ElementReveal>
      </section>

      <section id="explore" className="section exploreSection">
        <div className="sectionHeading">
          <TextReveal as="span" className="eyebrow" text="Deployment intelligence" />
          <SplitHeading text="From source tree<br />to certain release." />
          <TextReveal as="p" text="See what changes, why it changes, and how it propagates before CloudFormation executes the plan." delay={0.05} />
        </div>

        <div className="capabilityList">
          {siteConfig.capabilities.map((capability, index) => (
            <ElementReveal as="article" key={capability.index} className="capabilityCard" delay={index * 0.05}>
              <span className="capabilityIndex">{capability.index}</span>
              <div>
                <TextReveal as="h3" text={capability.title} delay={0.04} />
                <p>{capability.description}</p>
              </div>
              <ul aria-label={`${capability.title} services`}>
                {capability.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </ElementReveal>
          ))}
        </div>
      </section>

      <section id="process" className="section processSection">
        <div className="processLead">
          <TextReveal as="span" className="eyebrow" text="The lifecycle" />
          <SplitHeading text="Stage. Inspect.<br /><em>Release.</em>" />
          <AnvilMark className="processAnvil" />
        </div>

        <ol className="processList">
          {siteConfig.process.map((step, index) => (
            <ElementReveal as="li" key={step.phase} delay={index * 0.06}>
              <span>0{index + 1}</span>
              <TextReveal as="h3" text={step.phase} delay={0.04} />
              <p>{step.detail}</p>
            </ElementReveal>
          ))}
        </ol>
      </section>

      <section id="studio" className="section studioSection">
        <div className="studioCard">
          <span className="eyebrow">The release layer</span>
          <TextReveal
            as="p"
            className="forgeDisplayHeading studioStatement"
            text="Built for teams that already trust CloudFormation—and need to trust every release around it."
          />
          <div className="studioMeta">
            <span>Infrastructure / Pipelines / History</span>
            <span>Python 3.12+ / AWS</span>
          </div>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <div className={`landingCtaContent ctaContent`}>
          <div className={`landingCtaStart`}>
            <TextReveal as="span" className="eyebrow" text="Bring control to release" />
            <SplitHeading text="Know the change.<br />Then <em>ship.</em>" />
            <ElementReveal as="a" className="contactLink" href={`mailto:${siteConfig.contactEmail}`} delay={0.06}>
              {siteConfig.contactEmail}<span aria-hidden="true">↗</span>
            </ElementReveal>
          </div>
          <div className={`landingCtaEnd`}>
            <ForgeAnvilOrbit className="landingCtaAnvilOrbit" />
          </div>
        </div>
      </section>
    </div>
  );
}
