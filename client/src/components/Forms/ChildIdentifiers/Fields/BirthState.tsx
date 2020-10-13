import React, { useEffect, useState } from 'react';
import {
  TextInput,
  useGenericContext,
  FormContext,
  Checkbox,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import produce from 'immer';
import set from 'lodash/set';

type StateFieldProps = {
  child: Child;
};

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC<StateFieldProps> = ({ child }) => {
  const [state, setState] = useState<string | undefined>(undefined);
  const { dataDriller, updateData } = useGenericContext<Child>(FormContext);

  useEffect(() => {
    setState(!!child.birthState ? child.birthState : undefined);
  }, []);
  return (
    <>
      <TextInput
        type="input"
        id="birthState"
        label="State"
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, dataDriller.at('birthState').path, e.target.value)
            )
          );
          return e.target.value;
        }}
      />
      <Checkbox
        id="birth-state-not-collected-checkbox"
        text="Unknown/not collected"
        checked={state === undefined}
        onChange={(e) => {
          const {
            target: { checked },
          } = e;
          setState(checked ? undefined : '');
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, dataDriller.at('birthState').path, e.target.value)
            )
          );
          return checked;
        }}
      />
    </>
  );
};
