import React, { useContext, useState, useEffect } from 'react';
import idx from 'idx';
import {
  TextWithIcon,
  Accordion,
  Table,
  PlusCircle,
  Button,
} from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Child, AgeGroup } from '../../shared/models';
import { apiGet } from '../../utils/api';
import { tableColumns } from '../Roster/TableColumns';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';
import { RosterSectionHeader } from './RosterSectionHeader';
import { useAlerts } from '../../hooks/useAlerts';

const MAX_LENGTH_EXPANDED = 50;

const Roster: React.FC = () => {
  const { alertElements } = useAlerts();
  const { goBack } = useHistory();

  const { accessToken } = useContext(AuthenticationContext);
  const { user } = useContext(UserContext);
  // TODO add heirarchy to pick between organizations
  const organization = idx(user, (_) => _.organizations[0]);
  const showOrgInTables = idx(user, (_) => _.organizations.length > 1) || false;

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    apiGet('children', { accessToken })
      .then((_children) => {
        if (_children) setChildren(_children);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

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
        <RosterSectionHeader
          ageGroup={ageGroup as AgeGroup}
          children={ageGroupChildren}
        />
      ),
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

  return (
    <>
      <div className="Roster grid-container">
        {alertElements}
        <h2 className="font-body-xl margin-bottom-0">
          {organization?.providerName}
        </h2>
        <p className="font-body-xl margin-top-1">
          {loading
            ? 'Loading...'
            : `${children.length} children enrolled at ${distinctSiteIds.length} sites`}
        </p>
        <div className="display-flex flex-col flex-align center flex-justify-start margin-top-2 margin-bottom-4">
          <Link
            className="usa-button usa-button--unstyled"
            to={{ pathname: '/create-record', state: { organization } }}
          >
            <TextWithIcon Icon={PlusCircle} text="Add a record" />
          </Link>
          <CSVDownloadLink />
        </div>
        <Accordion items={accordionItems} titleHeadingLevel="h2" />
      </div>
      <FixedBottomBar>
        <Button text="Back" onClick={goBack} appearance="outline" />
        <Button text="Send to OEC" href="/success" />
      </FixedBottomBar>
    </>
  );
};

export default Roster;
