import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as ArrowLeft } from 'uswds/dist/img/arrow-left.svg';
import { DataDefinitionInfo } from '../../generated/models/DataDefinitionInfo';
import { getApi } from '../../utils/getApi';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Table, Column, TextWithIcon, Button } from '@ctoec/component-library';
import { Link } from 'react-router-dom';

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
            <div className="margin-top-1">Ex: {row.example}</div>
          </td>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <div className="grid-container margin-top-4">
      <Button
        className="text-bold margin-bottom-4"
        appearance="unstyled"
        href="/"
        text={<TextWithIcon text="Back" Icon={ArrowLeft} iconSide="left" />}
      />
      <h1 className="margin-bottom-2">OEC's enrollment data requirements</h1>
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
