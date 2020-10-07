import React, { useState, useEffect, useContext } from 'react';
import { BackButton } from '../../components/BackButton';
import { StepList } from '@ctoec/component-library';
import { Child, Organization } from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { RecordFormProps } from '../../components/Forms/types';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { listSteps } from './listSteps';

type LocationType = Location & {
  state: {
    organization: Organization;
  };
};

const AddRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const { state: locationState, hash } = useLocation() as LocationType;
  const { childId } = useParams() as { childId: string };
  const activeStep = hash.slice(1);
  const history = useHistory();

  // Keep track of steps that have been visited at least once
  const steps = listSteps(history);
  const indexOfCurrentStep = steps.findIndex((s) => s.key === activeStep) || 0;
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

  const [child, updateChild] = useState<Child>();
  const organization = locationState?.organization || child?.organization;
  const [refetchChild, setRefetchChild] = useState<number>(0);
  const triggerRefetchChild = () => setRefetchChild((r) => r + 1);

  // On initial load, create child
  useEffect(() => {
    if (child || childId || !organization) return;

    const placeholderChild = {
      firstName: '',
      lastName: '',
      organization,
    };

    apiPost('children', placeholderChild, {
      accessToken,
    })
      .then((res) => {
        updateChild(res);
        history.replace({ pathname: `/create-record/${res.id}` });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    accessToken,
    child,
    locationState,
    organization,
    history,
    updateChild,
    childId,
  ]);

  // Fetch fresh child from API whenever refetch is triggered
  useEffect(() => {
    if (!childId) return;

    const moveToNextStep = () => {
      if (indexOfCurrentStep === steps.length - 1) {
        history.push('/roster', {
          alerts: [
            {
              type: 'success',
              heading: 'Record added',
              text: `${child?.firstName} ${child?.lastName}'s record was added to your roster.`,
            },
          ],
        });
      } else {
        updateStepsVisited((oldSteps) => {
          const newSteps = [...oldSteps];
          newSteps[indexOfCurrentStep].visited = true;
          return newSteps;
        });
        history.replace({ hash: steps[indexOfCurrentStep + 1].key });
      }
    };

    apiGet(`children/${childId}`, {
      accessToken,
    })
      .then((updatedChild) => {
        updateChild(updatedChild);
        const currentStepStatus = steps[indexOfCurrentStep].status({
          record: updatedChild,
        } as RecordFormProps);
        // only allow the user to progress to next step if they have
        // added all necessary information to current step
        if (currentStepStatus === 'complete') {
          moveToNextStep();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, childId, refetchChild]);

  // After child is updated, programmatically focus on the first input with an error
  useFocusFirstError([child]);

  const { alertElements, setAlerts } = useAlerts();

  const commonFormProps = {
    record: child,
    afterDataSave: triggerRefetchChild,
    setAlerts,
    hideHeader: true,
    hideErrorsOnFirstLoad: (_hash: string) => {
      const hashMinusOctothorpe = _hash.replace('#', '');
      return !stepsVisited.find((s) => s.key === hashMinusOctothorpe)?.visited;
    },
  };

  if (!child) {
    return <>Loading...</>;
  }

  return (
    <div className="grid-container">
      {alertElements}
      <BackButton />
      <h1 ref={h1Ref}>Add a child record</h1>
      <p className="usa-hint">
        Information is required unless otherwise specified.
      </p>
      <StepList steps={steps} props={commonFormProps} activeStep={activeStep} />
    </div>
  );
};
export default AddRecord;
