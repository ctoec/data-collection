import React from 'react';
import { FormField, CheckboxProps, Checkbox } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';

export const FosterCheckbox: React.FC = () => (
  <FormField<Child, CheckboxProps, boolean | null>
    getValue={(data) => data.at('foster')}
    value={'foster'}
    parseOnChangeEvent={(e) => e.target.checked}
    inputComponent={Checkbox}
    id="foster"
    text="Child lives with foster family"
    className="margin-top-3"
  />
);
