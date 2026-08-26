'use client';

import Link from 'next/link';
import { useState } from 'react';

type AuthMode = 'sign-in' | 'sign-up';

type ForgeAuthFormProps = {
  mode: AuthMode;
};

const modeCopy = {
  'sign-in': {
    action: 'Sign in',
    alternatePrompt: 'Need an account?',
    alternateLabel: 'Create one',
    alternateHref: '/sign-up',
  },
  'sign-up': {
    action: 'Create account',
    alternatePrompt: 'Already have access?',
    alternateLabel: 'Sign in',
    alternateHref: '/sign-in',
  },
} as const;

export default function ForgeAuthForm({ mode }: ForgeAuthFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const copy = modeCopy[mode];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(
      mode === 'sign-in'
        ? 'Your form is ready. Connect Forge to an authentication provider to finish signing in.'
        : 'Your form is ready. Connect Forge to an authentication provider to finish creating your account.',
    );
  };

  return (
    <form className="authCard" onSubmit={handleSubmit}>
      <div className="authCardHeader">
        <span className="authCardIndex">01 / ACCESS</span>
        <span className="authCardMark" aria-hidden="true">↗</span>
      </div>

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

      <button className="authSubmit" type="submit">
        {copy.action}
        <span aria-hidden="true">↗</span>
      </button>

      {status ? <p className="authStatus" role="status">{status}</p> : null}

      <p className="authSwitch">
        {copy.alternatePrompt}{' '}
        <Link href={copy.alternateHref}>{copy.alternateLabel}</Link>
      </p>
    </form>
  );
}
