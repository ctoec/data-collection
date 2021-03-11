import React, { useState, useEffect } from 'react';
import {
  SelectProps,
  FormField,
  Select,
  TObjectDriller,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import {
  Funding,
  Enrollment,
  AgeGroup,
  FundingSource,
  FundingSpace,
} from '../../../../../shared/models';
import {
  ChangeFundingRequest,
  ChangeEnrollmentRequest,
} from '../../../../../shared/payloads';
import { fundingSpaceFormatter } from '../../../../../utils/formatters';
import { getValidationStatusForField } from '../../../../../utils/getValidationStatus';
import { useAuthenticatedSWR } from '../../../../../hooks/useAuthenticatedSWR';
import { stringify } from 'query-string';

import produce from 'immer';
import { set } from 'lodash';

type ContractSpaceProps<T> = {
  ageGroup: AgeGroup | undefined;
  fundingSource: FundingSource;
  organizationId: number;
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
};

export const ContractSpaceField = <
  T extends
    | Funding
    | ChangeFundingRequest
    | ChangeEnrollmentRequest
    | Enrollment
>({
  ageGroup,
  fundingSource,
  organizationId,
  fundingAccessor = (data) => data as TObjectDriller<Funding>,
}: ContractSpaceProps<T>) => {
  const { data: fundingSpaces } = useAuthenticatedSWR<FundingSpace[]>(
    `funding-spaces?${stringify({ organizationId })}`
  );
  const [fundingSpaceOptions, setFundingSpaceOptions] = useState<
    FundingSpace[]
  >([]);

  const { data, immutableUpdateData, dataDriller, updateData } = useGenericContext<T>(FormContext);

  useEffect(() => {
    if (!fundingSpaces) return;
    setFundingSpaceOptions(
      fundingSpaces.filter(
        (fs) => fs.ageGroup === ageGroup && fs.source === fundingSource
      )
    );
  }, [ageGroup, fundingSource, fundingSpaces]);

  if (fundingSpaceOptions.length === 1) {
    updateData(
      produce<T>(data, (draft) => set(draft, fundingAccessor(dataDriller).at('fundingSpace').at('id').path, fundingSpaceOptions[0].id))
    );

    return (
      <div>
        <span className="usa-hint text-italic">
          {fundingSpaceFormatter(fundingSpaceOptions[0])}
        </span>
    </div>
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
      status={(data, _, props) =>
        getValidationStatusForField(
          fundingAccessor(data),
          fundingAccessor(data).at('fundingSpace').path,
          props
        )
      }
    />
  );
};
