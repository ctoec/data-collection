import React, { useEffect } from 'react';
import set from 'lodash/set';
import produce from 'immer';
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
  const { data, updateData, dataDriller } = useGenericContext<T>(FormContext);
  const currentFundingSpace = accessor(dataDriller);

  useEffect(() => {
    if (currentFundingSpace.at('id').value !== fundingSpace.id) {
      updateData(produce<T>(data, (draft) =>
        set(draft, currentFundingSpace.path, fundingSpace)
      ));
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
