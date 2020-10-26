import React from 'react';
import { UNKNOWN } from '../../../../shared/constants';
import { Child } from '../../../../shared/models';
import { TripleBooleanRadio } from '../../../TripleBooleanRadio';

export const Foster: React.FC = () => (<TripleBooleanRadio<Child>
  field="foster"
  id="foster-button-group"
  legend="Child lives with foster family"
  trueOption={{
    id: 'foster-yes',
    label: 'Yes'
  }}
  falseOption={{
    id: 'foster-no',
    label: 'No'
  }}
  unknownOption={{
    id: 'foster-unknown',
    label: UNKNOWN
  }}
/>);
