import React from 'react';
import { Table, Column } from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import { FundingSource, FundingTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const FundingSourceTimes: React.FC = () => {
  console.log('Funding source times component init...');
  const h1Ref = getH1RefForTitle();

  /**
   * Structure to hold simplified information needed to show Funding
   * Spaces across columns with proper formatting.
   */
  type ContractSpaceDetails = {
    contractSpace: FundingTime;
    fundingType: string;
    fundingSources: FundingSource[];
    acceptedInputFormats: string;
    numContractSpacesInFundingType: number;
    displaySpace: boolean;
  };

  // Only want to display the FundingSpace row header once for each
  // applicable block of contract spaces
  let shouldShowFundingType: boolean;
  const contractSpaces: ContractSpaceDetails[] = [];

  // Need to 'invert' the array of funding_source_times because we
  // want _contract spaces_ to be what defines a row so that the
  // text between spaces and their formats will always match
  FUNDING_SOURCE_TIMES.map((fst) => {
    shouldShowFundingType = false;
    fst.fundingTimes.map((time) => {
      const spaceFromFST: ContractSpaceDetails = {
        contractSpace: time.value,
        fundingType: fst.displayName,
        fundingSources: fst.fundingSources,
        acceptedInputFormats: time.formats
          .map((format) => '"' + format + '"')
          .join(' or '),
        numContractSpacesInFundingType: fst.fundingTimes.length,
        displaySpace: !shouldShowFundingType,
      };
      contractSpaces.push(spaceFromFST);
      shouldShowFundingType = true;
    });
  });

  const columns: Column<ContractSpaceDetails>[] = [
    {
      name: 'Funding Type',
      cell: ({ row }) =>
        row && row.displaySpace ? (
          <th scope="row" rowSpan={row.numContractSpacesInFundingType}>
            <div className="text-bold">{row.fundingType}</div>
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
            <div className="margin-top-3 margin-bottom-3">
              {row.contractSpace}
            </div>
          </td>
        ) : (
          <></>
        ),
    },
    {
      name: 'Accepted formats',
      cell: ({ row }) => (row ? <td>{row.acceptedInputFormats}</td> : <></>),
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
          data={contractSpaces}
          rowKey={(row) => (row ? row.acceptedInputFormats : '')}
          columns={columns}
          defaultSortColumn={0}
        />
      </div>
    </div>
  );
};

export default FundingSourceTimes;
