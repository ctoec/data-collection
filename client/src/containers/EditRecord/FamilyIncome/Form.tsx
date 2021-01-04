import React, { useState } from 'react';
import { RecordFormProps } from '../../../components/Forms';
import {
  IncomeDetermination,
  UndefinableBoolean,
} from '../../../shared/models';
import { RedeterminationCard } from './RedeterminationCard';
import { Button } from '@ctoec/component-library';
import { EditDeterminationCard } from './EditDeterminationCard';
import { FosterIncomeNotRequiredAlert } from '../../../components/Forms/FamilyIncome/FosterIncomeNotRequiredAlert';
import { getNextHeadingLevel, Heading } from '../../../components/Heading';

/**
 * Component enabling user to edit the family income portion of a child
 * record. Renders RedeterminationCard and EditDeterminationCard which
 * enable the user to edit existing family income determinations or add
 * a new one.
 */
export const FamilyIncomeForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  topHeadingLevel,
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }

  const [showRedeterminationForm, setShowRedeterminationForm] = useState(false);
  const [currentIsNew, setCurrentIsNew] = useState(false);

  if (child?.foster === UndefinableBoolean.Yes) {
    return (
      <>
        <Heading level={topHeadingLevel}>Family income determination</Heading>
        <FosterIncomeNotRequiredAlert />
      </>
    );
  }

  const determinations: IncomeDetermination[] =
    child.family.incomeDeterminations || []; // assume they're sorted
  const currentDetermination: IncomeDetermination | undefined =
    determinations[0];
  const pastDeterminations: IncomeDetermination[] = determinations.slice(1);

  return (
    <>
      <Heading level={topHeadingLevel}>Family income determination</Heading>
      {showRedeterminationForm && (
        <RedeterminationCard
          child={child}
          afterSaveSuccess={() => {
            setShowRedeterminationForm(false);
            setCurrentIsNew(true);
            afterSaveSuccess();
          }}
          onCancel={() => setShowRedeterminationForm(false)}
          setAlerts={setAlerts}
          topHeadingLevel={getNextHeadingLevel(topHeadingLevel)}
        />
      )}
      <div className="margin-top-1">
        <div className="display-flex align-center">
          <Heading
            level={getNextHeadingLevel(topHeadingLevel)}
            className="font-sans-md margin-top-2 margin-bottom-2"
          >
            {currentDetermination
              ? 'Current income determination'
              : 'No income information on record'}
          </Heading>
          {!showRedeterminationForm && (
            <Button
              className="margin-left-1"
              text="Redetermine"
              appearance="unstyled"
              onClick={() => {
                setShowRedeterminationForm(true);
              }}
            />
          )}
        </div>
        {currentDetermination && (
          <EditDeterminationCard
            child={child}
            determinationId={currentDetermination.id}
            afterSaveSuccess={afterSaveSuccess}
            isCurrent={true}
            currentIsNew={currentIsNew}
            setAlerts={setAlerts}
            // This is nested under the current income det header
            topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
          />
        )}

        {!!pastDeterminations.length && (
          <>
            <div className="margin-top-1">
              <Heading level={getNextHeadingLevel(topHeadingLevel)}>
                Past income determinations
              </Heading>
              {pastDeterminations.map((determination) => (
                <EditDeterminationCard
                  child={child}
                  determinationId={determination.id}
                  afterSaveSuccess={afterSaveSuccess}
                  setAlerts={setAlerts}
                  topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
