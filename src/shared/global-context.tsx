'use client';

import { User } from '@/shared/models/User';
import {
  clearLocalAuthUser,
  getLocalAuthServerSnapshot,
  getLocalAuthSnapshot,
  storeLocalAuthUser,
  subscribeLocalAuth,
} from '@/shared/auth/local-auth-storage';
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type GlobalContextValue = {
  authReady: boolean;
  user: User | null;
  users: User[];
  setUser: Dispatch<SetStateAction<User | null>>;
  onSignOut: () => void;
};

const defaultState: GlobalContextValue = {
  authReady: false,
  user: null,
  users: [],
  setUser: () => undefined,
  onSignOut: () => undefined,
};

export const StateGlobals = createContext<GlobalContextValue>(defaultState);

export const useGlobalContext = () => useContext(StateGlobals);

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const { ready: authReady, user, users } = useSyncExternalStore(
    subscribeLocalAuth,
    getLocalAuthSnapshot,
    getLocalAuthServerSnapshot,
  );
  const setUser = useCallback<Dispatch<SetStateAction<User | null>>>((nextUser) => {
    const currentUser = getLocalAuthSnapshot().user;
    const resolvedUser = typeof nextUser === `function` ? nextUser(currentUser) : nextUser;
    if (resolvedUser) storeLocalAuthUser(resolvedUser);
    else clearLocalAuthUser();
  }, []);
  const onSignOut = useCallback(() => clearLocalAuthUser(), []);
  const state = useMemo(
    () => ({ authReady, user, users, setUser, onSignOut }),
    [authReady, onSignOut, setUser, user, users],
  );

  return <StateGlobals.Provider value={state}>{children}</StateGlobals.Provider>;
}
