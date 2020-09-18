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

type AgeGroupProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<AgeGroup>;
};
/**
 * Component for updating an enrollment's age group.
 */
export const AgeGroupField = <T extends Enrollment | ChangeEnrollment>({
  accessor,
}: AgeGroupProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, AgeGroup | null>
      getValue={(data) => accessor(data)}
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
    />
  );
};
