import React, { useContext, useState, useEffect } from 'react';
import {
  TabNav,
  HeadingLevel,
  LoadingWrapper,
  ErrorBoundary,
  Button,
  AlertProps,
} from '@ctoec/component-library';
import moment from 'moment';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { getAccordionItems, applySiteFilter, getRosterH2 } from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import {
  useIsSubmitted,
  useOrgSiteProps,
  useValidationErrorCounts,
} from './hooks';
import { RosterFilterIndicator } from '../../components/RosterFilterIndicator/RosterFilterIndicator';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { RosterContent } from './RosterContent';
import { EmptyRosterCard } from './EmptyRosterCard';
import { useAlerts } from '../../hooks/useAlerts';
import RosterContext from '../../contexts/RosterContext/RosterContext';
import { getChildrenWithErrorsAlert } from './rosterUtils/getChildrenWithErrorsAlert';
import { DataCompleteModal } from './DataCompleteModal';

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
  const { accessToken } = useContext(AuthenticationContext);
  const {
    childRecords,
    fetching,
    query,
    rosterUser: { activeOrgId, isMultiOrgUser, isSiteLevelUser, user },
    updateQueryMonth,
    updateQueryWithdrawn,
  } = useContext(RosterContext);
  const [
    { activeErrorsCount, withdrawnErrorsCount },
  ] = useValidationErrorCounts();
  const [isSubmitted, setIsSubmitted] = useIsSubmitted();
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const [alertElements, setAlerts] = useAlerts();
  // Get props for tabNav, h1Text, and subHeaderText, superHeaderText, and subSubHeader
  // based on user access (i.e. user's sites and org permissions)
  const {
    tabNavProps,
    h1Text,
    subHeaderText,
    superHeaderText,
  } = useOrgSiteProps();
  // Now get the alert for missing info, if applicable, and set all the
  // alerts at once
  const [alertType, setAlertType] = useState<'warning' | 'error'>('warning');
  useEffect(() => {
    const childrenWithErrorsAlert = getChildrenWithErrorsAlert(
      activeErrorsCount,
      withdrawnErrorsCount,
      alertType,
      activeOrgId
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
    activeErrorsCount,
    withdrawnErrorsCount,
    alertType,
    activeOrgId,
  ]);

  // Function to submit data to OEC, to pass down into submit button
  async function submitToOEC() {
    // Block submit if there are incomplete records / records with errors
    // Scroll to top of page and change alert to error, not warning
    if (activeErrorsCount + withdrawnErrorsCount > 0) {
      window.scrollTo(0, 0);
      setAlertType('error');
      // If there's an active org, submit
    } else if (activeOrgId) {
      await apiPut(`oec-report/${activeOrgId}`, undefined, {
        accessToken,
      }).then(() => {
        setSubmittedModalOpen(true);
        setIsSubmitted(true);
      });
    }
  }

  // Organization filtering happens on the server-side,
  // but site filtering needs to happen in the client-side, if a
  // site is requested
  const siteFilteredChildren = applySiteFilter(
    childRecords,
    query.site,
    query.withdrawn
  );
  const siteChildCount = (siteFilteredChildren || []).length;
  const siteIsEmpty = siteChildCount === 0;
  const rosterH2 = getRosterH2(siteChildCount, user?.sites, query);
  // Get roster content as accordion props
  const accordionProps = siteFilteredChildren
    ? {
        items: getAccordionItems(siteFilteredChildren, {
          hideCapacity: isSiteLevelUser || !!query.site,
          hideOrgColumn: !isMultiOrgUser,
          hideExitColumn: !query.withdrawn,
        }),
        titleHeadingLevel: (rosterH2 ? 'h3' : 'h2') as HeadingLevel,
      }
    : undefined;
  const rosterContentProps = { query, childRecords, accordionProps, rosterH2 };

  return (
    <>
      <div className="Roster grid-container">
        <BackButton
          location={query.month || query.withdrawn ? '/roster' : '/'}
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
            {query.month && (
              <RosterFilterIndicator
                filterTitleText={
                  moment.utc(query.month)?.format('MMMM YYYY') ?? undefined
                }
                reset={() => updateQueryMonth(undefined)}
                icon="calendar"
              />
            )}
            {!!query.withdrawn && (
              <RosterFilterIndicator
                filterTitleText="Withdrawn enrollments"
                reset={() => updateQueryWithdrawn(undefined)}
                icon="history"
              />
            )}
          </div>
        </div>
        <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
          {!query.withdrawn && <RosterButtonsTable />}
          <LoadingWrapper text="Loading your roster..." loading={fetching}>
            {tabNavProps ? (
              <TabNav {...tabNavProps}>
                {!siteIsEmpty && rosterH2}
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
            )}
          </LoadingWrapper>
        </ErrorBoundary>
      </div>
      {childRecords?.length && !isSubmitted && (
        <FixedBottomBar>
          {!isSiteLevelUser && (
            <Button
              id="submit-button"
              text="My Jul-Dec data is complete"
              onClick={submitToOEC}
              disabled={!activeOrgId}
            />
          )}
        </FixedBottomBar>
      )}
    </>
  );
};

export default Roster;
