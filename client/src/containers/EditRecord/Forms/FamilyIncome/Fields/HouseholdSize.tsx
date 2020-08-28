import React from 'react';
import { FormField, TextInputProps, TextInput } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';


export const HouseholdSizeField: React.FC = () => {
	return (
		<FormField<IncomeDetermination, TextInputProps, number | null>
			getValue={(data) => data.at('numberOfPeople')}
			parseOnChangeEvent={(e) => parseInt(e.target.value, 10) || null}
			defaultValue={undefined}
			inputComponent={TextInput}
			id={'number-of-people'}
			label="Household size"
			small
		/>
	);
};