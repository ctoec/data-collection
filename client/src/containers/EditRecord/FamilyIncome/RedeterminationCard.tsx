import React from 'react';
import { FamilyIncomeForm } from '../../../components/Forms';
import { Child } from '../../../shared/models';
import { Card, Button } from '@ctoec/component-library';

type RedeterminationCardProps = {
  child: Child;
  afterSaveSuccess: () => void;
  onCancel: () => void;
};

export const RedeterminationCard: React.FC<RedeterminationCardProps> = ({
  child,
  afterSaveSuccess,
  onCancel,
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
          setAlerts={() => {}}
          CancelButton={<Button text="Cancel" onChange={onCancel} />}
        />
      </Card>
    </>
  );
};
