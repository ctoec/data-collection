import React, { useState } from 'react';
import { RecordFormProps } from '../../../components/Forms';
import { IncomeDetermination } from '../../../shared/models';
import { RedeterminationCard } from './RedeterminationCard';
import { Button } from '@ctoec/component-library';
import { EditDeterminationCard } from './EditDeterminationCard';

/**
 * Component enabling user to edit the family income portion of a child
 * record. Renders RedeterminationCard and EditDeterminationCard which
 * enable the user to edit existing family income determinations or add
 * a new one.
 */
export const FamilyIncomeForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
}) => {
  if (!child?.family) {
    throw new Error('Family income form rendered without family');
  }

  const [showRedeterminationForm, setShowRedeterminationForm] = useState(false);
  const [currentIsNew, setCurrentIsNew] = useState(false);

  const determinations: IncomeDetermination[] =
    child.family.incomeDeterminations || []; // assume they're sorted
  const currentDetermination: IncomeDetermination | undefined =
    determinations[0];
  const pastDeterminations: IncomeDetermination[] = determinations.slice(1);

  return (
    <>
      <h2>Family income determination</h2>
      {showRedeterminationForm && (
        <RedeterminationCard
          child={child}
          afterSaveSuccess={() => {
            setShowRedeterminationForm(false);
            setCurrentIsNew(true);
            afterSaveSuccess();
          }}
          onCancel={() => setShowRedeterminationForm(false)}
        />
      )}
      <div className="margin-top-1">
        <div className="display-flex align-center">
          <h3 className="font-sans-md margin-top-2 margin-bottom-2">
            {currentDetermination
              ? 'Current income determination'
              : 'No income information on record'}
          </h3>
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
          />
        )}

        {!!pastDeterminations.length && (
          <>
            <div className="margin-top-1">
              <h3>Past income determinations</h3>
              {pastDeterminations.map((determination) => (
                <EditDeterminationCard
                  child={child}
                  determinationId={determination.id}
                  afterSaveSuccess={afterSaveSuccess}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
