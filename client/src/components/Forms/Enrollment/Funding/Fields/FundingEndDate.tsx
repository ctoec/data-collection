import React from 'react';
import { DateInput, DateInputProps, FormField, TObjectDriller } from '@ctoec/component-library';
import { Enrollment, Funding } from '../../../../../shared/models';
import { ChangeEnrollmentRequest, ChangeFundingRequest, WithdrawRequest } from '../../../../../shared/payloads';
import { Moment } from 'moment';
import { getValidationStatusForField } from '../../../../../utils/getValidationStatus';

type FundingEndDateProps<T> = {
	fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Partial<Funding>>;
	optional?: boolean;
}

export const FundingEndDateField = <
	T extends Funding | Enrollment | ChangeFundingRequest | ChangeEnrollmentRequest | WithdrawRequest
>({
	fundingAccessor = (data) => data as TObjectDriller<Funding>,
	optional = false
}: FundingEndDateProps<T>) => {
	return (
    <FormField<T, DateInputProps, Moment | null>
      // if field is optional, force default value empty (null)
      // otherwise, use default value today (undefined)
      defaultValue={optional ? null : undefined}
      getValue={(data) => fundingAccessor(data).at('endDate')}
      optional={optional}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Funding end date"
      id="funding-end-date"
      status={(data, _, props) =>
        getValidationStatusForField(
          fundingAccessor(data),
          fundingAccessor(data).at('endDate').path,
          props
        )
      }
    />
	)
}
