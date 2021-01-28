import React, { useEffect, useState } from 'react';
import { RecordFormProps } from '../../../components/Forms';
import { IncomeDetermination } from '../../../shared/models';
import { RedeterminationCard } from './RedeterminationCard';
import { Button, InlineIcon, TextWithIcon } from '@ctoec/component-library';
import { EditDeterminationCard } from './EditDeterminationCard';
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

  const determinations: IncomeDetermination[] =
    child.family.incomeDeterminations || []; // assume they're sorted

  // We create dets in the backend even if there's no data for them
  // (so that we can check validation errors), so this always has
  // positive length; need to check that the det has null fields
  const noRecordedDets =
    determinations.length === 1 &&
    determinations[0].determinationDate === undefined &&
    determinations[0].income === null &&
    determinations[0].numberOfPeople === null &&
    !determinations[0].incomeNotDisclosed;

  const currentDetermination: IncomeDetermination | undefined =
    determinations[0];
  const pastDeterminations: IncomeDetermination[] = determinations.slice(1);

  return (
    <>
      <Heading level={topHeadingLevel}>Family income determination</Heading>
      {noRecordedDets && (
        <p className="usa-error-message">
          <InlineIcon icon="attentionNeeded" /> A recorded income determination
          is required.
        </p>
      )}
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
        {!noRecordedDets && (
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
        )}
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
            noRecordedDets={noRecordedDets}
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
