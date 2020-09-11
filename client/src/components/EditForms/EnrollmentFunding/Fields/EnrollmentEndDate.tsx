import React from 'react';
import {
  DateInput,
  DateInputProps,
  FormField,
  TObjectDriller,
} from '@ctoec/component-library';
import { ChangeEnrollment, Withdraw } from '../../../../shared/payloads';
import { Moment } from 'moment';
import { Enrollment } from '../../../../shared/models';

type EnrollmentEndDateProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<Moment>;
  optional?: boolean;
};
/**
 *  Component for updating an enrollment's exit
 */
export const EnrollmentEndDateField = <
  T extends Enrollment | ChangeEnrollment | Withdraw
>({
  accessor,
  optional = false,
}: EnrollmentEndDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      // if field is optional, force default value empty (null)
      // otherwise, use default value today (undefined)
      defaultValue={optional ? null : undefined}
      getValue={(data) => accessor(data)}
      optional={optional}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Enrollment end date"
      id="end-date"
    />
  );
};
