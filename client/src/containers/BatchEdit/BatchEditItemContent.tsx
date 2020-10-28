import React, { useState, useEffect, useContext } from 'react';
import { Child, ObjectWithValidationErrors } from '../../shared/models';
import { StepProps, StepList, Button } from '@ctoec/component-library';
import { RecordFormProps } from '../../components/Forms/types';
import { listSteps } from './listSteps';
import { nameFormatter } from '../../utils/formatters';
import { useAlerts } from '../../hooks/useAlerts';
import { hasValidationErrorForField } from '../../utils/hasValidationError';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { Link } from 'react-router-dom';
import { getCurrentEnrollment } from '../../utils/models';

type BatchEditItemContentProps = {
  childId: string;
  moveNextRecord: () => void;
};

export const BatchEditItemContent: React.FC<BatchEditItemContentProps> = ({
  childId,
  moveNextRecord,
}) => {
  const [child, setChild] = useState<Child>();
  const {
    children: { addOrUpdateRecord: updateRecordInCache },
  } = useContext(DataCacheContext);
  const { setAlerts } = useAlerts();

  const [steps, setSteps] = useState<StepProps<RecordFormProps>[]>();
  const [activeStepKey, setActiveStep] = useState<string>();

  const { accessToken } = useContext(AuthenticationContext);
  const [triggerRefetchCount, setTriggerRefetchCount] = useState(0);

  // Reset state when new child
  useEffect(() => {
    setChild(undefined);
    setActiveStep(undefined);
    setSteps(undefined);
  }, [childId]);

  // Function to progress to next step
  const moveNextStep = () => {
    if (!activeStepKey || !steps) return;

    const activeStepIdx = steps.findIndex((step) => step.key === activeStepKey);
    if (activeStepIdx === steps.length - 1) {
      moveNextRecord();
    } else {
      setActiveStep(steps[activeStepIdx + 1].key);
    }
  };

  // Fetch child record
  // and if fetch is re-fetch,
  // then progress to next step if step is complete
  useEffect(() => {
    apiGet(`/children/${childId}`, accessToken)
      .then((updatedChild) => {
        setChild(updatedChild);
        updateRecordInCache(updatedChild);
        moveNextStep();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, triggerRefetchCount, !!child]);

  // Generate steps for the current record
  // after fetching a new one
  useEffect(() => {
    if (child) {
      const _steps = listSteps(child);
      setSteps(_steps);
      if (_steps.length) {
        setActiveStep(_steps[0].key);
      }
    }
  }, [child?.id]);

  const props: RecordFormProps = {
    child,
    afterSaveSuccess: () => setTriggerRefetchCount((r) => r + 1),
    setAlerts,
    hideHeader: true,
    hideErrorsOnFirstLoad: () => false,
    showFieldOrFieldset: showFieldInBatchEditForm,
    AdditionalButton: (
      <Button text="Skip" onClick={moveNextStep} appearance="outline" />
    ),
  };

  const AllComplete = (
    <div className="margin-y-2 display-flex flex-center">All complete!</div>
  );

  if (!child) {
    return <></>;
  }

  const currentEnrollment = getCurrentEnrollment(child);
  return (
    <>
      <div className="padding-x-2 padding-bottom-3">
        <div className="display-flex flex-row flex-justify flex-align-end">
          <h2 className="margin-bottom-0">{nameFormatter(child)}</h2>
          <div className="text-baseline text-base">
            Date of birth: {child.birthdate?.format('MM/DD/YYYY')}
          </div>
        </div>
        <div className="margin-top-1 display-flex flex-row flex-justify">
          <Link to={`/edit-record/${child.id}`}>View full profile</Link>
          <div className="text-base">
            {currentEnrollment?.ageGroup} — {currentEnrollment?.site?.siteName}
          </div>
        </div>
      </div>
      <div className="padding-top-1 border-top-1px border-base-light">
        {steps && steps.length ? (
          <StepList<RecordFormProps>
            key={child.id}
            steps={steps}
            props={props}
            activeStep={activeStepKey || ''}
          />
        ) : (
          AllComplete
        )}
      </div>
    </>
  );
};

// Function that defined what fields should be shown in
// forms during batch edit
export const showFieldInBatchEditForm = (
  formData: ObjectWithValidationErrors | undefined,
  fields: string[]
) => {
  if (!formData) return false;
  for (let i = 0; i < fields.length; i++) {
    if (
      // special case to account for separation of
      // enrollment and funding forms in batch edit flow
      // (the 'fundings' field in enrollment form shoud never be shown)
      fields[i] !== 'fundings' &&
      hasValidationErrorForField(formData, fields[i])
    ) {
      return true;
    }
  }
  return false;
};
