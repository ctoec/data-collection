import React, { useEffect, useState } from 'react';
import {
  TextInput,
  useGenericContext,
  FormContext,
  Checkbox,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import set from 'lodash/set';

type StateFieldProps = {
  child: Child;
};

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC<StateFieldProps> = ({ child }) => {
  // Use state to control clearing input when one component or the other is manipulated
  const [state, setState] = useState<string | null>(null);
  const { dataDriller, updateData } = useGenericContext<Child>(FormContext);

  // Can't parse undefined visually, so need conversion from null
  useEffect(() => {
    setState(
      child.birthState === undefined
        ? null
        : child.birthState === null
        ? null
        : child.birthState
    );
  }, []);

  return (
    <>
      <TextInput
        type="input"
        id="birthState"
        label="State"
        value={state || ''}
        onChange={(e) => {
          setState(e.target.value);
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
        checked={state === null}
        onChange={(e) => {
          setState(e.target.checked ? null : '');
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
