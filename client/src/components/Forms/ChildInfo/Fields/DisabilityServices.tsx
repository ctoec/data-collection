import React from 'react';
import {
  RadioButtonGroup, RadioOptionInForm,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { UNKNOWN } from '../../../../shared/constants';

export const DisabilityServices: React.FC = () => {

  const getRadioButtonProps = ({ label, id }: { label: string, id: string }): RadioOptionInForm<Child> => ({
    getValue: (data) => data.at('receivesDisabilityServices'),
    parseOnChangeEvent: (e) => {
      if (e.target.value !== 'disability-unknown')
        return e.target.value === 'disability-yes';
      else return null;
    },
    preprocessForDisplay: (data) => {
      if (data === true) return 'disability-yes';
      else if (data === false) return 'disability-no';
      else return 'disability-unknown';
    },
    id,
    text: label,
    value: id,
    name: id
  })

  return <RadioButtonGroup<Child>
    inForm
    id="disability-button-group"
    legend="Receiving disability services"
    showLegend
    options={[
      {
        id: "disability-yes",
        label: 'Receives disability services',
      },
      {
        id: 'disability-no',
        label: 'Does not receive disability services',
      },
      {
        id: 'disability-unknown',
        label: UNKNOWN,
      },
    ].map(o => getRadioButtonProps(o))}
    status={(data) =>
      getValidationStatusForFields(
        data,
        ['receivesDisabilityServices'],
        { message: 'Disability services status is required for OEC reporting.' }
      )
    } />
};
