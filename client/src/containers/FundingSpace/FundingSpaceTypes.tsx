import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';

const FundingSpaceTypes: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);

  const columns: Column<any>[] = [
    {
      name: 'Funding Type',
      cell: ({ row }) =>
        row ? (
          <th scope="row">
            <span className="text-bold">{row.formattedName}</span>
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
            <ReactMarkdown source={row.definition} />
          </td>
        ) : (
          <></>
        ),
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) => (row ? <td> {row.reason} </td> : <></>),
    }
  ];

  const rows = [{
    fundingType: 'Child Day Care (CDC)',
    contractSpaces: {
      'Full Time': '"1" or "Full time" or "FT"',
      'Part Time': '"2" or "Part time" or "PT"',
      'Split Time': '"3" or "Split time" or "Part time/Full time" "PT/FT"'
    }
  },
  {
    fundingType: 'School Readiness (CSR or PSR)',
    contractSpaces: {
      'Full-day': '"4" or "Full-day" or "FD"',
      'School-day/School-year': '"5" or "School-day" or "School-day/School-year" or "SD"',
      'Part-day': '"6" or "Part-Day" or "PD"',
      'Extended-day': '"7" or "Extended-day" or "Part time/Full time" or "ED"'
    },
  },
  {
    fundingType: 'Smart Start (SS)',
    contractSpaces: {
      'School-day/School-year': '"8" or "School day" or "SD"'
    },
  },
  {
    fundingType: 'State Head Start (SHS)',
    contractSpaces: {
      'Extended-day': '"9" or "Extended day" or "ED"',
      'Extended-year': '"10" or "Extended-year" or "EY"'
    },
  }];


  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1>Funding space types</h1>
      <p className="text-pre-line">This guide shows accepted formats for each funding space type when using OEC's data template.</p>
      <div className="margin-top-4">
        <Table
          id="data-requirements-table"
          data={rows}
          rowKey={(row) => (row ? row.fundingType : '')}
          columns={columns}
          defaultSortColumn={0}
        />
      </div>
    </div>
  );
};

export default FundingSpaceTypes;
