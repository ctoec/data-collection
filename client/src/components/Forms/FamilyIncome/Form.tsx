import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Child,
  IncomeDetermination,
  UndefinableBoolean,
} from '../../../shared/models';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import { RecordFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost, apiPut } from '../../../utils/api';
import {
  Form,
  FormSubmitButton,
  FormFieldSet,
  Button,
} from '@ctoec/component-library';
import {
  HouseholdSizeField,
  AnnualHouseholdIncomeField,
  DeterminationDateField,
} from './Fields';
import { FosterIncomeNotRequiredAlert } from './FosterIncomeNotRequiredAlert';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';

const incomeDeterminationFields = [
  'numberOfPeople',
  'income',
  'determinationDate',
];
export const doesFamilyIncomeFormHaveErrors = (
  child?: Child,
  determinationId?: number
) => {
  if (child?.foster === UndefinableBoolean.Yes) {
    return false;
  }

  if (determinationId) {
    const determination = child?.family?.incomeDeterminations?.find(
      (f) => f.id === determinationId
    );
    return determination
      ? !!getValidationStatusForFields(determination, incomeDeterminationFields)
      : false;
  }

  const familyHasIncomeDeterminationError = child?.family
    ? !!getValidationStatusForFields(child.family, ['incomeDeterminations'])
    : false;
  const incomeDeterminationsHaveError = child?.family?.incomeDeterminations
    ?.length
    ? !!getValidationStatusForFields(
      child.family.incomeDeterminations,
      incomeDeterminationFields
    )
    : false;

  return familyHasIncomeDeterminationError || incomeDeterminationsHaveError;
};

type FamilyIncomeFormProps = {
  id?: string;
  legend?: string;
  incomeDeterminationId?: number;
  CancelButton?: JSX.Element;
} & RecordFormProps;

export const FamilyIncomeForm: React.FC<FamilyIncomeFormProps> = ({
  id = 'new-income-determination',
  legend = 'New income determination',
  child,
  incomeDeterminationId,
  CancelButton,
  afterSaveSuccess,
  setAlerts,
  hideErrors
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);
  const { errorsHidden } = useValidationErrors(
    hideErrors
  );

  // Determine if we're in the create flow: affects how we
  // retrieve income determinations
  const { pathname: path } = useLocation();
  const inCreateFlow = path.includes('create-record');

  const isMounted = useIsMounted();

  if (child?.foster === UndefinableBoolean.Yes) {
    // New child is and batch edit both use this form directly
    // So this alert will show for those two forms
    // Edit child conditionally shows this form, so this alert is in that container too
    return (
      <div>
        <FosterIncomeNotRequiredAlert />
        <Button
          text="Next"
          onClick={afterSaveSuccess}
          className="margin-top-3"
        />
      </div>
    );
  }

  let determination: IncomeDetermination;
  const dets = child?.family?.incomeDeterminations || [];
  if (inCreateFlow) {
    determination = dets[0] || ({} as IncomeDetermination);
  } else {
    determination =
      dets.find((d) => d.id === incomeDeterminationId) ||
      dets[0] ||
      ({} as IncomeDetermination);
  }

  const createDetermination = async (updatedData: IncomeDetermination) =>
    apiPost(
      `families/${child?.family?.id}/income-determinations`,
      updatedData,
      { accessToken }
    );

  const updateDetermination = async (updatedData: IncomeDetermination) =>
    apiPut(
      `families/${child?.family?.id}/income-determinations/${determination.id}`,
      updatedData,
      { accessToken }
    );

  const saveData = determination.id ? updateDetermination : createDetermination;

  const onFinally = () => {
    if (isMounted()) {
      setLoading(false);
    }
  };

  const onSubmit = (updatedData: IncomeDetermination) => {
    setLoading(true);
    saveData(updatedData)
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error(err);
        setAlerts([
          { type: 'error', text: 'Unable to save family income determination' },
        ]);
      })
      .finally(onFinally);
  };

  return (
    <Form<IncomeDetermination>
      id={id}
      data={determination}
      onSubmit={onSubmit}
      hideStatus={errorsHidden}
    >
      <FormFieldSet<IncomeDetermination>
        id={`${id}-fieldset`}
        legend={legend}
        status={(data) =>
          getValidationStatusForFields(data, incomeDeterminationFields, {
            message: 'Income determination is required for OEC reporting.',
          })
        }
      >
        <div>
          <HouseholdSizeField />
        </div>
        <div>
          <AnnualHouseholdIncomeField />
        </div>
        <div>
          <DeterminationDateField />
        </div>
      </FormFieldSet>
      {CancelButton}
      <FormSubmitButton text={loading ? 'Saving... ' : 'Save'} />
    </Form>
  );
};
