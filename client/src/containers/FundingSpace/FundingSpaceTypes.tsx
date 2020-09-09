import React from 'react';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';

const FundingSpaceTypes: React.FC = () => {
  const columns: Column<FundingSpaceType>[] = [
    {
      name: 'Funding Type',
      cell: ({ row }) =>
        row ? (
          <th scope="row">
            <span className="text-bold">{row.displayName}</span>
          </th>
        ) : (
          <></>
        ),
    },
    {
      name: 'Contract Space',
      cell: ({ row }) =>
        row ? (<div>
          {row.contractSpaces.map(space => {
            return <td> {space.displayName} </td>
          })}
        </div>
        ) : (
          <></>
        )
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) =>
        row ? (<div>
          {row.contractSpaces.map(space => {
            return <td> {space.formats.join(' or')} </td>
          })}
        </div>
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
