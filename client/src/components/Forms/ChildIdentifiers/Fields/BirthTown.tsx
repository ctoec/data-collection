import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Checkbox,
  FormContext,
  useGenericContext,
} from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldInFieldset } from '../../../../utils/getValidationStatus';
import set from 'lodash/set';

type TownFieldProps = {
  child: Child;
};

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC<TownFieldProps> = ({ child }) => {
  // Use state to control clearing input when one component or the other is manipulated
  const [town, setTown] = useState<string | null>(null);
  const { dataDriller, updateData } = useGenericContext<Child>(FormContext);

  // Can't parse undefined visually, so need conversion from null
  useEffect(() => {
    setTown(
      child.birthTown === undefined
        ? null
        : child.birthTown === null
        ? null
        : child.birthTown
    );
  }, []);

  return (
    <>
      <TextInput
        type="input"
        label="Town"
        id="birthTown"
        value={town || ''}
        onChange={(e) => {
          setTown(e.target.value);
          updateData(
            set(child, dataDriller.at('birthTown').path, e.target.value)
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
        checked={town === null}
        onChange={(e) => {
          setTown(e.target.checked ? null : '');
          updateData(
            set(
              child,
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
