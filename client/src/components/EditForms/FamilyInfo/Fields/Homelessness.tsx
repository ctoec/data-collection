import React from 'react';
import { FormField, CheckboxProps, Checkbox } from '@ctoec/component-library';
import { Family } from '../../../../shared/models';

export const HomelessnessField: React.FC = () => {
  return (
    <>
      <p className="text-bold margin-top-3 margin-bottom-1">
        Experiencing homelessness
      </p>
      <FormField<Family, CheckboxProps, boolean | null>
        id="homelessness"
        getValue={(data) => data.at('homelessness')}
        value={'homelessness'}
        parseOnChangeEvent={(e) => e.target.checked}
        inputComponent={Checkbox}
        text="Family has experienced homelessness / housing insecurity within the last year"
      />
    </>
  );
};
