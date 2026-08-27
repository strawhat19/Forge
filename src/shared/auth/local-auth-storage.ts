import { User } from '@/shared/models/User';

const STORAGE_VERSION = 1;
export const LOCAL_AUTH_USER_KEY = `forge.auth.user.v${STORAGE_VERSION}`;
export const LOCAL_AUTH_USERS_KEY = `forge.auth.users.v${STORAGE_VERSION}`;

export type LocalAuthSnapshot = {
  ready: boolean;
  user: User | null;
  users: User[];
};

type StoredRecord = {
  version?: unknown;
  value?: unknown;
};

const serverSnapshot: LocalAuthSnapshot = {
  ready: false,
  user: null,
  users: [],
};

let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

const isUserData = (value: unknown): value is Partial<User> => {
  if (!value || typeof value !== `object`) return false;
  const record = value as Record<string, unknown>;
  return typeof record.email === `string`;
};

const readRecord = (key: string) => {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return null;
    const record = JSON.parse(rawValue) as StoredRecord;
    return record.version === STORAGE_VERSION ? record.value : null;
  } catch {
    return null;
  }
};

const readBrowserSnapshot = (): LocalAuthSnapshot => {
  const storedUser = readRecord(LOCAL_AUTH_USER_KEY);
  const storedUsers = readRecord(LOCAL_AUTH_USERS_KEY);
  const user = isUserData(storedUser) ? new User({ ...storedUser, signedIn: true }) : null;
  const users = Array.isArray(storedUsers)
    ? storedUsers.filter(isUserData).map(item => new User(item))
    : [];

  if (user && !users.some(item => item.id === user.id)) users.push(user);

  return { ready: true, user, users };
};

const ensureInitialized = () => {
  if (initialized || typeof window === `undefined`) return;
  snapshot = readBrowserSnapshot();
  initialized = true;
};

const emitChange = () => listeners.forEach(listener => listener());

const publishSnapshot = (nextSnapshot: LocalAuthSnapshot) => {
  snapshot = nextSnapshot;
  initialized = true;
  emitChange();
};

const writeRecord = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify({
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      value,
    }));
  } catch {
    // Keep the in-memory simulation usable when storage is unavailable.
  }
};

const removeRecord = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Keep the in-memory simulation usable when storage is unavailable.
  }
};

const handleStorageChange = (event: StorageEvent) => {
  if (event.key !== LOCAL_AUTH_USER_KEY && event.key !== LOCAL_AUTH_USERS_KEY && event.key !== null) return;
  snapshot = readBrowserSnapshot();
  initialized = true;
  emitChange();
};

export const subscribeLocalAuth = (listener: () => void) => {
  ensureInitialized();
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener(`storage`, handleStorageChange);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener(`storage`, handleStorageChange);
  };
};

export const getLocalAuthSnapshot = () => {
  ensureInitialized();
  return snapshot;
};

export const getLocalAuthServerSnapshot = () => serverSnapshot;

export const storeLocalAuthUser = (user: User) => {
  ensureInitialized();
  const now = new Date().toISOString();
  const nextUser = new User({
    ...user,
    signedIn: true,
    lastAuthenticated: now,
    updated: now,
  });
  const previousUsers = snapshot.users;
  const hasExistingUser = previousUsers.some(item => item.id === nextUser.id || item.email === nextUser.email);
  const nextUsers = previousUsers.map(item => {
    if (item.id === nextUser.id || item.email === nextUser.email) return nextUser;
    return item.signedIn ? new User({ ...item, signedIn: false }) : item;
  });

  if (!hasExistingUser) nextUsers.push(nextUser);

  writeRecord(LOCAL_AUTH_USER_KEY, nextUser);
  writeRecord(LOCAL_AUTH_USERS_KEY, nextUsers);
  publishSnapshot({ ready: true, user: nextUser, users: nextUsers });
  return nextUser;
};

export const clearLocalAuthUser = () => {
  ensureInitialized();
  const now = new Date().toISOString();
  const activeUserId = snapshot.user?.id;
  const nextUsers = snapshot.users.map(item => activeUserId && item.id === activeUserId
    ? new User({ ...item, signedIn: false, updated: now })
    : item);

  removeRecord(LOCAL_AUTH_USER_KEY);
  writeRecord(LOCAL_AUTH_USERS_KEY, nextUsers);
  publishSnapshot({ ready: true, user: null, users: nextUsers });
};
