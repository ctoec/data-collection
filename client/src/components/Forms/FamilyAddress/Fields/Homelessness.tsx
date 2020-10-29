import React from 'react';
import { UNKNOWN } from '../../../../shared/constants';
import { Family } from '../../../../shared/models';
import { TripleBooleanRadio } from '../../../TripleBooleanRadio';

export const HomelessnessField: React.FC = () => (
  <TripleBooleanRadio<Family>
    field="homelessness"
    id="homelessness-button-group"
    legend="Homelessness status"
    trueOption={{
      id: 'homelessness-yes',
      label: 'Child is currently experiencing homelessness',
    }}
    falseOption={{
      id: 'homelessness-no',
      label: 'Child is not currently experiencing homelessness',
    }}
    unknownOption={{
      id: 'homelessness-unknown',
      label: UNKNOWN,
    }}
  />
);
