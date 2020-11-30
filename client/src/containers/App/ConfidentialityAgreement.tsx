import { Alert, Button, Checkbox } from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';

export const ConfidentialityAgreement: React.FC = ({ children }) => {
  const {
    confidentialityAgreedDate,
    setConfidentialityAgreedDate,
  } = useContext(UserContext);
  const [_confidentialityAgreed, _setConfidentialityAgreed] = useState(false);

  return !!confidentialityAgreedDate ? (
    <>{children}</>
  ) : (
    <div className="grid-container">
      <Alert
        text="You must read and agree to the privacy policy before using ECE Reporter."
        type="info"
      />
      <div className="grid-row">
        <div className="tablet:grid-col-8">
          <h1>Confidentiality agreement</h1>
          <p>
            Connecticut’s Early Childhood Information System (ECIS) contains
            Personally Identifiable Information (PII) that is confidential
            pursuant to federal and state law. By logging onto and accessing
            ECIS, I hereby acknowledge that the information contained therein
            shall only be disclosed to authorized personnel and used as
            permitted by federal and state law. I further agree that I will only
            use this information for the Connecticut Office of Early Childhood
            conduct of business.
          </p>
          <p>
            I hereby assure that all records, reports and written information
            comply with the following: Provisions of the Family Educational
            Rights and Privacy Act, 20 U.S.C. Section 1232g (FERPA) and the
            regulations promulgated thereunder regarding the disclosure of
            confidential student information
          </p>
          <ol>
            <li>
              Provisions of the Family Educational Rights and Privacy Act, 20
              U.S.C. Section 1232g (FERPA) and the regulations promulgated
              thereunder regarding the disclosure of confidential student
              information;
            </li>
            <li>
              IDEA Part B regulations as identified in 34 CFR §§ 300.610 through
              300.626 and IDEA Part C regulations as identified in 34 CFR §§
              303.400 through 303.417 regarding confidentiality requirements to
              young children with disabilities, and
            </li>
            <li>
              Provisions of the Health Insurance Portability and Accountability
              Act (HIPAA) and the regulations promulgated thereunder.
              Information obtained pursuant to the provisions of HIPAA shall not
              be used or disclosed by the parties for any purpose without
              written consent, or unless otherwise permitted under HIPAA.
            </li>
          </ol>
          <div className="margin-top-4 margin-bottom-4">
            <Checkbox
              id="confidentiality-checkbox"
              text="I have read and agreed to the confidentiality agreement"
              checked={!!confidentialityAgreedDate}
              onChange={(_) => _setConfidentialityAgreed((agreed) => !agreed)}
            />
          </div>
          <div>
            <Button text="Logout" href="/logout" appearance="outline" />
            <Button
              text="Continue to ECE Reporter"
              disabled={!_confidentialityAgreed}
              onClick={() => setConfidentialityAgreedDate(new Date())}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
