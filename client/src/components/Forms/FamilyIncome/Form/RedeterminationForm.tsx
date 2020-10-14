import React, { useState, useContext } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Button, Form, FormSubmitButton } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import { IncomeDeterminationFieldSet } from '../Fields';
import { EditFormProps } from '../../types';

type RedeterminationFormProps = {
  familyId: number;
  setIsNew: () => void;
  hideForm: () => void;
  afterSaveSuccess: () => void;
  setAlerts: EditFormProps['setAlerts'];
};

/**
 * Form component that allows the generation of a new income determination.
 * Form is accessed via a button revealed by clicking "Redetermine income,"
 * and values default to 0 but are overwritten by user input.
 */
export const RedeterminationForm: React.FC<RedeterminationFormProps> = ({
  familyId,
  setIsNew,
  hideForm,
  afterSaveSuccess,
  setAlerts,
}) => {
  // Set up form state
  const { accessToken } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);

  // Save function that handles API protocols. Invokes an api.POST
  // call to create a new resource in the database to hold the values
  // of the associated redetermination. FamilyID is also sent so
  // that the new determination can be associated with the right
  // family object.
  const onFormSubmit = (newDet: IncomeDetermination) => {
    setLoading(true);
    apiPost(`families/${familyId}/income-determination`, newDet, {
      accessToken,
      jsonParse: false,
    })
      .then(() => {
        setIsNew();
        afterSaveSuccess();
        hideForm();
      })
      .catch((err) => {
        console.log('Unable to create income determination: ', err);
        setAlerts([
          {
            type: 'error',
            text: err || 'Unable to save income redetermination',
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Form<IncomeDetermination>
        id="redetermine-income"
        data={{} as IncomeDetermination}
        onSubmit={(data) => onFormSubmit(data)}
        className="usa-form"
      >
        <IncomeDeterminationFieldSet type="redetermine" />
        <div className="display-flex">
          <div>
            <Button text="Cancel" appearance="outline" onClick={hideForm} />
            <FormSubmitButton text={loading ? 'Saving...' : 'Save'} />
          </div>
        </div>
      </Form>
    </>
  );
};
