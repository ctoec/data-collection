import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DataTable,
  DataTableCustomRenderProps,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react';
import pluralize from 'pluralize';
import { stringify } from 'query-string';
import { IncompleteIcon } from '../../components/IncompleteIcon';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import {
  AgeGroup,
  Child,
  FundingTime,
  ObjectWithValidationErrors,
  Site,
} from '../../shared/models';
import { AgeGroupCount } from '../../shared/payloads/AgeGroupCount';
import { apiGet } from '../../utils/api';
import { nameFormatter } from '../../utils/formatters';
import { getStrippedFundingSourceName } from '../../utils/getFundingSpaceDisplayName';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { RosterSummaryCard } from './RosterSummaryCard';
import { Divider, Button } from '@ctoec/component-library';
import { AddRecordButton } from '../../components/AddRecordButton';

export interface ChildRow extends ObjectWithValidationErrors {
  ageGroup?: AgeGroup;
  enrollmentDate?: string;
  fundingSource?: string;
  fundingTime?: FundingTime;
  id: string;
  missingInfo: boolean;
  name: string;
  site?: Site['siteName'];
}

const Roster: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const userOrg = (user?.organizations || [])[0];
  const h1ref = getH1RefForTitle();

  const [childCounts, setChildCounts] = useState<AgeGroupCount>(
    Object.values(AgeGroup).reduce(
      (a, v) => ({ ...a, [v]: 0 }),
      {}
    ) as AgeGroupCount
  );

  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getRosterSubHeader() {
        const counts = await apiGet(
          `children/count?${stringify({
            organizationId: userOrg.id,
          })}`,
          accessToken
        );
        setChildCounts(counts);
      })();
    }
  }, [user, userOrg, accessToken]);

  const [sites, setSites] = useState<Site[]>([]);
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getSites() {
        const sites = await apiGet('sites', accessToken);
        setSites(sites);
      })();
    }
  }, [user, userOrg, accessToken]);

  const [childRows, setChildRows] = useState<ChildRow[]>([]);
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getChildRows() {
        const children: Child[] = await apiGet('children', accessToken);
        setChildRows(
          children.map((child) => {
            const { ageGroup, entry, fundings, site } =
              child.enrollments?.[0] ?? {};
            const [{ fundingSpace }] = fundings ?? [{}];
            return {
              ageGroup,
              enrollmentDate: entry?.format('MM/DD/YYYY'),
              fundingSource: fundingSpace?.source
                ? getStrippedFundingSourceName(fundingSpace?.source)
                : undefined,
              fundingTime: fundingSpace?.time,
              id: child.id,
              name: nameFormatter(child, {
                lastNameFirst: true,
                capitalize: true,
              }),
              site: site?.siteName,
              missingInfo: !!child.validationErrors?.length,
            };
          })
        );
      })();
    }
  }, [user, userOrg, accessToken]);

  return (
    <div className="margin-top-4 grid-container">
      <h1 ref={h1ref}>{userOrg.providerName}</h1>

      <p>
        Your roster has&nbsp;
        <span className="text-underline">
          {pluralize(
            'child',
            Object.values(childCounts).reduce(
              (a: number, v: any) => (a += v),
              0
            ),
            true
          )}
        </span>
        &nbsp;enrolled across&nbsp;
        <span className="text-underline">
          {pluralize('sites', sites.length, true)}
        </span>
        .
      </p>

      <div className="grid-row three-column-layout">
        <RosterSummaryCard
          ageGroup={AgeGroup.InfantToddler}
          count={childCounts[AgeGroup.InfantToddler]}
        />
        <RosterSummaryCard
          ageGroup={AgeGroup.Preschool}
          count={childCounts[AgeGroup.Preschool]}
        />
        <RosterSummaryCard
          ageGroup={AgeGroup.SchoolAge}
          count={childCounts[AgeGroup.SchoolAge]}
        />
      </div>

      <div className="grid-row grid-gap">
        <h3 className="tablet:grid-col-9 margin-bottom-1">Roster</h3>
        <div className="tablet:grid-col-2 margin-top-1 action-button">
          <Button
            text="Upload File"
            href="/upload"
          />
        </div>
        <div className="tablet:grid-col-2 margin-top-1 action-button">
          <AddRecordButton id="roster-add-record" />
        </div>
      </div>
      <Divider />

      <div className="margin-top-4">
        <DataTable
          rows={childRows}
          headers={[
            { key: 'name', header: 'Name' },
            { key: 'ageGroup', header: 'Age group' },
            { key: 'fundingSource', header: 'Funding type' },
            { key: 'fundingTime', header: 'Space type' },
            { key: 'site', header: 'Site' },
            { key: 'enrollmentDate', header: 'Enrollment date' },
          ]}
        >
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
          }: DataTableCustomRenderProps) => (
            <Table {...getTableProps()} className="roster font-body-2xs">
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      key={header.key}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-pre text-center break-spaces"
                      >
                        {cell.info.header === 'name' ? (
                          <>
                            <Link
                              className="usa-button usa-button--unstyled font-body-2xs text-no-wrap margin-right-1"
                              to={{
                                pathname: `/edit-record/${cell.id}`,
                              }}
                            >
                              {cell.value}
                            </Link>
                            {childRows[i].missingInfo && <IncompleteIcon />}
                          </>
                        ) : (
                          cell.value
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default Roster;
