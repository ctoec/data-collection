import { User, Organization } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { OrganizationSummary } from '../../client/src/shared/payloads/OrganizationsResponse';

/**
 * Get all funding spaces a given user has access to,
 * including those for organizations the user has
 * permissions for, and those for organizations that
 * own the sites the user has permissions for
 * @param user
 */
export const getOrganizations = async (
  user: User,
  organizationIds?: string[]
): Promise<Organization[]> => {
  if (!organizationIds?.length)
    organizationIds = await getReadAccessibleOrgIds(user);

  return getManager().find(Organization, {
    where: {
      id: In(organizationIds),
    },
    relations: ['sites', 'fundingSpaces'],
  });

  //   return getManager().query(`SELECT
  // o.id, o.providerName, COUNT(DISTINCT s.siteName) as sites, fs.source
  // FROM organization o
  // JOIN site s ON o.id = s.organizationId
  // JOIN funding_space fs on o.id = fs.organizationId
  // GROUP BY  o.id, o.providerName, fs.source`);
};

// export const getOrganizations = async (
//   user: User,
//   organizationIds?: string[]
// ): Promise<Organization[]> => {
//   const sites = await getSiteSummaries();
//   const summaryResponse: SummaryResponse = {
//     totalProviderUsers: await getProviderUserCount(),
//     totalOrganizations: await getOrganizationCount(),
//     totalChildren: await getChildCount(),
//     siteSummaries: sites.reduce(
//       (_siteSummaries, site) => {
//         if (!!site.submissionDate) {
//           _siteSummaries.completedSites.push(site);
//         } else if (site.totalEnrollments > 0) {
//           _siteSummaries.inProgressSites.push(site);
//         } else {
//           _siteSummaries.noDataSites.push(site);
//         }
//         return _siteSummaries;
//       },
//       { completedSites: [], inProgressSites: [], noDataSites: [] }
//     ),
//   };

//   return summaryResponse;
// };

// import { User, FundingSpace } from '../entity';
// import { getManager, In } from 'typeorm';
// import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';

// /**
//  * Get all funding spaces a given user has access to,
//  * including those for organizations the user has
//  * permissions for, and those for organizations that
//  * own the sites the user has permissions for
//  * @param user
//  */
// export const getFundingSpaces = async (
//   user: User,
//   organizationIds?: string[]
// ): Promise<FundingSpace[]> => {
//   if (!organizationIds?.length)
//     organizationIds = await getReadAccessibleOrgIds(user);

//   return getManager().find(FundingSpace, {
//     where: {
//       organization: { id: In(organizationIds) },
//     },
//     relations: ['organization'],
//   });
// };
