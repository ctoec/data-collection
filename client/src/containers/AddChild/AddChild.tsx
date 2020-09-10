import React, { useState, useEffect, useContext } from 'react';
import { BackButton } from '../../components/BackButton';
import { StepList, Button, StepProps } from '@ctoec/component-library';
import { Child, Organization } from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { EditFormProps } from '../../components/EditForms/types';
import { ChildInfoForm, FamilyInfoForm } from '../../components/EditForms';
import { NewEnrollment } from './NewEnrollment';
import { NewFamilyIncome } from './NewFamilyIncome';
import { ChildIdentifiersForm } from '../../components/EditForms/ChildIdentifiers/Form';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

type LocationType = Location & {
  state: {
    organization: Organization;
  };
};

const AddChild: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const { childId } = useParams();
  const location = useLocation() as LocationType;
  const organization = location.state ? location.state.organization : undefined;

  const activeStep = location.hash.slice(1);
  const history = useHistory();
  useEffect(() => {
    if (!activeStep) {
      history.replace({ ...location, hash: steps[0].key });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // https://skylight.invisionapp.com/console/Full-Data-Collection-Tool-ckeaf1bpi00wn01yhh6f147bf/ckeaf1cjw00wp01yh09w41ivy/play#project_console
  const steps: StepProps<EditFormProps>[] = [
    {
      key: 'child-ident',
      name: 'Child identifiers',
      status: () => 'incomplete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit<span className="usa-sr-only"> child identifiers</span>
            </>
          }
          onClick={() => history.replace({ ...location, hash: 'child-ident' })}
        />
      ),
      Form: ChildIdentifiersForm,
    },
    {
      key: 'child-info',
      name: 'Child info',
      status: () => 'incomplete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit<span className="usa-sr-only"> child info</span>
            </>
          }
          onClick={() => history.replace({ ...location, hash: 'child-info' })}
        />
      ),
      Form: ChildInfoForm,
    },
    {
      key: 'family-address',
      name: 'Family address',
      status: () => 'incomplete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit<span className="usa-sr-only"> family address</span>
            </>
          }
          onClick={() =>
            history.replace({ ...location, hash: 'family-address' })
          }
        />
      ),
      Form: FamilyInfoForm,
    },
    {
      key: 'family-income',
      name: 'Family income determination',
      status: () => 'incomplete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit
              <span className="usa-sr-only"> family income determination</span>
            </>
          }
          onClick={() =>
            history.replace({ ...location, hash: 'family-income' })
          }
        />
      ),
      Form: NewFamilyIncome,
    },
    {
      key: 'enrollment',
      name: 'Enrollment and funding',
      status: () => 'incomplete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit<span className="usa-sr-only"> enrollment and funding</span>
            </>
          }
          onClick={() => history.replace({ ...location, hash: 'enrollment' })}
        />
      ),
      Form: NewEnrollment,
    },
  ];

  const [child, updateChild] = useState<Child>();
  const [refetchChild, setRefetchChild] = useState<number>(0);

  useEffect(() => {
    // On initial load, create child
    if (child || childId || !accessToken) return;

    if (!organization) {
      throw Error('Cannot create child without organization');
    }
    apiPost(
      'children',
      { firstName: '', lastName: '', organization },
      {
        accessToken,
      }
    )
      .then((res) => {
        updateChild(res);
        history.replace({ ...location, pathname: `/create-record/${res.id}` });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    accessToken,
    child,
    childId,
    location,
    organization,
    history,
    updateChild,
  ]);

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
    const indexOfCurrentStep = steps.findIndex((s) => s.key === activeStep);
    if (indexOfCurrentStep === steps.length - 1) {
      // If we're all done
      console.log('TODO: what do we do after adding a child?');
      history.push('/check-data/1', {
        alerts: [
          {
            type: 'success',
            heading: 'Record added',
            text: `${child?.firstName} ${child?.lastName}'s record was added to your roster.`,
          },
        ],
      });
    } else {
      setRefetchChild((r) => r + 1);
      history.replace({ ...location, hash: steps[indexOfCurrentStep + 1].key });
    }
  };

  const { alertElements, setAlerts } = useAlerts();

  const commonFormProps = { child, onSuccess, setAlerts };

  if (!child) {
    return <>Loading...</>;
  }

  return (
    <div className="grid-container">
      <div className="margin-top-4">
        <BackButton />
        {alertElements}
        <h1 ref={h1Ref}>Add a child record</h1>
        {/* TODO: ask Ryan if this is ok placement-- it was not consistent in other forms, and not present in edit flow */}
        <p className="usa-hint">
          Information is required unless otherwise specified.
          </p>
      </div>
      <StepList steps={steps} props={commonFormProps} activeStep={activeStep} />
    </div>
  );
};
export default AddChild;
