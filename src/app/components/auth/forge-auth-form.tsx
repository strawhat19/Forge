'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

type AuthMode = 'sign-in' | 'sign-up';

type ForgeAuthFormProps = {
  mode: AuthMode;
  variant?: 'page' | 'compact';
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

export default function ForgeAuthForm({ mode, variant = 'page' }: ForgeAuthFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const copy = modeCopy[mode];
  const compact = variant === 'compact';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(
      mode === 'sign-in'
        ? 'Your form is ready. Connect Forge to an authentication provider to finish signing in.'
        : 'Your form is ready. Connect Forge to an authentication provider to finish creating your account.',
    );
  };

  return (
    <form className={`authCard${compact ? ' authCardCompact' : ''}`} onSubmit={handleSubmit}>
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
          <input name="passwordConfirmation" type="password" placeholder="Repeat your password" autoComplete="new-password" minLength={8} required />
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

    </form>
  );
}
