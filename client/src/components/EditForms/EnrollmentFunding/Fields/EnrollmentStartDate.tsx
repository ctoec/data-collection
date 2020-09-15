import React from 'react';
import {
  FormField,
  DateInputProps,
  DateInput,
  TObjectDriller,
} from '@ctoec/component-library';
import { Moment } from 'moment';
import { Enrollment } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';

type EnrollmentStartDateProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<Moment>;
};
/**
 *  Component for updating an enrollment's entry
 */
export const EnrollmentStartDateField = <
  T extends Enrollment | ChangeEnrollment
>({
  accessor,
}: EnrollmentStartDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      getValue={(data) => accessor(data)}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Enrollment start date"
      id="start-date"
      defaultValue={null}
    />
  );
};
