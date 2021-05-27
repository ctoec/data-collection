import { ProgressIndicator } from '@ctoec/component-library';
import React, { SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../../hooks/useAlerts';
import { EnrollmentReportCheckResponse } from '../../shared/payloads';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { PreviewChanges } from './PreviewChanges';
import { ReviewMissingInfo } from './ReviewMissingInfo';
import Upload from './Upload';

export type StepContentProps = {
  setCurrentStepIndex: React.Dispatch<SetStateAction<number>>;
  setEnrollmentReportCheck: React.Dispatch<
    SetStateAction<EnrollmentReportCheckResponse | undefined>
  >;
  enrollmentReportCheck?: EnrollmentReportCheckResponse;
};

const UPLOAD_WIZARD_STEPS = [
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
  const [alertElements] = useAlerts();

  const StepContent = UPLOAD_WIZARD_STEPS[currentStepIndex].content;
  return (
    <div className="grid-container">
      {alertElements}
      <div>
        <h1 ref={h1Ref} className="margin-bottom-4">
          Upload your enrollment data
        </h1>

        <ProgressIndicator
          currentIndex={currentStepIndex}
          steps={UPLOAD_WIZARD_STEPS}
        />
        {currentStepIndex === 0 && (
          <p>
            You can use the <Link to="/template">data collection template</Link>
            to enter all of the required state-funded enrollment data. When
            you’re finished, you can upload the complete template below. After
            your data is in the system, you can also{' '}
            <Link to="/roster">
              use the Roster to make changes to your data
            </Link>
            .
          </p>
        )}
        <h2 className="margin-bottom-2">
          <span className="usa-step-indicator__current-step">
            {currentStepIndex + 1}
          </span>
          <span className="usa-step-indicator__total-steps">
            of {UPLOAD_WIZARD_STEPS.length}
          </span>
          {UPLOAD_WIZARD_STEPS[currentStepIndex].description}
        </h2>

        <StepContent
          setCurrentStepIndex={setCurrentStepIndex}
          setEnrollmentReportCheck={setEnrollmentReportCheck}
          enrollmentReportCheck={enrollmentReportCheck}
        />
      </div>
    </div>
  );
};

export default UploadWizard;
