import React, { useContext, useEffect, useState } from 'react';
import {
  SasidField,
  FirstNameField,
  MiddleNameField,
  LastNameField,
  SuffixField,
  DateOfBirthField,
  BirthCertificateFieldSet,
} from './Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { RecordFormProps } from '../types';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child, UniqueIdType } from '../../../shared/models';
import { apiPost, apiPut } from '../../../utils/api';
import useIsMounted from '../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../hooks/useValidationErrors';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import { useHistory } from 'react-router-dom';
import { UniqueIdField } from './Fields/UniqueId';

// The fields we use to check to see if this form has errors or missing info
const childIdentifiersFields = [
  'firstName',
  'lastName',
  'birthdate',
  'birthCertificateType',
  'birthTown',
  'birthState',
  'birthCertificateId',
];
export const doesChildIdFormHaveErrors = (child?: Child) =>
  child ? !!getValidationStatusForFields(child, childIdentifiersFields) : true;

export const ChildIdentifiersForm = ({
  child: inputChild,
  afterSaveSuccess,
  hideHeader = false,
  hideErrors,
  showFieldOrFieldset = () => true,
  setAlerts,
}: RecordFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!inputChild) {
    throw new Error('Child info rendered without child');
  }
  // Must keep track of child locally in case creation fails
  const [child, updateChild] = useState(inputChild);
  useEffect(() => {
    updateChild(inputChild);
  }, [inputChild]);
  const { errorsHidden } = useValidationErrors(hideErrors);

  const onFinally = () => {
    if (isMounted()) {
      setSaving(false);
    }
  };

  const onFormSubmit = (_child: Child) => {
    setSaving(true);
    if (!child.id) {
      apiPost('children', _child, {
        accessToken,
      })
        .then((res) => {
          history.replace({ pathname: `/create-record/${res.id}` });
          afterSaveSuccess();
        })
        .catch((err) => {
          if (err.data) {
            updateChild(err.data);
          }
          console.error(err);
          setAlerts([
            { type: 'error', text: 'Unable to save child identifiers' },
          ]);
        })
        .finally(onFinally);
    } else {
      apiPut(`children/${child.id}`, _child, { accessToken })
        .then(afterSaveSuccess)
        .catch((err) => {
          console.error(err);
          setAlerts([
            { type: 'error', text: 'Unable to save child identifiers' },
          ]);
        })
        .finally(onFinally);
    }
  };

  return (
    <Form<Child>
      className="ChildIdentifiersForm usa-form"
      data={child}
      onSubmit={onFormSubmit}
      noValidate
      autoComplete="off"
      hideStatus={errorsHidden}
    >
      {!hideHeader && <h2>Child's identifiers</h2>}
      {showFieldOrFieldset(child, ['sasid', 'uniqueId']) &&
        (child.organization.uniqueIdType === UniqueIdType.SASID ? (
          <div className="mobile-lg:grid-col-12">
            <SasidField />
          </div>
        ) : child.organization.uniqueIdType === UniqueIdType.Other ? (
          <div className="mobile-lg:grid-col-12">
            <UniqueIdField />
          </div>
        ) : (
          <></>
        ))}
      {showFieldOrFieldset(child, [
        'firstName',
        'lastName',
        'middleName',
        'suffix',
      ]) && (
        <>
          <div className="mobile-lg:grid-col-9">
            <FirstNameField />
          </div>
          <div className="mobile-lg:grid-col-9">
            <MiddleNameField />
          </div>
          <div className="display-flex flex-row flex-align-end grid-row grid-gap">
            <div className="mobile-lg:grid-col-9">
              <LastNameField />
            </div>
            <div className="mobile-lg:grid-col-3">
              <SuffixField />
            </div>
          </div>
        </>
      )}
      {showFieldOrFieldset(child, ['birthdate']) && <DateOfBirthField />}
      {showFieldOrFieldset(child, [
        'birthCertificateType',
        'birthCertificateId',
        'birthTown',
        'birthState',
      ]) && <BirthCertificateFieldSet />}
      <FormSubmitButton
        text={saving ? 'Saving...' : 'Save'}
        disabled={saving}
      />
    </Form>
  );
};
