import { registerDecorator, ValidationOptions } from 'class-validator';
import { Enrollment } from '../Enrollment';
import { Funding } from '../Funding';

// Make sure first reporting period of a funding is after the last reporting period of the previous funding

const fundingPeriodOverlap = 'Cannot claim a child twice in a reporting period';

export function FundingDoesNotOverlap(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'fundingOverlap',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: fundingPeriodOverlap, ...validationOptions },
      constraints: [{ fundingPeriod: fundingPeriodOverlap }],
      validator: {
        validate(validatingFunding, { object: enrollment }) {
          const allFundings = (enrollment as Enrollment).fundings;
          const {
            firstReportingPeriod: validatingFirstPeriod,
            lastReportingPeriod: validatingLastPeriod,
          } = validatingFunding as Funding;
          if (!validatingFirstPeriod) {
            return true;
          }
          const allExceptThisFunding = allFundings.filter(
            (f) => f.id !== validatingFunding.id
          );

          let overlap = false;
          allExceptThisFunding.forEach((_funding) => {
            const _firstPeriod = _funding.firstReportingPeriod;

            if (
              _firstPeriod.periodStart.isSame(validatingFirstPeriod.periodStart)
            ) {
              overlap = true;
            } else if (
              _firstPeriod.periodStart.isBefore(
                validatingFirstPeriod.periodStart
              )
            ) {
              if (!_funding.lastReportingPeriod) {
                // If a funding has no last reporting period and starts before this funding, there's an overlap
                overlap = true;
              } else {
                const _lastPeriod = _funding.lastReportingPeriod;
                if (
                  validatingFirstPeriod.periodStart.isSameOrBefore(
                    _lastPeriod.periodEnd
                  )
                ) {
                  // if the validated funding starts before this funding's period ends
                  overlap = true;
                }
              }
            } else {
              // If this funding period starts after the validating funding period start
              if (!validatingFirstPeriod.periodEnd) {
                // The validating period must have an end
                overlap = true;
              } else if (
                _firstPeriod.periodStart.isSameOrBefore(
                  validatingLastPeriod.periodEnd
                )
              ) {
                // This period's start can't be before the last period's end
                overlap = true;
              }
            }
          });
          return !overlap;
        },
      },
    });
  };
}
