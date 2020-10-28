import React, { useContext, useState, useEffect } from 'react';
import { Child } from '../../../shared/models';
import {
  Card,
  InlineIcon,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  TrashCan,
  CardExpansion,
} from '@ctoec/component-library';
import { currencyFormatter } from '../../../utils/formatters';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import { FamilyIncomeForm } from '../../../components/Forms';

type EditDeterminationCardProps = {
  child: Child;
  determinationId: number;
  afterSaveSuccess: () => void;
  isCurrent?: boolean;
  currentIsNew?: boolean;
};

/**
 * Component for editing a family income determination in the EditRecord flow.
 * Renders a card component that displays determination info, with a card expansion
 * containing a general-purpose FamilyIncome form
 */
export const EditDeterminationCard: React.FC<EditDeterminationCardProps> = ({
  child,
  determinationId,
  afterSaveSuccess,
  isCurrent,
  currentIsNew,
}) => {
  const determination = child?.family?.incomeDeterminations?.find(
    (d) => d.id === determinationId
  );
  if (!determination) {
    throw new Error('Edit determination rendered without determination');
  }

  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);

  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  const deleteDetermination = () => {
    apiDelete(
      `families/${child?.family?.id}/income-determinations/${determinationId}`,
      { accessToken }
    )
      .then(afterSaveSuccess)
      .catch((err) => console.error('Unable to delete determination'));
  };

  return (
    <Card
      className="margin-bottom-2"
      appearance={isCurrent ? 'primary' : 'secondary'}
      key={determination.id}
      showTag={currentIsNew}
      forceClose={closeCard}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p>Household size</p>
          <p className="text-bold">
            {determination.numberOfPeople || InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-1">
          <p>Income</p>
          <p className="text-bold">
            {determination.income
              ? currencyFormatter(determination.income)
              : InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-2">
          <p>Determined on</p>
          <p className="text-bold">
            {determination.determinationDate
              ? determination.determinationDate.format('MM/DD/YYYY')
              : InlineIcon({ icon: 'incomplete' })}
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
              onClick={deleteDetermination}
            />
          </div>
        </div>
      </div>
      <CardExpansion>
        <FamilyIncomeForm
          child={child}
          id={`edit-determination-${determinationId}`}
          legend={`Edit income determiniation ${determinationId}`}
          afterSaveSuccess={() => {
            setCloseCard(true);
            afterSaveSuccess();
          }}
          setAlerts={() => {}}
        />
      </CardExpansion>
    </Card>
  );
};
