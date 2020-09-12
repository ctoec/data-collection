import React from 'react';
import { FormField, CheckboxProps, Checkbox } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

export const FosterCheckbox: React.FC = () => (
  <>
    <p className="text-bold margin-top-3 margin-bottom-1">Foster family</p>
    <FormField<Child, CheckboxProps, boolean | null>
      getValue={(data) => data.at('foster')}
      value={'foster'}
      parseOnChangeEvent={(e) => e.target.checked}
      inputComponent={Checkbox}
      id="foster"
      text="Child lives with foster family"
      status={getValidationStatusForField}
    />
  </>
);