import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Checkbox,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import produce from 'immer';
import set from 'lodash/set';

type TownFieldProps = {
  child: Child;
};

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC<TownFieldProps> = ({ child }) => {
  const [town, setTown] = useState<string | undefined>(undefined);
  const { dataDriller, updateData } = useGenericContext<Child>(FormContext);

  useEffect(() => {
    setTown(!!child.birthTown ? child.birthTown : undefined);
  }, []);

  return (
    <>
      <TextInput
        type="input"
        label="Town"
        id="birthTown"
        value={town}
        onChange={(e) => {
          setTown(e.target.value);
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, dataDriller.at('birthTown').path, e.target.value)
            )
          );
          return e.target.value;
        }}
      />
      <Checkbox
        id="birth-town-not-collected-checkbox"
        text="Unknown/not collected"
        checked={town === undefined}
        onChange={(e) => {
          const {
            target: { checked },
          } = e;
          setTown(checked ? undefined : '');
          updateData(
            produce<Child>(child, (draft) =>
              set(draft, dataDriller.at('birthTown').path, e.target.value)
            )
          );
          return checked;
        }}
      />
    </>
  );
};
