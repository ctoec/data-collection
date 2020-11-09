import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ColumnMetadata } from '../shared/models';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column } from '@ctoec/component-library';
import { apiGet } from '../utils/api';

const DataDefTable: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const [columnMetadata, setColumnMetadata] = useState<ColumnMetadata[]>([]);

  useEffect(() => {
    apiGet('template/column-metadata').then((definitions) =>
      setColumnMetadata(definitions)
    );
  }, [accessToken]);

  const columns: Column<ColumnMetadata>[] = [
    {
      name: 'Field name',
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
      name: 'Required/ Optional',
      cell: ({ row }) => (row ? <td> {row.required} </td> : <></>),
    },
    {
      name: 'Definition',
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
      name: 'Reason for collecting',
      cell: ({ row }) => (row ? <td> {row.reason} </td> : <></>),
    },
    {
      name: 'Format',
      cell: ({ row }) =>
        row ? (
          <td>
            <div>{row.format}</div>
            <div className="margin-top-1">Ex: {row.example}</div>
          </td>
        ) : (
          <></>
        ),
    },
  ];

  const columnMetadataBySection: { [key: string]: ColumnMetadata[] } = {};
  columnMetadata.reduce((_bySection, _metadata) => {
    if (_bySection[_metadata.section]) {
      _bySection[_metadata.section].push(_metadata);
    } else {
      _bySection[_metadata.section] = [_metadata];
    }

    return _bySection;
  }, columnMetadataBySection);

  return (
    <div>
      {Object.entries(columnMetadataBySection).map(
        ([sectionName, sectionData]) => (
          <div key={sectionName} className="margin-top-4">
            <h2>{sectionName}</h2>
            <p className="text-pre-line">{getSectionCopy(sectionName)}</p>
            <Table
              id="data-requirements-table"
              data={sectionData}
              rowKey={(row) => (row ? row.formattedName : '')}
              columns={columns}
              defaultSortColumn={0}
            />
          </div>
        )
      )}
    </div>
  );
};

const getSectionCopy = (section: string) => {
  if (section.toLowerCase().includes('child identifier'))
    return 'Data used to identify unique children enrolled in an ECE program.';
  if (section.toLocaleLowerCase().includes('child information'))
    return "Data on children's circumstances. This data is used to ensure children from different backgrounds are equitably served by ECE programs.";
  if (section.toLowerCase().includes('income'))
    return 'This data is collected to assess eligibility for public funding by calculating state median income percentage. Income determinations must be updated at least once a year.';
  if (section.toLowerCase().includes('family'))
    return 'One or more children that share the same address and household income.';
  if (section.toLowerCase().includes('enrollment'))
    return 'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.';
};
export default DataDefTable;
