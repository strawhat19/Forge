'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { User } from '@/shared/models/User';
import { useGlobalContext } from '@/shared/global-context';
import { DataSources, Providers, Roles } from '@/shared/types/types';

type AuthMode = 'sign-in' | 'sign-up';

type ForgeAuthFormProps = {
  mode: AuthMode;
  variant?: 'page' | 'compact';
  toolMark?: ReactNode;
};

const modeCopy = {
  'sign-in': {
    action: 'Sign in',
    alternatePrompt: 'Need an account?',
    alternateLabel: 'Create one',
    alternateHref: '/sign-up',
    fullPageLabel: 'Open full sign-in',
    fullPageHref: '/sign-in',
  },
  'sign-up': {
    action: 'Create account',
    alternatePrompt: 'Already have access?',
    alternateLabel: 'Sign in',
    alternateHref: '/sign-in',
    fullPageLabel: 'Open full sign-up',
    fullPageHref: '/sign-up',
  },
} as const;

export default function ForgeAuthForm({ mode, variant = 'page', toolMark }: ForgeAuthFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const { authReady, user, users, setUser, onSignOut } = useGlobalContext();
  const copy = modeCopy[mode];
  const compact = variant === 'compact';
  const cardClassName = `authCard${compact ? ' authCardCompact' : ''}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get(`name`) ?? ``).trim();
    const email = String(formData.get(`email`) ?? ``).trim().toLowerCase();
    const password = String(formData.get(`password`) ?? ``);
    const passwordConfirmation = String(formData.get(`passwordConfirmation`) ?? ``);
    const confirmationInput = form.elements.namedItem(`passwordConfirmation`);

    if (mode === `sign-up` && password !== passwordConfirmation) {
      if (confirmationInput instanceof HTMLInputElement) {
        confirmationInput.setCustomValidity(`Passwords do not match.`);
        confirmationInput.reportValidity();
      }
      setStatus(`Passwords do not match.`);
      return;
    }

    const storedUser = users.find(item => item.email === email);
    const nextUser = new User({
      ...storedUser,
      name: mode === `sign-up` ? name : storedUser?.name,
      email,
      role: storedUser?.role ?? Roles.Customer,
      roles: storedUser?.roles?.length ? storedUser.roles : [Roles.Customer],
      provider: Providers.Simulated,
      dataSource: DataSources.Simulated,
      providerId: `frontend-simulation`,
      signedIn: true,
    });

    setUser(nextUser);
    setStatus(null);
    form.reset();
  };

  const handleSignOut = () => {
    onSignOut();
    setStatus(`Simulated session signed out.`);
  };

  if (!authReady) {
    return (
      <div className={cardClassName} role="status" aria-live="polite">
        <div className="authSession">
          <span>Local session</span>
          <strong>Restoring access</strong>
          <small>Checking this browser</small>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={cardClassName}>
        {compact ? null : (
          <div className="authCardHeader">
            <span className="authCardIndex">01 / ACCESS</span>
            <span className="authCardMark" aria-hidden="true">✓</span>
          </div>
        )}
        <div className="authSession">
          <span>Simulated session</span>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
          <small>Role / {user.role}</small>
          <button className="authSubmit" type="button" onClick={handleSignOut}>
            Sign out
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={`${cardClassName}${toolMark && !compact ? ' authCardWithTool' : ''}`} onSubmit={handleSubmit}>
      <div className="authCardContent">
        {compact ? null : (
          <div className="authCardHeader">
            <span className="authCardIndex">01 / ACCESS</span>
            <span className="authCardMark" aria-hidden="true">↗</span>
          </div>
        )}

        {mode === 'sign-up' ? (
          <label className="authField">
            <span>Name</span>
            <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
          </label>
        ) : null}

        <label className="authField">
          <span>Email</span>
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </label>

        <label className="authField">
          <span>Password</span>
          <input
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            minLength={8}
            required
          />
        </label>

        {mode === 'sign-up' ? (
          <label className="authField">
            <span>Confirm password</span>
            <input
              name="passwordConfirmation"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              minLength={8}
              required
              onInput={(event) => event.currentTarget.setCustomValidity(``)}
            />
          </label>
        ) : null}

        <div className={`authWidgetActions`}>
          <button className="authSubmit" type="submit">
            {copy.action}
            <span aria-hidden="true">↗</span>
          </button>
          {status ? (
            <p className="authStatus" role="status">
              {status}
            </p>
          ) : null}
          <p className="authSwitch">
            {compact ? (
              <Link className={`headerAuthLink`} href={copy.fullPageHref}>
                {copy.fullPageLabel} <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <>
                {copy.alternatePrompt}{' '}
                <Link href={copy.alternateHref}>
                  {copy.alternateLabel}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {toolMark && !compact ? (
        <div className="authToolPanel" aria-hidden="true">
          <span className="authToolLabel">Heat / shape / strike</span>
          <div className="authToolStage">
            <span className="authToolOrbit authToolOrbitOuter" />
            <span className="authToolOrbit authToolOrbitInner" />
            <span className="authToolArc" />
            <span className="authToolGraphic">{toolMark}</span>
          </div>
          <span className="authToolLabel">{mode === 'sign-up' ? 'Access anvil' : 'Forge hammer'}</span>
        </div>
      ) : null}
    </form>
  );
}
