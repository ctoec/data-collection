import React, { useState, useContext, useEffect } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  Button,
  Form,
  ExpandCard,
  FormSubmitButton,
} from '@ctoec/component-library';
import { IncomeDeterminationCard } from './Fields/DeterminationCard';
import { IncomeDetermination } from '../../../../shared/models';
import { apiPut } from '../../../../utils/api';
import { IncomeDeterminationFieldSet } from './Fields';

type EditDeterminationFormProps = {
  determination: IncomeDetermination;
  familyId: number;
  isCurrent: boolean;
  isNew: boolean;
  refetchChild: () => void;
};

/**
 * The main form rendered in the EditRecord TabNav that allows a user
 * to update the income determination for a given Child record
 * object. Updates are performed on individual income determinations
 * before being re-persisted to the database.
 */
export const EditDeterminationForm: React.FC<EditDeterminationFormProps> = ({
  determination,
  familyId,
  isCurrent,
  isNew,
  refetchChild,
}) => {
  // Set up form state
  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  // Save function that handles API protocols
  // Uses the ID of the user-modified determination to make the correct
  // update to the determinations array before pushing the whole
  // thing to the DB.
  const onFormSubmit = (userModifiedDet: IncomeDetermination) => {
    setLoading(true);
    apiPut(
      `families/${familyId}/incomeDetermination/${determination.id}`,
      userModifiedDet,
      { accessToken }
    )
      .then((resp) => {
        console.log(resp);
        setCloseCard(true);
        refetchChild();
      })
      .catch((err) => {
        console.log('Unable to edit income determination: ', err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <IncomeDeterminationCard
      determination={determination}
      isCurrent={isCurrent}
      isNew={isNew}
      forceClose={closeCard}
      expansion={
        <Form<IncomeDetermination>
          id={`update-family-income-${determination.id}`}
          data={determination}
          onSubmit={(data) => onFormSubmit(data)}
          className="usa-form"
        >
          <IncomeDeterminationFieldSet
            type={'edit'}
            determinationId={determination.id}
          />
          <div className="display-flex">
            <div>
              <ExpandCard>
                <Button text="Cancel" appearance="outline" />
              </ExpandCard>
              <FormSubmitButton text={loading ? 'Saving...' : 'Save'} />
            </div>
          </div>
        </Form>
      }
    />
  );
};
