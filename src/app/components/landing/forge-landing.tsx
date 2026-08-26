import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';
import AnvilMark from '@/app/components/brand/anvil-mark';

export default function ForgeLanding() {
  return (
    <div className="forgeLanding">
      <section id="top" className="heroSection">
        <div className="heroNoise" aria-hidden="true" />
        <div className="heroCopy">
          <span className="eyebrow heroReveal">Independent digital foundry</span>
          <h1 className="heroTitle heroReveal">
            Ideas enter.
            <span>Products emerge.</span>
          </h1>
          <p className="heroIntro heroReveal">
            We shape bold ideas into precise digital products—strategy, design,
            engineering, and intelligent systems under one roof.
          </p>
          <div className="heroActions heroReveal">
            <a className="button buttonPrimary" href="#contact">Bring us a challenge <span aria-hidden="true">↗</span></a>
            <a className="textLink" href="#expertise">Explore the forge <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="heroVisual heroReveal" aria-label="Forge brand mark">
          <div className="heroOrbit heroOrbitOuter" aria-hidden="true" />
          <div className="heroOrbit heroOrbitInner" aria-hidden="true" />
          <span className="heroCoordinate heroCoordinateTop">40.7128° N</span>
          <span className="heroCoordinate heroCoordinateBottom">BUILT / 001</span>
          <div className="heroLogoPlate">
            <Image
              priority
              width={356}
              height={433}
              src={`/${siteConfig.logo}`}
              className={`heroLogoPlateMark`}
              alt="Forge flame and gear logo"
              sizes="(max-width: 720px) 62vw, 340px"
            />
          </div>
          <div className="heroHeatLine" aria-hidden="true" />
        </div>

        <div className="heroMetrics heroReveal" aria-label="Forge principles">
          <div><strong>03</strong><span>Disciplines aligned</span></div>
          <div><strong>01</strong><span>Relentless standard</span></div>
          <div><strong>∞</strong><span>Built to evolve</span></div>
        </div>
      </section>

      <section id="expertise" className="section expertiseSection">
        <div className="sectionHeading">
          <span className="eyebrow">What we forge</span>
          <h2>From first spark<br />to lasting system.</h2>
          <p>Small senior teams. Close collaboration. No handoff gaps between the thinking and the making.</p>
        </div>

        <div className="capabilityList">
          {siteConfig.capabilities.map((capability) => (
            <article key={capability.index} className="capabilityCard">
              <span className="capabilityIndex">{capability.index}</span>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
              <ul aria-label={`${capability.title} services`}>
                {capability.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="section processSection">
        <div className="processLead">
          <span className="eyebrow">The method</span>
          <h2>Made under<br /><em>pressure.</em></h2>
          <AnvilMark className="processAnvil" />
        </div>

        <ol className="processList">
          {siteConfig.process.map((step, index) => (
            <li key={step.phase}>
              <span>0{index + 1}</span>
              <h3>{step.phase}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="studio" className="section studioSection">
        <div className="studioCard">
          <span className="eyebrow">The studio</span>
          <p className="studioStatement">
            Built for people with something worth making—and the appetite to make it unmistakable.
          </p>
          <div className="studioMeta">
            <span>Strategy / Design / Engineering</span>
            <span>Available worldwide</span>
          </div>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <span className="eyebrow">Your move</span>
        <h2>Let&apos;s make<br />something <em>hold.</em></h2>
        <a className="contactLink" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
