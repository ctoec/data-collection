import React, { useContext } from 'react';
import {
  SelectProps,
  FormField,
  Select,
  TObjectDriller,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import {
  Funding,
  Enrollment,
  AgeGroup,
  FundingSource,
} from '../../../../../../shared/models';
import { SingleContractSpaceField } from './SingleContractSpace';
import {
  ChangeFunding,
  ChangeEnrollment,
} from '../../../../../../shared/payloads';
import { fundingSpaceFormatter } from '../../../../../../utils/formatters';
import DataCacheContext from '../../../../../../contexts/DataCacheContext/DataCacheContext';
import { getValidationStatusForField } from '../../../../../../utils/getValidationStatus';

type ContractSpaceProps<T> = {
  ageGroup: AgeGroup | undefined;
  fundingSource: FundingSource;
  organizationId: number;
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
  showStatus?: boolean;
};

export const ContractSpaceField = <
  T extends Funding | ChangeFunding | ChangeEnrollment | Enrollment
>({
  ageGroup,
  fundingSource,
  organizationId,
  fundingAccessor = (data) => data as TObjectDriller<Funding>,
  showStatus,
}: ContractSpaceProps<T>) => {
  const { fundingSpaces } = useContext(DataCacheContext);
  const fundingSpaceOptions = fundingSpaces.records.filter(
    (fs) =>
      fs.ageGroup === ageGroup &&
      fs.source === fundingSource &&
      fs.organization.id === organizationId
  );

  const { dataDriller } = useGenericContext<T>(FormContext);

  if (fundingSpaceOptions.length === 1) {
    return (
      <SingleContractSpaceField<T>
        fundingSpace={fundingSpaceOptions[0]}
        accessor={(data) => fundingAccessor(data).at('fundingSpace')}
      />
    );
  }

  return (
    <FormField<T, SelectProps, number | null>
      getValue={(data) => fundingAccessor(data).at('fundingSpace').at('id')}
      parseOnChangeEvent={(e: React.ChangeEvent<any>) =>
        parseInt(e.target.value) || null
      }
      name="contract-space"
      inputComponent={Select}
      label="Contract space"
      id="contract-space"
      options={fundingSpaceOptions.map((fs) => ({
        text: fundingSpaceFormatter(fs),
        value: `${fs.id}`,
      }))}
      status={
        showStatus
          ? (data, _, props) =>
              getValidationStatusForField(
                fundingAccessor(data),
                fundingAccessor(data).at('fundingSpace').path,
                props
              )
          : undefined
      }
    />
  );
};
