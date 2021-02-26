import { getManager } from 'typeorm';
import { Child, Organization, User } from '../entity';

export async function getProviderUserCount(): Promise<number> {
  return getManager().count(User, { where: { isAdmin: false } });
}

export async function getOrganizationCount(): Promise<number> {
  return getManager().count(Organization);
}

export async function getChildCount(): Promise<number> {
  return getManager().count(Child);
}
