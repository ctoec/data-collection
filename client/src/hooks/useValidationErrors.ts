import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ObjectWithValidationErrors } from '../shared/models/ObjectWithValidationErrors';

export type HideErrors = boolean | ((locationHash: string) => boolean);

export function useValidationErrors<T extends ObjectWithValidationErrors>(
  inputObject: T,
  hideErrors?: HideErrors
) {
  const { hash } = useLocation();
  let initialHide = hideErrors;
  if (hideErrors instanceof Function) {
    initialHide = hideErrors(hash);
  }
  const [errorsHidden, setErrorsHidden] = useState(!!initialHide);
  const [outputObject, setOutputObject] = useState<T>({
    ...inputObject,
    validationErrors: undefined,
  });

  useEffect(() => {
    if (!errorsHidden) {
      setOutputObject(inputObject);
    }
  }, [errorsHidden]);

  return {
    obj: outputObject,
    setErrorsHidden,
  };
}
