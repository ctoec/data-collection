import React from 'react';
import { UNKNOWN } from '../../../../shared/constants';
import { Child } from '../../../../shared/models';
import { TripleBooleanRadio } from '../../../TripleBooleanRadio';

export const DisabilityServices: React.FC = () => (
  <TripleBooleanRadio<Child>
    field="receivesDisabilityServices"
    id="disability-button-group"
    legend="Receiving disability services"
    trueOption={{
      id: 'disability-yes',
      label: 'Receives disability services',
    }}
    falseOption={{
      id: 'disability-no',
      label: 'Does not receive disability services',
    }}
    unknownOption={{
      id: 'disability-unknown',
      label: UNKNOWN,
    }}
  />
);
