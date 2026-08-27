import { DataSources, Providers, Roles, Types } from '@/shared/types/types';

export const minRole = (currentRole: Roles | string, requiredRole: Roles | string) => {
  const currentIndex = Object.values(Roles).indexOf(currentRole as Roles);
  const requiredIndex = Object.values(Roles).indexOf(requiredRole as Roles);
  return currentIndex >= requiredIndex;
};

const nameFromEmail = (email: string) => email
  .split(`@`)[0]
  .split(/[._-]+/)
  .filter(Boolean)
  .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(` `);

export class User {
  id = ``;
  uid = ``;
  name = ``;
  email = ``;
  displayName = ``;
  role: Roles | string = Roles.Customer;
  roles: Array<Roles | string> = [];
  type: Types | string = Types.User;
  provider: Providers | string = Providers.Firebase;
  dataSource: DataSources | string = DataSources.Firebase;
  providerId = ``;
  signedIn = false;
  emailVerified = false;
  photoURL = ``;
  avatar = ``;
  created = ``;
  updated = ``;
  lastAuthenticated = ``;
  metadata: Record<string, unknown> = {};

  constructor(data: Partial<User> = {}) {
    const now = new Date().toISOString();
    const email = String(data.email ?? ``).trim().toLowerCase();
    const fallbackName = nameFromEmail(email) || `Forge User`;
    const fallbackId = `forge-${email.replace(/[^a-z0-9]+/g, `-`).replace(/^-|-$/g, ``) || `user`}`;

    Object.assign(this, data);

    this.email = email;
    this.name = String(data.name || data.displayName || fallbackName);
    this.displayName = String(data.displayName || this.name);
    this.uid = String(data.uid || data.id || fallbackId);
    this.id = String(data.id || this.uid);
    this.role = data.role ?? data.roles?.[0] ?? Roles.Customer;
    this.roles = data.roles?.length ? [...data.roles] : [this.role];
    this.created = String(data.created || now);
    this.updated = String(data.updated || now);
    this.lastAuthenticated = String(data.lastAuthenticated || now);
  }
}
