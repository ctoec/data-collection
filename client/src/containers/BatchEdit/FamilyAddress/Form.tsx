import React from 'react';
import {
  EditFormProps,
  doesFamilyAddressFormHaveErrors,
} from '../../../components/Forms';
import { FamilyAddressForm as AddressForm } from '../../../components/Forms';

/**
 * Special componnet that enables batch editing a family address form for
 * a child. Records with errors in their family's address field will
 * appear in the SideNav of batch edit, and as those errors are
 * addressed, the form will disappear after saving.
 */
export const FamilyAddressForm: React.FC<EditFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  showField,
}) => {
  return (
    <>
      {doesFamilyAddressFormHaveErrors(child) && (
        <AddressForm
          child={child}
          afterSaveSuccess={afterSaveSuccess}
          setAlerts={setAlerts}
          showField={showField}
        />
      )}
    </>
  );
};
