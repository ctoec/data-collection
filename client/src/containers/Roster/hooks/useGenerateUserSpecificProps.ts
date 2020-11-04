import { TabNav, TabItem } from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import { QUERY_STRING_MONTH_FORMAT } from '../rosterUtils';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../../contexts/UserContext/UserContext';
import { Site, Organization } from '../../../shared/models';
import moment from 'moment';

const ALL_SITES = 'all-sites';

export const useGenerateUserSpecificProps = (
  isLoading: boolean,
  childCount: number
) => {
  const { user } = useContext(UserContext);
  const organizations = user?.organizations || [];
  const sites = user?.sites || [];

  const history = useHistory();
  const query = parse(history.location.search) as {
    organization?: string;
    site?: string;
    month?: string;
  };

  // Function to update search query when user clicks on tab nav
  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    if (clickedItem.nestedItemType) {
      // If it has a nested item type then it's an org
      history.push({
        search: stringify({ ...query, organization: clickedId }),
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
    subHeaderText: isLoading ? '' : `${childCount} children enrolled`,
  };

  // Multi-org user gets nested tabs (for orgs and sites)
  if (organizations.length > 1) {
    // H1 text = selected org Id
    props.h1Text =
      organizations.find((o) => `${o.id}` === query.organization)
        ?.providerName || '';
    props.subHeaderText = getSubHeaderText(childCount, sites, true, query);
    props.tabNavProps = {
      itemType: 'organization',
      items: getOrganizationTabItems(organizations, sites),
      onClick: tabNavOnClick,
      nestedActiveId: query.site,
      activeId: query.organization,
    };
  } else if (sites.length > 1) {
    // Assume users with multi-site access are all under the same org
    props.h1Text = query.site
      ? sites.find((s) => `${s.id}` === query.site)?.siteName || ''
      : 'All sites';
    props.subHeaderText = getSubHeaderText(childCount, sites, false, query);
    props.tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteTabItems(sites),
      activeId: query.site,
    };
  }

  return props;
};

/****************** HELPER FUNCTIONS  ***********************/
function getSubHeaderText(
  childCount: number,
  userSites: Site[],
  isMultiOrg: boolean,
  query: {
    organization?: string;
    month?: string;
    site?: string;
  }
) {
  const { organization, month, site } = query;

  // Base case
  let returnText = `${childCount} children enrolled`;

  // If multi-site + user is not looking at a single site
  // then include the count of all sites in the sub header
  if (userSites.length > 1 && !site) {
    returnText += ` at ${
      userSites.filter((s) => `${s.organizationId}` === organization).length
    } sites`;
  }
  // If multi-org + user is looking at single site
  // Then include the site name in the sub header
  else if (isMultiOrg && site) {
    returnText += ` at ${userSites.find((s) => `${s.id}` === site)?.siteName}`;
  }

  if (month) {
    returnText += ` in ${moment
      .utc(month, QUERY_STRING_MONTH_FORMAT)
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
