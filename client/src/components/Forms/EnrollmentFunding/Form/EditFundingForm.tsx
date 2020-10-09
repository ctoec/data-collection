import React, { useContext, useState, useEffect } from 'react';
import { Funding, Enrollment } from '../../../../shared/models';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut, apiDelete } from '../../../../utils/api';
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
  TrashCan,
} from '@ctoec/component-library';
import { ReportingPeriodField, ContractSpaceField } from '../Fields';

type EditFundingFormProps = {
  funding: Funding;
  enrollment: Enrollment;
  isCurrent?: boolean;
  afterDataSave: () => void;
};

/**
 * Component for displaying and editing an existing Funding.
 * Does not enable fundingSource to be updated, as this invalidates
 * reporting period and fundingSpace information, and should
 * instead be handled by deleting and creating new funding.
 */
export const EditFundingForm: React.FC<EditFundingFormProps> = ({
  funding,
  enrollment,
  isCurrent,
  afterDataSave,
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
        afterDataSave();
      })
      .catch(() => setError('Unable to edit funding'))
      .finally(() => setLoading(false));
  };

  function deleteFunding() {
    apiDelete(`/enrollments/${enrollment.id}/fundings/${funding.id}`, {
      accessToken,
    })
      .then(() => {
        afterDataSave();
      })
      .catch((err) => {
        console.error('Unable to delete enrollment', err);
      });
  }

  return (
    <Card
      key={funding.id}
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
      borderless={true}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p className="margin-bottom-0">Funding</p>
          <Tag className="margin-top-0" text={funding.fundingSpace.source} />
        </div>
        <div className="flex-1">
          <p className="margin-bottom-0">Space type</p>
          <p className="text-bold margin-top-0">{funding.fundingSpace.time}</p>
        </div>
        <div className="flex-2">
          <p className="margin-bottom-0">Reporting periods</p>
          <p className="text-bold margin-top-0">
            {funding.firstReportingPeriod?.period.format('MMMM YYYY')} -{' '}
            {funding.lastReportingPeriod
              ? funding.lastReportingPeriod.period.format('MMMM YYYY')
              : 'present'}
          </p>
        </div>
        <div className="display-flex align-center flex-space-between">
          <div className="display-flex align-center margin-right-2">
            <ExpandCard>
              <Button
                text={<TextWithIcon text="Edit" Icon={Pencil} />}
                appearance="unstyled"
              />
            </ExpandCard>
          </div>
          <div className="display-flex align-center margin-right-2">
            <Button
              text={<TextWithIcon text="Delete" Icon={TrashCan} />}
              appearance="unstyled"
              onClick={deleteFunding}
            />
          </div>
        </div>
      </div>
      <CardExpansion>
        {error && <Alert type="error" text={error} />}
        <Form<Funding>
          id={`edit-funding-${funding.id}`}
          className="usa-form"
          data={funding}
          onSubmit={onSubmit}
        >
          <ContractSpaceField<Funding>
            ageGroup={enrollment.ageGroup}
            fundingSource={funding.fundingSpace.source}
            organizationId={enrollment.site.organization.id}
            accessor={(data) => data.at('fundingSpace')}
          />
          <ReportingPeriodField<Funding>
            fundingSource={funding.fundingSpace.source}
            accessor={(data) => data.at('firstReportingPeriod')}
          />
          {!!funding.lastReportingPeriod && (
            <ReportingPeriodField<Funding>
              fundingSource={funding.fundingSpace.source}
              accessor={(data) => data.at('lastReportingPeriod')}
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
