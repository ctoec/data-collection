import { TabNav, TabItem } from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import { QUERY_STRING_MONTH_FORMAT } from '../rosterUtils';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../../contexts/UserContext/UserContext';
import { Site, Organization } from '../../../shared/models';
import moment from 'moment';
import { RosterQueryParams } from '../Roster';

const ALL_SITES = 'all-sites';

export const useOrgSiteProps = (isLoading: boolean, childCount: number) => {
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
          site: undefined,
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

  // Base case: single-site user:
  // - has no tabNav
  // - has site name as h1Content
  // - does not include site count in subHeaderText
  const props = {
    tabNavProps: undefined as TabNav | undefined,
    h1Text: isLoading ? 'Loading...' : sites[0].siteName,
    subHeaderText: getSubHeaderText(isLoading, childCount, sites, query),
    superHeaderText: organizations?.[0]?.providerName,
  };

  // Multi-org user gets 'Multiple organizations' h1,
  //nested tabs (for orgs and sites),
  // sub header with only sites for the currently selected org,
  // and no super header
  if (organizations.length > 1) {
    props.h1Text = 'Multiple organizations';
    const orgSites = sites.filter(
      (s) => `${s.organizationId}` === query.organization
    );
    props.subHeaderText = getSubHeaderText(
      isLoading,
      childCount,
      orgSites,
      query
    );
    props.superHeaderText = '';
    props.tabNavProps = {
      itemType: 'organization',
      items: getOrganizationTabItems(organizations, sites),
      onClick: tabNavOnClick,
      nestedActiveId: query.site,
      activeId: query.organization,
    };
  }
  // Multi-site user gets org name as h1
  // single level of tabs (for sites)
  // and no super header
  else if (sites.length > 1) {
    // Assume users with multi-site access are all under the same org
    props.h1Text = organizations[0].providerName;
    props.superHeaderText = '';
    props.tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteTabItems(sites),
      activeId: query.site,
    };
  }

  if (query.withdrawn) {
    props.h1Text = 'Withdrawn enrollments';
  }

  return props;
};

/****************** HELPER FUNCTIONS  ***********************/
function getSubHeaderText(
  loading: boolean,
  childCount: number,
  userSites?: Site[],
  query?: RosterQueryParams
) {
  if (loading) return '';
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
  sites: Site[]
): TabItem[] {
  const items: TabItem[] = organizations.map(({ id, providerName }) => ({
    id: `${id}`,
    tabText: providerName,
    tabTextFormatter: formatTabItemText,
    nestedItemType: 'site',
    nestedTabs: getSiteTabItems(sites.filter((s) => s.organizationId === id)),
  }));
  return items;
}

function formatTabItemText(text: string) {
  if (text.length > 20) {
    return `${text.slice(0, 19)}...`;
  }
  return text;
}
