import React, { useContext, useState, useEffect } from 'react';
import { Child } from '../../../shared/models';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import {
  Card,
  Tag,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  CardExpansion,
  Alert,
  TrashCan,
  CardProps,
  InlineIcon,
} from '@ctoec/component-library';
import { FundingForm } from '../../../components/Forms/Enrollment/Funding/Form';

type EditFundingCardProps = CardProps & {
  child: Child;
  fundingId: number;
  enrollmentId: number;
  isCurrent?: boolean;
  afterSaveSuccess: () => void;
};

/**
 * Component for displaying and editing an existing Funding.
 * Does not enable fundingSource to be updated, as this invalidates
 * reporting period and fundingSpace information, and should
 * instead be handled by deleting and creating new funding.
 */
export const EditFundingCard: React.FC<EditFundingCardProps> = ({
  child,
  fundingId,
  enrollmentId,
  isCurrent,
  expanded,
  afterSaveSuccess: _afterSaveSuccess,
}) => {
  const enrollment = child.enrollments?.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    throw new Error('Edit funding rendered without enrollment');
  }

  const funding = enrollment.fundings?.find((f) => f.id === fundingId);
  if (!funding) {
    throw new Error('Edit funding rendered without funding');
  }

  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [expandedCard, setExpandedCard] = useState(expanded);
  const [error, setError] = useState<string>();

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make forms re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  const afterSaveSuccess = () => {
    setError(undefined);
    setExpandedCard(false);
    _afterSaveSuccess();
  };

  function deleteFunding() {
    apiDelete(`/enrollments/${enrollmentId}/fundings/${fundingId}`, {
      accessToken,
    })
      .then(() => {
        afterSaveSuccess();
      })
      .catch((err) => {
        console.error('Unable to delete enrollment', err);
      });
  }

  return (
    <Card
      key={fundingId}
      appearance={isCurrent ? 'primary' : 'secondary'}
      borderless={true}
      expanded={expanded}
      forceClose={closeCard}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p className="margin-bottom-0">Funding</p>
          {funding.fundingSpace ? (
            <Tag className="margin-top-0" text={funding.fundingSpace.source} />
          ) : (
            <InlineIcon icon="incomplete" />
          )}
        </div>
        <div className="flex-1">
          <p className="margin-bottom-0">Space type</p>
          <p className="text-bold margin-top-0">
            {funding.fundingSpace?.time || <InlineIcon icon="incomplete" />}
          </p>
        </div>
        <div className="flex-2">
          <p className="margin-bottom-0">Reporting periods</p>
          <p className="text-bold margin-top-0">
            {funding.firstReportingPeriod ? (
              funding.firstReportingPeriod.period.format('MMMM YYYY')
            ) : (
              <InlineIcon icon="incomplete" />
            )}{' '}
            -{' '}
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
        <FundingForm
          id={`edit-funding-form-${funding.id}`}
          child={child}
          fundingId={funding.id}
          enrollmentId={enrollment.id}
          afterSaveSuccess={afterSaveSuccess}
          setAlerts={() => setError('Unable to save funding')}
        />
      </CardExpansion>
    </Card>
  );
};
