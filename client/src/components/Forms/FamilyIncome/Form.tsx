import React, { useContext, useState } from 'react';
import {
  Child,
  Family,
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
  Checkbox,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import {
  HouseholdSizeField,
  AnnualHouseholdIncomeField,
  DeterminationDateField,
} from './Fields';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { useLocation } from 'react-router-dom';
import { set } from 'lodash';
import produce from 'immer';
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
} & RecordFormProps;

export const FamilyIncomeForm: React.FC<FamilyIncomeFormProps> = ({
  id = 'new-income-determination',
  legend = 'New income determination',
  child,
  incomeDeterminationId,
  CancelButton,
  afterSaveSuccess,
  setAlerts,
  hideErrorsOnFirstLoad,
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }

  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);
  const { errorsHidden, setErrorsHidden } = useValidationErrors(
    hideErrorsOnFirstLoad
  );

  // Determine if we're in the create flow: affects how we
  // retrieve income determinations
  const { pathname: path } = useLocation();
  const inCreateFlow = path.includes('create-record');

  const isMounted = useIsMounted();

  // if (child?.foster === UndefinableBoolean.Yes) {
  //   // New child and batch edit both use this form directly
  //   // So this alert will show for those two forms
  //   // Edit child conditionally shows this form, so this alert is in that container too
  //   return (
  //     <div>
  //       <FosterIncomeNotRequiredAlert />
  //       <Button
  //         text="Next"
  //         onClick={afterSaveSuccess}
  //         className="margin-top-3"
  //       />
  //     </div>
  //   );
  // }

  let determination: IncomeDetermination;
  if (inCreateFlow) {
    const dets = child?.family?.incomeDeterminations || [];
    determination = dets[0] || ({} as IncomeDetermination);
  } else {
    determination =
      child?.family?.incomeDeterminations?.find(
        (d) => d.id === incomeDeterminationId
      ) || ({} as IncomeDetermination);
  }

  const createDetermination = async (updatedData: IncomeDetermination) =>
    apiPost(
      `families/${child?.family?.id}/income-determinations`,
      updatedData,
      { accessToken }
    );

  const updateDetermination = async (updatedData: IncomeDetermination) => {
    console.log('updated det is ', updatedData);
    apiPut(
      `families/${child?.family?.id}/income-determinations/${determination.id}`,
      updatedData,
      { accessToken }
    );
  };

  const saveData = determination.id ? updateDetermination : createDetermination;

  const onFinally = () => {
    if (isMounted()) {
      setErrorsHidden(false);
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

  // console.log(child.family);
  console.log(determination);

  // Use state to control clearing input when one component or the other is manipulated
  // const { data: family, dataDriller: familyDriller, updateData: updateFamily } = useGenericContext<Family>(
  //   FormContext
  // );
  // const { data: det, dataDriller, updateData } = useGenericContext<IncomeDetermination>(FormContext);
  // updateData(
  //   produce<IncomeDetermination>(determination, (draft) => draft)
  // );
  // console.log(det);
  // const [notDisclosed, setNotDisclosed] = useState<boolean | undefined>(determination.incomeNotDisclosed);
  // console.log(notDisclosed);
  // const [det, setDet] = useState<IncomeDetermination>(determination);

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
        <div>
          <NotDisclosedField />
        </div>
      </FormFieldSet>
      {CancelButton}
      <FormSubmitButton text={loading ? 'Saving... ' : 'Save'} />
    </Form>
  );
};
