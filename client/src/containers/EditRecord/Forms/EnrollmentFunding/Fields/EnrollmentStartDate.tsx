import React from 'react';
import { FormField, DateInputProps, DateInput } from '@ctoec/component-library';
import { Enrollment } from '../../../../../shared/models';
import { Moment } from 'moment';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { EnrollmentFieldProps } from './FieldProps';

export const EnrollmentStartDateField: React.FC<EnrollmentFieldProps> = ({
  isChangeEnrollment = false,
}) => {
  const commonProps = {
    parseOnChangeEvent: (e: any) => e,
    inputComponent: DateInput,
    label: 'Enrollment start date',
    id: 'start-date',
  };
  return isChangeEnrollment ? (
    <FormField<ChangeEnrollment, DateInputProps, Moment | null>
      getValue={(data) => data.at('newEnrollment').at('entry')}
      {...commonProps}
    />
  ) : (
    <FormField<Enrollment, DateInputProps, Moment | null>
      getValue={(data) => data.at('entry')}
      {...commonProps}
    />
  );
};
