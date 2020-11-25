import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export type HideErrors = boolean | ((locationHash: string) => boolean);

export function useValidationErrors(hideErrors?: HideErrors) {
  const { hash } = useLocation();
  let initialHide = hideErrors;
  if (hideErrors instanceof Function) {
    initialHide = hideErrors(hash);
  }
  const [errorsHidden, setErrorsHidden] = useState(!!initialHide);

  return {
    errorsHidden,
    setErrorsHidden,
  };
}
