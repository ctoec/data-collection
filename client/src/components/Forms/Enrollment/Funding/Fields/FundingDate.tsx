import React from 'react';
import {
  DateInput,
  DateInputProps,
  FormField,
  TObjectDriller,
} from '@ctoec/component-library';
import { Enrollment, Funding } from '../../../../../shared/models';
import {
  ChangeEnrollmentRequest,
  ChangeFundingRequest,
  WithdrawRequest,
} from '../../../../../shared/payloads';
import { Moment } from 'moment';
import { getValidationStatusForField } from '../../../../../utils/getValidationStatus';

type FundingStartDateProps<T> = {
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Partial<Funding>>;
  fieldType: 'startDate' | 'endDate';
  optional?: boolean;
};

export const FundingDateField = <
  T extends
    | Funding
    | Enrollment
    | ChangeFundingRequest
    | ChangeEnrollmentRequest
    | WithdrawRequest
>({
  fundingAccessor = (data) => data as TObjectDriller<Partial<Funding>>,
  fieldType,
  optional = false,
}: FundingStartDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      // if field is optional, force default value empty (null)
      // otherwise, use default value today (undefined)
      defaultValue={optional ? null : undefined}
      getValue={(data) => fundingAccessor(data).at(fieldType)}
      optional={optional}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label={
        fieldType === 'startDate' ? 'Funding start date' : 'Funding end date'
      }
      id={fieldType === 'startDate' ? `funding-start-date` : `funding-end-date`}
      status={(data, _, props) =>
        getValidationStatusForField(
          fundingAccessor(data),
          fundingAccessor(data).at(fieldType).path,
          props
        )
      }
    />
  );
};
