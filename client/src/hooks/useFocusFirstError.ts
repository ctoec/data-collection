import { useEffect, DependencyList, useState } from 'react';

export function useFocusFirstError(deps: DependencyList | undefined = []) {
  const [firstElWithError, setFirstElWithError] = useState<Element>();

  useEffect(() => {
    setTimeout(() => {
      const input = document.querySelector(
        '.usa-input--error, .oec-date-input--error input'
      );
      setFirstElWithError(input || undefined);
    });
  });

  return useEffect(() => {
    if (firstElWithError) {
      (firstElWithError as HTMLElement).focus();
    }
  }, [...deps, firstElWithError]);
}
