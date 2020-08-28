import React from 'react';
import { EnrollmentFieldProps } from './FieldProps';
import { DateInput, DateInputProps, FormField } from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { Moment } from 'moment';
import { Enrollment } from '../../../../../shared/models';

export const EnrollmentEndDateField: React.FC<EnrollmentFieldProps> = ({
  isChangeEnrollment = false,
}) => {
  const commonProps = {
    parseOnChangeEvent: (e: any) => e,
    inputComponent: DateInput,
    label: 'Enrollment end date',
    id: 'end-date',
  };
  return isChangeEnrollment ? (
    <FormField<ChangeEnrollment, DateInputProps, Moment | null>
      getValue={(data) => data.at('oldEnrollment').at('exitDate')}
      optional
      {...commonProps}
    />
  ) : (
    <FormField<Enrollment, DateInputProps, Moment | null>
      getValue={(data) => data.at('exit')}
      {...commonProps}
    />
  );
};
