import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <a className="siteBrand" href="#top" aria-label="Forge home">
        <span className="siteBrandMark">
          <Image src={`/${siteConfig.logo}`} alt="Forge logo" width={28} height={32} priority />
        </span>
        <span>Forge</span>
      </a>

      <nav className="siteNav" aria-label="Primary navigation">
        {siteConfig.navigation.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>

      <a className="headerCta" href="#contact">
        Start a build
        <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
