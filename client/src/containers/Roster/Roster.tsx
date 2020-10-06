import React, { useContext, useState, useEffect } from 'react';
import idx from 'idx';
import { Accordion, Table, Button, AlertProps } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Child, AgeGroup } from '../../shared/models';
import { apiGet } from '../../utils/api';
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
import { apiPut } from '../../utils/api';

const MAX_LENGTH_EXPANDED = 50;

const Roster: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const { user } = useContext(UserContext);
  const organizations = user?.organizations;
  // TODO: let user select between orgs
  const organization = organizations ? organizations[0] : undefined;
  const showOrgInTables = idx(user, (_) => _.organizations.length > 1) || false;

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    apiGet('children', { accessToken })
      .then((_children) => {
        if (_children) setChildren(_children);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const numberOfChildrenWithErrors = children.filter(
    (c) => c.validationErrors && c.validationErrors.length > 0
  ).length;
  const childrenWithErrorsAlert: AlertProps = {
    text: (
      <span>
        `You'll need to add required info for{' '}
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
    if (numberOfChildrenWithErrors) {
      setAlerts([...alerts, childrenWithErrorsAlert]);
    }
  }, [numberOfChildrenWithErrors]);

  const childrenByAgeGroup: { [key in AgeGroup]?: Child[] } = {};
  children.reduce((_byAgeGroup, _child) => {
    const ageGroup = idx(_child, (_) => _.enrollments[0].ageGroup) || undefined;
    if (ageGroup) {
      if (!!!_byAgeGroup[ageGroup]) {
        _byAgeGroup[ageGroup] = [_child];
      } else {
        // acc[ageGroup] is not _actually_ possibly undefined; checked in above if
        _byAgeGroup[ageGroup]?.push(_child);
      }
    }

    return _byAgeGroup;
  }, childrenByAgeGroup);

  const accordionItems = Object.entries(childrenByAgeGroup)
    .filter((entry) => entry[1] && entry[1].length)
    .map(([ageGroup, ageGroupChildren = []]) => ({
      id: ageGroup,
      title: (
        <>
          {ageGroup}{' '}
          <span className="text-normal">
            {pluralize('children', ageGroupChildren.length, true)}{' '}
          </span>
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

  const distinctSiteIds: number[] = [];
  children.reduce((total, child) => {
    const siteId = idx(child, (_) => _.enrollments[0].site.id);
    if (siteId && !total.includes(siteId)) total.push(siteId);
    return total;
  }, distinctSiteIds);

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
          {loading
            ? 'Loading...'
            : `${children.length} children enrolled at ${distinctSiteIds.length} sites`}
        </p>
        <div className="display-flex flex-col flex-align center flex-justify-start margin-top-2 margin-bottom-4">
          <AddRecordButton orgs={organizations} />
          <CSVDownloadLink />
        </div>
        <Accordion items={accordionItems} titleHeadingLevel="h2" />
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
