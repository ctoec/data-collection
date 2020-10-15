import React, { useState, useEffect, useContext } from 'react';
import { Child, ObjectWithValidationErrors } from '../../shared/models';
import { StepProps, StepList, Button } from '@ctoec/component-library';
import { EditFormProps } from '../../components/Forms/types';
import { listSteps } from './listSteps';
import { nameFormatter } from '../../utils/formatters';
import { useAlerts } from '../../hooks/useAlerts';
import { hasValidationErrorForField } from '../../utils/hasValidationError';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { Link } from 'react-router-dom';

type BatchEditItemContentProps = {
  record: Child;
  moveNextRecord: () => void;
};

export const BatchEditItemContent: React.FC<BatchEditItemContentProps> = ({
  record,
  moveNextRecord,
}) => {
  const { children } = useContext(DataCacheContext);
  const { setAlerts } = useAlerts();

  const [steps, setSteps] = useState<StepProps<EditFormProps>[]>([]);
  const [activeStepKey, setActiveStep] = useState('');

  const { accessToken } = useContext(AuthenticationContext);
  const [refetchChild, setRefetchChild] = useState(0);
  const triggerRefetchChild = () => setRefetchChild((r) => r + 1);

  const moveNextStep = () => {
    if (!activeStepKey) return;

    const activeStepIdx = steps.findIndex((step) => step.key === activeStepKey);
    if (activeStepIdx === steps.length - 1) {
      moveNextRecord();
    } else {
      setActiveStep(steps[activeStepIdx + 1].key);
    }
  };

  useEffect(() => {
    setDidInitialFetch(false);
    apiGet(`/children/${record.id}`, { accessToken })
      .then((updatedChild) => {
        children.addOrUpdateRecord(updatedChild);
        if (activeStepKey.length) {
          const currentStepStatus = steps
            .find((step) => step.key === activeStepKey)
            ?.status(updatedChild);
          if (currentStepStatus === 'complete') {
            moveNextStep();
          }
        } else {
          setDidInitialFetch(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // only trigger refetch on explicit refetch
    // not when record prop changes (user clicks on tab nav)
    //es-lint-disable-next-line
  }, [accessToken, refetchChild, record.id]);

  // Trigger step generation after initial individual fetch
  // but on the next render loop so that the form props include
  // the updated child
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  useEffect(() => {
    if (didInitialFetch) {
      const _steps = listSteps(record);
      setSteps(_steps);
      if (_steps.length) {
        setActiveStep(_steps[0].key);
      }
    }
  }, [didInitialFetch]);

  const showFieldInBatchEditForm = (
    formData: ObjectWithValidationErrors,
    fields: string[],
    allFormFields: string[]
  ) => {
    for (let i = 0; i < fields.length; i++) {
      if (
        allFormFields.includes(fields[i]) &&
        hasValidationErrorForField(formData, fields[i])
      )
        return true;
    }
    return false;
  };

  const props: EditFormProps = {
    child: record,
    afterSaveSuccess: triggerRefetchChild,
    setAlerts,
    hideHeader: true,
    hideErrorsOnFirstLoad: () => false,
    showField: showFieldInBatchEditForm,
    AdditionalButton: (
      <Button text="Skip" onClick={moveNextStep} appearance="outline" />
    ),
  };

  const AllComplete = (
    <div className="margin-y-2 display-flex flex-center">All complete!</div>
  );

  if (!steps.length || !activeStepKey) {
    return AllComplete;
  }

  return (
    <>
      <div className="padding-x-2 padding-bottom-3">
        <div className="display-flex flex-row flex-justify flex-align-end">
          <h2>{nameFormatter(record)}</h2>
          <div className="text-baseline">
            Date of birth: {record.birthdate?.format('MM/DD/YYYY')}
          </div>
        </div>
        <div className="margin-top-1">
          <Link to={`/edit-record/${record.id}`} />
        </div>
      </div>
      <div className="padding-top-1 border-top-1px border-base-light">
        {steps.length ? (
          <StepList<EditFormProps>
            key={record.id}
            steps={steps}
            props={props}
            activeStep={activeStepKey}
          />
        ) : (
          { AllComplete }
        )}
      </div>
    </>
  );
};
