import React from 'react';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import {
  FundingSource,
  FundingSourceTime,
  FundingSpace,
  FundingTime,
} from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const FundingSourceTimes: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  /**
   * Structure to hold simplified information needed to show Funding
   * Spaces across columns with proper formatting.
   */
  type SpaceToFunding = {
    space: FundingTime;
    type: string;
    sources: FundingSource[];
    format: string;
    numSpacesInType: number;
    showSpace: boolean;
  };

  // Only want to display the FundingSpace row header once for each
  // applicable block of contract spaces
  let setSpaceHeader: boolean;
  const spaces: SpaceToFunding[] = [];

  // Need to 'invert' the array of funding_source_times because we
  // want _contract spaces_ to be what defines a row so that the
  // text between spaces and their formats will always match
  FUNDING_SOURCE_TIMES.map((fst) => {
    setSpaceHeader = false;
    fst.fundingTimes.map((time) => {
      const spaceFromFST: SpaceToFunding = {
        space: time.value,
        type: fst.displayName,
        sources: fst.fundingSources,
        format: time.formats.map((format) => '"' + format + '"').join(' or '),
        numSpacesInType: fst.fundingTimes.length,
        showSpace: !setSpaceHeader,
      };
      spaces.push(spaceFromFST);
      setSpaceHeader = true;
    });
  });

  const columns: Column<SpaceToFunding>[] = [
    {
      name: 'Funding Type',
      cell: ({ row }) =>
        row && row.showSpace ? (
          <th scope="row" rowSpan={row.numSpacesInType}>
            <div className="text-bold">{row.type}</div>
            <div>({row.sources.join(' or ')})</div>
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
            <div className="margin-top-3 margin-bottom-3">{row.space}</div>
          </td>
        ) : (
          <></>
        ),
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) => (row ? <td>{row.format}</td> : <></>),
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
          data={spaces}
          rowKey={(row) => (row ? row.format : '')}
          columns={columns}
          defaultSortColumn={0}
        />
      </div>
    </div>
  );
};

export default FundingSourceTimes;
