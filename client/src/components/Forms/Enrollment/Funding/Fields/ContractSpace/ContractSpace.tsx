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
  FundingSpace,
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
import { getValidationStatusForFields } from '../../../../../../utils/getValidationStatus';

type ContractSpaceProps<T> = {
  ageGroup: AgeGroup | undefined;
  fundingSource: FundingSource;
  organizationId: number;
  accessor: (_: TObjectDriller<T>) => TObjectDriller<FundingSpace>;
  getFunding: (_: TObjectDriller<T>) => Funding;
};

export const ContractSpaceField = <
  T extends Funding | ChangeFunding | ChangeEnrollment | Enrollment
>({
  ageGroup,
  fundingSource,
  organizationId,
  accessor,
  getFunding,
}: ContractSpaceProps<T>) => {
  const { fundingSpaces } = useContext(DataCacheContext);
  const fundingSpaceOptions = fundingSpaces.records.filter(
    (fs) =>
      fs.ageGroup === ageGroup &&
      fs.source === fundingSource &&
      fs.organization.id === organizationId
  );

  const { dataDriller } = useGenericContext<T>(FormContext);
  const funding = getFunding(dataDriller);

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
        text: fundingSpaceFormatter(fs),
        value: `${fs.id}`,
      }))}
      status={(data, _, props) =>
        getValidationStatusForFields(funding, ['firstReportingPeriod'])
      }
    />
  );
};
