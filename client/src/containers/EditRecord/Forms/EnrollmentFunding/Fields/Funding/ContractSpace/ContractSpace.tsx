import React from 'react';
import {
  SelectProps,
  FormField,
  Select,
  TObjectDriller,
} from '@ctoec/component-library';
import { FundingSpace, Funding } from '../../../../../../../shared/models';
import { SingleContractSpaceField } from './SingleContractSpace';
import { getContractSpaceString } from './common';
import {
  ChangeFunding,
  ChangeEnrollment,
} from '../../../../../../../shared/payloads';

type ContractSpaceProps<T> = {
  fundingSpaceOptions: FundingSpace[];
  accessor: (_: TObjectDriller<T>) => TObjectDriller<FundingSpace>;
};

export const ContractSpaceField = <
  T extends Funding | ChangeFunding | ChangeEnrollment
>({
  fundingSpaceOptions,
  accessor,
}: ContractSpaceProps<T>) => {
  if (fundingSpaceOptions.length === 1) {
    return (
      <SingleContractSpaceField<T>
        fundingSpace={fundingSpaceOptions[0]}
        accessor={accessor}
      />
    );
  }

  return (
    <FormField<T, SelectProps, number | null>
      getValue={(data) => accessor(data).at('id')}
      parseOnChangeEvent={(e: React.ChangeEvent<any>) =>
        parseInt(e.target.value) || null
      }
      name="contract-space"
      inputComponent={Select}
      label="Contract space"
      id="contract-space"
      options={fundingSpaceOptions.map((fs) => ({
        text: getContractSpaceString(fs),
        value: `${fs.id}`,
      }))}
    />
  );
};
