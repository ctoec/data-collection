import React, { useState, useEffect, useContext } from 'react';
import { Child } from '../../shared/models';
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

  const [steps, setSteps] = useState<StepProps<RecordFormProps>[]>([]);
  const [activeStepKey, setActiveStep] = useState('');
  useEffect(() => {
    if (record) {
      const _steps = listSteps(record, setActiveStep);
      setSteps(_steps);
      setActiveStep(_steps[0].key);
    }
  }, [!!record]);

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
    if (!activeStepKey) return;

    apiGet(`/children/${record.id}`, { accessToken })
      .then((updatedChild) => {
        children.addOrUpdateRecord(updatedChild);
        const currentStepStatus = steps
          .find((step) => step.key === activeStepKey)
          ?.status(updatedChild);
        if (currentStepStatus === 'complete') {
          moveNextStep();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // only trigger refetch on explicit refetch
    // not when record prop changes (user clicks on tab nav)
    //es-lint-disable-next-line
  }, [accessToken, refetchChild]);

  const showFieldInBatchEditForm = (
    fields: string | string[],
    allFormFields: string[],
    record: Child
  ) => {
    if (Array.isArray(fields)) {
      for (let i = 0; i++; i < fields.length) {
        if (
          allFormFields.includes(fields[i]) &&
          hasValidationErrorForField(record, fields[i])
        )
          return true;
      }
      return false;
    }

    return (
      allFormFields.includes(fields) &&
      hasValidationErrorForField(record, fields)
    );
  };

  const props: RecordFormProps = {
    record,
    afterDataSave: triggerRefetchChild,
    setAlerts,
    hideHeader: true,
    hideErrorsOnFirstLoad: () => false,
    batchEditProps: {
      showField: showFieldInBatchEditForm,
      SkipButton: (
        <Button text="Skip" onClick={moveNextStep} appearance="outline" />
      ),
    },
  };

  if (!steps.length || !activeStepKey || !record) {
    return <> </>;
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
          <StepList<RecordFormProps>
            key={record.id}
            steps={steps}
            props={props}
            activeStep={activeStepKey}
          />
        ) : (
          <div className="margin-y-2 display-flex flex-center">
            All complete!
          </div>
        )}
      </div>
    </>
  );
};
