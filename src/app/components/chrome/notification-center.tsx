'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import { forgeNotifications } from '@/shared/config/notifications';
import ForgeIcon from '@/app/components/brand/forge-icon';

type NotificationCenterProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

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

  const toggleNotifications = () => onOpenChange(!open);

  const closeNotifications = () => {
    onOpenChange(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <div className={`notificationCenter${open ? ` notificationCenterOpen` : ``}`} ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className="notificationBell"
        aria-controls={popoverId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Notifications, ${forgeNotifications.length} updates`}
        onClick={toggleNotifications}
      >
        <ForgeIcon name="bell" />
        <span aria-hidden="true">{forgeNotifications.length}</span>
      </button>

      {open ? (
        <section id={popoverId} className="notificationPopover" role="dialog" aria-modal="false" aria-labelledby={`${popoverId}-title`}>
          <div className="notificationPopoverHeader">
            <div><span>Live feed</span><h2 id={`${popoverId}-title`}>Notifications</h2></div>
            <button type="button" ref={closeButtonRef} onClick={closeNotifications} aria-label="Close notifications"><span aria-hidden="true">×</span></button>
          </div>
          <ul className="notificationPopoverList">
            {forgeNotifications.map((notification) => (
              <li key={notification.id}>
                <Link href={notification.href} onClick={() => onOpenChange(false)}>
                  <span className="notificationItemIcon"><ForgeIcon name={notification.icon} /></span>
                  <span className="notificationItemCopy"><small>{notification.type}</small><strong>{notification.title}</strong><span>{notification.detail}</span></span>
                  <time dateTime={notification.dateTime}>{notification.dateLabel}</time>
                </Link>
              </li>
            ))}
          </ul>
          <Link className="notificationPopoverFooter" href="/notifications" onClick={() => onOpenChange(false)}>View all notifications<span aria-hidden="true">→</span></Link>
        </section>
      ) : null}
    </div>
  );
}
