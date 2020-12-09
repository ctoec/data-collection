import React from 'react';
import set from 'lodash/set';
import produce from 'immer';
import {
  TextInput,
  useGenericContext,
  FormContext,
  Checkbox,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC = () => {
  // Use state to control clearing input when one component or the other is manipulated
  const { data: child, dataDriller, updateData } = useGenericContext<Child>(
    FormContext
  );
  const path = dataDriller.at('birthState').path;

  return (
    <>
      <TextInput
        type="input"
        label="State"
        id="birthState"
        value={child.birthState}
        onChange={(e) => {
          updateData(
            produce<Child>(child, (draft) => set(draft, path, e.target.value))
          );
          return e.target.value;
        }}
        status={getValidationStatusForFieldInFieldset(dataDriller, path, {})}
      />
      <Checkbox
        id="birth-state-not-collected-checkbox"
        text="State unknown/not collected"
        checked={child.birthState === null}
        onChange={(e) => {
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, path, e.target.checked ? null : '')
            )
          );
          return e.target.checked;
        }}
      />
    </>
  );
};
