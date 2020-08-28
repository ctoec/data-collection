import React from 'react';
import { FundingSpace, Funding } from '../../../../../../../shared/models';
import { SelectProps, FormField, Select } from '@ctoec/component-library';
import { ChangeFunding } from '../../../../../../../shared/payloads/ChangeFunding';
import {
  ChangeFundingSingleContractSpaceField,
  FundingSingleContractSpaceField,
} from './SingleContractSpace';
import { getContractSpaceString } from './common';

type ContractSpaceProps = {
  fundingSpaceOptions: FundingSpace[];
  isChangeFunding?: boolean;
};

export const ContractSpaceField: React.FC<ContractSpaceProps> = ({
  fundingSpaceOptions,
  isChangeFunding = false,
}) => {
  if (fundingSpaceOptions.length === 1) {
    return isChangeFunding ? (
      <ChangeFundingSingleContractSpaceField
        fundingSpace={fundingSpaceOptions[0]}
      />
    ) : (
      <FundingSingleContractSpaceField fundingSpace={fundingSpaceOptions[0]} />
    );
  }

  const commonProps = {
    parseOnChangeEvent: (e: React.ChangeEvent<any>) =>
      parseInt(e.target.value) || null,
    name: 'contract-space',
    inputComponent: Select,
    label: 'Contract space',
    id: 'contract-space',
    options: fundingSpaceOptions.map((fs) => ({
      text: getContractSpaceString(fs),
      value: `${fs.id}`,
    })),
  };
  return isChangeFunding ? (
    <FormField<ChangeFunding, SelectProps, number | null>
      getValue={(data) => data.at('newFunding').at('fundingSpace').at('id')}
      {...commonProps}
    />
  ) : (
    <FormField<Funding, SelectProps, number | null>
      getValue={(data) => data.at('fundingSpace').at('id')}
      {...commonProps}
    />
  );
};
