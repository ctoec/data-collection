import React, { useEffect } from 'react';
import set from 'lodash/set';
import {
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import { FundingSpace, Funding } from '../../../../../../../shared/models';
import { getContractSpaceString } from './common';
import {
  ChangeEnrollment,
  ChangeFunding,
} from '../../../../../../../shared/payloads';

type SingleContractSpaceProps<T> = {
  fundingSpace: FundingSpace;
  accessor: (_: TObjectDriller<T>) => TObjectDriller<FundingSpace>;
};

export const SingleContractSpaceField = <
  T extends Funding | ChangeFunding | ChangeEnrollment
>({
  fundingSpace,
  accessor,
}: SingleContractSpaceProps<T>) => {
  const { updateData, dataDriller } = useGenericContext<T>(FormContext);
  const currentFundingSpace = accessor(dataDriller);

  useEffect(() => {
    if (currentFundingSpace.at('id').value !== fundingSpace.id) {
      updateData((_data) =>
        set({ ..._data }, currentFundingSpace.path, fundingSpace)
      );
    }
  }, [fundingSpace]);

  return (
    <div>
      <span className="usa-hint text-italic">
        {getContractSpaceString(fundingSpace)}
      </span>
    </div>
  );
};
