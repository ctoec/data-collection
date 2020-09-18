import jwt, { UnauthorizedError } from 'express-jwt';
import jwks from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { getManager, In } from 'typeorm';
import { User, Organization, Site, OrganizationPermission } from '../entity';
import { passAsyncError } from './error/passAsyncError';

import { default as axios, AxiosResponse } from 'axios';
import * as https from 'https';
import { InvalidSubClaimError } from './error/errors';

/**
 * Authentication middleware to decode auth JWT (JSON web token)
 * with appropriate key from JWKS (JSON web key set).
 * Leverages express-jwt, a middleware for validating JWT (https://github.com/auth0/express-jwt#readme)
 *
 * Adds the resulting claims to the "claims" property on the request.
 */
const decodeClaim = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    jwksUri: `${
      process.env.WINGED_KEYS_HOST || 'https://localhost:5050'
    }/.well-known/openid-configuration/jwks`,
    strictSsl: false,
  }),
  algorithms: ['RS256'],
  requestProperty: 'claims',
});

/**
 * Authentication middleware to use the "sub" claim from the decoded token,
 * which represents the WingedKeysId for a user, to lookup the authed user.
 *
 * Adds the resulting User object to the "user" property on the request.
 */
const addUser = passAsyncError(
  async (req: Request, _: Response, next: NextFunction) => {
    if (req.claims.sub) {
      let fawkesUser = await getUser(req.claims.sub);

      //  TODO: Remove once an actual user management system is implemented
      if (!fawkesUser) {
        const res: AxiosResponse<any> = await getUserFromWingedKeys(req.headers.authorization);

        if (res && res.data && res.data.sub && res.data.sub === req.claims.sub) {
          fawkesUser = await createUserWithFullPermissions(req.claims.sub, res.data);
        } else {
          throw new InvalidSubClaimError();
        }
      }

      req.user = fawkesUser;
      next();
    }
  }
);

/**
 * Get user by wingedKeysId, and populate
 * user.siteIds and user.organizationIds.
 * @param wingedKeysId
 */
const getUser = async (wingedKeysId: string) => {
  const user = await getManager().findOne(User, {
    where: { wingedKeysId },
    relations: ['orgPermissions', 'sitePermissions', 'communityPermissions'],
  });

  if (!user) return;

  // Get all orgs associated with communities user has permissions for
  const orgsFromCommunities = (user.communityPermissions || []).length
    ? await getManager().find(Organization, {
        where: {
          communityId: In(
            user.communityPermissions.map((perm) => perm.communityId)
          ),
        },
      })
    : [];

  // Create list of distinct organization ids the user can access
  const allOrgIds = Array.from(
    new Set([
      ...(user.orgPermissions || []).map((perm) => perm.organizationId),
      ...orgsFromCommunities.map((org) => org.id),
    ])
  );

  // Get all sites associated with all organizations user has permissions for
  const sitesFromAllOrgs = await getManager().find(Site, {
    where: { organizationId: In(allOrgIds) },
  });

  // Create list of distinct site ids the user can access
  const allSiteIds = Array.from(
    new Set([
      ...(user.sitePermissions || []).map((perm) => perm.siteId),
      ...sitesFromAllOrgs.map((site) => site.id),
    ])
  );

  // Add values to the user object
  user.organizationIds = allOrgIds;
  user.siteIds = allSiteIds;
  return user;
};

async function getUserFromWingedKeys(bearerToken: string): Promise<AxiosResponse<any>> {
    return await axios.get(`${process.env.WINGED_KEYS_HOST}/connect/userinfo`, {
      headers: {
        authorization: bearerToken
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
}

async function createUserWithFullPermissions(wingedKeysId: string, wingedKeysUser: { given_name: string, family_name: string }): Promise<User> {
  let user: User;

  await getManager().transaction(async (manager) => {
    const _user = manager.create(User, {
      wingedKeysId,
      firstName: wingedKeysUser.given_name,
      lastName: wingedKeysUser.family_name,
    });
    
    user = await manager.save(_user);

    const permsForAllOrgs: OrganizationPermission[] = await manager.find(OrganizationPermission);

    if (permsForAllOrgs.length) {
      const orgPermsForUser = manager.create(OrganizationPermission, permsForAllOrgs.map(orgPerm => ({
        user,
        organizationId: orgPerm.organizationId
      })));
      await manager.save(orgPermsForUser);
    }
  });

  return user;
}

/**
 * Full authentication middleware chains together decodeClaim and addUser,
 * so that any authenticated route gets the user, looked up via decoded JWT
 * "sub" claim, added to the request
 */
export const authenticate = [decodeClaim, addUser];
