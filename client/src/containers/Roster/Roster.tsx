import React, { useContext, useEffect } from 'react';
import { Moment } from 'moment';
import {
  Accordion,
  Button,
  Alert,
  TabItem,
  TabNav,
  HeadingLevel,
} from '@ctoec/component-library';
import { stringify } from 'query-string';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
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
  getOrganizationItems,
  getQueryMonthFormat,
  getSiteItems,
  getSubHeaderText,
  parseQueryParams,
} from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import { MonthFilterIndicator } from './MonthFilter/MonthFilterIndicator';
import { useRosterFilters } from './useRosterFilters';

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const isSiteLevelUser = user?.accessType === 'site';
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const location = useLocation();

  // TODO: if query params are nonsense or user doesn't have access, should we throw an error or just ignore?
  const userOrganizations = user?.organizations || [];
  const userSites = user?.sites || [];

  const { children: childrenCache } = useContext(DataCacheContext);
  const { records: allChildren } = childrenCache;

  // Parse query params and filter children
  const { activeMonth, activeSiteId, activeOrgId } = parseQueryParams(
    location.search,
    userSites
  );

  const updateActiveMonth = (newMonth: Moment) => {
    const month = getQueryMonthFormat(newMonth);
    history.replace({
      search: stringify({
        organization: activeOrgId,
        site: activeSiteId,
        month,
      }),
    });
  };

  const {
    childrenFilteredByMonth,
    childrenFilteredByLocation,
    childrenFilteredByAll,
    childrenWithErrors,
  } = useRosterFilters({ allChildren, activeOrgId, activeSiteId, activeMonth });

  // Out of all of the children ever
  const numberOfChildrenWithErrors = childrenWithErrors.length;
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

  async function submitToOEC() {
    // If there's an active org submit
    // Otherwise button should be disabled for now
    // TODO: figure out how submit works for multi-site users
    if (activeOrgId) {
      await apiPut(`oec-report/${activeOrgId}`, undefined, { accessToken });
    }
    history.push('/success');
  }

  // Base case is single site user
  let h1Content = userSites.length ? userSites[0].siteName : 'Loading...';
  let subHeaderText = '';

  if (user && !childrenCache.loading) {
    subHeaderText = getSubHeaderText(
      activeMonth ? childrenFilteredByMonth : allChildren,
      userSites,
      activeMonth
    );
  }

  const childrenByAgeGroup = getChildrenByAgeGroup(childrenFilteredByAll);
  const accordionItems = getAccordionItems(childrenByAgeGroup, {
    hideCapacity: isSiteLevelUser,
    showOrgInTables: userOrganizations.length > 1 || false,
  });
  const accordionProps = {
    items: accordionItems,
    titleHeadingLevel: 'h2' as HeadingLevel,
  };

  let tabNavProps: TabNav | undefined;
  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    const month = getQueryMonthFormat(activeMonth);
    if (clickedItem.nestedItemType) {
      // If it has a nested item type then it's an org
      history.replace({
        search: stringify({ organization: clickedId, month }),
      });
    } else {
      history.replace({ search: stringify({ site: clickedId, month }) });
    }
  };

  // Multi site, single org user
  if (userSites.length > 1 && userOrganizations.length === 1) {
    // If user only has one org, just show sites and make the h1 the org
    h1Content = userOrganizations[0].providerName;
    tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteItems(userSites),
      activeId: activeSiteId,
    };
  } else if (userOrganizations.length > 1) {
    // If user has multiple orgs, show them all and placeholder the h1
    h1Content = 'Multiple organizations';
    // TODO: replace placeholder with community name
    tabNavProps = {
      itemType: 'organization',
      items: getOrganizationItems(userOrganizations, userSites),
      onClick: tabNavOnClick,
      nestedActiveId: activeSiteId,
      activeId: activeOrgId,
    };
  } else if (userSites.length > 1) {
    // User has no organization permissions, is restricted on page
    tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteItems(userSites),
      activeId: activeSiteId,
    };
  }

  return (
    <>
      <div className="Roster grid-container">
        <BackButton
          text="Back to getting started"
          location="/getting-started"
        />
        {alertElements}
        <div className="grid-row flex-align-center">
          <div className="tablet:grid-col-10">
            <h1 className="margin-bottom-0" ref={h1Ref}>
              {isSiteLevelUser && (
                <div className="margin-bottom-1 font-body-sm text-base-darker">
                  {userOrganizations[0].providerName}
                </div>
              )}
              {h1Content}
            </h1>
            <p className="font-body-xl margin-top-1">{subHeaderText}</p>
          </div>
          <div className="tablet:grid-col-2">
            <MonthFilterIndicator
              filterByMonth={activeMonth}
              setFilterByMonth={updateActiveMonth}
            />
          </div>
        </div>
        <RosterButtonsTable
          organizations={userOrganizations}
          filterByMonth={activeMonth}
          setFilterByMonth={updateActiveMonth}
        />
        {!childrenFilteredByLocation.length ? (
          <Alert
            heading="No records in your roster"
            type="info"
            text="Get started by adding records to your roster"
            actionItem={
              <AddRecordButton
                orgs={userOrganizations}
                id="add-record-in-alert"
              />
            }
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
        {!isSiteLevelUser && (
          <Button
            text={
              isSiteLevelUser
                ? 'Organization permissions required to submit'
                : 'Send to OEC'
            }
            onClick={submitToOEC}
            disabled={!activeOrgId}
          />
        )}
      </FixedBottomBar>
    </>
  );
};

export default Roster;
