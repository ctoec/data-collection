import React, { useContext } from 'react';
import { Moment } from 'moment';
import {
  Accordion,
  Button,
  TabNav,
  HeadingLevel,
  LoadingWrapper,
} from '@ctoec/component-library';
import { stringify, parse } from 'query-string';
import moment from 'moment';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useHistory } from 'react-router-dom';
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
import { NoRecordsAlert } from './NoRecordsAlert';
import {
  useUpdateRosterParams,
  useOrgSiteProps,
  useChildrenWithErrorsAlert,
  usePaginatedChildData,
} from './hooks';

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
  const query = parse(history.location.search) as {
    organization?: string;
    site?: string;
    month?: string;
  };
  const queryMonth = query.month
    ? moment.utc(query.month, QUERY_STRING_MONTH_FORMAT)
    : undefined;

  const { children, error } = usePaginatedChildData(query.organization);
  // Get alerts for page, including alert for children with errors
  // (which includes count of ALL children with errors for the active org)
  const { alertElements } = useChildrenWithErrorsAlert(
    !children,
    (children || []).filter(
      (child) => child.validationErrors && child.validationErrors.length
    ).length
  );
  const loading = !children && !error;

  // Organization filtering happens on the server-side,
  // but site filtering needs to happen in the client-side, if a
  // site is requested
  const clientSideFilteredChildren = applyClientSideFilters(
    children || [],
    query.site,
    queryMonth
  );

  const childrenByAgeGroup = getChildrenByAgeGroup(clientSideFilteredChildren);
  const accordionProps = {
    items: getAccordionItems(childrenByAgeGroup, {
      hideCapacity: isSiteLevelUser,
      showOrgInTables: isMultiOrgUser,
    }),
    titleHeadingLevel: 'h2' as HeadingLevel,
  };

  // Get props for tabNav, h1Text, and subHeaderText based on user access (i.e. user's sites and org permissions)
  const {
    tabNavProps,
    h1Text,
    subHeaderText,
    superHeaderText,
  } = useOrgSiteProps(
    !children || !query.organization,
    clientSideFilteredChildren.length
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

  let rosterContent = <NoRecordsAlert />;
  if (children?.length && accordionProps.items.length)
    rosterContent = <Accordion {...accordionProps} />;
  if (tabNavProps)
    rosterContent = <TabNav {...tabNavProps}>{rosterContent}</TabNav>;

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
              {superHeaderText && (
                <div className="margin-bottom-1 font-body-sm text-base-darker">
                  {superHeaderText}
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
        <LoadingWrapper text="Loading your roster..." loading={loading}>
          {rosterContent}
        </LoadingWrapper>
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
