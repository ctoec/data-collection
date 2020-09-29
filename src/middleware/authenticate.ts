import jwt, { UnauthorizedError } from 'express-jwt';
import jwks from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { getManager, In } from 'typeorm';
import { User, Provider, Site, ProviderPermission } from '../entity';
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
        const res: AxiosResponse<any> = await getUserFromWingedKeys(
          req.headers.authorization
        );

        if (
          res &&
          res.data &&
          res.data.sub &&
          res.data.sub === req.claims.sub
        ) {
          fawkesUser = await createUserWithFullPermissions(
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
    where: { wingedKeysId: wingedKeysId },
    relations: [
      'organizationPermissions',
      'providerPermissions',
      'sitePermissions',
    ],
  });

  if (!user) return;

  // Get all providers user has permissions for via organization permissions
  const providersFromOrganizations = user.organizationPermissions?.length
    ? await getManager().find(Provider, {
        where: {
          organizationId: In(
            user.organizationPermissions.map((perm) => perm.organizationId)
          ),
        },
      })
    : [];

  // Create list of distinct provider ids the user can access, via organization
  // permission and
  const allProviderIds = Array.from(
    new Set([
      ...providersFromOrganizations.map((provider) => provider.id),
      ...(user.providerPermissions || []).map((perm) => perm.providerId),
    ])
  );

  // Get all sites associated with all providers user has permissions for
  const sitesFromAllProviders = await getManager().find(Site, {
    where: { providerId: In(allProviderIds) },
  });

  // Create list of distinct site ids the user can access
  const allSiteIds = Array.from(
    new Set([
      ...(user.sitePermissions || []).map((perm) => perm.siteId),
      ...sitesFromAllProviders.map((site) => site.id),
    ])
  );

  // Add values to the user object
  user.organizationIds = (user.organizationPermissions || []).map(
    (perm) => perm.organizationId
  );
  user.providerIds = allProviderIds;
  user.siteIds = allSiteIds;
  return user;
};

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

async function createUserWithFullPermissions(
  wingedKeysId: string,
  wingedKeysUser: { given_name: string; family_name: string }
): Promise<User> {
  let user: User;

  await getManager().transaction(async (manager) => {
    const _user = manager.create(User, {
      wingedKeysId,
      firstName: wingedKeysUser.given_name,
      lastName: wingedKeysUser.family_name,
    });

    user = await manager.save(_user);

    const providers: Provider[] = await manager.find(Provider);
    if (providers.length) {
      const providerPermsForUser = manager.create(
        ProviderPermission,
        providers.map((provider) => ({
          user,
          providerId: provider.id,
        }))
      );
      await manager.save(providerPermsForUser);
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
