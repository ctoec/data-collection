import React from 'react';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import { FundingSpaceType } from '../../shared/models';
import { FUNDING_SPACE_TYPES } from '../../shared/constants';

const FundingSpaceTypes: React.FC = () => {
  const columns: Column<FundingSpaceType>[] = [
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
        )
    },
    {
      name: 'Contract Space',
      cell: ({ row }) =>
        row ? (<td>
          {row.fundingTimes.map(space => {
            return <div>{space.displayName}</div>
          })}
        </td>
        ) : (
          <></>
        )
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) =>
        row ? (<td>
          {row.fundingTimes.map(space => {
            return <div>{space.formats.map(x => '"' + x + '"').join(' or ')}</div>
          })}
        </td>
        ) : (
          <></>
        )
    }
  ];


  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1>Funding space types</h1>
      <p className="text-pre-line">This guide shows accepted formats for each funding space type when using OEC's data template.</p>
      <div className="margin-top-4">
        <Table
          id="data-requirements-table"
          data={FUNDING_SPACE_TYPES}
          rowKey={(row) => (row ? row.displayName : '')}
          columns={columns}
          defaultSortColumn={0}
        />
      </div>
    </div>
  );
};

export default FundingSpaceTypes;
