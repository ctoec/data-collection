import { TabItem } from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import { useHistory } from 'react-router-dom';
import React, { useContext } from 'react';
import moment from 'moment';
import UserContext from '../../../contexts/UserContext/UserContext';
import { Site, Organization } from '../../../shared/models';
import { RosterQueryParams } from '../Roster';
import { QUERY_STRING_MONTH_FORMAT } from '../rosterUtils';
import pluralize from 'pluralize';

const ALL_SITES = 'all-sites';

export const useOrgSiteProps = (
  isLoading: boolean,
  orgChildCount: number,
  siteChildCount: number
) => {
  const { user } = useContext(UserContext);
  const organizations = user?.organizations || [];
  const sites = user?.sites || [];

  const history = useHistory();
  const query = parse(history.location.search) as RosterQueryParams;

  // Function to update search query when user clicks on tab nav
  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    // If it has a nested item type then it's an org
    if (clickedItem.nestedItemType) {
      // Remove site param if clickedId !== current orgId
      if (clickedId !== query.organization) delete query.site;
      history.push({
        search: stringify({
          ...query,
          organization: clickedId,
        }),
      });
    } else {
      // Push a specific site id if specific site clicked
      if (clickedId !== ALL_SITES) {
        history.push({
          search: stringify({ ...query, site: clickedId }),
        });
      }
      // Or remove site param from search if 'All sites' clicked
      else {
        delete query.site;
        history.push({ search: stringify(query) });
      }
    }
  };

  if (isLoading) {
    return {
      h1Text: 'Loading...',
    };
  }

  // Multi-org user gets 'Multiple organizations' h1,
  //nested tabs (for orgs and sites),
  // sub header with only sites for the currently selected org,
  // and no super header
  if (organizations.length > 1) {
    const orgSites = sites.filter(
      (s) => `${s.organizationId}` === query.organization
    );
    return {
      h1Text: query.withdrawn
        ? 'Withdrawn enrollments'
        : 'Multiple organizations',
      tabNavProps: {
        itemType: 'organization',
        items: getOrganizationTabItems(organizations, orgSites),
        onClick: tabNavOnClick,
        nestedActiveId: query.site,
        activeId: query.organization,
      },
      subHeaderText: getSubHeaderText(orgChildCount, orgSites, query),
      rosterH2: getRosterH2(siteChildCount, sites, query),
      superHeaderText: '',
    };
  }
  // Multi-site user gets org name as h1
  // single level of tabs (for sites)
  // and no super header
  else if (sites.length > 1) {
    return {
      // Assume users with multi-site access are all under the same org
      h1Text: query.withdrawn
        ? 'Withdrawn enrollments'
        : organizations[0].providerName,
      tabNavProps: {
        itemType: 'site',
        onClick: tabNavOnClick,
        items: getSiteTabItems(sites),
        activeId: query.site,
      },
      subHeaderText: getSubHeaderText(orgChildCount, sites, query),
      rosterH2: getRosterH2(siteChildCount, sites, query),
    };
  }

  // Base case: single-site user:
  // - has no tabNav
  // - has site name as h1Content
  // - does not include site count in subHeaderText
  // - no sub-sub header (because no tabNav)
  return {
    h1Text: query.withdrawn ? 'Withdrawn enrollments' : sites[0].siteName,
    tabNavProps: undefined,
    subHeaderText: getSubHeaderText(orgChildCount, sites, query),
    rosterH2: undefined,
    superHeaderText: organizations?.[0]?.providerName,
  };
};

/****************** HELPER FUNCTIONS  ***********************/
function getSubHeaderText(
  childCount: number,
  userSites?: Site[],
  query?: RosterQueryParams
) {
  if (query?.withdrawn) {
    return 'Showing age group at time of withdrawal';
  }

  // Base case
  let returnText = `${childCount} children enrolled`;

  // If multi-site + user is not looking at a single site
  // then include the count of all sites in the sub header
  if (userSites && userSites.length > 1) {
    returnText += ` at ${userSites.length} sites`;
  }

  if (query?.month) {
    returnText += ` in ${moment
      .utc(query.month, QUERY_STRING_MONTH_FORMAT)
      .format('MMMM YYYY')}`;
  }
  return returnText;
}

function getRosterH2(
  childCount: number,
  sites: Site[],
  query?: RosterQueryParams
) {
  const siteText = query?.site
    ? sites.find((s) => `${s.id}` === query.site)?.siteName
    : 'All sites';
  return (
    <h2>
      {siteText}
      <span className="text-light">
        {' '}
        {pluralize('child', childCount, true)}
      </span>
    </h2>
  );
}

function getSiteTabItems(sites: Site[]): TabItem[] {
  const siteItems: TabItem[] = sites.map(({ id, siteName }) => ({
    id: `${id}`,
    tabText: siteName,
    tabTextFormatter: formatTabItemText,
  }));
  siteItems.splice(0, 0, {
    id: ALL_SITES,
    tabText: 'All sites',
    firstItem: true,
  });
  return siteItems;
}

function getOrganizationTabItems(
  organizations: Organization[],
  orgSites: Site[]
): TabItem[] {
  const items: TabItem[] = organizations.map(({ id, providerName }) => ({
    id: `${id}`,
    tabText: providerName,
    tabTextFormatter: formatTabItemText,
    nestedItemType: 'site',
    nestedTabs: getSiteTabItems(orgSites),
  }));
  return items;
}

function formatTabItemText(text: string) {
  if (text.length > 20) {
    return `${text.slice(0, 19)}...`;
  }
  return text;
}
