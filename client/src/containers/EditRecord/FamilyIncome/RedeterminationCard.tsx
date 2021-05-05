import React from 'react';
import { FamilyIncomeForm, RecordFormProps } from '../../../components/Forms';
import { Child } from '../../../shared/models';
import { Card, Button } from '@ctoec/component-library';
import {
  getNextHeadingLevel,
  Heading,
  HeadingLevel,
} from '../../../components/Heading';

type RedeterminationCardProps = {
  child: Child;
  afterSaveSuccess: () => void;
  onCancel: () => void;
  setAlerts: RecordFormProps['setAlerts'];
  topHeadingLevel: HeadingLevel;
  noRecordedDets: boolean;
};

/**
 * Component for re-determining family income in the EditRecord flow.
 * Renders a card component that contains a general-purpose FamilyIncome form
 */
export const RedeterminationCard: React.FC<RedeterminationCardProps> = ({
  child,
  afterSaveSuccess,
  onCancel,
  setAlerts,
  topHeadingLevel,
  noRecordedDets = false,
}) => {
  const title = noRecordedDets
    ? 'Determine family income'
    : 'Redetermine family income';
  return (
    <>
      <Heading level={topHeadingLevel}>{title}</Heading>
      <Card>
        <FamilyIncomeForm
          id={'redetermine-family-income'}
          legend={title}
          child={child}
          afterSaveSuccess={afterSaveSuccess}
          setAlerts={setAlerts}
          redetermine={true}
          CancelButton={
            <Button text="Cancel" appearance="outline" onClick={onCancel} />
          }
          topHeadingLevel={getNextHeadingLevel(topHeadingLevel)}
        />
      </Card>
    </>
  );
};
