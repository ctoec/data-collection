import React from 'react';
import {
  RadioButton,
  RadioButtonGroupProps,
  RadioButtonGroup,
  FormField,
  RadioOptionRenderProps,
  TObjectDriller,
} from '@ctoec/component-library';
import { AgeGroup, Enrollment } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type AgeGroupProps<T> = {
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};
/**
 * Component for updating an enrollment's age group.
 */
export const AgeGroupField = <T extends Enrollment | ChangeEnrollment>({
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: AgeGroupProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, AgeGroup | null>
      getValue={(data) => enrollmentAccessor(data).at('ageGroup')}
      parseOnChangeEvent={(e) => e.target.value as AgeGroup}
      inputComponent={RadioButtonGroup}
      name="age-group"
      id="age-group-radiogroup"
      legend="Age group"
      showLegend
      options={Object.values(AgeGroup).map((ageGroup) => ({
        render: (props: RadioOptionRenderProps) => (
          <RadioButton {...props} text={ageGroup} />
        ),
        value: ageGroup,
      }))}
      status={(data, _, props) =>
        getValidationStatusForField(
          enrollmentAccessor(data),
          enrollmentAccessor(data).at('ageGroup').path,
          props
        )
      }
    />
  );
};
