import React, { useState, useEffect, useContext } from 'react';
import { Child, ObjectWithValidationErrors } from '../../shared/models';
import {
  StepProps,
  StepList,
  Button,
  InlineIcon,
} from '@ctoec/component-library';
import { RecordFormProps } from '../../components/Forms/types';
import { listSteps } from './listSteps';
import { nameFormatter } from '../../utils/formatters';
import { useAlerts } from '../../hooks/useAlerts';
import { hasValidationErrorForField } from '../../utils/hasValidationError';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Link } from 'react-router-dom';
import { getCurrentEnrollment } from '../../utils/models';
import { useAuthenticatedSWR } from '../../hooks/useAuthenticatedSWR';
import { stringify } from 'query-string';

type BatchEditItemContentProps = {
  childId: string;
  organizationId?: string;
  moveNextRecord: () => void;
};

export const BatchEditItemContent: React.FC<BatchEditItemContentProps> = ({
  childId,
  organizationId,
  moveNextRecord,
}) => {
  const [child, setChild] = useState<Child>();
  const { mutate } = useAuthenticatedSWR<Child[]>(
    organizationId
      ? `children?${stringify({ organizationId, 'missing-info': true })}`
      : null // no organizationId means this is single-record batch edit, so no need to update cache
  );

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

  // Generate steps for the current child
  // after state is set (child has been fetched)
  useEffect(() => {
    if (child) {
      const _steps = listSteps(child);
      setSteps(_steps);
      if (_steps.length) {
        setActiveStep(_steps[0].key);
      }
    }
  }, [child?.id]);

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
  // and if fetch is re-fetch (triggerRefetchCount > 0)
  // then progress to next step
  useEffect(() => {
    apiGet(`children/${childId}`, accessToken)
      .then((updatedChild) => {
        setChild(updatedChild);
        // Presence of orgId indicates multi-record batch edit
        // so cache must be updated
        if (organizationId) {
          mutate((children: Child[]) => {
            if (children) {
              const idx = children.findIndex((c) => c.id === childId);
              if (idx > -1) children.splice(idx, 1, updatedChild);
              return children;
            }
            return children;
          }, false);
        }

        if (triggerRefetchCount) moveNextStep();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [accessToken, triggerRefetchCount, !!child]);

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
    <div className="margin-y-2">
      <div style={{ textAlign: 'center' }} className="font-body-xl">
        <InlineIcon icon="complete" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2>{`${child?.firstName}'s record is now complete!`}</h2>
      </div>
    </div>
  );

  if (!child) {
    return <></>;
  }

  const currentEnrollment = getCurrentEnrollment(child);
  return (
    <>
      <div className="padding-left-2 padding-right-2 padding-bottom-3">
        <div className="display-flex flex-row flex-justify flex-align-end">
          <h2 className="margin-bottom-0">{nameFormatter(child)}</h2>
          <div className="text-baseline text-base">
            Date of birth: {child.birthdate?.format('MM/DD/YYYY') || 'Missing'}
          </div>
        </div>
        <div className="margin-top-1 display-flex flex-row flex-justify">
          <Link to={`/edit-record/${child.id}`}>View full profile</Link>
          <div className="text-base">
            {currentEnrollment?.ageGroup || 'Missing age group'} —{' '}
            {currentEnrollment?.site?.siteName || 'Missing site'}
          </div>
        </div>
      </div>
      <div
        style={{ padding: '1em' }}
        className="padding-top-1 border-top-1px border-base-light"
      >
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
