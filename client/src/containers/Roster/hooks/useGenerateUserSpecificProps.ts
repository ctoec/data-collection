import { TabNav, TabItem } from '@ctoec/component-library';
import { stringify, parse } from 'querystring';
import { QUERY_STRING_MONTH_FORMAT } from '../rosterUtils';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../../contexts/UserContext/UserContext';
import { Site, Organization } from '../../../shared/models';
import moment from 'moment';

export const useGenerateUserSpecificProps = (
  isLoading: boolean,
  childCount: number
) => {
  const { user } = useContext(UserContext);
  const organizations = user?.organizations || [];
  const sites = user?.sites || [];

  const history = useHistory();
  const query = parse(history.location.search) as {
    organization: string;
    site: string;
    month: string;
  };

  // Base case: single-site user:
  // - has no tabNav
  // - has site name as h1Content
  // - does not include site count in subHeaderText
  const props = {
    tabNavProps: undefined as TabNav | undefined,
    h1Text: isLoading ? 'Loading...' : sites.length ? sites[0].siteName : '',
    subHeaderText: isLoading ? '' : `${childCount} children enrolled`,
  };

  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    if (clickedItem.nestedItemType) {
      // If it has a nested item type then it's an org
      history.push({
        search: stringify({ organization: clickedId, month: query.month }),
      });
    } else {
      history.push({
        search: stringify({ site: clickedId, month: query.month }),
      });
    }
  };

  // Multi-org user
  if (organizations.length > 1) {
    // show all orgs in tabs, and placeholder the h1
    props.h1Text = 'Multiple organizations';
    props.tabNavProps = {
      itemType: 'organization',
      items: getOrganizationTabItems(organizations, sites),
      onClick: tabNavOnClick,
      nestedActiveId: query.site,
      activeId: query.organization,
    };
  } else if (sites.length > 1) {
    // If user has multiple orgs, show them all and placeholder the h1
    props.h1Text = organizations[0].providerName;
    props.tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteTabItems(sites),
      activeId: query.site,
    };
  }

  props.subHeaderText = getSubHeaderText(childCount, sites, query.month);
  return props;
};

/****************** HELPER FUNCTIONS  ***********************/
function getSubHeaderText(
  childCount: number,
  userSites: Site[],
  activeMonth?: string
) {
  let returnText = `${childCount} children enrolled`;
  if (userSites.length > 1) {
    returnText += ` at ${userSites.length} sites`;
  }
  if (activeMonth) {
    returnText += ` in ${moment
      .utc(activeMonth, QUERY_STRING_MONTH_FORMAT)
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
    id: 'all-sites',
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
