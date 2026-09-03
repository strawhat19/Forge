import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';
import Clock from '@/app/components/chrome/clock';
import ContactWidget from '../landing/contact-widget';
import TextReveal from '@/app/components/effects/text-reveal';
import GitHubLinks from '@/app/components/product/github-links';
import ElementReveal from '@/app/components/effects/element-reveal';
import FooterParallax from '@/app/components/chrome/footer-parallax';

type SiteFooterProps = {
  parallax?: boolean;
};

export default function SiteFooter({ parallax = false }: SiteFooterProps) {
  if (!parallax) {
    return (
      <footer className="siteFooter siteProductFooter">
        <div className="footerIdentity">
          <span className="footerBrand"><Image src={`/${siteConfig.logo}`} alt="" width={18} height={21} />Forge</span>
          <span className="footerNote">Cloud Forged Controlled Releases.</span>
        </div>
        <GitHubLinks compact className="footerRepositories" />
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        <div className="footerBottom"><Clock /><span>© {new Date().getFullYear()} Forge</span></div>
      </footer>
    );
  }

  return (
    <FooterParallax>
      <div className="footerSignal" aria-hidden="true">
        <span>CFN / Forge</span>
        <span>Release Control / 01</span>
      </div>
      <div className="footerContent">
        <ElementReveal className="footerContentReveal footerContentRevealLead" x={18} y={0} duration={0.72}>
          <div className="footerLead">
            <TextReveal as="span" className="eyebrow" text="The final release gate" />
            <h2 style={{ letterSpacing: `-2px`, }}>
              <TextReveal as="span" className="footerTitleLine footerTitleLineTop" text="Inspect. Stage." variant="hero" />
              <TextReveal as="span" className="footerTitleLine footerTitleAccent" text="Release." variant="hero" delay={0.08} />
            </h2>
          </div>
        </ElementReveal>
        <ElementReveal className="footerContentReveal footerContentRevealContact" x={-18} y={0} delay={0.1} duration={0.72}>
          <div className="footerContact">
            <ContactWidget />
          </div>
        </ElementReveal>
      </div>
      <div className="footerUtilityLayer">
        <ElementReveal className="footerIdentity" y={12}>
          <span className="footerBrand">
            <Image src={`/${siteConfig.logo}`} alt="" width={18} height={21} />Forge
          </span>
          <span className="footerNote">
            Cloud Forged Controlled Releases.
          </span>
        </ElementReveal>
        <ElementReveal className="footerRepositoryReveal" y={12} delay={0.08}>
          <GitHubLinks compact className="footerRepositories" />
        </ElementReveal>
        <ElementReveal as="a" className="footerEmail" href={`mailto:${siteConfig.contactEmail}`} y={12} delay={0.12}>
          {siteConfig.contactEmail}
        </ElementReveal>
        <ElementReveal className="footerBottom" y={12} delay={0.16}>
          <Clock /><span>© {new Date().getFullYear()} Forge</span>
        </ElementReveal>
      </div>
    </FooterParallax>
  );
}
