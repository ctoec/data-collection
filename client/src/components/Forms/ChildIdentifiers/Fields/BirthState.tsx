import React from 'react';
import {
  TextInput,
  useGenericContext,
  FormContext,
  Checkbox,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import set from 'lodash/set';

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC = () => {
  // Use state to control clearing input when one component or the other is manipulated
  const { data: child, dataDriller, updateData } = useGenericContext<Child>(
    FormContext
  );

  return (
    <>
      <TextInput
        type="input"
        id="birthState"
        label="State"
        value={child.birthState}
        onChange={(e) => {
          updateData(
            set(child, dataDriller.at('birthState').path, e.target.value)
          );
          return e.target.value;
        }}
        status={getValidationStatusForFieldInFieldset(
          dataDriller,
          dataDriller.at('birthState').path,
          {}
        )}
      />
      <Checkbox
        id="birth-state-not-collected-checkbox"
        text="Unknown/not collected"
        checked={child.birthState === null}
        onChange={(e) => {
          updateData(
            set(
              child,
              dataDriller.at('birthState').path,
              e.target.checked ? null : ''
            )
          );
          return e.target.checked;
        }}
      />
    </>
  );
};
