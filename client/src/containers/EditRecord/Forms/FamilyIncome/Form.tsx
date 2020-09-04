import React, { useState } from 'react';
import { Button, Card } from '@ctoec/component-library';
import { propertyDateSorter } from '../../../../utils/dateSorter';
import { IncomeDetermination } from '../../../../shared/models';
import { EditDeterminationForm } from './EditDeterminationForm';
import { RedeterminationForm } from './RedeterminationForm';

/**
 * Generic type to hold the props of the high-level income forms,
 * specifically to allow indexing into the desire determination as
 * well as persisting back to the DB.
 */
export type IncomeFormProps = {
  familyId: number;
  determinations: IncomeDetermination[];
  refetchChild: () => void;
};

/**
 * The main form rendered in the EditRecord TabNav that allows a user
 * to update the income determination for a given Child record
 * object. Updates are performed on individual income determinations
 * before being re-persisted to the database, but these updates are
 * passed off to the accessible forms (Edit and Redetermine) reached
 * through this page.
 */
export const FamilyIncomeForm: React.FC<IncomeFormProps> = ({
  familyId,
  determinations,
  refetchChild,
}) => {
  const [showRedeterminationForm, setShowRedeterminationForm] = useState(false);
  const [currentIsNew, setCurrentIsNew] = useState(false);

  // Tracking variables for easy reference in element creation
  const sortedDeterminations = (determinations || []).sort((a, b) =>
    propertyDateSorter(a, b, (det) => det.determinationDate, true)
  );
  const currentDetermination = sortedDeterminations[0];
  const pastDeterminations = sortedDeterminations.slice(1);

  return (
    <>
      {showRedeterminationForm && (
        <>
          <h2 className="font-sans-md margin-top-2 margin-bottom-2">
            Redetermine family income
          </h2>
          <Card>
            <RedeterminationForm
              familyId={familyId}
              setIsNew={() => setCurrentIsNew(true)}
              hideForm={() => setShowRedeterminationForm(false)}
              refetchChild={refetchChild}
            />
          </Card>
        </>
      )}
      <div className="margin-top-1">
        <div className="display-flex align-center">
          <h2 className="font-sans-md margin-top-2 margin-bottom-2">
            {currentDetermination
              ? 'Current income determination'
              : 'No income information on record'}
          </h2>
          &nbsp;&nbsp;&nbsp;
          {!showRedeterminationForm && (
            <Button
              text="Redetermine income"
              appearance="unstyled"
              onClick={() => {
                setShowRedeterminationForm(true);
              }}
            />
          )}
        </div>
        <div>
          {currentDetermination && (
            <EditDeterminationForm
              determination={currentDetermination}
              familyId={familyId}
              isCurrent={true}
              isNew={currentIsNew}
              refetchChild={refetchChild}
            />
          )}
        </div>

        {pastDeterminations.length > 0 && (
          <>
            <div className="display-flex align-center">
              <h2 className="font-sans-md margin-top-2 margin-bottom-2">
                Past income determinations
              </h2>
            </div>
            <div>
              {pastDeterminations.map((determination) => (
                <EditDeterminationForm
                  key={determination.id}
                  determination={determination}
                  familyId={familyId}
                  isCurrent={false}
                  isNew={false}
                  refetchChild={refetchChild}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
