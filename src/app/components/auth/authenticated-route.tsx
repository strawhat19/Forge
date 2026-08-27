'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/shared/global-context';

export default function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authReady, user } = useGlobalContext();

  useEffect(() => {
    if (authReady && !user) router.replace(`/sign-in`);
  }, [authReady, router, user]);

  if (!authReady || !user) {
    return (
      <div className="authRoutePending" role="status" aria-live="polite">
        <span>{authReady ? `Redirecting to sign in` : `Restoring local session`}</span>
      </div>
    );
  }

  return children;
}
