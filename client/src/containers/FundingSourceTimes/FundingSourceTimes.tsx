import React from 'react';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import { FundingSourceTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const FundingSourceTimes: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  const columns: Column<FundingSourceTime>[] = [
    {
      name: 'Funding Type',
      cell: ({ row }) =>
        row ? (
          <th scope="row">
            <div className="text-bold">{row.displayName}</div>
            <div>({row.fundingSources.join(' or ')})</div>
          </th>
        ) : (
          <></>
        ),
    },
    {
      name: 'Contract Space',
      cell: ({ row }) =>
        row ? (
          <td>
            {row.fundingTimes.map((fundingTime) => {
              return (
                <div className="margin-top-3 margin-bottom-3">
                  {fundingTime.value}
                </div>
              );
            })}
          </td>
        ) : (
          <></>
        ),
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) =>
        row ? (
          <td>
            {row.fundingTimes.map((fundingTime) => {
              return (
                <div className="margin-top-3 margin-bottom-3">
                  {fundingTime.formats
                    .map((format) => '"' + format + '"')
                    .join(' or ')}
                </div>
              );
            })}
          </td>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1 ref={h1Ref}>Funding space types</h1>
      <p className="text-pre-line">
        This guide shows accepted formats for each funding space type when using
        OEC's data template.
      </p>
      <div className="margin-top-4">
        <Table
          id="data-requirements-table"
          data={FUNDING_SOURCE_TIMES}
          rowKey={(row) => (row ? row.displayName : '')}
          columns={columns}
          defaultSortColumn={0}
        />
      </div>
    </div>
  );
};

export default FundingSourceTimes;
