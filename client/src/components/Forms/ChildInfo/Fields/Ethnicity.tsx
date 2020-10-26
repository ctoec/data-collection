import React from 'react';
import { UNKNOWN } from '../../../../shared/constants';
import { Child } from '../../../../shared/models';
import { TripleBooleanRadio } from '../../../TripleBooleanRadio';

export const EthnicityField: React.FC = () => (
  <TripleBooleanRadio<Child>
    field="hispanicOrLatinxEthnicity"
    id="ethnicity-radiogroup"
    legend="Ethnicity"
    trueOption={{
      id: 'hispanic-ethnicity-yes',
      label: 'Hispanic or Latinx',
    }}
    falseOption={{
      id: 'hispanic-ethnicity-no',
      label: 'Not Hispanic or Latinx',
    }}
    unknownOption={{
      id: 'hispanic-ethnicity-unknown',
      label: UNKNOWN,
    }}
  />
);
