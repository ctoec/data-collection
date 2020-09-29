import React from 'react';
import {
  RadioButton,
  RadioButtonGroupProps,
  RadioButtonGroup,
  FormField,
  RadioOptionRenderProps,
  TObjectDriller,
} from '@ctoec/component-library';
import { CareModel, Enrollment } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';

type CareModelProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<CareModel>;
};
/**
 * Component for updating an enrollment's age group.
 */
export const CareModelField = <T extends Enrollment | ChangeEnrollment>({
  accessor,
}: CareModelProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, CareModel | null>
      getValue={(data) => accessor(data)}
      parseOnChangeEvent={(e) => e.target.value as CareModel}
      inputComponent={RadioButtonGroup}
      name="age-group"
      id="age-group-radiogroup"
      legend="Age group"
      showLegend
      options={Object.values(CareModel).map((model) => ({
        render: (props: RadioOptionRenderProps) => (
          <RadioButton {...props} text={model} />
        ),
        value: model,
      }))}
    />
  );
};
