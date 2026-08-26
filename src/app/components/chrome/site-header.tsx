import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <Link className="siteBrand" href={`/`} aria-label="Forge home">
        <span className="siteBrandMark">
          <Image src={`/${siteConfig.logo}`} alt="Forge logo" width={28} height={32} priority />
        </span>
        <span>Forge</span>
      </Link>

      <nav className="siteNav" aria-label="Primary navigation">
        {siteConfig.navigation.map((item) => (
          <Link key={item.href} href={item.href.startsWith('#') ? `/${item.href}` : item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="headerActions">
        <Link className="headerAuthLink" href="/sign-in">
          Sign in
        </Link>
        <Link className="headerAuthLink headerAuthLinkSignUp" href="/sign-up">
          Sign up
        </Link>
        <Link className="headerCta" href="/#contact">
          Start a build
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
