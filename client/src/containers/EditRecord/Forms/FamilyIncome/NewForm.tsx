import React, { useState, useContext, useEffect } from 'react';
import { IncomeFormProps } from './Fields/Common';
import { Form, FormSubmitButton, Alert } from '@ctoec/component-library';
import { WithNewDetermination, IncomeDeterminationFieldSet, NotDisclosedField } from './Fields';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import idx from 'idx';
import { IncomeDetermination } from '../../../../shared/models';
// import FamilyIncome from '.';
// import { NotDisclosedField } from './Fields/NotDisclosed';

/**
 * The form rendered in EnrollmentNew flow, which optionally adds a family income determination
 * to the enrollment's child's family.
 *
 * If the user marks that income is not disclosed, no family income determination will be created,
 * and the user will be shown a warning that they cannot enroll the child in a funded space without
 * this information.
 *
 * If the user does not mark that income is not disclosed, and does not enter any information, a new
 * determination without any values will be created, which will later trigger missing information
 * validation errors.
 */

export const NewForm: React.FC<IncomeFormProps> = ({
  familyId,
  isFoster,
  hasDisclosed,
  determinations,
  refetchChild,
}) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	// if (!enrollment || !enrollment.child) {
	// 	throw new Error('Section rendered without enrollment or child');
	// }

	const { accessToken } = useContext(AuthenticationContext);

	// const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(
		// If enrollment's child's family does not exist, create an empty default
		// enrollment.child.family == undefined
			// ? enrollmentWithDefaultFamily(enrollment, getIdForUser(user, 'org'))
			// : enrollment
	// );

	// Set up API request (enrollment PUT)
	const [saving, setSaving] = useState(false);
	// const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		// id: enrollment.id,
		// siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		// orgId: getIdForUser(user, 'org'),
		// enrollment: mutatedEnrollment,
	// };
	// const { error: errorOnSave, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
	// 	(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
	// 	{
	// 		skip: !attemptSave,
	// 		callback: () => {
	// 			setAttemptSave(false);
	// 			onSectionTouch && onSectionTouch(FamilyIncome);
	// 		},
	// 	}
	// );

	// Handle API error
	// display CatchAll error alert on any API error
	// useCatchAllErrorAlert(errorOnSave);

	// Handle API request success
	// useEffect(() => {
		// If the request is still loading or
		// If the request produced an error,
		// Do nothing
		// if (isSaving || errorOnSave) {
			// return;
		// }

		// If the request succeeded, process the response
		// if (returnedEnrollment) {
			// if (successCallback) successCallback(returnedEnrollment);
		// }
		// Else the request hasn't fired, do nothing.
	// }, [isSaving, errorOnSave, successCallback, returnedEnrollment]);

	// Skip section when child lives with foster
	// if (idx(enrollment, (_) => _.child.foster)) {
	// 	successCallback && successCallback(enrollment);
	// }

	/**
	 * User will first land here on their first pass through the form sections,
	 * at which point no determination exists.
	 * Default to determinationId = 0 and notDisclosed = false.
	 *
	 * User may navigate back to this section during the enrollment NEW flow.
	 * At that point, if there is a determination, use it to populate the form.
	 * If there is no determination, then they did not disclose.
	 */
	// const isReturnVisit = touchedSections && touchedSections[FamilyIncome.key];
	const determinationId = idx(determinations, () => determinations[0].id) || 0;
	const [notDisclosed, setNotDisclosed] = useState(determinationId === 0 ? !hasDisclosed : false);

	const onFormSubmit = (userModifiedDet: IncomeDetermination) => {
		setSaving(true);
		console.log(userModifiedDet);
		setSaving(false);
	};
	return (
		<>
			{notDisclosed && <Alert type="info" text='You must disclose income 
					information to enroll a child in a funded program' />}
			<Form<IncomeDetermination>
				data={determinations[determinationId]}
				onSubmit={onFormSubmit}
				className="enrollment-new-family-income-section usa-form"
				noValidate
				autoComplete="off"
			>
				<WithNewDetermination
					// create new determination if:
					// - determinationId = 0 (indicating new determination)
					// - user has not indicated that income information is not disclosed
					shouldCreate={determinationId === 0 && !notDisclosed}
				>
					{!notDisclosed && (
						// No header level supplied because new determination doesn't show header
						<IncomeDeterminationFieldSet type="new" determinationId={determinationId} />
					)}
				</WithNewDetermination>

				<div className="margin-top-2">
					<NotDisclosedField notDisclosed={notDisclosed} setNotDisclosed={setNotDisclosed} />
				</div>
				<FormSubmitButton text={saving ? 'Saving...' : 'Save'} />
			</Form>
		</>
	);
};