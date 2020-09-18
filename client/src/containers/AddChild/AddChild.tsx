import React, { useState, useEffect, useContext } from 'react';
import { BackButton } from '../../components/BackButton';
import { StepList } from '@ctoec/component-library';
import { Child, Organization } from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useLocation, useHistory } from 'react-router-dom';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { listSteps } from './ListSteps';
import { distributeValidationErrorsToSubObjects } from '../../utils/getValidationStatus';

type LocationType = Location & {
  state: {
    organization: Organization;
  };
};

const AddChild: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const { state: locationState, hash } = useLocation() as LocationType;
  const activeStep = hash.slice(1);
  const history = useHistory();
  const steps = listSteps(history);
  const indexOfCurrentStep = steps.findIndex((s) => s.key === activeStep);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [child, updateChild] = useState<Child>();
  // TODO how do we choose correct org / site for creating new data
  const organization = locationState?.organization || child?.organization;
  const [creating, setCreating] = useState(false);
  const [refetchChild, setRefetchChild] = useState<number>(0);
  const triggerRefetchChild = () => setRefetchChild((r) => r + 1);

  // On initial load, create child
  useEffect(() => {
    if (child || creating) return;

    if (!organization) {
      throw Error('Cannot create child without organization');
    }
    const placeholderChild = {
      firstName: '',
      lastName: '',
      organization,
    };

    setCreating(true);
    apiPost('children', placeholderChild, {
      accessToken,
    })
      .then((res) => {
        updateChild(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setCreating(false));
  }, [
    accessToken,
    child,
    locationState,
    organization,
    history,
    updateChild,
    creating,
  ]);

  // Fetch fresh child from API whenever refetch is triggered
  const childId = child?.id;
  useEffect(() => {
    if (!childId) return;

    apiGet(`children/${childId}`, {
      accessToken,
    })
      .then((updatedChild) => {
        updateChild(updatedChild);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, childId, refetchChild]);

  const onSuccess = () => {
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
      triggerRefetchChild();
      history.replace({ hash: steps[indexOfCurrentStep + 1].key });
    }
  };

  const { alertElements, setAlerts } = useAlerts();
  const commonFormProps = {
    child: distributeValidationErrorsToSubObjects(child),
    onSuccess,
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
      <div className="margin-top-4">
        <BackButton />
        {alertElements}
        <h1 ref={h1Ref}>Add a child record</h1>
        <p className="usa-hint">
          Information is required unless otherwise specified.
        </p>
      </div>
      <StepList steps={steps} props={commonFormProps} activeStep={activeStep} />
    </div>
  );
};
export default AddChild;
