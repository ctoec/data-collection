import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { DataDefinitionInfo } from '../../generated/models/DataDefinitionInfo';
import { getApi } from '../../utils/getApi';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column } from '@ctoec/component-library';

const DataDefinitions: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const [dataDefinitions, setDataDefinitions] = useState<DataDefinitionInfo[]>(
    []
  );

  useEffect(() => {
    getApi(accessToken)
      .getDataDefinitions()
      .then((definitions) => setDataDefinitions(definitions));
  });

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
            <div>Ex: {row.example}</div>
          </td>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <div className="grid-container margin-top-4">
      <Table
        id="data-definitions-table"
        data={dataDefinitions}
        rowKey={(row) => (row ? row.formattedName : '')}
        columns={columns}
        defaultSortColumn={0}
      />
    </div>
  );
};

export default DataDefinitions;
