import React from 'react';
import {
  EditFormProps,
  doesChildIdFormHaveErrors,
} from '../../../components/Forms';
import { ChildIdentifiersForm as ChildIdForm } from '../../../components/Forms';

/**
 * Special componnet that enables batch editing a child identifiers
 * form for a child. Records with errors in their identifier fields
 * will appear in the SideNav of batch edit, and as those errors are
 * addressed, the form will disappear after saving.
 */
export const ChildIdentifiersForm: React.FC<EditFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  showField,
}) => {
  return (
    <>
      {doesChildIdFormHaveErrors(child) && (
        <ChildIdForm
          child={child}
          afterSaveSuccess={afterSaveSuccess}
          setAlerts={setAlerts}
          showField={showField}
        />
      )}
    </>
  );
};
