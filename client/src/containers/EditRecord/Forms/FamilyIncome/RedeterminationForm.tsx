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
import { IncomeDetermination } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import { IncomeDeterminationFieldSet } from './Fields';

type RedeterminationFormProps = {
  familyId: number;
  refetchChild: () => void;
};

/**
 * Form component that allows the generation of a new income determination.
 * Form is accessed via a button revealed by clicking "Redetermine income,"
 * and values default to 0 but are overwritten by user input.
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

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make form re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  // Save function that handles API protocols. Invokes an api.POST
  // call to create a new resource in the database to hold the values
  // of the associated redetermination. FamilyID is also sent so
  // that the new determination can be associated with the right
  // family object.
  const onFormSubmit = (newDet: IncomeDetermination) => {
    setLoading(true);
    apiPost(`families/${familyId}/income-determination/`, newDet, {
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
