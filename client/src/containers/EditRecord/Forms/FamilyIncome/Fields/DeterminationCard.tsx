import React from 'react';
import {
  Card,
  InlineIcon,
  Button,
  TextWithIcon,
  CardExpansion,
  ExpandCard,
  Pencil,
} from '@ctoec/component-library';
import { currencyFormatter } from '../../../../../utils/formatters';
import { IncomeDetermination } from '../../../../../shared/models';

/**
 * Type to hold the basic properties of an income determination card.
 */
type IncomeDeterminationCardProps = {
  determination: IncomeDetermination;
  isCurrent: boolean;
  isNew?: boolean;
  forceClose: boolean;
  expansion: JSX.Element;
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
}: IncomeDeterminationCardProps) => {
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
        <ExpandCard>
          <Button
            text={<TextWithIcon text="Edit" Icon={Pencil} />}
            appearance="unstyled"
          />
        </ExpandCard>
      </div>
      <CardExpansion>{expansion}</CardExpansion>
    </Card>
  );
};
