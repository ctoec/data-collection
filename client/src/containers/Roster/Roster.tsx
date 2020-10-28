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
import { stringify, parse } from 'query-string';
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
	QUERY_STRING_MONTH_FORMAT,
} from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import { MonthFilterIndicator } from './MonthFilter/MonthFilterIndicator';
import { Child } from '../../shared/models';
import { useRosterFilters } from './useRosterFilters';
import useSWR from 'swr';
import moment from 'moment';
import { NoRecordsAlert } from './NoRecordsAlert';

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const isSiteLevelUser = user?.accessType === 'site';
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
 
 // Parse query params
 const location = useLocation();
 const query = parse(location.search) as {
   organization: string;
	 site: string;
	 month: string;
 };
 const queryMonth = query.month ? moment.utc(query.month, QUERY_STRING_MONTH_FORMAT) : undefined;

 const organizations = user?.organizations || [];
 const sites = user?.sites || [];
 const isMultiOrgUser = organizations.length > 1;
 const hasSiteLevelAccess = user?.accessType === 'site';

 // If missing (initial load), bad or invalid params, set them based on user data
 useEffect(() => {
   // Wait until user exists
   if (!user) return;

   let updatedQuery = { ...query };
   // Add org id if user has org-access AND:
   // - no org is active OR
   // - active org is invalid (user does not have access)
   if (isMultiOrgUser) {
     if (
       !query.organization ||
       !organizations.find((o) => o.id.toString() === query.organization)
     ) {
       updatedQuery.organization = organizations[0].id.toString();
     }
   }
   // Add site id if user has site access AND
   // - there is an active site AND
   // - active site is invalid (user does not have access)
   if (query.site && !sites.find((s) => s.id.toString() === query.site)) {
     delete updatedQuery.site;
   }

   if (Object.values(query) !== Object.values(updatedQuery)) {
     history.replace({ search: stringify(updatedQuery) });
   }
 }, [query.organization, query.site, organizations, sites]);

 // Update active month 
	const updateActiveMonth = (newMonth: Moment) => {
		const month = getQueryMonthFormat(newMonth);
		history.push({
			search: stringify({
				organization: query.organization,
				site: query.site,
				month,
			}),
		});
	};

 const { data: children, isValidating } = useSWR([
   `/children?organizationId=${query.organization}`,
   accessToken,
 ]) as { data: Child[] | undefined; isValidating: boolean };

  const {
    childrenFilteredByMonth,
    childrenFilteredByLocation,
    childrenFilteredByAll,
    childrenWithErrors,
  } = useRosterFilters({ allChildren: children || [], activeOrgId: query.organization, activeSiteId: query.site, activeMonth: queryMonth });

  // Out of all of the children ever
  const numberOfChildrenWithErrors = childrenWithErrors.length;
  const childrenWithErrorsAlert = getChildrenWithErrorsAlertProps(
    numberOfChildrenWithErrors
  );
  const { alertElements, setAlerts, alerts } = useAlerts();

  useEffect(() => {
    if (isValidating) {
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
  }, [isValidating, numberOfChildrenWithErrors]);

  async function submitToOEC() {
    // If there's an active org submit
    // Otherwise button should be disabled for now
    // TODO: figure out how submit works for multi-site users
    if (query.organization) {
      await apiPut(`oec-report/${query.organization}`, undefined, { accessToken });
    }
    history.push('/success');
  }

  // Base case is single site user
  let h1Content = sites.length ? sites[0].siteName : 'Loading...';
  let subHeaderText = '';

  if (user && !isValidating) {
    subHeaderText = getSubHeaderText(
      queryMonth ? childrenFilteredByMonth : (children || []),
			sites,
			queryMonth
    );
  }

  const childrenByAgeGroup = getChildrenByAgeGroup(childrenFilteredByAll);
  const accordionItems = getAccordionItems(childrenByAgeGroup, {
    hideCapacity: isSiteLevelUser,
    showOrgInTables: organizations.length > 1 || false,
  });

  let tabNavProps: TabNav | undefined;
  const tabNavOnClick = (clickedId: string, clickedItem: TabItem) => {
    if (clickedItem.nestedItemType) {
      // If it has a nested item type then it's an org
      history.push({
        search: stringify({ organization: clickedId, month: query.month }),
      });
    } else {
      history.push({ search: stringify({ site: clickedId, month: query.month }) });
    }
	};
	
  const accordionProps = {
    items: accordionItems,
    titleHeadingLevel: 'h2' as HeadingLevel,
  };
  // Multi site, single org user
  if (sites.length > 1 && organizations.length === 1) {
    // If user only has one org, just show sites and make the h1 the org
    h1Content = organizations[0].providerName;
    tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteItems(sites),
      activeId: query.site,
    };
  } else if (organizations.length > 1) {
    // If user has multiple orgs, show them all and placeholder the h1
    h1Content = 'Multiple organizations';
    // TODO: replace placeholder with community name
    tabNavProps = {
      itemType: 'organization',
      items: getOrganizationItems(organizations, sites),
      onClick: tabNavOnClick,
      nestedActiveId: query.site,
      activeId: query.organization,
    };
  } else if (sites.length > 1) {
    // User has no organization permissions, is restricted on page
    tabNavProps = {
      itemType: 'site',
      onClick: tabNavOnClick,
      items: getSiteItems(sites),
      activeId: query.site,
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
                  {organizations[0].providerName}
                </div>
              )}
              {h1Content}
            </h1>
            <p className="font-body-xl margin-top-1">{subHeaderText}</p>
          </div>
          <div className="tablet:grid-col-2">
            <MonthFilterIndicator
              filterByMonth={queryMonth}
              setFilterByMonth={updateActiveMonth}
            />
          </div>
        </div>
        <RosterButtonsTable
          organizations={organizations}
          filterByMonth={queryMonth}
          setFilterByMonth={updateActiveMonth}
        />
        {!(children || []).length ? (
         <NoRecordsAlert organizations={organizations} />
        ) : tabNavProps ? (
          <TabNav {...tabNavProps}>
            {accordionProps.items.length ? <Accordion {...accordionProps} /> : <NoRecordsAlert organizations={organizations} />}
          </TabNav>
        ) : (
          accordionProps.items.length ? <Accordion {...accordionProps} /> : <NoRecordsAlert organizations={organizations} />
				)}
      </div>

      <FixedBottomBar>
        <Button
          text="Back to getting started"
          href="/getting-started"
          appearance="outline"
        />
        {/* TODO: change when we figure out multi-site entity */}
        {!hasSiteLevelAccess && (
          <Button
            text={
              hasSiteLevelAccess
                ? 'Organization permissions required to submit'
                : 'Send to OEC'
            }
            onClick={submitToOEC}
            disabled={!query.organization}
          />
        )}
      </FixedBottomBar>
    </>
  );
};

export default Roster;
