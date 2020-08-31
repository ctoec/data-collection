import React, { useState, useContext } from 'react';
// import { SectionProps } from '../../../enrollmentTypes';
// import {
// Enrollment,
// ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
// } from '../../../../../generated';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
// import { validatePermissions, getIdForUser } from '../../../../../utils/models';
// import useApi from '../../../../../hooks/useApi';
import { Button, Card } from '@ctoec/component-library';
import { propertyDateSorter } from '../../../../utils/dateSorter';
import { IncomeDeterminationCard } from './Fields/DeterminationCard';
import DeterminationFormInCard from './Fields/DeterminationFormInCard';
import { IncomeFormProps } from './Fields/Common';
import { IncomeDetermination } from '../../../../shared/models';

// import useCatchAllErrorAlert from '../../../../../hooks/useCatchAllErrorAlert';

/**
 * The form rendered in EnrollmentUpdate flow, which displays all determinations
 * for the given enrollment's child's family. The user can edit any existing
 * determination, or add a new one.
 */
export const UpdateForm: React.FC<IncomeFormProps> = ({
  familyId,
  isFoster,
  hasDisclosed,
  determinations,
  refetchChild,
}) => {
  // Enrollment and child must already exist to create family income data,
  // and cannot be created without user input (have required non null fields)
  // if (!enrollment || !enrollment.child || !enrollment.child.family) {
  // throw new Error('Section rendered without enrollment or child');
  // }

  const { accessToken } = useContext(AuthenticationContext);

  // Set up form state
  const [showNew, setShowNew] = useState(false);
  const [forceCloseEditForms, setForceCloseEditForms] = useState(false);
  const [didAddNew, setDidAddNew] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [saving, setSaving] = useState(false);

  // Convenience vars for rendering the form
  const formOnSubmit = (userModifiedDet: IncomeDetermination) => {
    setSaving(true);
    console.log(userModifiedDet);
    setSaving(false);
  };

  const sortedDeterminations = (determinations || []).sort((a, b) =>
    propertyDateSorter(a, b, (det) => det.determinationDate, true)
  );
  const currentDetermination = sortedDeterminations[0];
  const pastDeterminations = sortedDeterminations.slice(1);

  console.log(determinations[0]);

  return (
    <>
      {showNew && (
        <>
          <h2 className="font-sans-md margin-top-2 margin-bottom-2">
            New income determination
          </h2>
          <Card>
            <DeterminationFormInCard
              determinationId={0}
              formData={determinations[0]}
              onSubmit={(_data) => {
                setDidAddNew(true);
                formOnSubmit(_data);
              }}
              onCancel={() => setShowNew(false)}
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
            <IncomeDeterminationCard
              determination={currentDetermination}
              isCurrent={true}
              isNew={isNew}
              forceClose={forceCloseEditForms}
              expansion={
                <DeterminationFormInCard
                  determinationId={currentDetermination.id}
                  formData={currentDetermination}
                  onSubmit={formOnSubmit}
                />
              }
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
              // WRONG
              {pastDeterminations.map((determination) => (
                <IncomeDeterminationCard
                  key={determination.id}
                  determination={determination}
                  isCurrent={false}
                  forceClose={forceCloseEditForms}
                  expansion={
                    <DeterminationFormInCard
                      determinationId={determination.id}
                      formData={determination}
                      onSubmit={formOnSubmit}
                    />
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
