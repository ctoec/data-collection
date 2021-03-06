import React, { useState, useEffect, useContext } from 'react';
import { Child, ObjectWithValidationErrors } from '../../shared/models';
import {
  StepProps,
  StepList,
  Button,
  InlineIcon,
  LoadingWrapper,
} from '@ctoec/component-library';
import { stringify } from 'query-string';
import { RecordFormProps } from '../../components/Forms/types';
import { listSteps } from './listSteps';
import { nameFormatter } from '../../utils/formatters';
import { useAlerts } from '../../hooks/useAlerts';
import { hasValidationErrorForField } from '../../utils/hasValidationError';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Link, useHistory } from 'react-router-dom';
import { getCurrentEnrollment } from '../../utils/models';
import { mutateCallback } from 'swr/dist/types';
import RosterContext from '../../contexts/RosterContext/RosterContext';

type BatchEditItemContentProps = {
  childId: string;
  moveNextRecord: (_?: Child[]) => void;
  mutate?: (_: mutateCallback<Child[]>, __: boolean) => void;
  isSingleRecord?: boolean;
};

export const BatchEditItemContent: React.FC<BatchEditItemContentProps> = ({
  childId,
  moveNextRecord,
  mutate,
  isSingleRecord,
}) => {
  const [child, setChild] = useState<Child>();

  const [, setAlerts] = useAlerts();
  const history = useHistory();

  const [steps, setSteps] = useState<StepProps<RecordFormProps>[]>();
  const [activeStepKey, setActiveStep] = useState<string>();

  const { accessToken } = useContext(AuthenticationContext);
  const [triggerRefetchCount, setTriggerRefetchCount] = useState(0);

  const { updateChildRecords, query } = useContext(RosterContext);

  // Special function for single record batch edit because we use the child's
  // name information in an alert
  const singleRecordSuccess = () => {
    history.push({
      pathname: '/roster',
      search: stringify(query),
      state: {
        alerts: [
          {
            type: 'success',
            heading: 'Changed saved!',
            text: `${
              child?.firstName ? child?.firstName : 'Child'
            }'s record now has all required information.`,
          },
        ],
      },
    });
  };
  const afterRecordAction = isSingleRecord
    ? singleRecordSuccess
    : moveNextRecord;

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
  const moveNextStep = (records?: Child[]) => {
    if (!activeStepKey || !steps) return;

    const activeStepIdx = steps.findIndex((step) => step.key === activeStepKey);
    if (activeStepIdx === steps.length - 1) {
      afterRecordAction(records);
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
        let updatedChildren: Child[] = [];
        if (mutate) {
          mutate((children?: Child[]) => {
            if (children) {
              updatedChildren = [...children];
              const idx = updatedChildren.findIndex((c) => c.id === childId);
              if (idx > -1) updatedChildren.splice(idx, 1, updatedChild);
              return updatedChildren;
            }
            return children;
          }, false);
        }
        updateChildRecords({ updatedChild });

        if (triggerRefetchCount) moveNextStep(updatedChildren);
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
    topHeadingLevel: 'h4', // needed bc we still need the headers within the forms to be accurately nested
    showFieldOrFieldset: showFieldInBatchEditForm,
    AdditionalButton: (
      <Button
        text="Skip"
        onClick={() => afterRecordAction()}
        appearance="outline"
      />
    ),
  };

  const AllComplete = (
    <div className="margin-y-2">
      <div className="text-center font-body-xl">
        <InlineIcon icon="complete" />
      </div>
      <div className="text-center text-bold font-body-lg">
        {`${nameFormatter(child, {
          firstOnly: true,
          capitalize: true,
        })}'s record is now complete!`}
      </div>
    </div>
  );

  if (!child) {
    return <LoadingWrapper loading={true} />;
  }

  const currentEnrollment = getCurrentEnrollment(child);
  return (
    <>
      <div className="padding-left-2 padding-right-2 padding-bottom-3">
        <div className="display-flex flex-row flex-justify flex-align-end">
          <h2 className="margin-bottom-0">
            {nameFormatter(child, { lastNameFirst: true, capitalize: true })}
          </h2>
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
      <div className="padding-1 border-top-1px border-base-light">
        {steps && steps.length ? (
          <StepList<RecordFormProps>
            key={child.id}
            steps={steps}
            props={props}
            activeStep={activeStepKey || ''}
            headerLevel="h3"
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
  return (
    fields.some(
      (f) => f !== 'fundings' && hasValidationErrorForField(formData, f)
    ) || false
  );
};
