import React, { useContext, useEffect } from 'react';
import {
  Accordion,
  Button,
  Alert,
  TabItem,
  TabNav,
  HeadingLevel,
} from '@ctoec/component-library';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { AddRecordButton } from '../../components/AddRecordButton';
import { useHistory, useLocation } from 'react-router-dom';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  getAccordionItems,
  getChildrenByAgeGroup,
  getChildrenWithErrorsAlertProps,
  getFilteredChildren,
  getOrganizationItems,
  getSiteItems,
} from './rosterUtils';
import { parse } from 'query-string';

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  // TODO: if query params are nonsense or user doesn't have access, should we throw an error or just ignore?
  const organizations = user?.organizations || [];
  const sites = user?.sites || [];
  const showOrgInTables = organizations.length > 1 || false;

  const { children: childrenCache } = useContext(DataCacheContext);

  // Parse query params and filter children
  const location = useLocation();
  const { organization: paramOrgId, site: paramSiteId } = parse(
    location.search
  );
  // Parse method can return numbers or arrays-- make sure it's the right type
  const activeOrgId = paramOrgId?.toString();
  const activeSiteId = paramSiteId?.toString();
  const filteredChildren = getFilteredChildren(
    childrenCache.records,
    activeOrgId,
    activeSiteId
  );

  // TODO: should this be all of the children for the whole org or what?
  const numberOfChildrenWithErrors = childrenCache.records.filter(
    (c) => c.validationErrors && c.validationErrors.length > 0
  ).length;

  const childrenWithErrorsAlert = getChildrenWithErrorsAlertProps(
    numberOfChildrenWithErrors
  );
  const { alertElements, setAlerts, alerts } = useAlerts();

  useEffect(() => {
    if (childrenCache.loading) {
      setAlerts([]);
      return;
    }

    if (
      numberOfChildrenWithErrors &&
      !alerts.includes(childrenWithErrorsAlert)
    ) {
      // TODO: if we decide to count children shown on page in alert, need to use a different way to check whether we've already set the alert
      setAlerts([...alerts, childrenWithErrorsAlert]);
    }
  }, [childrenCache.loading, numberOfChildrenWithErrors]);

  const childrenByAgeGroup = getChildrenByAgeGroup(filteredChildren);

  const accordionItems = getAccordionItems(childrenByAgeGroup, showOrgInTables);

  // If there's an active org use that, otherwise grab it from the site
  let currentOrgId = activeOrgId;
  if (!activeOrgId && activeSiteId) {
    const activeSite = sites.find((s) => s.id === +activeSiteId);
    currentOrgId = `${
      activeSite?.organizationId || activeSite?.organization.id || ''
    }`;
  }
  async function submitToOEC() {
    // If there's an active org submit
    // Otherwise button should be disabled for now
    // TODO: figure out how submit works for multi-site users
    if (currentOrgId) {
      await apiPut(`oec-report/${currentOrgId}`, undefined, { accessToken });
    }
    history.push('/success');
  }

  // Base case is single site user
  let h1Content = sites.length ? sites[0].siteName : 'Loading...';
  const accordionProps = {
    items: accordionItems,
    titleHeadingLevel: 'h2' as HeadingLevel,
  };

  let tabNavProps: TabNav | undefined;
  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    if (clickedItem.nestedItemType) {
      // If it has a nested item type then it's an org
      history.replace(`/roster?organization=${clickedId}`);
    } else {
      // Else it's a site
      history.replace(`/roster?site=${clickedId}`);
    }
  };

  // Multi site, single org user
  if (sites.length > 1 && organizations.length === 1) {
    // If user only has one org, just show sites and make the h1 the org
    h1Content = organizations[0].providerName;
    tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteItems(sites),
      activeId: activeSiteId,
    };
  } else if (organizations.length > 1) {
    // If user has multiple orgs, show them all and placeholder the h1
    h1Content = 'Multiple organizations';
    // TODO: replace placeholder with community name
    tabNavProps = {
      itemType: 'organization',
      items: getOrganizationItems(organizations, sites),
      onClick: tabNavOnClick,
      nestedActiveId: activeSiteId,
      activeId: activeOrgId,
    };
  }

  return (
    <>
      <div className="Roster grid-container">
        {alertElements}
        <h1 className="margin-bottom-0" ref={h1Ref}>
          {h1Content}
        </h1>
        <p className="font-body-xl margin-top-1">
          {/* TODO: should this count be just for the thing showing or for all of them? */}
          {childrenCache.loading
            ? 'Loading...'
            : `${childrenCache.records.length} children enrolled at ${sites.length} sites`}
        </p>
        <div className="display-flex flex-col flex-align center flex-justify-start margin-top-2 margin-bottom-4">
          <AddRecordButton orgs={organizations} />
          <CSVDownloadLink />
        </div>
        {!filteredChildren.length ? (
          <Alert
            heading="No records in your roster"
            type="info"
            text="Get started by adding records to your roster"
            actionItem={<AddRecordButton orgs={organizations} />}
          />
        ) : tabNavProps ? (
          <TabNav {...tabNavProps}>
            <Accordion {...accordionProps} />
          </TabNav>
        ) : (
          <Accordion {...accordionProps} />
        )}
      </div>

      <FixedBottomBar>
        <Button
          text="Back to getting started"
          href="/getting-started"
          appearance="outline"
        />
        {/* TODO: change when we figure out multi-site entity */}
        <Button
          text="Send to OEC"
          onClick={submitToOEC}
          disabled={!currentOrgId}
        />
      </FixedBottomBar>
    </>
  );
};

export default Roster;
