import { registerDecorator, ValidationOptions } from 'class-validator';
import { propertyDateSorter } from '../../../utils/propertyDateSorter';
import { Funding } from '../../Funding';

// Make sure first reporting period of a funding is after the last reporting period of the previous funding

const fundingPeriodOverlap =
  'Cannot claim a child twice in a reporting period.';

export function FundingsDoNotOverlap(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'fundingsDoNotOverlap',
      target: object.constructor,
      propertyName,
      options: { message: fundingPeriodOverlap, ...validationOptions },
      validator: {
        validate(allFundings: Funding[]) {
					if (!allFundings || !allFundings.length) return true;

					let overlap = false;
					return allFundings
					.sort((a,b) => propertyDateSorter(a, b, (f) => f.startDate))
					.every((funding, idx) => {
						// Last (or only) funding, nothing to compare
						if(idx === allFundings.length -1) return true;
						
						const nextFunding = allFundings[idx + 1];
						// Overlap if multiple fundings and first funding does not have end date
						// (implies next funding starts after this funding starts)
						// OR next funding starts before this funding ends
						if(
							!funding.endDate ||
							nextFunding.startDate.isBefore(funding.endDate)
					 	) {
								return false;
							}
						return true;
						});
      	}
			}
    });
  };
}
