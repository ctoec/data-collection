import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { getManager, In } from 'typeorm';
import { User, Organization, Site, OrganizationPermission } from '../entity';
import { passAsyncError } from './error/passAsyncError';
import { default as axios, AxiosResponse } from 'axios';
import * as https from 'https';
import { InvalidSubClaimError } from './error/errors';
import { isProdLike } from '../utils/isProdLike';
import { organizations } from '../data/fake/organizations';

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
    if (req.claims?.sub) {
      let fawkesUser = await getUser(req.claims.sub);

      // Only automatically create app user in test environments
      if (!fawkesUser && !isProdLike()) {
        const res: AxiosResponse<any> = await getUserFromWingedKeys(
          req.headers.authorization
        );

        if (res?.data?.sub === req.claims.sub) {
          fawkesUser = await createUserWithSingleOrgPermissions(
            req.claims.sub,
            res.data
          );
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
    relations: ['orgPermissions', 'sitePermissions'],
    where: { wingedKeysId },
  });

  if (!user) return;

  // Create list of distinct organization ids the user can access
  const allOrgIds = (user.orgPermissions || []).map(
    (perm) => perm.organizationId
  );

  // Get all sites associated with all organizations user has permissions for
  const sitesFromAllOrgs = allOrgIds.length
    ? await getManager().find(Site, {
        where: { organizationId: In(allOrgIds) },
      })
    : [];

  // Create list of distinct site ids the user can access
  const allSiteIds = Array.from(
    new Set([
      ...(user.sitePermissions || []).map((perm) => perm.siteId),
      ...sitesFromAllOrgs.map((site) => site.id),
    ])
  );

  // Determine access pattern level of the user
  user.accessType =
    (user.orgPermissions || []).length === 0 ? 'site' : 'organization';

  // Add values to the user object
  user.organizationIds = allOrgIds;
  user.siteIds = allSiteIds;
  return user;
};

/**
 * Fetches a user object from winged-keys, for test env automatic
 * app user creation flow
 * @param bearerToken
 */
async function getUserFromWingedKeys(
  bearerToken: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`${process.env.WINGED_KEYS_HOST}/connect/userinfo`, {
    headers: {
      authorization: bearerToken,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
}

/**
 * For test environments. Incoming requests from legit
 * wingek-keys users get an application user created for them,
 * with org-level permissions for a single test org
 * @param wingedKeysId
 * @param wingedKeysUser
 */
async function createUserWithSingleOrgPermissions(
  wingedKeysId: string,
  wingedKeysUser: { given_name: string; family_name: string }
): Promise<User> {
  let user: User;

  await getManager().transaction(async (manager) => {
    const _user = manager.create(User, {
      wingedKeysId,
      firstName: wingedKeysUser.given_name,
      lastName: wingedKeysUser.family_name,
      confidentialityAgreedDate: null,
    });

    user = await manager.save(_user);

    const org: Organization = await manager.findOne(Organization, {
      where: { providerName: organizations[0].providerName },
    });
    if (org) {
      const orgPermsForUser = manager.create(OrganizationPermission, {
        user,
        organizationId: org.id,
      });
      await manager.save(orgPermsForUser);
    }
  });

  return user;
}

/**
 * A conditional wrapper around the real authentication logic to decode the
 * jwt claim. If `x-test-no-authenticate` header is set, and the request is
 * being processed in a non-prod environment, then skip token decode. Instead,
 * add the default "voldemort" user to the request and continue down the
 * middlewares chain
 * @param req
 * @param res
 * @param next
 */
const decodeOrMockClaim = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isProdLike() && req.headers['x-test-no-authenticate']) {
    const user = await getManager().findOne(User, {
      where: { firstName: 'voldemort' },
    });
    req.claims = { sub: user.wingedKeysId };
    return next();
  }

  decodeClaim(req, res, next);
};
/**
 * Full authentication middleware chains together decodeOrMockClaim and addUser,
 * so that any authenticated route gets the user, looked up via decoded JWT
 * "sub" claim, added to the request
 */
export const authenticate = [decodeOrMockClaim, addUser];
