import React, { useContext, useState, useEffect } from 'react';
import {
  Funding,
  FundingSpace,
  Enrollment,
  ReportingPeriod,
} from '../../../../../shared/models';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../../../utils/api';
import {
  Card,
  Tag,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  CardExpansion,
  Alert,
  Form,
  FormSubmitButton,
} from '@ctoec/component-library';
import { ReportingPeriodField, ContractSpaceField } from '../Fields';

type EditFundingFormProps = {
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];
  funding: Funding;
  enrollment: Enrollment;
  isCurrent?: boolean;
  refetchChild: () => void;
};

export const EditFundingForm: React.FC<EditFundingFormProps> = ({
  fundingSpaces,
  reportingPeriods,
  funding,
  enrollment,
  isCurrent,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make forms re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  const onSubmit = (updatedFunding: Funding) => {
    setLoading(true);
    apiPut(
      `enrollments/${enrollment.id}/fundings/${funding.id}`,
      updatedFunding,
      { accessToken }
    )
      .then(() => {
        setError(undefined);
        setCloseCard(true);
        refetchChild();
      })
      .catch(() => setError('Unable to edit funding'))
      .finally(() => setLoading(false));
  };

  return (
    <Card
      key={funding.id}
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
      borderless={true}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p>Funding</p>
          <Tag text={funding.fundingSpace.source} />
        </div>
        <div className="flex-1">
          <p>Space type</p>
          <p className="text-bold">{funding.fundingSpace.time}</p>
        </div>
        <div className="flex-2">
          <p>Reporting periods</p>
          <p className="text-bold">
            {funding.firstReportingPeriod?.period.format('MMMM YYYY')} -{' '}
            {funding.lastReportingPeriod
              ? funding.lastReportingPeriod.period.format('MMMM YYYY')
              : 'present'}
          </p>
        </div>
        <ExpandCard>
          <Button
            text={<TextWithIcon text="Edit" Icon={Pencil} />}
            appearance="unstyled"
          />
        </ExpandCard>
      </div>
      <CardExpansion>
        {error && <Alert type="error" text={error} />}
        <Form<Funding>
          id={`edit-funding-${funding.id}`}
          className="usa-form"
          data={funding}
          onSubmit={onSubmit}
        >
          {/* <FundingField
            fundingSpaces={fundingSpaces}
            reportingPeriods={reportingPeriods}
            ageGroup={enrollment.ageGroup}
            site={enrollment.site}
          /> */}
          <ContractSpaceField
            fundingSpaceOptions={fundingSpaces.filter(
              (fs) =>
                fs.ageGroup === enrollment.ageGroup &&
                fs.source === funding.fundingSpace.source &&
                fs.organization.id === enrollment.site.organization.id
            )}
          />
          <ReportingPeriodField
            reportingPeriods={reportingPeriods.filter(
              (rp) => rp.type === funding.fundingSpace.source
            )}
          />
          {!!funding.lastReportingPeriod && (
            <ReportingPeriodField
              reportingPeriods={reportingPeriods.filter(
                (rp) => rp.type === funding.fundingSpace.source
              )}
              isLast={true}
            />
          )}
          <ExpandCard>
            <Button text="Cancel" appearance="outline" />
          </ExpandCard>
          <FormSubmitButton
            text={loading ? 'Saving...' : 'Save'}
            disabled={loading}
          />
        </Form>
      </CardExpansion>
    </Card>
  );
};
