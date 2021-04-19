import { AlertProps, ProgressIndicator } from '@ctoec/component-library';
import React, { SetStateAction, useState } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { EnrollmentReportCheckResponse } from '../../shared/payloads';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { PreviewChanges } from './PreviewChanges';
import { ReviewMissingInfo } from './ReviewMissingInfo';
import Upload from './Upload';

export type StepContentProps = {
  setAlerts: React.Dispatch<SetStateAction<(AlertProps | undefined)[]>>;
  setCurrentStepIndex: React.Dispatch<SetStateAction<number>>;
  setEnrollmentReportCheck: React.Dispatch<
    SetStateAction<EnrollmentReportCheckResponse | undefined>
  >;
  enrollmentReportCheck?: EnrollmentReportCheckResponse;
  setFile: React.Dispatch<SetStateAction<File | undefined>>;
  file?: File;
};

const STEPS = [
  {
    label: 'Choose file',
    description: 'Choose your enrollment file',
    content: Upload,
  },
  {
    label: 'Review missing info',
    description: 'Review missing info',
    content: ReviewMissingInfo,
  },
  {
    label: 'Preview and upload',
    description: 'Preview changes and upload file',
    content: PreviewChanges,
  },
];

const UploadWizard: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [
    enrollmentReportCheck,
    setEnrollmentReportCheck,
  ] = useState<EnrollmentReportCheckResponse>();
  const [file, setFile] = useState<File>();
  const { alertElements, setAlerts } = useAlerts();

  const StepContent = STEPS[currentStepIndex].content;
  return (
    <div className="grid-container">
      {alertElements}
      <div>
        <h1 ref={h1Ref} className="margin-bottom-4">
          Upload your enrollment data
        </h1>

        <ProgressIndicator currentIndex={currentStepIndex} steps={STEPS} />
        <h2 className="margin-bottom-2">
          <span className="usa-step-indicator__current-step">
            {currentStepIndex + 1}
          </span>
          <span className="usa-step-indicator__total-steps">
            of {STEPS.length}
          </span>
          {STEPS[currentStepIndex].description}
        </h2>

        <StepContent
          setCurrentStepIndex={setCurrentStepIndex}
          setAlerts={setAlerts}
          setEnrollmentReportCheck={setEnrollmentReportCheck}
          enrollmentReportCheck={enrollmentReportCheck}
          setFile={setFile}
          file={file}
        />
      </div>
    </div>
  );
};

export default UploadWizard;
