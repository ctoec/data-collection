import React, { useState, useContext } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Button, Card } from '@ctoec/component-library';
import { propertyDateSorter } from '../../../../utils/dateSorter';
import { IncomeDeterminationCard } from './Fields/DeterminationCard';
import DeterminationFormInCard from './Fields/DeterminationFormInCard';
import { IncomeFormProps } from './Fields/Common';
import { IncomeDetermination } from '../../../../shared/models';
import { EditDeterminationForm } from './EditDeterminationForm';
import { RedeterminationForm } from './RedeterminationForm';

/**
 * The main form rendered in the EditRecord TabNav that allows a user
 * to update the income determination for a given Child record
 * object. Updates are performed on individual income determinations
 * before being re-persisted to the database.
 */
export const UpdateForm: React.FC<IncomeFormProps> = ({
  familyId,
  determinations,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);

  // Set up form state
  const [showNew, setShowNew] = useState(false);
  const [forceCloseEditForms, setForceCloseEditForms] = useState(false);
  const [didAddNew, setDidAddNew] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Save function that handles API protocols
  // Uses the ID of the user-modified determination to make the correct
  // update to the determinations array before pushing the whole
  // thing to the DB.
  const formOnSubmit = (
    userModifiedDet: IncomeDetermination,
    detId: number
  ) => {
    setSaving(true);
    console.log(userModifiedDet);
    setSaving(false);
  };

  // Tracking variables for easy reference in element creation
  const sortedDeterminations = (determinations || []).sort((a, b) =>
    propertyDateSorter(a, b, (det) => det.determinationDate, true)
  );
  const currentDetermination = sortedDeterminations[0];
  const pastDeterminations = sortedDeterminations.slice(1);

  return (
    <>
      {showNew && (
        <>
          <h2 className="font-sans-md margin-top-2 margin-bottom-2">
            New income determination
          </h2>
          <Card>
            <RedeterminationForm
              familyId={familyId}
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
          {!showNew && (
            <Button
              text="Redetermine income"
              appearance="unstyled"
              onClick={() => setShowNew(true)}
            />
          )}
        </div>
        <div>
          {currentDetermination && (
            <EditDeterminationForm
              determination={currentDetermination}
              familyId={familyId}
              isCurrent={true}
              isNew={isNew}
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
