import React, { useContext, useState } from 'react';
import { Child, IncomeDetermination } from '../../../shared/models';
import {
  getValidationStatusForFields,
  getValidationStatusForField,
} from '../../../utils/getValidationStatus';
import { RecordFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost, apiPut } from '../../../utils/api';
import idx from 'idx';
import {
  Form,
  FormSubmitButton,
  FormFieldSet,
  Alert,
} from '@ctoec/component-library';
import {
  HouseholdSizeField,
  AnnualHouseholdIncomeField,
  DeterminationDateField,
} from './Fields';
import { FosterIncomeNotRequiredAlert } from './FosterIncomeNotRequiredAlert';

const incomeDeterminationFields = [
  'numberOfPeople',
  'income',
  'determinationDate',
];
export const doesFamilyIncomeFormHaveErrors = (
  child?: Child,
  determinationId?: number
) => {
  if (child?.foster) {
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
  type?: 'edit' | 'redetermination';
} & RecordFormProps;

export const FamilyIncomeForm: React.FC<FamilyIncomeFormProps> = ({
  id = 'new-income-determination',
  legend = 'New income determination',
  child,
  incomeDeterminationId,
  CancelButton,
  type,
  afterSaveSuccess,
  setAlerts,
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }

  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);

  if (child?.foster) {
    // This shows up for new child
    return <FosterIncomeNotRequiredAlert />;
  }

  const determination = (type === 'edit'
    ? (incomeDeterminationId
        ? child?.family?.incomeDeterminations?.find(
            (d) => d.id === incomeDeterminationId
          )
        : idx(child, (_) => _.family.incomeDeterminations[0])) || {}
    : {}) as IncomeDetermination;

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
  const onSubmit = (updatedData: IncomeDetermination) => {
    setLoading(true);
    saveData(updatedData)
      .then(afterSaveSuccess)
      .catch((err) => {
        console.log(err);
        setAlerts([
          { type: 'error', text: 'Unable to save family income determination' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form<IncomeDetermination> id={id} data={determination} onSubmit={onSubmit}>
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
