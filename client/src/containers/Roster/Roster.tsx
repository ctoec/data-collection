import React, { useContext } from 'react';
import { Moment } from 'moment';
import {
  Accordion,
  Button,
  TabNav,
  HeadingLevel,
} from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import moment from 'moment';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useHistory, useLocation } from 'react-router-dom';
import { apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  getAccordionItems,
  getChildrenByAgeGroup,
  getQueryMonthFormat,
  QUERY_STRING_MONTH_FORMAT,
  applyClientSideFilters,
} from './rosterUtils';
import { BackButton } from '../../components/BackButton';
import { RosterButtonsTable } from './RosterButtonsTable';
import { MonthFilterIndicator } from './MonthFilter/MonthFilterIndicator';
import { Child } from '../../shared/models';
import { NoRecordsAlert } from './NoRecordsAlert';
import {
  useUpdateRosterParams,
  useGenerateUserSpecificProps,
  useChildrenWithErrorsAlert,
} from './hooks';
import { useAuthenticatedSWR } from '../../hooks/useAuthenticatedSWR';

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const isSiteLevelUser = user?.accessType === 'site';
  const userOrganizations = user?.organizations || [];
  const isMultiOrgUser = userOrganizations.length > 1;

  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  // Parse query params, and update if missing (i.e. initial load) or invalid
  const location = useLocation();
  const query = parse(location.search) as {
    organization?: string;
    site?: string;
    month?: string;
  };

  const queryMonth = query.month
    ? moment.utc(query.month, QUERY_STRING_MONTH_FORMAT)
    : undefined;
  useUpdateRosterParams();

  // Fetch child data, filtered by organization and month
  const { data: children, isValidating } = useAuthenticatedSWR<Child[]>(
    query.organization
      ? `/children?${stringify({ organizationId: query.organization })}`
      : null
  );

  // Organization filtering happens on the server-side,
  // but site filtering needs to happen in the client-side, if a
  // site is requested
  const browserSideFilteredChildren = applyClientSideFilters(
    children || [],
    query.site,
    queryMonth
  );
  const childrenByAgeGroup = getChildrenByAgeGroup(browserSideFilteredChildren);
  const accordionProps = {
    items: getAccordionItems(childrenByAgeGroup, {
      hideCapacity: isSiteLevelUser,
      showOrgInTables: isMultiOrgUser,
    }),
    titleHeadingLevel: 'h2' as HeadingLevel,
  };

  // Get alerts for page, including alert for children with errors
  const { alertElements } = useChildrenWithErrorsAlert(
    isValidating,
    browserSideFilteredChildren.filter(
      (child) => child.validationErrors && child.validationErrors.length
    ).length
  );
  // Get props for tabNav, h1Text, and subHeaderText based on user access (i.e. user's sites and org permissions)
  const { tabNavProps, h1Text, subHeaderText } = useGenerateUserSpecificProps(
    isValidating,
    browserSideFilteredChildren.length
  );

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
              {h1Text}
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
          filterByMonth={queryMonth}
          setFilterByMonth={updateActiveMonth}
        />
        {isValidating ? (
          <></>
        ) : !(children || []).length ? (
          <NoRecordsAlert />
        ) : tabNavProps ? (
          <TabNav {...tabNavProps}>
            {accordionProps.items.length ? (
              <Accordion {...accordionProps} />
            ) : (
              <NoRecordsAlert />
            )}
          </TabNav>
        ) : accordionProps.items.length ? (
          <Accordion {...accordionProps} />
        ) : (
          <NoRecordsAlert />
        )}
      </div>

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
      </FixedBottomBar>
    </>
  );
};

export default Roster;
