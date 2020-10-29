import React from 'react';
import { RadioButtonGroup, TObjectDriller } from '@ctoec/component-library';
import { Enrollment, CareModel } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

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
    <RadioButtonGroup<T>
      inForm
      id="care-model-radiogroup"
      legend="Care model"
      showLegend
      inputName="model"
      options={Object.values(CareModel).map((model) => {
        const id = model.replace(/\s/g, '-');
        return {
          value: model,
          text: model,
          id,
          getValue: (data) => enrollmentAccessor(data).at('model'),
          parseOnChangeEvent: (e) => { console.log(e.target.value); return e.target.value },
        };
      })}
      status={(_, dataDriller) =>
        getValidationStatusForFields(
          enrollmentAccessor(dataDriller).value,
          ['model'],
          { message: `Care model is required for OEC reporting.` }
        )
      }
    />
  );
};
