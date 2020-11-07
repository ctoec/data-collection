import { WorkSheet, utils } from 'xlsx';
import { getManager } from 'typeorm';
import {
  User,
  OrganizationPermission,
  SitePermission,
  Organization,
  Site,
} from '../../entity';
import { parse } from './utils';

export class UserRow {
  parentOrgNames: string = '';
  userName: string = '';
  email: string = '';
  siteNames: string = '';
  uuid: string = '';
}

export const USER_ROW_PROPS = Object.keys(new UserRow());

export const createUserData = async (sheetData: WorkSheet) => {
  const parsedData = parse<UserRow>(sheetData, USER_ROW_PROPS);

  console.log(`Attempting to create ${parsedData.length} users...`);
  let createdCount = 0;

  for (const row of parsedData) {
    try {
      const user = getManager('script').create(User, {
        firstName: row.userName.split(' ')[0],
        lastName: row.userName.split(' ')[1],
        wingedKeysId: row.uuid,
      });

      const { id, firstName, lastName } = await getManager('script').save(user);
      console.log(
        `\tCreated user for ${firstName} ${lastName} with app id ${id}`
      );
      createdCount += 1;

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

async function createOrgOrSitePermissions(
  user: User,
  userOrgs: string,
  userSites: string
) {
  const orgs = userOrgs.split(',').map((o) => o.trim());
  const sites = userSites.split(',').map((s) => s.trim());
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

    // User has access to all org sites (is single-org user -- create single org permission)
    if ((org.sites || []).every((site) => sites.includes(site.siteName))) {
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
      `\t\tError creating permissions for user ${user.firstName} ${user.lastName} at orgs ${userOrgs}, sites ${userSites}`
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
