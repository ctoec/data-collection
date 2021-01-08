import React, { useContext, useState } from 'react';
import {
  Form,
  ExpandCard,
  Button,
  FormSubmitButton,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { Enrollment, Child, FundingSource } from '../../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  CareModelField,
  AgeGroupField,
  NewFundingField,
} from '../../../../components/Forms/Enrollment/Fields';
import { ReportingPeriodField } from '../../../../components/Forms/Enrollment/Funding/Fields';
import UserContext from '../../../../contexts/UserContext/UserContext';
import { apiPost } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Heading, HeadingLevel } from '../../../../components/Heading';
import { nameFormatter } from '../../../../utils/formatters';

type ChangeEnrollmentFormProps = {
  afterSaveSuccess: () => void;
  afterSaveFailure: (err: any) => void;
  child: Child;
  currentEnrollment?: Enrollment;
  topHeadingLevel: HeadingLevel;
};

export const ChangeEnrollmentForm: React.FC<ChangeEnrollmentFormProps> = ({
  afterSaveSuccess,
  afterSaveFailure,
  child,
  currentEnrollment,
  topHeadingLevel,
}) => {
  const { user } = useContext(UserContext);
  const sites = (user?.sites || []).filter(
    (site) => site.organizationId === child.organization?.id
  );

  const { accessToken } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(false);
  const onSubmit = (updatedData: ChangeEnrollment) => {
    setLoading(true);

    //  Because the radio group for the Site field broadcasts ID as a string,
    //  but the API is expecting a number (as it should)
    if (
      !!updatedData.newEnrollment &&
      !!updatedData.newEnrollment.site &&
      !!updatedData.newEnrollment.site.id &&
      typeof updatedData.newEnrollment.site.id === 'string'
    ) {
      updatedData.newEnrollment.site.id = parseInt(
        updatedData.newEnrollment.site.id
      );
    }

    apiPost(`children/${child.id}/change-enrollment`, updatedData, {
      accessToken,
      jsonParse: false,
    })
      .then(afterSaveSuccess)
      .catch(afterSaveFailure)
      .finally(() => setLoading(false));
  };

  const activeFunding = currentEnrollment?.fundings?.find(
    (f) => !f.lastReportingPeriod
  );

  if (activeFunding && !activeFunding?.fundingSpace) {
    return (
      <div>
        <p>
          Add missing enrollment and/or funding information before you can
          change {nameFormatter(child, { firstOnly: true })}'s enrollment
        </p>
        <ExpandCard>
          <Button text="Cancel" appearance="outline" />
        </ExpandCard>
      </div>
    );
  }

  return (
    <Form<ChangeEnrollment>
      id="change-enrollment-form"
      className="usa-form"
      data={{ newEnrollment: {} as Enrollment }}
      onSubmit={onSubmit}
    >
      <Heading level={topHeadingLevel} className="margin-top-2 margin-bottom-2">
        New enrollment
      </Heading>
      <SiteField<ChangeEnrollment>
        sites={sites}
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <EnrollmentStartDateField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <CareModelField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <AgeGroupField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <NewFundingField<ChangeEnrollment>
        fundingAccessor={(data) =>
          data.at('newEnrollment').at('fundings').at(0)
        }
        getEnrollment={(data) => data.at('newEnrollment').value}
        organizationId={child.organization.id}
      />

      {!!currentEnrollment && activeFunding && (
        <>
          <Heading level={topHeadingLevel}>Previous enrollment</Heading>
          <ReportingPeriodField<ChangeEnrollment>
            accessor={(data) =>
              data.at('oldEnrollment').at('funding').at('lastReportingPeriod')
            }
            fundingSource={activeFunding.fundingSpace?.source as FundingSource} // This is known to have a value (check on line 58)
            isLast={true}
            optional={true}
            label={`Last reporting period for current ${activeFunding.fundingSpace?.source} - ${activeFunding.fundingSpace?.time} funding`}
          />
        </>
      )}

      <ExpandCard>
        <Button text="Cancel" appearance="outline" />
      </ExpandCard>
      <FormSubmitButton
        text={loading ? 'Chaging enrollment...' : 'Change enrollment'}
        disabled={loading}
      />
    </Form>
  );
};
