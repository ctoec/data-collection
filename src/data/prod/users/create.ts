import { WorkSheet } from 'xlsx';
import { getManager } from 'typeorm';
import { ConnectionPool } from 'mssql';
import {
  User,
  OrganizationPermission,
  SitePermission,
  Organization,
  Site,
} from '../../../entity';
import { parse } from '../utils';
import { createWingedKeysUsers } from './wingedKeys';

export class UserRow {
  parentOrgNames: string = '';
  userName: string = '';
  email: string = '';
  siteNames: string = '';
}

export const USER_ROW_PROPS = Object.keys(new UserRow());

export type SiteConnectionOpts = {
  url: string;
  user: string;
  password: string;
};

export type DBConnectionOpts = {
  server: string;
  port: number;
  user: string;
  password: string;
};

export const createUserData = async (
  sheetData: WorkSheet,
  wingedkeysSiteConnectionOpts: SiteConnectionOpts,
  wingedkeysDbConnectionOpts: DBConnectionOpts,
  passwordFile?: string
) => {
  const parsedData = parse<UserRow>(sheetData, USER_ROW_PROPS);

  let createdCount = 0;

  console.log(`Attempting to create ${parsedData.length} winged-keys users...`);
  await createWingedKeysUsers(
    parsedData,
    wingedkeysSiteConnectionOpts,
    passwordFile
  );
  const UUIDs = await getWingedKeysIds(wingedkeysDbConnectionOpts);

  console.log(`Attempting to create ${parsedData.length} application users...`);
  for (const row of parsedData) {
    try {
      const _firstName = row.userName.split(' ')[0];
      const _lastName = row.userName.split(' ')[1];
      // New users have username = email;
      // pilot v1 users have username = firstname.lastname or Firstname.Lastname
      const wingedKeysId =
        UUIDs[row.email] ||
        UUIDs[`${_firstName.toLowerCase()}.${_lastName.toLowerCase()}`] ||
        UUIDs[`${_firstName}.${_lastName}`];

      let user = await getManager('script').findOne(User, {
        where: { wingedKeysId },
      });

      if (!user) {
        user = await getManager('script').save(
          getManager('script').create(User, {
            firstName: _firstName,
            lastName: _lastName,
            wingedKeysId,
            email: row.email,
          })
        );

        console.log(
          `\tCreated user for ${user.firstName} ${user.lastName} with app id ${user.id}`
        );
        createdCount += 1;
      } else {
        console.log(
          `\tUser ${row.userName} with username ${row.email} already exists.`
        );
      }

      const somePermissionsCreated = await createOrgOrSitePermissions(
        user,
        row.parentOrgNames,
        row.siteNames
      );
      if (!somePermissionsCreated) {
        console.error(
          `\tNo permissions were created for user ${user.firstName} ${user.lastName}`
        );
      }
    } catch (err) {
      console.error(`\tError creating user ${row.userName}`, err);
    }
  }

  console.log(`Successfully created ${createdCount} users`);
};

async function getWingedKeysIds(connectionOpts: DBConnectionOpts) {
  try {
    const pool = await new ConnectionPool({
      ...connectionOpts,
      database: 'wingedkeys',
    }).connect();

    const res = await pool.query(`SELECT username, id FROM AspNetUsers`);

    await pool.close();

    return res.recordset.reduce(
      (acc, { username, id }: { username: string; id: string }) => {
        acc[username] = id;
        return acc;
      },
      {}
    );
  } catch (err) {
    console.error('Error fetching ids from wingedkeys', err);
  }
}

async function createOrgOrSitePermissions(
  user: User,
  userOrgs: string,
  userSites: string
) {
  const orgs = userOrgs.split(',').map((o) => o.trim());
  const sites = userSites?.split(',').map((s) => s.trim());
  let somePermissionsCreated = false;

  // User is multi-org user -- create multiple org permissions
  if (orgs.length > 1) {
    for (const orgName of orgs) {
      somePermissionsCreated =
        (await createOrgPermission(user, orgName)) || somePermissionsCreated;
    }
    return somePermissionsCreated;
  }

  try {
    const org = await getManager('script').findOneOrFail(Organization, {
      relations: ['sites'],
      where: { providerName: orgs[0] },
    });

    // User has no specific site permissions
    // or has access to all sites for an organization
    // (is single-org user -- create single org permission)
    if (
      !sites ||
      !sites.length ||
      (org.sites || []).every((site) => sites.includes(site.siteName))
    ) {
      somePermissionsCreated =
        (await createOrgPermission(user, org)) || somePermissionsCreated;
      return somePermissionsCreated;
    }

    // User is site-level user -- create site permissions for each site
    for (const siteName of sites) {
      somePermissionsCreated =
        (await createSitePermission(user, siteName, org.id)) ||
        somePermissionsCreated;
    }

    return somePermissionsCreated;
  } catch (err) {
    console.error(
      `\t\tError creating permissions for user ${user.firstName} ${user.lastName} at orgs ${userOrgs}, sites ${userSites}`,
      err
    );
  }
}

async function createOrgPermission(user: User, org: Organization | string) {
  try {
    org =
      org instanceof Organization
        ? org
        : await getManager('script').findOneOrFail(Organization, {
            where: { providerName: org },
          });
    const orgPerm = getManager('script').create(OrganizationPermission, {
      user,
      organizationId: org.id,
    });

    await getManager('script').save(orgPerm);
    console.log(
      `\t\tCreated org permission for user ${user.firstName} ${
        user.lastName
      } at ${org instanceof Organization ? org.providerName : org}`
    );
    return true;
  } catch (err) {
    console.error(
      `\t\tError creating org permission for user ${user.firstName} ${
        user.lastName
      } at ${org instanceof Organization ? org.providerName : org}`,
      err
    );

    return false;
  }
}

async function createSitePermission(
  user: User,
  siteName: string,
  organizationId: number
) {
  try {
    const site = await getManager('script').findOneOrFail(Site, {
      where: { siteName, organizationId },
    });

    const sitePerm = getManager('script').create(SitePermission, {
      user,
      siteId: site.id,
    });

    await getManager('script').save(sitePerm);
    console.log(
      `\t\tCreated site permission for user ${user.firstName} ${user.lastName} at ${siteName}`
    );
    return true;
  } catch (err) {
    console.error(
      `\t\tError creating site permission for user ${user.firstName} ${user.lastName} at ${siteName}`,
      err
    );

    return false;
  }
}
