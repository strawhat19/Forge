import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';
import Clock from '@/app/components/chrome/clock';
import GitHubLinks from '@/app/components/product/github-links';

export default function SiteFooter() {
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
