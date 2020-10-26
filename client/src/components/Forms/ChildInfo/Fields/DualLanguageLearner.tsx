import React from 'react';
import {
  RadioButtonGroup, RadioOptionInForm,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { UNKNOWN } from '../../../../shared/constants';

export const DualLanguageLearner: React.FC = () => {
  const getRadioButtonProps = ({ label, id }: { label: string, id: string }): RadioOptionInForm<Child> => ({
    getValue: (data) => data.at('dualLanguageLearner'),
    parseOnChangeEvent: (e) => {
      if (e.target.value !== 'dual-unknown')
        return e.target.value === 'dual-yes';
      else return null;
    },
    preprocessForDisplay: (data) => {
      if (data === true) return 'dual-yes';
      else if (data === false) return 'dual-no';
      else return 'dual-unknown';
    },
    id,
    text: label,
    value: id,
    name: id
  })

  return <RadioButtonGroup<Child>
    inForm
    id="duallanguage-button-group"
    legend="Dual language learner"
    showLegend
    options={[
      {
        id: "dual-yes",
        label: 'Is a dual language learner',
      },
      {
        id: 'dual-no',
        label: 'Is not a dual language learner',
      },
      {
        id: 'dual-unknown',
        label: UNKNOWN,
      },
    ].map(o => getRadioButtonProps(o))}
    status={(data) =>
      getValidationStatusForFields(
        data,
        ['dualLanguageLearner'],
        { message: 'Dual language learner status is required for OEC reporting.' }
      )
    } />
};
