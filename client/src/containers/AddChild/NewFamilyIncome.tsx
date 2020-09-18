import React, { useState, useContext } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Child, IncomeDetermination } from '../../shared/models';
import { apiPost } from '../../utils/api';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { IncomeDeterminationFieldSet } from '../../components/Forms/FamilyIncome/Fields';
import { EditFormProps } from '../../components/Forms/types';
import useIsMounted from '../../hooks/useIsMounted';
import idx from 'idx';
import { useValidationErrors } from '../../hooks/useValidationErrors';

/**
 * Form component that allows the generation of a new income determination.
 * Form is accessed via a button revealed by clicking "Redetermine income,"
 * and values default to 0 but are overwritten by user input.
 */
export const NewFamilyIncome: React.FC<EditFormProps> = ({
  child: inputChild,
  onSuccess,
  setAlerts,
  hideErrorsOnFirstLoad = false,
}) => {
  // Set up form state
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  if (!inputChild) {
    throw new Error('New family income rendered without child');
  }
  const { obj: child, setErrorsHidden } = useValidationErrors<Child>(
    inputChild,
    hideErrorsOnFirstLoad
  );

  const familyId = child?.family.id;

  // Save function that handles API protocols. Invokes an api.POST
  // call to create a new resource in the database to hold the values
  // of the associated redetermination. FamilyID is also sent so
  // that the new determination can be associated with the right
  // family object.
  const onFormSubmit = (newDet: IncomeDetermination) => {
    setErrorsHidden(false);
    setLoading(true);
    apiPost(`families/${familyId}/income-determination`, newDet, {
      accessToken,
      jsonParse: false,
    })
      .then(onSuccess)
      .catch((err) => {
        console.log('Unable to create income determination: ', err);
        setAlerts([
          {
            type: 'error',
            text: err || 'Unable to save income redetermination',
          },
        ]);
      })
      .finally(() => (isMounted() ? setLoading(false) : null));
  };

  const determination =
    idx(child, (_) => _.family.incomeDeterminations[0]) ||
    ({} as IncomeDetermination);
  return (
    <Form<IncomeDetermination>
      id="redetermine-income"
      data={determination}
      onSubmit={onFormSubmit}
      className="usa-form"
    >
      <IncomeDeterminationFieldSet type="redetermine" />
      <div className="display-flex">
        <div>
          <FormSubmitButton text={loading ? 'Saving...' : 'Save'} />
        </div>
      </div>
    </Form>
  );
};
