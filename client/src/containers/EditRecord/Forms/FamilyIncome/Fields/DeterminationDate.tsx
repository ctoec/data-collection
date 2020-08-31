import React, { ChangeEvent } from 'react';
import { FormField, DateInput, DateInputProps } from '@ctoec/component-library';
import { parseDateChange } from '../../../../../utils/parseDateChange';
import { IncomeDetermination } from '../../../../../shared/models';

export const DeterminationDateField: React.FC = () => {
	return (
		<FormField<IncomeDetermination, DateInputProps, Date | null>
			getValue={(data) => data.at('determinationDate')}
			parseOnChangeEvent={(e: ChangeEvent) => parseDateChange(e)}
			inputComponent={DateInput}
			id='determination-date-'
			label="Determination date"
		/>
	);
};