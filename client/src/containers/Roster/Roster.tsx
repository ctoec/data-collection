import React, { useContext, useState, useEffect } from 'react';
import idx from 'idx';
import {
  TextWithIcon,
  Accordion,
  Table,
  PlusCircle,
  Button,
  FileDownload,
} from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Child, AgeGroup } from '../../shared/models';
import { apiGet } from '../../utils/api';
import { tableColumns } from '../CheckData/TableColumns';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';

const Roster: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);

  const { user } = useContext(UserContext);
  // TODO add heirarchy to pick between organizations
  const organization = idx(user, (_) => _.organizations[0]);

  const [children, setChildren] = useState<Child[]>([]);
  useEffect(() => {
    apiGet('/children', { accessToken }).then((_children) => {
      if (_children) setChildren(_children);
    });
  }, [accessToken]);

  const childrenByAgeGroup: { [key in AgeGroup]?: Child[] } = {};
  children.reduce((acc, child) => {
    const ageGroup = idx(child, (_) => _.enrollments[0].ageGroup) || undefined;
    if (ageGroup) {
      if (!!!acc[ageGroup]) {
        acc[ageGroup] = [child];
      } else {
        // acc[ageGroup] is not _actually_ possibly undefined; checked in above if
        acc[ageGroup]?.push(child);
      }
    }

    return acc;
  }, childrenByAgeGroup);

  const accordionItems = Object.entries(childrenByAgeGroup)
    .filter((entry) => entry[1] && entry[1].length)
    .map(([ageGroup, ageGroupChildren]) => ({
      id: ageGroup,
      title: (
        <p>
          <span className="text-bold">{ageGroup}</span>{' '}
          {ageGroupChildren?.length} children
        </p>
      ),
      expandText: `Show ${ageGroup} roster`,
      collapseText: `Hide ${ageGroup} roster`,
      content: (
        <Table<Child>
          id={`roster-table-${ageGroup}`}
          rowKey={(row) => row.id}
          data={ageGroupChildren || []}
          columns={tableColumns}
        />
      ),
    }));

  const distinctSiteIds: number[] = [];
  children.reduce((total, child) => {
    const siteId = idx(child, (_) => _.enrollments[0].site.id);
    if (siteId && !total.includes(siteId)) total.push(siteId);
    return total;
  }, distinctSiteIds);

  return (
    <div className="grid-container">
      <h2 className="font-body-xl margin-bottom-0">{organization?.name}</h2>
      <p className="font-body-xl margin-top-1">
        {children.length} children enrolled at {distinctSiteIds.length} sites
      </p>
      <div className="display-flex flex-col flex-align center flex-justify-start margin-top-2 margin-bottom-4">
        <Link
          className="usa-button usa-button--unstyled"
          to={{ pathname: '/create-record', state: { organization } }}
        >
          <TextWithIcon Icon={PlusCircle} text="Add a record" />
        </Link>
        {/* TODO hook up this button to download */}
        <Button
          className="margin-left-2"
          appearance="unstyled"
          text={
            <TextWithIcon
              Icon={FileDownload}
              text="Export current view (PLACEHOLDER)"
            />
          }
        />
      </div>
      <Accordion items={accordionItems} titleHeadingLevel="h2" />
    </div>
  );
};

export default Roster;
