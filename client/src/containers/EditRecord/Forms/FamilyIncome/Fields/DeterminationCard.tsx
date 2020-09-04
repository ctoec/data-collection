import React, { useContext } from 'react';
import {
  Card,
  InlineIcon,
  Button,
  TextWithIcon,
  CardExpansion,
  ExpandCard,
  Pencil,
  TrashCan,
} from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';
import { currencyFormatter } from '../../../../../utils/formatters';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../../../utils/api';

/**
 * Type to hold the basic properties of an income determination card.
 */
type IncomeDeterminationCardProps = {
  determination: IncomeDetermination;
  isCurrent: boolean;
  isNew?: boolean;
  forceClose: boolean;
  expansion: JSX.Element;
  refetchChild: () => void;
};

/**
 * Card that displays an income determination record.
 * This is the basic unit of displaying income determinations
 * in the TabNav form, and is used for both redetermining
 * income as well as editing a determination.
 */
export const IncomeDeterminationCard = ({
  determination,
  isCurrent,
  isNew = false,
  forceClose,
  expansion,
  refetchChild,
}: IncomeDeterminationCardProps) => {
  const { accessToken } = useContext(AuthenticationContext);

  function deleteDetermination() {
    console.log(determination);
    apiDelete(`families/income-determination/${determination.id}`, {
      accessToken,
    })
      .then(() => {
        refetchChild();
      })
      .catch((err) => {
        console.error('Unable to delete determination', err);
      });
  }

  return (
    <Card
      className="margin-bottom-2"
      appearance={isCurrent ? 'primary' : 'secondary'}
      showTag={isCurrent ? isNew : undefined}
      forceClose={forceClose}
      key={determination.id}
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
              text={<TextWithIcon text="Delete" Icon={Pencil} />}
              appearance="unstyled"
              onClick={deleteDetermination}
            />
          </div>
        </div>
      </div>
      <CardExpansion>{expansion}</CardExpansion>
    </Card>
  );
};
