'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import ForgeIcon from '@/app/components/brand/forge-icon';
import { useGlobalContext } from '@/shared/global-context';

type AccountMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
};

export default function AccountMenu({ open, onOpenChange, onSignOut }: AccountMenuProps) {
  const { user } = useGlobalContext();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const userInitial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? `F`;

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());

    const closeOnPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) onOpenChange(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;
      onOpenChange(false);
      buttonRef.current?.focus();
    };

    document.addEventListener(`pointerdown`, closeOnPointerDown);
    window.addEventListener(`keydown`, closeOnEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener(`pointerdown`, closeOnPointerDown);
      window.removeEventListener(`keydown`, closeOnEscape);
    };
  }, [onOpenChange, open]);

  if (!user) return null;

  const signOut = () => {
    onOpenChange(false);
    onSignOut();
  };

  return (
    <div className={`accountMenu${open ? ` accountMenuOpen` : ``}`} ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className="accountMenuButton"
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Open account menu for ${user.name}`}
        title={`${user.name} / ${user.role}`}
        onClick={() => onOpenChange(!open)}
      >
        <span aria-hidden="true">{userInitial}</span>
      </button>

      {open ? (
        <section id={menuId} className="accountPopover" role="dialog" aria-modal="false" aria-label="Account menu">
          <div className="accountPopoverHeader">
            <span className="accountPopoverAvatar" aria-hidden="true">{userInitial}</span>
            <div>
              <small>Signed in / {user.role}</small>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className="accountPopoverLinks" aria-label="Account pages">
            <Link ref={firstLinkRef} href="/profile" onClick={() => onOpenChange(false)}>
              <span className="accountPopoverIcon"><ForgeIcon name="profile" /></span>
              <span><strong>Profile</strong><small>Identity and access role</small></span>
              <span>01</span>
            </Link>
            <Link href="/dashboard" onClick={() => onOpenChange(false)}>
              <span className="accountPopoverIcon"><ForgeIcon name="dashboard" /></span>
              <span><strong>Dashboard</strong><small>Workspace and release overview</small></span>
              <span>02</span>
            </Link>
          </nav>

          <button className="accountPopoverSignOut" type="button" onClick={signOut}>
            <span className="accountPopoverIcon"><ForgeIcon name="sign-out" /></span>
            <span><strong>Sign out</strong><small>Clear simulated session</small></span>
            <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : null}
    </div>
  );
}
