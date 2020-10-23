import React from 'react';
import {
  RadioButton,
  RadioButtonGroupProps,
  RadioButtonGroup,
  FormField,
  RadioOptionRenderProps,
  TObjectDriller,
} from '@ctoec/component-library';
import { Enrollment, CareModel } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type CareModelProps<T> = {
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};
/**
 * Component for updating an enrollment's care model.
 */
export const CareModelField = <T extends Enrollment | ChangeEnrollment>({
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: CareModelProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, CareModel | null>
      getValue={(data) => enrollmentAccessor(data).at('model')}
      parseOnChangeEvent={(e) => e.target.value as CareModel}
      inputComponent={RadioButtonGroup}
      name="care-model"
      id="care-model-radiogroup"
      legend="Care model"
      showLegend
      useFormFieldSet
      options={Object.values(CareModel).map((model) => ({
        render: (props: RadioOptionRenderProps) => (
          <RadioButton {...props} text={model} />
        ),
        value: model,
      }))}
      status={(data, _, props) =>
        getValidationStatusForField(
          enrollmentAccessor(data),
          enrollmentAccessor(data).at('model').path,
          props
        )
      }
    />
  );
};
