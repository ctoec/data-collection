import React, { useState } from 'react';
import { Button, Card } from '@ctoec/component-library';
import { propertyDateSorter } from '../../../../utils/dateSorter';
import { EditDeterminationForm } from './EditDeterminationForm';
import { RedeterminationForm } from './RedeterminationForm';
import { EditFormProps } from '../types';

/**
 * The main form rendered in the EditRecord TabNav that allows a user
 * to update the income determination for a given Child record
 * object. Updates are performed on individual income determinations
 * before being re-persisted to the database, but these updates are
 * passed off to the accessible forms (Edit and Redetermine) reached
 * through this page.
 */
export const FamilyIncomeForm: React.FC<EditFormProps> = (props) => {
  const { child, onSuccess } = props;
  const [showRedeterminationForm, setShowRedeterminationForm] = useState(false);
  const [currentIsNew, setCurrentIsNew] = useState(false);

  if (!child) return <></>;

  const determinations = child.family.incomeDeterminations || [];
  const familyId = child.family.id;

  // Tracking variables for easy reference in element creation
  const sortedDeterminations = determinations.sort((a, b) =>
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
              {...props}
              familyId={familyId}
              setIsNew={() => setCurrentIsNew(true)}
              hideForm={() => setShowRedeterminationForm(false)}
              onSuccess={onSuccess}
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
              {...props}
              determination={currentDetermination}
              familyId={familyId}
              isCurrent={true}
              isNew={currentIsNew}
              onSuccess={onSuccess}
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
                  {...props}
                  key={determination.id}
                  determination={determination}
                  familyId={familyId}
                  isCurrent={false}
                  isNew={false}
                  onSuccess={onSuccess}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
