import React, { useContext, useState, useEffect } from 'react';
import { Moment } from 'moment';
import {
  TabNav,
  HeadingLevel,
  LoadingWrapper,
  ErrorBoundary,
  Button,
  AlertProps,
} from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import moment from 'moment';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useHistory } from 'react-router-dom';
import { apiGet, apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  getAccordionItems,
  getQueryMonthFormat,
  QUERY_STRING_MONTH_FORMAT,
  applySiteFilter,
  getRosterH2,
  filterChildrenByWithdrawn,
} from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import {
  useUpdateRosterParams,
  useOrgSiteProps,
  usePaginatedChildData,
} from './hooks';
import { RosterFilterIndicator } from '../../components/RosterFilterIndicator/RosterFilterIndicator';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { RosterContent } from './RosterContent';
import { EmptyRosterCard } from './EmptyRosterCard';
import { useAlerts } from '../../hooks/useAlerts';
import RosterContext from '../../contexts/RosterContext/RosterContext';
import { getChildrenWithErrorsAlert } from './rosterUtils/getChildrenWithErrorsAlert';
import { DataCompleteModal } from './DataCompleteModal';

export type RosterQueryParams = {
  organization?: string;
  site?: string;
  month?: string;
  withdrawn?: boolean;
};

// Define a constant for the alert that shows once an organization
// has submitted its data to OEC
const SUBMITTED: AlertProps = {
  text:
    'Make revisions and updates, such as new enrollments, directly in your ECE reporter roster.',
  heading: 'You completed your July to December data collection!',
  type: 'info',
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

  // Track roster query so we can update cache appropriately and navigate back to it
  const { setRosterQuery } = useContext(RosterContext);
  useEffect(() => {
    if (query) setRosterQuery(query);
  }, [query?.organization, query?.month]);

  let {
    children: allChildren,
    stillFetching: loading,
    error: fetchRosterError
  } = usePaginatedChildData(query);

  if (fetchRosterError) {
    loading = false;
    throw fetchRosterError;
  }

  const {
    active: activeChildren,
    withdrawn: withdrawnChildren,
  } = filterChildrenByWithdrawn(allChildren || []);
  const rosterIsEmpty = (allChildren || []).length === 0;
  const displayChildren = query.withdrawn ? withdrawnChildren : activeChildren;
  const isSingleSiteView = query.site ? true : false;

  // Get other alerts for page, including alert for children with errors
  // (which includes count of ALL children with errors for the active org)
  const [alertType, setAlertType] = useState<'warning' | 'error'>('warning');
  const activeChildrenWithErrorsCount = activeChildren.filter(
    (child) => child?.validationErrors && child.validationErrors.length
  ).length;
  const withdrawnChildrenWithErrorsCount = withdrawnChildren.filter(
    (child) => child?.validationErrors && child.validationErrors.length
  ).length;

  // Determine if we need to show the successful submit alert when loading
  // page (the alert is persistent and should appear at the top of the roster
  // any time after submitting until the end of the collection period)
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    apiGet(`oec-report/${query.organization}`, accessToken).then((res) => {
      setIsSubmitted(!!res?.submitted);
    });
  }, [query.organization, accessToken]);

  // Now get the alert for missing info, if applicable, and set all the
  // alerts at once
  const { setAlerts, alertElements } = useAlerts();
  useEffect(() => {
    const childrenWithErrorsAlert = getChildrenWithErrorsAlert(
      activeChildrenWithErrorsCount,
      withdrawnChildrenWithErrorsCount,
      alertType,
      query.organization
    );
    setAlerts((_alerts) => [
      isSubmitted ? SUBMITTED : undefined,
      ..._alerts.filter(
        (a) =>
          a?.heading !== childrenWithErrorsAlert?.heading &&
          a?.heading !== SUBMITTED.heading
      ),
      childrenWithErrorsAlert,
    ]);
  }, [
    isSubmitted,
    activeChildrenWithErrorsCount,
    withdrawnChildrenWithErrorsCount,
    alertType,
    query.organization,
  ]);

  // Organization filtering happens on the server-side,
  // but site filtering needs to happen in the client-side, if a
  // site is requested
  const siteFilteredChildren = applySiteFilter(displayChildren, query.site);

  // Get props for tabNav, h1Text, and subHeaderText, superHeaderText, and subSubHeader
  // based on user access (i.e. user's sites and org permissions)
  const {
    tabNavProps,
    h1Text,
    subHeaderText,
    superHeaderText,
  } = useOrgSiteProps(loading, displayChildren.length);

  const siteChildCount = (siteFilteredChildren || []).length;
  const siteIsEmpty = siteChildCount === 0;
  const rosterH2 = getRosterH2(siteChildCount, user?.sites, query);
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

  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);

  // Function to submit data to OEC, to pass down into submit button
  async function submitToOEC() {
    // Block submit if there are incomplete records / records with errors
    // Scroll to top of page and change alert to error, not warning
    if (
      activeChildrenWithErrorsCount + withdrawnChildrenWithErrorsCount !==
      0
    ) {
      window.scrollTo(0, 0);
      setAlertType('error');
      return;
    }
    // If there's an active org submit
    if (query.organization) {
      await apiPut(`oec-report/${query.organization}`, undefined, {
        accessToken,
      }).then(() => {
        setSubmittedModalOpen(true);
        setIsSubmitted(true);
      });
    }
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

  const rosterContentProps = {
    query,
    childRecords: displayChildren,
    accordionProps,
    rosterH2,
  };

  let rosterContent = tabNavProps ? (
    <TabNav {...tabNavProps}>
      {siteIsEmpty ? <></> : rosterH2}
      {
        // Decide if site is empty here to keep site-switching
        // controls available
        siteIsEmpty ? (
          <EmptyRosterCard boldText="This site doesn't have any records yet" />
        ) : (
          <RosterContent {...rosterContentProps} />
        )
      }
    </TabNav>
  ) : (
    <RosterContent {...rosterContentProps} />
  );

  return (
    <>
    <ErrorBoundary alertProps={defaultErrorBoundaryProps}>
      <div className="Roster grid-container">
        <BackButton
          location={
            query.month || query.withdrawn
              ? `/roster?organization=${query.organization}`
              : '/'
          }
        />
        <DataCompleteModal
          isOpen={submittedModalOpen}
          closeModal={() => setSubmittedModalOpen(false)}
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
      {!rosterIsEmpty && !isSubmitted && (
        <FixedBottomBar>
          <Button text="Back to home" href="/home" appearance="outline" />
          {!isSiteLevelUser && (
            <Button
              id="submit-button"
              text="My Jul-Dec data is complete"
              onClick={submitToOEC}
              disabled={!query.organization}
            />
          )}
        </FixedBottomBar>
      )}
      </ErrorBoundary>
    </>
  );
};

export default Roster;
