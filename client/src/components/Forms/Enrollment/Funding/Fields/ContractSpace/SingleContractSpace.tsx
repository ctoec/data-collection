import React, { useEffect } from 'react';
import set from 'lodash/set';
import {
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import {
  FundingSpace,
  Funding,
  Enrollment,
} from '../../../../../../shared/models';
import { fundingSpaceFormatter } from '../../../../../../utils/formatters';
import {
  ChangeEnrollmentRequest,
  ChangeFundingRequest,
} from '../../../../../../shared/payloads';

type SingleContractSpaceProps<T> = {
  fundingSpace: FundingSpace;
  accessor: (_: TObjectDriller<T>) => TObjectDriller<FundingSpace>;
};

export const SingleContractSpaceField = <
  T extends
    | Funding
    | ChangeFundingRequest
    | ChangeEnrollmentRequest
    | Enrollment
>({
  fundingSpace,
  accessor,
}: SingleContractSpaceProps<T>) => {
  console.log('Single contract space field init...');
  const { updateData, dataDriller } = useGenericContext<T>(FormContext);
  const currentFundingSpace = accessor(dataDriller);

  useEffect(() => {
    console.log('Updating single contract space field...');
    if (currentFundingSpace.at('id').value !== fundingSpace.id) {
      updateData(produce<T>(whoKnows, (idk) => {
        console.log('AHAHAHA', idk);
        console.log('OH COOL', whoKnows);
        return set(idk, currentFundingSpace.path, fundingSpace)
      });
    }
  }, [fundingSpace, currentFundingSpace, updateData]);

  return (
    <div>
      <span className="usa-hint text-italic">
        {fundingSpaceFormatter(fundingSpace)}
      </span>
    </div>
  );
};
