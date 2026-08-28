'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/shared/config/site';
import ForgeIcon from '@/app/components/brand/forge-icon';
import TopMarquee from '@/app/components/chrome/top-marquee';
import GitHubLinks from '@/app/components/product/github-links';
import AccountMenu from '@/app/components/chrome/account-menu';
import NotificationCenter from '@/app/components/chrome/notification-center';
import { useGlobalContext } from '@/shared/global-context';
import { forgeLoaderStartEvent } from '@/app/components/loaders/forge-loader/forge-loader-events';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react';
import {
  forgeGaussianBlurDismissEvent,
  hideGaussianBlurOverlay,
  showGaussianBlurOverlay,
} from '@/app/components/effects/gaussian-blur-overlay-events';

type SiteHeaderProps = {
  sticky?: boolean;
};

export default function SiteHeader({ sticky = false }: SiteHeaderProps) {
  const { user, onSignOut } = useGlobalContext();
  const userId = user?.id ?? null;
  const scrolledRef = useRef(false);
  const mobileMenuToggleRef = useRef<HTMLButtonElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAccountUserId, setOpenAccountUserId] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const accountOpen = userId !== null && openAccountUserId === userId;
  const headerSurfaceOpen = menuOpen || Boolean(activeMegaMenu) || notificationsOpen || accountOpen;
  const headerGlassFilter = isScrolled || headerSurfaceOpen ? `blur(22px) saturate(130%)` : `blur(0) saturate(100%)`;
  const headerGlassStyle = {
    backdropFilter: headerGlassFilter,
    WebkitBackdropFilter: headerGlassFilter,
    transition: `background-color 360ms ease, backdrop-filter 420ms cubic-bezier(0.2, 0.85, 0.25, 1), -webkit-backdrop-filter 420ms cubic-bezier(0.2, 0.85, 0.25, 1)`,
  } as CSSProperties;

  const closeNavigation = useCallback(() => {
    setMenuOpen(false);
    setActiveMegaMenu(null);
    setActiveMobileSection(null);
  }, []);

  const closeHeaderSurfaces = useCallback(() => {
    closeNavigation();
    setOpenAccountUserId(null);
    setNotificationsOpen(false);
  }, [closeNavigation]);

  const signOutUser = () => {
    onSignOut();
    closeHeaderSurfaces();
  };

  const changeNotifications = useCallback((open: boolean) => {
    if (open) closeNavigation();
    setOpenAccountUserId(null);
    setNotificationsOpen(open);
  }, [closeNavigation]);

  const changeAccountMenu = useCallback((open: boolean) => {
    if (open) closeNavigation();
    setNotificationsOpen(false);
    setOpenAccountUserId(open ? userId : null);
  }, [closeNavigation, userId]);

  const changeMegaMenu = (menuId: string | null) => {
    setMenuOpen(false);
    setOpenAccountUserId(null);
    setNotificationsOpen(false);
    setActiveMobileSection(null);
    setActiveMegaMenu(menuId);
  };

  const toggleMobileMenu = () => {
    const nextOpen = !menuOpen;
    setActiveMegaMenu(null);
    setOpenAccountUserId(null);
    setNotificationsOpen(false);
    setMenuOpen(nextOpen);
    if (!nextOpen) setActiveMobileSection(null);
  };

  useEffect(() => {
    const desktopQuery = window.matchMedia(`(min-width: 981px)`);

    const syncBreakpoint = () => closeHeaderSurfaces();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;

      const activeElement = document.activeElement;
      const activeMegaMenu = activeElement?.closest(`.megaMenu`);
      const activeMobileNavigation = activeElement?.closest(`#mobile-primary-navigation`);

      if (activeMegaMenu) activeMegaMenu.closest(`.siteNavGroup`)?.querySelector<HTMLButtonElement>(`.siteNavTrigger`)?.focus();
      else if (activeMobileNavigation) mobileMenuToggleRef.current?.focus();

      closeHeaderSurfaces();
    };

    desktopQuery.addEventListener(`change`, syncBreakpoint);
    window.addEventListener(`keydown`, closeOnEscape);
    window.addEventListener(forgeLoaderStartEvent, closeHeaderSurfaces);
    window.addEventListener(forgeGaussianBlurDismissEvent, closeHeaderSurfaces);

    return () => {
      desktopQuery.removeEventListener(`change`, syncBreakpoint);
      window.removeEventListener(`keydown`, closeOnEscape);
      window.removeEventListener(forgeLoaderStartEvent, closeHeaderSurfaces);
      window.removeEventListener(forgeGaussianBlurDismissEvent, closeHeaderSurfaces);
    };
  }, [closeHeaderSurfaces]);

  useEffect(() => {
    const overlayOpen = menuOpen || Boolean(activeMegaMenu) || notificationsOpen || accountOpen;
    if (overlayOpen) showGaussianBlurOverlay(`site-header`, menuOpen || notificationsOpen || accountOpen ? 18 : 12);
    else hideGaussianBlurOverlay(`site-header`);
  }, [accountOpen, activeMegaMenu, menuOpen, notificationsOpen]);

  useEffect(() => () => hideGaussianBlurOverlay(`site-header`), []);

  useEffect(() => {
    let frame = 0;

    const syncScrolledState = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 8;
      if (nextScrolled === scrolledRef.current) return;
      scrolledRef.current = nextScrolled;
      setIsScrolled(nextScrolled);
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncScrolledState);
    };

    syncScrolledState();
    window.addEventListener(`scroll`, requestSync, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener(`scroll`, requestSync);
    };
  }, []);

  const handleNavigationBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    setActiveMegaMenu(null);
  };

  return (
    <header className={`siteHeader siteHeaderProduct${sticky ? ` siteHeaderSticky` : ``}${isScrolled ? ` siteHeaderScrolled` : ``}${headerSurfaceOpen ? ` siteHeaderSurfaceOpen` : ``}${menuOpen ? ` mobileMenuOpen` : ``}`}>
      <TopMarquee sticky={sticky} style={headerGlassStyle} />

      <div className="siteHeaderNav" style={headerGlassStyle}>
        <Link className="siteBrand" href="/" aria-label="Forge home" onClick={closeNavigation}>
          <span className="siteBrandMark"><Image src={`/${siteConfig.logo}`} alt="Forge logo" width={28} height={32} priority /></span>
          <span>Forge</span>
        </Link>

        <nav className="siteNav siteProductNav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => item.children?.length ? (
            <div className="siteNavGroup" key={item.id} onBlur={handleNavigationBlur} onMouseEnter={() => changeMegaMenu(item.id)}>
              <div className="siteNavGroupControl">
                <Link className="siteNavGroupLink" href={item.href} onFocus={() => changeMegaMenu(item.id)} onClick={closeNavigation}>
                  <ForgeIcon name={item.icon} />
                  {item.label}
                </Link>
                <button
                  type="button"
                  className="siteNavTrigger"
                  aria-controls={`mega-menu-${item.id}`}
                  aria-expanded={activeMegaMenu === item.id}
                  aria-label={`${activeMegaMenu === item.id ? `Close` : `Open`} ${item.label} menu`}
                  onFocus={() => changeMegaMenu(item.id)}
                  onClick={() => changeMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                >
                  <span className="siteNavChevron" aria-hidden="true" />
                </button>
              </div>

              <div
                id={`mega-menu-${item.id}`}
                className={`megaMenu${activeMegaMenu === item.id ? ` megaMenuOpen` : ``}`}
                aria-hidden={activeMegaMenu !== item.id}
                inert={activeMegaMenu !== item.id}
                onMouseLeave={(event) => {
                  if (event.currentTarget.contains(document.activeElement)) return;
                  setActiveMegaMenu(null);
                }}
              >
                <div className="megaMenuLead">
                  <span className="eyebrow">{item.label}</span>
                  <h2>{item.description}</h2>
                  <Link href={item.href} tabIndex={activeMegaMenu === item.id ? 0 : -1} onClick={closeNavigation}>
                    View {item.label.toLowerCase()}<span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="megaMenuItems">
                  {item.children.map((child, index) => {
                    const content = (
                      <>
                        <span className="megaMenuItemIcon"><ForgeIcon name={child.icon} /></span>
                        <span className="megaMenuItemCopy"><strong>{child.label}{child.badge ? <small>{child.badge}</small> : null}</strong><span>{child.description}</span></span>
                        <span className="megaMenuItemIndex">0{index + 1}</span>
                      </>
                    );

                    return child.external ? (
                      <a key={child.href} href={child.href} target="_blank" rel="noreferrer" tabIndex={activeMegaMenu === item.id ? 0 : -1} onClick={closeNavigation}>{content}</a>
                    ) : (
                      <Link key={child.href} href={child.href} tabIndex={activeMegaMenu === item.id ? 0 : -1} onClick={closeNavigation}>{content}</Link>
                    );
                  })}
                </div>

                <div className="megaMenuFooter">
                  <span>
                    <Link href={`https://piratechs.com`} target={`_blank`}>
                      Site Design // Piratechs
                    </Link>
                  </span>
                  <GitHubLinks compact />
                </div>
              </div>
            </div>
          ) : (
            <Link className="siteNavDirect" key={item.id} href={item.href} onClick={closeNavigation}><ForgeIcon name={item.icon} />{item.label}</Link>
          ))}
        </nav>

        <div className="headerActions">
          {user ? (
            <AccountMenu open={accountOpen} onOpenChange={changeAccountMenu} onSignOut={signOutUser} />
          ) : (
            <>
              <Link className="headerAuthLink hideOnSmallMegaMenu" href="/sign-in"><ForgeIcon name="sign-in" />
                Sign in
              </Link>
              <Link className="headerAuthLink headerAuthLinkSignUp" href="/sign-up"><ForgeIcon name="sign-up" />
                Register
              </Link>
            </>
          )}
          <Link className="headerCta hideOnSmallMegaMenu" href="/download">
            <span className="headerCtaLabel">Download</span><span className="headerCtaIcon" aria-hidden="true"><ForgeIcon name="download" /></span>
          </Link>
          <NotificationCenter open={notificationsOpen} onOpenChange={changeNotifications} />
          <button
            type="button"
            ref={mobileMenuToggleRef}
            className="mobileMenuToggle"
            aria-controls="mobile-primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? `Close navigation menu` : `Open navigation menu`}
            onClick={toggleMobileMenu}
          >
            <span className="mobileMenuIcon" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </div>

      <nav id="mobile-primary-navigation" className="mobileNav mobileProductNav" aria-label="Mobile navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobileProductNavItems">
          {siteConfig.navigation.map((item, index) => {
            const expanded = activeMobileSection === item.id;
            const itemStyle = { [`--nav-delay` as string]: `${80 + index * 45}ms` } as CSSProperties;

            return item.children?.length ? (
              <div className={`mobileProductNavGroup${expanded ? ` expanded` : ``}`} key={item.id} style={itemStyle}>
                <button
                  type="button"
                  tabIndex={menuOpen ? 0 : -1}
                  aria-expanded={expanded}
                  aria-controls={`mobile-nav-${item.id}`}
                  onClick={() => setActiveMobileSection((active) => active === item.id ? null : item.id)}
                >
                  <span className="mobileProductNavIndex">{String(index + 1).padStart(2, `0`)}</span>
                  <span className="mobileProductNavLabel"><ForgeIcon name={item.icon} />{item.label}</span>
                  <span className="mobileProductNavChevron" aria-hidden="true">+</span>
                </button>
                <div id={`mobile-nav-${item.id}`} className="mobileProductSubnav" aria-hidden={!expanded} inert={!expanded}>
                  <Link href={item.href} tabIndex={menuOpen && expanded ? 0 : -1} onClick={closeNavigation}><ForgeIcon name={item.icon} />Overview</Link>
                  {item.children.map((child) => child.external ? (
                    <a key={child.href} href={child.href} target="_blank" rel="noreferrer" tabIndex={menuOpen && expanded ? 0 : -1} onClick={closeNavigation}><ForgeIcon name={child.icon} />{child.label}</a>
                  ) : (
                    <Link key={child.href} href={child.href} tabIndex={menuOpen && expanded ? 0 : -1} onClick={closeNavigation}><ForgeIcon name={child.icon} />{child.label}</Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link className="mobileProductNavDirect" key={item.id} href={item.href} tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation} style={itemStyle}>
                <span className="mobileProductNavIndex">{String(index + 1).padStart(2, `0`)}</span>
                <span className="mobileProductNavLabel"><ForgeIcon name={item.icon} />{item.label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </div>

        <div className="mobileNavActions">
          {user ? (
            <>
              <Link href="/profile" tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation}><ForgeIcon name="profile" />Profile</Link>
              <Link className="mobileNavSignUp" href="/dashboard" tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation}><ForgeIcon name="dashboard" />Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation}><ForgeIcon name="sign-in" />Sign in</Link>
              <Link className="mobileNavSignUp" href="/sign-up" tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation}><ForgeIcon name="sign-up" />Register</Link>
            </>
          )}
          <Link className="mobileNavCta" href="/download" tabIndex={menuOpen ? 0 : -1} onClick={closeNavigation}><span className="mobileNavCtaLabel"><ForgeIcon name="download" />Download Forge</span><span className="mobileNavCtaIcon" aria-hidden="true"><ForgeIcon name="download" /></span></Link>
        </div>
      </nav>
    </header>
  );
}
