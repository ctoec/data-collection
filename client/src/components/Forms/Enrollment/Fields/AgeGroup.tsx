import React from 'react';
import {
  RadioButtonGroup,
  RadioOptionInForm,
  TObjectDriller,
} from '@ctoec/component-library';
import { AgeGroup, Enrollment } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

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
    <RadioButtonGroup<T>
      inForm
      id="age-group-radiogroup"
      legend="Age group"
      showLegend
      options={Object.values(AgeGroup).map(
        (ageGroup): RadioOptionInForm<T> => {
          const id = ageGroup.replace(' ', '-');
          return {
            id,
            text: ageGroup,
            value: ageGroup,
            name: id,
            getValue: (data) => enrollmentAccessor(data).at('ageGroup'),
            parseOnChangeEvent: (e) => e.target.value as AgeGroup,
          };
        }
      )}
      status={(_, dataDriller) =>
        getValidationStatusForFields(
          enrollmentAccessor(dataDriller).value,
          ['ageGroup'],
          { message: `Age group is required for OEC reporting.` }
        )
      }
    />
  );
};
