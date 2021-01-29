import { registerDecorator, ValidationOptions } from 'class-validator';
import { Funding } from '../../Funding';

// Make sure first reporting period of a funding is after the last reporting period of the previous funding

const fundingPeriodOverlap =
  'Cannot claim a child twice in a reporting period.';

export function FundingDoesNotOverlap(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: Funding, propertyName: string) {
    registerDecorator({
      name: 'fundingOverlap',
      target: object.constructor,
      propertyName,
      options: { message: fundingPeriodOverlap, ...validationOptions },
      constraints: [{ fundingPeriod: fundingPeriodOverlap }],
      validator: {
        validate(_, { object: funding }) {
          const allFundings = (funding as any).allFundings;
          if (!allFundings) return true;

          const allExceptThisFunding = [
            ...allFundings.filter((f) => f.id !== (funding as Funding).id),
          ];

          if (!allExceptThisFunding.length) {
            return true;
          }

          const {
            firstReportingPeriod: validatingFirstPeriod,
            lastReportingPeriod: validatingLastPeriod,
          } = funding as Funding;

          if (!validatingFirstPeriod) {
            return true;
          }

          let overlap = false;
          allExceptThisFunding.forEach((_funding) => {
            const _firstPeriod = _funding.firstReportingPeriod;
            console.log(`Fundingggggggggg: FUNDING ${_funding.id}`)

            if (!_firstPeriod) {
              console.log(`WOOOOOOOO, NO FIRST PERIOD FOUND FOR ${_funding.id}`)
              return;
            }

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
                  !!_lastPeriod &&
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
              if (!validatingFirstPeriod?.periodEnd) {
                // The validating period must have an end
                overlap = true;
              } else if (
                validatingLastPeriod &&
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
