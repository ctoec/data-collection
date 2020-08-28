import React from 'react';
import {
  RadioButton,
  RadioButtonGroupProps,
  RadioButtonGroup,
  FormField,
  RadioOptionRenderProps,
} from '@ctoec/component-library';
import { Enrollment, AgeGroup } from '../../../../../shared/models';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { EnrollmentFieldProps } from './FieldProps';

/**
 * Component for setting the age group of an enrollment.
 * When the age group for an enrollment is changed, all
 * fundings are removed. Fundings must be associated with
 * a funding space, which must have a matching age group
 * to the funding's enrollment.
 */
export const AgeGroupField: React.FC<EnrollmentFieldProps> = ({
  isChangeEnrollment = false,
}) => {
  const commonProps = {
    parseOnChangeEvent: (e: React.ChangeEvent<any>) =>
      e.target.value as AgeGroup,
    inputComponent: RadioButtonGroup,
    name: 'age-group',
    id: 'age-group-radiogroup',
    legend: 'Age group',
    options: Object.values(AgeGroup).map((ageGroup) => ({
      render: (props: RadioOptionRenderProps) => (
        <RadioButton text={ageGroup} {...props} />
      ),
      value: ageGroup,
    })),
  };
  return isChangeEnrollment ? (
    <FormField<ChangeEnrollment, RadioButtonGroupProps, AgeGroup | null>
      getValue={(data) => data.at('newEnrollment').at('ageGroup')}
      {...commonProps}
    />
  ) : (
    <FormField<Enrollment, RadioButtonGroupProps, AgeGroup | null>
      getValue={(data) => data.at('ageGroup')}
      {...commonProps}
    />
  );
};
