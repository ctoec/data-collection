import React from 'react';
import {
  FormField,
  DateInputProps,
  DateInput,
  TObjectDriller,
} from '@ctoec/component-library';
import { Moment } from 'moment';
import { Enrollment } from '../../../../shared/models';
import { ChangeEnrollmentRequest } from '../../../../shared/payloads';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type EnrollmentStartDateProps<T> = {
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};
/**
 *  Component for updating an enrollment's entry
 */
export const EnrollmentStartDateField = <
  T extends Enrollment | ChangeEnrollmentRequest
>({
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: EnrollmentStartDateProps<T>) => {
  console.log('EnrollmentStartDateField render...');
  // TODO: why does this not show up after save during create child?
  // To reproduce: add child, save without completely filling out enrollment form (but include entry)
  return (
    <FormField<T, DateInputProps, Moment | null>
      getValue={(data) => {
        return enrollmentAccessor(data).at('entry');
      }}
      parseOnChangeEvent={(e) => {
        return (e as unknown) as Moment;
      }}
      inputComponent={DateInput}
      label="Enrollment start date"
      id="start-date"
      status={(data, _, props) =>
        getValidationStatusForField(
          enrollmentAccessor(data),
          enrollmentAccessor(data).at('entry').path,
          props
        )
      }
    />
  );
};
