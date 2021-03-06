import React, { useContext, useState, useEffect } from 'react';
import { Child } from '../../../shared/models';
import {
  Card,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  TrashCan,
  CardExpansion,
  InlineIcon,
} from '@ctoec/component-library';
import { currencyFormatter } from '../../../utils/formatters';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import { FamilyIncomeForm, RecordFormProps } from '../../../components/Forms';
import { HeadingLevel } from '../../../components/Heading';

type EditDeterminationCardProps = {
  child: Child;
  determinationId: number;
  afterSaveSuccess: () => void;
  isCurrent?: boolean;
  currentIsNew?: boolean;
  setAlerts: RecordFormProps['setAlerts'];
  topHeadingLevel: HeadingLevel;
  noRecordedDets?: boolean;
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
  setAlerts,
  topHeadingLevel,
  noRecordedDets,
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
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to delete determination',
          },
        ]);
      });
  };

  // If we're in the error state of EditRecord where a child has no
  // recorded income dets, then don't show any cards or current info,
  // just the form expansion with NO error styling at all
  if (noRecordedDets) {
    return (
      <div className="tablet:grid-col-9">
        <Card>
          <FamilyIncomeForm
            child={child}
            id={`edit-determination-${determinationId}`}
            legend="Edit income determiniation"
            incomeDeterminationId={determinationId}
            afterSaveSuccess={() => {
              setCloseCard(true);
              afterSaveSuccess();
            }}
            setAlerts={setAlerts}
            topHeadingLevel={topHeadingLevel}
            hideErrors={true}
            isFirstRecordedDet={true}
          />
        </Card>
      </div>
    );
  }

  // Assign the card text options to variables for cleanliness
  // of showing it in the return statement below
  const notDisclosedCardText = (
    <div className="flex-1">
      <p className="text-bold">Income not disclosed</p>
    </div>
  );

  const incomeInfoText = (
    <>
      <div className="flex-1">
        <p>Household size</p>
        <p className="text-bold">
          {determination.numberOfPeople || InlineIcon({ icon: 'incomplete' })}
        </p>
      </div>
      <div className="flex-1">
        <p>Income</p>
        <p className="text-bold">
          {typeof determination.income === 'number'
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
    </>
  );

  return (
    <Card
      className="margin-bottom-2"
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
      key={determination.id}
      showTag={currentIsNew}
    >
      <div className="display-flex flex-justify">
        {determination.incomeNotDisclosed
          ? notDisclosedCardText
          : incomeInfoText}
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
          legend="Edit income determiniation"
          incomeDeterminationId={determinationId}
          afterSaveSuccess={() => {
            setCloseCard(true);
            afterSaveSuccess();
          }}
          setAlerts={setAlerts}
          topHeadingLevel={topHeadingLevel}
        />
      </CardExpansion>
    </Card>
  );
};
