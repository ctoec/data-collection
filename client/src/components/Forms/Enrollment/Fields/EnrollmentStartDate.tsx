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
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type EnrollmentStartDateProps<T> = {
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};
/**
 *  Component for updating an enrollment's entry
 */
export const EnrollmentStartDateField = <
  T extends Enrollment | ChangeEnrollment
>({
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: EnrollmentStartDateProps<T>) => {
  return (
    <FormField<T, DateInputProps, Moment | null>
      getValue={(data) => enrollmentAccessor(data).at('entry')}
      parseOnChangeEvent={(e: any) => e}
      inputComponent={DateInput}
      label="Enrollment start date"
      id="start-date"
      defaultValue={null}
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
