import React, { useContext, useState } from 'react';
import { Child, IncomeDetermination } from '../../../shared/models';
import { useLocation } from 'react-router-dom';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import { RecordFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost, apiPut } from '../../../utils/api';
import {
  Form,
  FormSubmitButton,
  FormFieldSet,
  Divider,
} from '@ctoec/component-library';
import {
  HouseholdSizeField,
  AnnualHouseholdIncomeField,
  DeterminationDateField,
} from './Fields';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { NotDisclosedField } from './Fields/NotDisclosed';

const incomeDeterminationFields = [
  'numberOfPeople',
  'income',
  'determinationDate',
  'incomeNotDisclosed',
];
export const doesFamilyIncomeFormHaveErrors = (
  child?: Child,
  determinationId?: number
) => {
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
  isFirstRecordedDet?: boolean;
  redetermine?: boolean;
} & RecordFormProps;

export const FamilyIncomeForm: React.FC<FamilyIncomeFormProps> = ({
  id = 'new-income-determination',
  legend = 'New income determination',
  child,
  incomeDeterminationId,
  CancelButton,
  redetermine = false,
  afterSaveSuccess,
  setAlerts,
  hideErrors,
  isFirstRecordedDet,
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);
  const { errorsHidden } = useValidationErrors(hideErrors);

  // Determine if we're in the create flow: affects how we
  // retrieve income determinations
  const { pathname: path } = useLocation();
  const inCreateFlow = path.includes('create-record');

  const isMounted = useIsMounted();

  let determination: IncomeDetermination;
  const dets = child?.family?.incomeDeterminations || [];
  if (inCreateFlow || redetermine) {
    determination =
      ({
        numberOfPeople: dets[0].numberOfPeople,
        income: dets[0].income,
        determinationDate: dets[0].determinationDate,
        incomeNotDisclosed: dets[0].incomeNotDisclosed,
      } as IncomeDetermination) || ({} as IncomeDetermination);
  } else {
    determination =
      dets.find((d) => d.id === incomeDeterminationId) ||
      dets[0] ||
      ({} as IncomeDetermination);
  }

  const createDetermination = async (updatedData: IncomeDetermination) => {
    await apiPost(
      `families/${child?.family?.id}/income-determinations`,
      updatedData,
      { accessToken }
    );
  };
  const updateDetermination = async (updatedData: IncomeDetermination) => {
    await apiPut(
      `families/${child?.family?.id}/income-determinations/${determination.id}`,
      updatedData,
      { accessToken }
    );
  };

  const saveData =
    determination.id && !redetermine
      ? updateDetermination
      : createDetermination;

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
          errorsHidden
            ? undefined
            : getValidationStatusForFields(data, incomeDeterminationFields, {
                message: 'Income determination is required for OEC reporting.',
              })
        }
      >
        <div>
          <HouseholdSizeField hideStatus={errorsHidden} />
        </div>
        <div>
          <AnnualHouseholdIncomeField hideStatus={errorsHidden} />
        </div>
        <div>
          <DeterminationDateField />
        </div>
        <div className="margin-top-4 margin-bottom-4">
          <Divider />
        </div>
        <div>
          <NotDisclosedField />
        </div>
      </FormFieldSet>
      {CancelButton}
      <FormSubmitButton
        text={
          loading
            ? 'Saving... '
            : isFirstRecordedDet
            ? 'Add income determination'
            : 'Save'
        }
      />
    </Form>
  );
};
