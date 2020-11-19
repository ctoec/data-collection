import React, { useContext } from 'react';
import { Moment } from 'moment';
import {
  Accordion,
  Button,
  TabNav,
  HeadingLevel,
  LoadingWrapper,
  ErrorBoundary,
} from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import moment from 'moment';
import UserContext from '../../contexts/UserContext/UserContext';
// TODO: Uncomment this import when you want to reactivate the
// bottom bar with buttons
// import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { Link, useHistory } from 'react-router-dom';
import { apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  getAccordionItems,
  getQueryMonthFormat,
  QUERY_STRING_MONTH_FORMAT,
  applySiteFilter,
} from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import { NoRecordsAlert } from './NoRecordsAlert';
import {
  useUpdateRosterParams,
  useOrgSiteProps,
  useChildrenWithErrorsAlert,
  usePaginatedChildData,
} from './hooks';
import { RosterFilterIndicator } from '../../components/RosterFilterIndicator/RosterFilterIndicator';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';

export type RosterQueryParams = {
  organization?: string;
  site?: string;
  month?: string;
  withdrawn?: boolean;
};

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const isSiteLevelUser = user?.accessType === 'site';
  const userOrganizations = user?.organizations || [];
  const isMultiOrgUser = userOrganizations.length > 1;

  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  // Parse query params, and update if missing (i.e. initial load) or invalid
  useUpdateRosterParams();
  const query = parse(history.location.search) as RosterQueryParams;
  const queryMonth = query.month
    ? moment.utc(query.month, QUERY_STRING_MONTH_FORMAT)
    : undefined;

  // TODO: handle fetching error
  const { children: allChildrenForOrg, stillFetching } = usePaginatedChildData({
    ...query,
    withdrawn: false,
  });
  const {
    children: withdrawnChildren,
    stillFetching: stillFetchingWithdrawn,
  } = usePaginatedChildData({ ...query, withdrawn: true });
  const children = query.withdrawn ? withdrawnChildren : allChildrenForOrg;
  const loading = stillFetching || stillFetchingWithdrawn;
  const isSingleSiteView = query.site ? true : false;

  // Get alerts for page, including alert for children with errors
  // (which includes count of ALL children with errors for the active org)
  const { alertElements } = useChildrenWithErrorsAlert(
    loading,
    (allChildrenForOrg || []).filter(
      (child) => child?.validationErrors && child.validationErrors.length
    ).length,
    (withdrawnChildren || []).filter(
      (child) => child?.validationErrors && child.validationErrors.length
    ).length,
    query.organization
  );

  // Organization filtering happens on the server-side,
  // but site filtering needs to happen in the client-side, if a
  // site is requested
  const siteFilteredChildren = applySiteFilter(children, query.site);

  // Get props for tabNav, h1Text, and subHeaderText, superHeaderText, and subSubHeader
  // based on user access (i.e. user's sites and org permissions)
  const {
    tabNavProps,
    h1Text,
    subHeaderText,
    rosterH2,
    superHeaderText,
  } = useOrgSiteProps(
    !children || !query.organization,
    (children || []).length,
    (siteFilteredChildren || []).length
  );

  // Get roster content as accordion props
  const accordionProps = siteFilteredChildren
    ? {
        items: getAccordionItems(siteFilteredChildren, {
          hideCapacity: isSiteLevelUser || isSingleSiteView,
          hideOrgColumn: !isMultiOrgUser,
          hideExitColumn: !query.withdrawn,
        }),
        titleHeadingLevel: (rosterH2 ? 'h3' : 'h2') as HeadingLevel,
      }
    : undefined;

  // Function to submit data to OEC, to pass down into submit button
  async function submitToOEC() {
    // If there's an active org submit
    if (query.organization) {
      await apiPut(`oec-report/${query.organization}`, undefined, {
        accessToken,
      });
      history.push('/success');
    }
    // Otherwise, do nothing (button should be disabled)
  }

  // Function to update active month, to pass down into month filter buttons
  const updateActiveMonth = (newMonth?: Moment) => {
    const month = getQueryMonthFormat(newMonth);
    history.push({
      search: stringify({
        ...query,
        withdrawn: undefined,
        month,
      }),
    });
  };

  // Function to update whether we're only showing withdrawn enrollments
  const updateWithdrawnOnly = (showOnlyWithdrawn: boolean) => {
    history.push({
      search: stringify({
        ...query,
        month: undefined,
        withdrawn: showOnlyWithdrawn || undefined, // Can't have both filters active
      }),
    });
  };

  let rosterContent = <NoRecordsAlert />;
  if (query.withdrawn) {
    // Default for no children and show only withdrawn
    rosterContent = (
      <div className="margin-top-4 margin-bottom-4">
        <div className="font-body-lg margin-bottom-2">
          You have no withdrawn enrollments
        </div>
        {/* TODO: we're doing a lot of sketchy buttons-that-go-somewhere stuff, and they should probably all be links */}
        <Link
          to={{
            ...history.location,
            search: stringify({ ...query, withdrawn: undefined }),
          }}
        >
          Return to current roster
        </Link>
      </div>
    );
  }
  if (children?.length && accordionProps?.items.length) {
    rosterContent = <Accordion {...accordionProps} />;
  }
  if (tabNavProps)
    rosterContent = (
      <TabNav {...tabNavProps}>
        <>
          {rosterH2}
          {rosterContent}
        </>
      </TabNav>
    );

  return (
    <>
      <div className="Roster grid-container">
        <BackButton
          text="Back to getting started"
          location="/getting-started"
        />
        {alertElements}
        <div className="grid-row flex-align-center">
          <div className="tablet:grid-col-9">
            <h1 className="margin-bottom-0" ref={h1Ref}>
              {superHeaderText && (
                <div className="margin-bottom-1 font-body-sm text-base-darker">
                  {superHeaderText}
                </div>
              )}
              {h1Text}
            </h1>
            <p className="font-body-xl margin-top-1">{subHeaderText}</p>
          </div>
          <div className="tablet:grid-col-3">
            {queryMonth && (
              <RosterFilterIndicator
                filterTitleText={queryMonth.format('MMMM YYYY')}
                reset={() => updateActiveMonth(undefined)}
                icon="calendar"
              />
            )}
            {!!query.withdrawn && (
              <RosterFilterIndicator
                filterTitleText="Withdrawn enrollments"
                reset={() => updateWithdrawnOnly(false)}
                icon="history"
              />
            )}
          </div>
        </div>
        <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
          {!query.withdrawn && (
            <RosterButtonsTable
              filterByMonth={queryMonth}
              setFilterByMonth={updateActiveMonth}
              updateWithdrawnOnly={updateWithdrawnOnly}
            />
          )}
          <LoadingWrapper text="Loading your roster..." loading={loading}>
            {rosterContent}
          </LoadingWrapper>
        </ErrorBoundary>
      </div>
      {/* // TODO: Re-enable the bottom bar once we're in January and using the app
      <FixedBottomBar>
        <Button
          text="Back to getting started"
          href="/getting-started"
          appearance="outline"
        />
        {!isSiteLevelUser && (
          <Button
            text={
              isSiteLevelUser
                ? 'Organization permissions required to submit'
                : 'Send to OEC'
            }
            onClick={submitToOEC}
            disabled={!query.organization}
          />
        )}
      </FixedBottomBar> */}
    </>
  );
};

export default Roster;
