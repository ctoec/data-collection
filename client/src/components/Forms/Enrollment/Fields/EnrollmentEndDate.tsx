import React from 'react';
import {
  DateInput,
  DateInputProps,
  FormField,
  TObjectDriller,
} from '@ctoec/component-library';
import {
  ChangeEnrollmentRequest,
  WithdrawRequest,
} from '../../../../shared/payloads';
import { Moment } from 'moment';
import { Enrollment } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type EnrollmentEndDateProps<T> = {
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
  optional?: boolean;
};
/**
 *  Component for updating an enrollment's exit
 */
export const EnrollmentEndDateField = <
  T extends Enrollment | ChangeEnrollmentRequest | WithdrawRequest
>({
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
  optional = false,
}: EnrollmentEndDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      // if field is optional, force default value empty (null)
      // otherwise, use default value today (undefined)
      defaultValue={optional ? null : undefined}
      getValue={(data) => enrollmentAccessor(data).at('exit')}
      optional={optional}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Enrollment end date"
      id="end-date"
      status={(data, _, props) =>
        getValidationStatusForField(
          enrollmentAccessor(data),
          enrollmentAccessor(data).at('exit').path,
          props
        )
      }
    />
  );
};
