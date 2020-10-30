import React from 'react';
import { UNKNOWN } from '../../../../shared/constants';
import { Child } from '../../../../shared/models';
import { TripleBooleanRadio } from '../../../TripleBooleanRadio';

export const DualLanguageLearner: React.FC = () => (
  <TripleBooleanRadio<Child>
    field="dualLanguageLearner"
    id="duallanguage-button-group"
    legend="Dual Language Learner"
    trueOption={{
      id: 'dual-yes',
      label: 'Is a dual language learner',
    }}
    falseOption={{
      id: 'dual-no',
      label: 'Is not a dual language learner',
    }}
    unknownOption={{
      id: 'dual-unknown',
      label: UNKNOWN,
    }}
  />
);
