import { siteConfig } from '@/shared/config/site';

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <span className="footerBrand">Forge</span>
        <span className="footerNote">Digital products, shaped with intent.</span>
      </div>
      <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}
