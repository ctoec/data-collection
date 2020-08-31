import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as ArrowLeft } from 'uswds/dist/img/arrow-left.svg';
import { ColumnMetadata } from '../../shared/models';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column, TextWithIcon, Button } from '@ctoec/component-library';
import { apiGet } from '../../utils/api';
import BackButton from '../../components/BackButton';

const DataRequirements: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const [columnMetadata, setColumnMetadata] = useState<ColumnMetadata[]>([]);

  useEffect(() => {
    apiGet('column-metadata').then((definitions) =>
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
  columnMetadata.reduce((acc, cur) => {
    if (acc[cur.section]) {
      acc[cur.section].push(cur);
    } else {
      acc[cur.section] = [cur];
    }

    return acc;
  }, columnMetadataBySection);

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1>OEC's enrollment data requirements</h1>
      {Object.entries(columnMetadataBySection).map(
        ([sectionName, sectionData]) => (
          <div className="margin-top-4">
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
  if (section.toLowerCase().includes('child'))
    return 'A unique person enrolled in an ECE program.';
  if (section.toLowerCase().includes('income'))
    return "A determination by a provider of a family's income, for purposes of assessing eligibility for public funding; must be updated at least once a year.";
  if (section.toLowerCase().includes('family'))
    return 'One or more children that share the same address and household income.';
  if (section.toLowerCase().includes('enrollment'))
    return 'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.\nCare 4 Kids: Whether or not the enrollment was subsidized by the Care 4 Kids program.';
};
export default DataRequirements;
