import React from 'react';
// import { Enrollment } from '../../../../../generated';
import { WithNewDetermination, IncomeDeterminationFieldSet } from '../Fields';
import { Button, FormSubmitButton, Form, ExpandCard } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';
// import FormSubmitButton from '../../../../../components/Form_New/FormSubmitButton';
// import Form from '../../../../../components/Form_New/Form';
// import { ExpandCard } from '../../../../../components/Card/ExpandCard';
// import { headerLevels } from '../../../enrollmentTypes';

type DeterminationFormInCardProps = {
	determinationId: number;
	formData: IncomeDetermination;
	onSubmit: (_: IncomeDetermination) => void;
	onCancel?: () => void;
};

/**
 * The single-determination form to be embedded in FamilyDeterminationCard in the UpdateForm.
 *
 * The component relies on determinationId to determine which flavor of CardForm it is:
 * - determinationId = 0: displayed in a Card as the primary content to create a new determination
 * - determinationId != 0: displayed in a CardExpansion as the expanded context to edit existing determination with given id
 */
const DeterminationFormInCard: React.FC<DeterminationFormInCardProps> = ({
	determinationId,
	formData,
	onSubmit,
	onCancel,
}) => {
	// determinationId !== 0 means edit, not redetermination
	const isEditExpansion = determinationId !== 0;

	// Use a basic button to cancel adding new determination,
	// or an ExpandCard button to collapse the card expansion edit form for an existing determination
	const cancelElement = !isEditExpansion ? (
		<Button
			text="Cancel"
			appearance="outline"
			onClick={() => {
				if (onCancel) onCancel();
			}}
		/>
	) : (
		<ExpandCard>
			<Button text="Cancel" appearance="outline" />
		</ExpandCard>
	);

	return (
		<Form
			id={`update-family-income-${determinationId}`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<WithNewDetermination shouldCreate={!isEditExpansion}>
				<IncomeDeterminationFieldSet
					type={isEditExpansion ? 'edit' : 'redetermine'}
					determinationId={determinationId}
				/>
			</WithNewDetermination>
			<div className="display-flex">
				<div>
					{cancelElement}
					<FormSubmitButton text={isEditExpansion ? 'Save' : 'Redetermine'} />
				</div>
			</div>
		</Form>
	);
};

export default DeterminationFormInCard;