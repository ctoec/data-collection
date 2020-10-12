import React, { useContext, useEffect } from 'react';
import idx from 'idx';
import {
  Accordion,
  Table,
  Button,
  AlertProps,
  Alert,
  Error,
  InlineIcon,
} from '@ctoec/component-library';
import { Child, AgeGroup } from '../../shared/models';
import { tableColumns } from '../Roster/TableColumns';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';
import { RosterSectionHeader } from './RosterSectionHeader';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import pluralize from 'pluralize';
import { AddRecordButton } from '../../components/AddRecordButton';
import { Link, useHistory } from 'react-router-dom';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { apiPut } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';

const MAX_LENGTH_EXPANDED = 50;

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  const organizations = user?.organizations;
  const organization = organizations ? organizations[0] : undefined;
  const showOrgInTables = idx(user, (_) => _.organizations.length > 1) || false;

  const { children } = useContext(DataCacheContext);

  const numberOfChildrenWithErrors = children.records.filter(
    (c) => c.validationErrors && c.validationErrors.length > 0
  ).length;
  const childrenWithErrorsAlert: AlertProps = {
    text: (
      <span>
        You'll need to add required info for{' '}
        {pluralize('record', numberOfChildrenWithErrors, true)} before
        submitting your data to OEC. Update with{' '}
        <Link className="usa-button usa-button--unstyled" to="/batch-edit">
          batch editing.
        </Link>
      </span>
    ),
    heading: 'Update roster before submitting',
    type: 'warning',
  };
  const { alertElements, setAlerts, alerts } = useAlerts();

  useEffect(() => {
    if (children.loading) {
      setAlerts([]);
      return;
    }

    if (numberOfChildrenWithErrors) {
      setAlerts([...alerts, childrenWithErrorsAlert]);
    }
  }, [children.loading, numberOfChildrenWithErrors]);

  const NoAgeGroup = 'No age group';
  type RosterSections = AgeGroup | typeof NoAgeGroup;
  const childrenByAgeGroup: { [key in RosterSections]?: Child[] } = {};
  children.records.reduce((_byAgeGroup, _child) => {
    const ageGroup = idx(_child, (_) => _.enrollments[0].ageGroup) || undefined;
    if (ageGroup) {
      if (!!!_byAgeGroup[ageGroup]) {
        _byAgeGroup[ageGroup] = [_child];
      } else {
        // acc[ageGroup] is not _actually_ possibly undefined; checked in above if
        _byAgeGroup[ageGroup]?.push(_child);
      }
    } else {
      if (!_byAgeGroup[NoAgeGroup]) {
        _byAgeGroup[NoAgeGroup] = [_child];
      } else {
        _byAgeGroup[NoAgeGroup]?.push(_child);
      }
    }
    return _byAgeGroup;
  }, childrenByAgeGroup);

  const accordionItems = Object.entries(childrenByAgeGroup)
    .filter(
      ([_, ageGroupChildren]) => ageGroupChildren && ageGroupChildren.length
    )
    .map(([ageGroup, ageGroupChildren = []]) => ({
      id: ageGroup,
      title: (
        <>
          {ageGroup === NoAgeGroup && <InlineIcon icon="attentionNeeded" />}
          {ageGroup}{' '}
          <span className="text-normal">
            {pluralize('children', ageGroupChildren.length, true)}{' '}
          </span>
          {ageGroup === NoAgeGroup && (
            <>
              <br />
              <p className="usa-error-message margin-y-0 font-body-md">
                All records must have an assigned age group
              </p>
            </>
          )}
        </>
      ),
      headerContent: <RosterSectionHeader children={ageGroupChildren} />,
      expandText: `Show ${ageGroup} roster`,
      collapseText: `Hide ${ageGroup} roster`,
      content: (
        <Table<Child>
          className="margin-bottom-4"
          id={`roster-table-${ageGroup}`}
          rowKey={(row) => row.id}
          data={ageGroupChildren}
          columns={tableColumns(showOrgInTables)}
          defaultSortColumn={0}
          defaultSortOrder="ascending"
        />
      ),
      isExpanded: ageGroupChildren.length <= MAX_LENGTH_EXPANDED,
    }));

  async function submitToOEC() {
    await apiPut(`oec-report/${organization?.id}`, undefined, { accessToken });
    history.push('/success');
  }

  return (
    <>
      <div className="Roster grid-container">
        {alertElements}
        <h1 className="margin-bottom-0" ref={h1Ref}>
          {organization?.providerName}
        </h1>
        <p className="font-body-xl margin-top-1">
          {children.loading
            ? 'Loading...'
            : `${children.records.length} children enrolled at ${user?.sites?.length} sites`}
        </p>
        <div className="display-flex flex-col flex-align center flex-justify-start margin-top-2 margin-bottom-4">
          <AddRecordButton orgs={organizations} />
          <CSVDownloadLink />
        </div>

        {children.records.length == 0 ? (
          <Alert
            heading="No records in your roster"
            type="info"
            text="Get started by adding records to your roster"
            actionItem={<AddRecordButton orgs={organizations} />}
          />
        ) : (
          <Accordion items={accordionItems} titleHeadingLevel="h2" />
        )}
      </div>

      <FixedBottomBar>
        <Button
          text="Back to getting started"
          href="/getting-started"
          appearance="outline"
        />
        <Button text="Send to OEC" onClick={submitToOEC} />
      </FixedBottomBar>
    </>
  );
};

export default Roster;
