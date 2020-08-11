import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as ArrowLeft } from 'uswds/dist/img/arrow-left.svg';
import { DataDefinitionInfo } from 'shared/models';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column, TextWithIcon, Button } from '@ctoec/component-library';
import { SECTION_COPY } from './Sections';
import { apiGet } from '../../utils/api';

const DataDefinitions: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const [dataDefinitions, setDataDefinitions] = useState<DataDefinitionInfo[]>(
    []
  );

  useEffect(() => {
    apiGet('data-definitions').then((definitions) =>
      setDataDefinitions(definitions)
    );
  }, [accessToken]);

  const columns: Column<DataDefinitionInfo>[] = [
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
      sort: (row) => (row ? row.formattedName.toLowerCase() : ''),
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

  const dataDefinitionsBySection: { [key: string]: DataDefinitionInfo[] } = {};
  dataDefinitions.reduce((acc, cur) => {
    if (acc[cur.section]) {
      acc[cur.section].push(cur);
    } else {
      acc[cur.section] = [cur];
    }

    return acc;
  }, dataDefinitionsBySection);

  return (
    <div className="grid-container margin-top-4">
      <Button
        className="text-bold margin-bottom-4"
        appearance="unstyled"
        href="/"
        text={<TextWithIcon text="Back" Icon={ArrowLeft} iconSide="left" />}
      />
      <h1>OEC's enrollment data requirements</h1>
      {Object.entries(dataDefinitionsBySection).map(
        ([sectionKey, sectionData]) => (
          <div className="margin-top-4">
            <h2>{SECTION_COPY[sectionKey].formattedName}</h2>
            <p className="text-pre-line">
              {SECTION_COPY[sectionKey].description}
            </p>
            <Table
              id="data-definitions-table"
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

export default DataDefinitions;
