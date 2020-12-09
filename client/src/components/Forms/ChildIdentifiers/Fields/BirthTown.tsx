import React from 'react';
import set from 'lodash/set';
import produce from 'immer';
import {
  TextInput,
  Checkbox,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC = () => {
  const { data: child, dataDriller, updateData } = useGenericContext<Child>(
    FormContext
  );

  const path = dataDriller.at('birthTown').path;

  return (
    <>
      <TextInput
        type="input"
        label="Town"
        id="birthTown"
        value={child.birthTown}
        onChange={(e) => {
          updateData(
            produce<Child>(child, (draft) => set(draft, path, e.target.value))
          );
          return e.target.value;
        }}
        status={getValidationStatusForFieldInFieldset(dataDriller, path, {})}
      />
      <Checkbox
        id="birth-town-not-collected-checkbox"
        text="Town unknown/not collected"
        checked={child.birthTown === null}
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
