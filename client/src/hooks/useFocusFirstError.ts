import { useEffect, DependencyList, useState } from 'react';

export function useFocusFirstError(deps: DependencyList | undefined = []) {
  const [firstElWithError, setFirstElWithError] = useState<Element>();
  useEffect(() => {
    const input = document.querySelectorAll(
      '.usa-input--error, .oec-date-input--error input, .usa-fieldset--error'
    );
    setFirstElWithError(input ? input[0] : undefined);
  }, []);

  return useEffect(() => {
    if (firstElWithError) {
      (firstElWithError as HTMLElement).focus();
    }
  }, [...deps, firstElWithError]);
}
