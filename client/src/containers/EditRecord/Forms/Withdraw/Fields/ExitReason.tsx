import { FormField, SelectProps, Select } from '@ctoec/component-library';
import React from 'react';
import { ExitReason } from '../../../../../shared/models';
import { Withdraw } from '../../../../../shared/payloads';

export const ExitReasonField: React.FC = () => {
  return (
    <FormField<Withdraw, SelectProps, string | null>
      getValue={(data) => data.at('exitReason')}
      parseOnChangeEvent={(e) => e.target.value}
      inputComponent={Select}
      id="exit-reason"
      label="Exit reason"
      options={Object.values(ExitReason).map((reason) => ({
        text: reason,
        value: reason,
      }))}
    />
  );
};
