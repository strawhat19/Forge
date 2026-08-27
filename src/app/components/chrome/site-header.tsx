'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/shared/config/site';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 981px)');

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    desktopQuery.addEventListener('change', closeOnDesktop);
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      desktopQuery.removeEventListener('change', closeOnDesktop);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`siteHeader${menuOpen ? ' mobileMenuOpen' : ''}`}>
      <Link className="siteBrand" href={`/`} aria-label="Forge home" onClick={closeMenu}>
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

        <button
          className="mobileMenuToggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="mobileMenuIcon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <nav
        id="mobile-primary-navigation"
        className="mobileNav"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobileNavLinks">
          {siteConfig.navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href.startsWith('#') ? `/${item.href}` : item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mobileNavActions">
          <Link href="/sign-in" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>
            Sign in
          </Link>
          <Link
            className="mobileNavSignUp"
            href="/sign-up"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            Sign up
          </Link>
          <Link
            className="mobileNavCta"
            href="/#contact"
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            Start a build
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
