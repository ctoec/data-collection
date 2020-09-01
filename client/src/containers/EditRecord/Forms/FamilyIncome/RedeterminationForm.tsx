import React, { useState, useContext, useEffect } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  Button,
  Form,
  ExpandCard,
  FormSubmitButton,
  Card,
  CardExpansion,
} from '@ctoec/component-library';
import { IncomeDeterminationCard } from './Fields/DeterminationCard';
import { IncomeDetermination } from '../../../../shared/models';
import { apiPut, apiPost } from '../../../../utils/api';
import { IncomeDeterminationFieldSet } from './Fields';

type RedeterminationFormProps = {
  familyId: number;
  refetchChild: () => void;
};

/**
 * The main form rendered in the EditRecord TabNav that allows a user
 * to update the income determination for a given Child record
 * object. Updates are performed on individual income determinations
 * before being re-persisted to the database.
 */
export const RedeterminationForm: React.FC<RedeterminationFormProps> = ({
  familyId,
  refetchChild,
}) => {
  // Set up form state
  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [loading, setLoading] = useState(false);

  var newDet = { id: 0, numberOfPeople: 0, income: 0 } as IncomeDetermination;

  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  // Save function that handles API protocols
  // Uses the ID of the user-modified determination to make the correct
  // update to the determinations array before pushing the whole
  // thing to the DB.
  const onFormSubmit = (newDet: IncomeDetermination) => {
    console.log(newDet);
    setLoading(true);
    apiPost(`families/${familyId}/incomeDetermination/`, newDet, {
      accessToken,
      jsonParse: false,
    })
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
    <Card forceClose={closeCard}>
      <div className="display-flex flex-justify">
        <h2 className="header-normal font-heading-lg">Redetermine income?</h2>
        <ExpandCard>
          <Button text="Redetermine" appearance="outline" />
        </ExpandCard>
      </div>
      <CardExpansion>
        <Form<IncomeDetermination>
          id={`update-family-income-${newDet.id}`}
          data={newDet}
          onSubmit={(data) => onFormSubmit(data)}
          className="usa-form"
        >
          <IncomeDeterminationFieldSet
            type={'redetermine'}
            determinationId={newDet.id}
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
      </CardExpansion>
    </Card>
    //   }
    // />
  );
};
