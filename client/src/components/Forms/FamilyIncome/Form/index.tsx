import React, { useState, useEffect } from 'react';
import { Button, Card } from '@ctoec/component-library';
import { propertyDateSorter } from '../../../../utils/dateSorter';
import { EditDeterminationForm } from './EditDeterminationForm';
import { RedeterminationForm } from './RedeterminationForm';
import { EditFormProps } from '../../types';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { Family } from '../../../../shared/models';

const incomeDetFields = ['numberOfPeople', 'income', 'determinationDate'];
export const doesFamilyIncomeFormHaveErrors = (family?: Family) =>
  family?.incomeDeterminations?.length
    ? !!getValidationStatusForFields(
      family.incomeDeterminations,
      incomeDetFields
    )
    : true;

export const FamilyIncomeForm: React.FC<EditFormProps> = (props) => {
  const { child, afterDataSave: afterDataSave } = props;
  const [showRedeterminationForm, setShowRedeterminationForm] = useState(false);
  const [currentIsNew, setCurrentIsNew] = useState(false);

  if (!child?.family) {
    throw new Error('Family income rendered without family');
  }

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
      <h2>Family income determination</h2>
      {showRedeterminationForm && (
        <>
          <h3>Redetermine family income</h3>
          <Card>
            <RedeterminationForm
              {...props}
              familyId={familyId}
              setIsNew={() => setCurrentIsNew(true)}
              hideForm={() => setShowRedeterminationForm(false)}
              afterDataSave={afterDataSave}
            />
          </Card>
        </>
      )}
      <div className="margin-top-1">
        <div className="display-flex align-center">
          <h3 className="font-sans-md margin-top-2 margin-bottom-2">
            {currentDetermination
              ? 'Current income determination'
              : 'No income information on record'}
          </h3>
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
              afterDataSave={afterDataSave}
            />
          )}
        </div>

        {pastDeterminations.length > 0 && (
          <>
            <div className="display-flex align-center">
              <h3>Past income determinations</h3>
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
                  afterDataSave={afterDataSave}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
