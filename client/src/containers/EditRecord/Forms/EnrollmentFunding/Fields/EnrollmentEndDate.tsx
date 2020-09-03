import React from 'react';
import {
  DateInput,
  DateInputProps,
  FormField,
  TObjectDriller,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { Moment } from 'moment';
import { Enrollment } from '../../../../../shared/models';
import moment from 'moment';

type EnrollmentEndDateProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<Moment>;
  optional?: boolean;
};
/**
 *  Component for updating an enrollment's exit
 */
export const EnrollmentEndDateField = <
  T extends Enrollment | ChangeEnrollment
>({
  accessor,
  optional = false,
}: EnrollmentEndDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      defaultValue={null}
      getValue={(data) => accessor(data)}
      optional={optional}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Enrollment end date"
      id="end-date"
    />
  );
};
