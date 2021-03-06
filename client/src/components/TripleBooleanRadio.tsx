import React from 'react';
import { RadioButtonGroup, RadioOptionInForm } from '@ctoec/component-library';
import { getValidationStatusForFields } from '../utils/getValidationStatus';
import { UndefinableBoolean } from '../shared/models';

export type TripleBooleanRadioOption = {
  id: string;
  label: string;
};

export type TripleBooleanRadio<T> = {
  field: keyof T;
  id: string;
  legend: string;
  trueOption: TripleBooleanRadioOption;
  falseOption: TripleBooleanRadioOption;
  unknownOption: TripleBooleanRadioOption;
};

// Future podcast title??
export const TripleBooleanRadio = <T extends {}>({
  id,
  legend,
  trueOption,
  falseOption,
  unknownOption,
  field,
}: TripleBooleanRadio<T>) => {
  const getRadioButtonProps = ({
    label,
    id,
  }: {
    label: string;
    id: string;
  }): RadioOptionInForm<T> => ({
    getValue: (data) => data.at(field),
    parseOnChangeEvent: (e) => {
      if (e.target.value === unknownOption.id) {
        return UndefinableBoolean.NotCollected;
      }
      return e.target.value === trueOption.id
        ? UndefinableBoolean.Yes
        : UndefinableBoolean.No;
    },
    preprocessForDisplay: (data) => {
      if (data === UndefinableBoolean.Yes) return trueOption.id === id;
      else if (data === UndefinableBoolean.No) return falseOption.id === id;
      else if (data === UndefinableBoolean.NotCollected)
        return unknownOption.id === id;
      return false;
    },
    id,
    text: label,
    value: id,
  });

  return (
    <RadioButtonGroup<T>
      inForm
      inputName={field as string}
      id={id}
      legend={legend}
      showLegend
      options={[trueOption, falseOption, unknownOption].map((o) =>
        getRadioButtonProps(o)
      )}
      status={(data) =>
        getValidationStatusForFields(data, [field as string], {
          message: `${legend} indication is required for OEC reporting.`,
        })
      }
    />
  );
};
