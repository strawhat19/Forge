'use client';

import Link from 'next/link';
import ForgeIcon from '@/app/components/brand/forge-icon';
import { useGlobalContext } from '@/shared/global-context';

type AccountPagePanelProps = {
  page: `profile` | `dashboard`;
};

export default function AccountPagePanel({ page }: AccountPagePanelProps) {
  const { user } = useGlobalContext();

  if (!user) {
    return (
      <section className="productSection accountPageSection">
        <div className="accountSignedOut">
          <span className="accountPageIcon"><ForgeIcon name={page} /></span>
          <span className="eyebrow">Simulated account required</span>
          <h2>Sign in to preview your {page}.</h2>
          <p>This page is ready for role-based rendering, but the current session is front-end only.</p>
          <Link className="productButton productButtonPrimary" href="/sign-in">Open sign in<span aria-hidden="true">→</span></Link>
        </div>
      </section>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? `F`;

  return (
    <section className="productSection accountPageSection">
      <div className="accountIdentityCard">
        <span className="accountIdentityAvatar" aria-hidden="true">{initial}</span>
        <div>
          <span className="eyebrow">Simulated Forge user</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="accountDetailGrid">
        <article><span>Role</span><strong>{user.role}</strong><p>Available now for conditional interface rendering.</p></article>
        <article><span>Provider</span><strong>{user.provider}</strong><p>Prepared to be replaced by Firebase Authentication.</p></article>
        <article><span>{page === `profile` ? `Identity` : `Workspace`}</span><strong>{page === `profile` ? `Profile ready` : `Dashboard ready`}</strong><p>{page === `profile` ? `User metadata can be extended here.` : `Release and project data can be connected here.`}</p></article>
      </div>
    </section>
  );
}
