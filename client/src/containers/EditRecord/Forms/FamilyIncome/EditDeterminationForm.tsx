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
 * Form component used for editing an existing income determination.
 * This form handles its own change events, as well as processes
 * its own interactions with the backend and the API.
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

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make form re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  // Save function that handles API protocols. Uses an api.PUT
  // request to update an existing determination with the one
  // that the user has spent time modifying.
  const onFormSubmit = (userModifiedDet: IncomeDetermination) => {
    setLoading(true);
    apiPut(
      `families/${familyId}/income-determination/${determination.id}`,
      userModifiedDet,
      { accessToken }
    )
      .then(() => {
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
