import React from 'react';
import { FamilyIncomeForm, RecordFormProps } from '../../../components/Forms';
import { Child } from '../../../shared/models';
import { Card, Button } from '@ctoec/component-library';

type RedeterminationCardProps = {
  child: Child;
  afterSaveSuccess: () => void;
  onCancel: () => void;
  setAlerts: RecordFormProps['setAlerts'];
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
}) => {
  return (
    <>
      <h3>Redetermine family income</h3>
      <Card>
        <FamilyIncomeForm
          id={'redetermine-family-income'}
          legend={'Redetermine family income'}
          child={child}
          afterSaveSuccess={afterSaveSuccess}
          setAlerts={setAlerts}
          CancelButton={
            <Button text="Cancel" appearance="outline" onClick={onCancel} />
          }
        />
      </Card>
    </>
  );
};
