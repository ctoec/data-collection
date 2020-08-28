import React from 'react';
import { FormContext, Checkbox, useGenericContext } from '@ctoec/component-library';
import produce from 'immer';
import { IncomeDetermination } from '../../../../../shared/models';

type NotDisclosedFieldProps = {
	notDisclosed: boolean;
	setNotDisclosed: (_: boolean) => void;
};

/**
 * This component is only used in NewForm, to remove all determinations.
 */
export const NotDisclosedField: React.FC<NotDisclosedFieldProps> = ({
	notDisclosed,
	setNotDisclosed,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<IncomeDetermination>(FormContext);
	return (
		<Checkbox
			id="not-disclosed"
			text="Family income not disclosed"
			defaultValue={notDisclosed}
			value="not-disclosed"
			onChange={(e) => {
				setNotDisclosed(e.target.checked);
				updateData(
					produce<IncomeDetermination>(data, (draft) => draft.family.incomeDeterminations = []));
			}}
		/>
	);
};