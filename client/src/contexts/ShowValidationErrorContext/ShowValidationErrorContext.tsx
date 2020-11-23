import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  getValidationStatusForFieldInFieldset,
  getValidationStatusForField,
  getValidationStatusForFields,
} from '../../utils/getValidationStatus';

export type HideErrors = boolean | ((locationHash: string) => boolean);

export type ShowValidationErrorContextProps = {
  hideErrorsOnInitialLoad?: HideErrors;
};

export type ShowValidationErrorContextType = {
  setShowValidationErrors: Dispatch<SetStateAction<boolean>>;
  getValidationStatusForFieldInFieldset: Function;
  getValidationStatusForField: Function;
  getValidationStatusForFields: Function;
};

const ShowValidationErrorContext = createContext<
  ShowValidationErrorContextType
>({
  setShowValidationErrors: () => {},
  getValidationStatusForFieldInFieldset,
  getValidationStatusForField,
  getValidationStatusForFields,
});

const { Provider, Consumer } = ShowValidationErrorContext;

const ShowValidationErrorContextProvider: React.FC<ShowValidationErrorContextProps> = ({
  hideErrorsOnInitialLoad = true,
  children,
}) => {
  const { hash } = useLocation();
  let initialHide = hideErrorsOnInitialLoad;
  if (hideErrorsOnInitialLoad instanceof Function) {
    initialHide = hideErrorsOnInitialLoad(hash);
  }
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(
    !!initialHide
  );
  let functions: { [k: string]: Function } = {
    getValidationStatusForFieldInFieldset,
    getValidationStatusForField,
    getValidationStatusForFields,
  };
  if (!showValidationErrors) {
    Object.keys(functions).forEach((k) => {
      functions[k] = (_: any) => undefined;
    });
  }

  return (
    <Provider
      value={
        {
          setShowValidationErrors,
          ...functions,
        } as ShowValidationErrorContextType
      }
    >
      {children}
    </Provider>
  );
};

export {
  ShowValidationErrorContextProvider,
  Consumer as ShowValidationErrorContextConsumer,
};
export default ShowValidationErrorContext;
