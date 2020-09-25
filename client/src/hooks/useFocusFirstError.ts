import { useEffect, DependencyList, useState } from 'react';
import useIsMounted from './useIsMounted';

export function useFocusFirstError(deps: DependencyList | undefined = []) {
  const [firstElWithError, setFirstElWithError] = useState<Element>();
  const isMounted = useIsMounted();
  useEffect(() => {
    const input = document.querySelectorAll(
      '.usa-input--error, .oec-date-input--error input, .usa-fieldset--error'
    );
    setFirstElWithError(input ? input[0] : undefined);
  }, [...deps, isMounted()]);

  return useEffect(() => {
    if (firstElWithError) {
      (firstElWithError as HTMLElement).focus();
    }
  }, [...deps, firstElWithError, isMounted()]);
}
