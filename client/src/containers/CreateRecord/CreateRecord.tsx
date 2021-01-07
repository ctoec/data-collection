import React, { useState, useEffect, useContext, useMemo } from 'react';
import { BackButton } from '../../components/BackButton';
import { ErrorBoundary, StepList } from '@ctoec/component-library';
import { Organization, Child } from '../../shared/models';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { RecordFormProps } from '../../components/Forms/types';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { listSteps } from './listSteps';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { nameFormatter } from '../../utils/formatters';

type LocationType = Location & {
  state: {
    organization: Organization;
  };
};

const CreateRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const { state: locationState, hash } = useLocation() as LocationType;
  const { childId } = useParams() as { childId: string };
  const activeStep = hash.slice(1);
  const history = useHistory();
  const steps = listSteps(history);
  let indexOfCurrentStep = steps.findIndex((s) => s.key === activeStep);
  if (indexOfCurrentStep < 0) indexOfCurrentStep = 0;
  // Keep track of steps that have been visited at least once
  const [stepsVisited, updateStepsVisited] = useState<
    { key: string; visited: boolean; active: boolean }[]
  >(
    steps.map(({ key }, i) => ({
      key,
      visited: i < indexOfCurrentStep,
      active: key === activeStep,
    }))
  );

  // On initial load, set url hash to first step hash
  useEffect(() => {
    if (!activeStep) {
      history.replace({ hash: steps[0].key });
    }
  }, [activeStep, history, steps]);

  const [child, setChild] = useState<Child>({
    organization: locationState?.organization,
  } as Child);

  const [refetchChild, setRefetchChild] = useState<number>(0);
  const triggerRefetchChild = () => setRefetchChild((r) => r + 1);

  // Fetch fresh child from API whenever refetch is triggered
  // And move to next step, if current step is complete (has no validation errors)
  useEffect(() => {
    const markStepVisited = () => {
      updateStepsVisited((oldSteps) => {
        const newSteps = [...oldSteps];
        newSteps[indexOfCurrentStep].visited = true;
        return newSteps;
      });
    };

    if (!childId) {
      markStepVisited();
      return;
    }

    const moveToNextStep = () => {
      if (indexOfCurrentStep === steps.length - 1) {
        history.push('/roster', {
          alerts: [
            {
              type: 'success',
              heading: 'Record added',
              text: `${nameFormatter(child)}'s record was added to your roster.`,
            },
          ],
        });
      } else {
        history.replace({ hash: steps[indexOfCurrentStep + 1].key });
      }
    };
    apiGet(`children/${childId}`, accessToken)
      .then((updatedChild) => {
        setChild(updatedChild);
        const currentStepStatus = steps[indexOfCurrentStep]?.status({
          child: updatedChild,
        } as RecordFormProps);
        if (
          currentStepStatus === 'complete' ||
          currentStepStatus === 'exempt'
        ) {
          moveToNextStep();
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(markStepVisited);
  }, [accessToken, childId, refetchChild]);

  // After child is updated, programmatically focus on the first input with an error
  useFocusFirstError([child]);

  const { alertElements, setAlerts } = useAlerts();

  const hideErrors = useMemo(
    () => (_hash: string) => {
      return !stepsVisited.find((s) => s.key === _hash.slice(1))?.visited;
    },
    [JSON.stringify(stepsVisited)]
  );

  const commonFormProps: RecordFormProps = {
    child,
    afterSaveSuccess: () => {
      triggerRefetchChild();
      setAlerts([]);
    },
    setAlerts,
    hideHeader: true,
    topHeadingLevel: 'h2',
    hideErrors,
  };

  return (
    <div className="grid-container">
      <BackButton />
      {alertElements}
      <h1 ref={h1Ref}>Add a child record</h1>
      <p className="usa-hint">
        Information is required unless otherwise specified.
      </p>
      <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
        <StepList
          steps={steps}
          props={commonFormProps}
          activeStep={activeStep}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateRecord;
