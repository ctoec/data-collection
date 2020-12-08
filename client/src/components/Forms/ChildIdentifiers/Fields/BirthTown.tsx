import React from 'react';
import {
  TextInput,
  Checkbox,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import set from 'lodash/set';

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC = () => {
  const { data: child, dataDriller, updateData } = useGenericContext<Child>(FormContext);

  return (
    <>
      <TextInput
        type="input"
        label="Town"
        id="birthTown"
        value={child.birthTown}
        onChange={(e) => {
          updateData(oldChild =>
            set(oldChild, dataDriller.at('birthTown').path, e.target.value)
          );
          return e.target.value;
        }}
        status={getValidationStatusForFieldInFieldset(
          dataDriller,
          dataDriller.at('birthTown').path,
          {}
        )}
      />
      <Checkbox
        id="birth-town-not-collected-checkbox"
        text="Unknown/not collected"
        checked={child.birthTown === null}
        onChange={(e) => {
          updateData(oldChild =>
            set(
              oldChild,
              dataDriller.at('birthTown').path,
              e.target.checked ? null : ''
            )
          );
          return e.target.checked;
        }}
      />
    </>
  );
};
