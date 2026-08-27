type ForgeIconProps = {
  name: string;
  className?: string;
  gradientId?: string;
};

export default function ForgeIcon({ name, className = ``, gradientId }: ForgeIconProps) {
  const icon = (() => {
    switch (name) {
      case `applications`:
      case `product`:
        return <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 12h3v3H7zM14 12h3v3h-3z" /></>;
      case `cloud`:
        return <><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 8.7 4.7 4.7 0 0 0 7 18Z" /><path d="m10 12-2 2 2 2m4-4 2 2-2 2" /></>;
      case `devops`:
      case `reconcile`:
        return <><path d="M8.2 7.1A5.5 5.5 0 0 1 17 8l1.5 2.2M15.8 16.9A5.5 5.5 0 0 1 7 16l-1.5-2.2" /><path d="M18.5 6.5v3.7h-3.7M5.5 17.5v-3.7h3.7" /></>;
      case `build`:
      case `refactor`:
        return <><path d="m14.5 5.5 4 4M13 7l4 4M5 19l8.8-8.8" /><path d="m3.8 17.2 3 3-3.8.8zM13.8 4.2l2.7-1.2 4.5 4.5-1.2 2.7" /></>;
      case `pipeline`:
      case `workflow`:
        return <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="5" cy="18" r="2" /><path d="M7 6h3a4 4 0 0 1 4 4 2 2 0 0 0 2 2h1M7 18h3a4 4 0 0 0 4-4" /></>;
      case `cloudformation`:
      case `overview`:
        return <><path d="m12 3 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" /><path d="M8 9v5m8-5v5" /></>;
      case `terraform`:
        return <><path d="m4 5 6 3.5V15l-6-3.5zM11 9l6 3.5V19l-6-3.5zM11 3l6 3.5V11l-6-3.5z" /><path d="m18 12 2-1.2v6.5L18 19z" /></>;
      case `iac`:
      case `docs`:
        return <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 17h8m-5-7-2 2 2 2m2-4 2 2-2 2" /></>;
      case `terminal`:
        return <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3m5 0h5" /></>;
      case `ai`:
        return <><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" /><path d="m12 7 1.35 3.65L17 12l-3.65 1.35L12 17l-1.35-3.65L7 12l3.65-1.35z" /></>;
      case `clock`:
        return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>;
      case `bell`:
        return <><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 6 2.5 8H3.5c0-2 2.5-2 2.5-8Z" /><path d="M10 20h4" /></>;
      case `sign-in`:
        return <><path d="M10 5H5v14h5M13 8l4 4-4 4m-6-4h10" /></>;
      case `sign-out`:
        return <><path d="M14 5h5v14h-5M11 8l-4 4 4 4m6-4H7" /></>;
      case `sign-up`:
        return <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5M18 7v6m-3-3h6" /></>;
      case `profile`:
        return <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5" /></>;
      case `dashboard`:
        return <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>;
      case `stage`:
        return <><path d="M4 18h16M6 14h12M8 10h8M10 6h4" /><circle cx="12" cy="4" r="1" /></>;
      case `inspect`:
        return <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4M8 11h6m-3-3v6" /></>;
      case `release`:
        return <><path d="M12 20V6m0 0L7 11m5-5 5 5" /><path d="M5 4h14M5 20h14" /></>;
      case `history`:
        return <><path d="M4 12a8 8 0 1 0 2.3-5.65L4 8" /><path d="M4 4v4h4m4-1v5l3 2" /></>;
      case `diff`:
        return <><path d="M5 6h6M8 3v6M13 16h6" /><path d="M5 13h5l4-4h5M5 19h5l4-4h5" /></>;
      case `parameter`:
        return <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>;
      case `drift`:
        return <><path d="M3 8c3-3 5 3 8 0s5 3 8 0M3 14c3-3 5 3 8 0s5 3 8 0" /><path d="m17 18 3-3-3-3" /></>;
      case `teardown`:
        return <><path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14" /><path d="M10 11v6m4-6v6" /></>;
      case `shield`:
        return <><path d="M12 3 5 6v5c0 4.7 2.7 8 7 10 4.3-2 7-5.3 7-10V6z" /><path d="m9 12 2 2 4-5" /></>;
      case `download`:
        return <><path d="M12 4v11m0 0-4-4m4 4 4-4" /><path d="M5 19h14" /></>;
      case `plans`:
        return <><path d="M4 6h16v12H4z" /><path d="M4 10h16M8 14h3" /></>;
      case `api`:
        return <><path d="m8 5-5 7 5 7m8-14 5 7-5 7M14 3l-4 18" /></>;
      case `github`:
        return <path className="forgeIconFill" d="M12 2.7a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.3-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.7.4.3.7 1 .7 1.9v2.8c0 .4.2.7.7.5A9.5 9.5 0 0 0 12 2.7Z" />;
      default:
        return <><path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14" /></>;
    }
  })();

  return (
    <svg
      viewBox="0 0 24 24"
      className={`forgeIcon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      style={gradientId ? { stroke: `url(#${gradientId})` } : undefined}
    >
      {gradientId ? (
        <defs>
          <linearGradient id={gradientId} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--red)" />
            <stop offset="1" stopColor="var(--ember)" />
          </linearGradient>
        </defs>
      ) : null}
      {icon}
    </svg>
  );
}
