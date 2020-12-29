import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export type HideErrors = boolean | ((locationHash: string) => boolean);

export function useValidationErrors(hideErrors?: HideErrors) {
  const { hash } = useLocation();
  const [errorsHidden, setErrorsHidden] = useState<boolean>();

  useEffect(() => {
    let hide = hideErrors;
    if (hideErrors instanceof Function) {
      hide = hideErrors(hash);
    }
    setErrorsHidden(!!hide)
  }, [hideErrors, hash])

  return {
    errorsHidden,
    setErrorsHidden,
  };
}
