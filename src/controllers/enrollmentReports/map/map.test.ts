import { EnrollmentReportRow } from '../../../template';
import {
  Site,
  Child,
  IncomeDetermination,
  Enrollment,
  FundingSpace,
  Funding,
  ReportingPeriod,
} from '../../../entity';
import {
  BirthCertificateType,
  Gender,
  CareModel,
  AgeGroup,
  FundingSource,
  FundingTime,
  FundingSourceTime,
} from '../../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../../client/src/shared/constants';
import { getRaceIndicated, mapEnum, mapFundingTime } from './entities';
import { lookUpSite } from './utils';
import {
  updateBirthCertificate,
  getEnrollmentMatch,
  getFundingMatch,
  rowHasNewDetermination,
  rowHasNewEnrollment,
  rowHasNewFunding,
} from './updates';
import moment from 'moment';

describe('controllers', () => {
  describe('enrollmentReports', () => {
    describe('lookUpSite', () => {
      it('returns undefined if source row does not have siteName', () => {
        const site = lookUpSite({} as EnrollmentReportRow, 1, []);
        expect(site).toBeUndefined();
      });
      it.each([
        ['site1', 1, 'site1'],
        ['site1', 10, undefined],
        ['site1000', 1, undefined],
      ])(
        'returns the site from the list that matches input org Id and source site name',
        (sourceSiteName, inputOrgId, resultSiteName) => {
          const inputSites = [
            { siteName: 'site1', organizationId: 1 },
            { siteName: 'site2', organizationId: 2 },
          ] as Site[];
          const source = { site: sourceSiteName } as EnrollmentReportRow;

          const site = lookUpSite(source, inputOrgId, inputSites);
          expect(site?.siteName).toEqual(resultSiteName);
        }
      );
    });

    describe('raceIndicated', () => {
      it.each([
        [{ americanIndianOrAlaskaNative: true }, true],
        [{ asian: true }, true],
        [{ blackOrAfricanAmerican: true }, true],
        [{ nativeHawaiianOrPacificIslander: true }, true],
        [{ white: true }, true],
        [
          {
            americanIndianOrAlaskaNative: true,
            asian: false,
            blackOrAfricanAmerican: false,
            nativeHawaiianOrPacificIslander: false,
            white: false,
          },
          true,
        ],
        [
          {
            americanIndianOrAlaskaNative: false,
            asian: false,
            blackOrAfricanAmerican: false,
            nativeHawaiianOrPacificIslander: false,
            white: false,
          },
          false,
        ],
        [{}, false],
      ])(
        'returns true if any race variables are true',
        (sourceRow, expectedResult) => {
          const isIndicated = getRaceIndicated(
            sourceRow as EnrollmentReportRow
          );
          expect(isIndicated).toEqual(expectedResult);
        }
      );
    });

    describe('mapEnum', () => {
      it.each([
        ...Object.values(BirthCertificateType).map((bcType) => [
          bcType,
          bcType,
        ]),
        ...Object.values(BirthCertificateType).map((bcType) => [
          bcType.toLowerCase(),
          bcType,
        ]),
      ])(
        'can parse any BirthCertificateType value: %s returns %s',
        (inputBirthCertificateType, expectedBirthCertificateType) => {
          const parsed = mapEnum(
            BirthCertificateType,
            inputBirthCertificateType
          );
          expect(parsed).toEqual(expectedBirthCertificateType);
        }
      );

      it.each([
        ...Object.values(Gender).map((gender) => [gender, gender]),
        ...Object.values(Gender).map((gender) => [
          gender.toLowerCase(),
          gender,
        ]),
      ])(
        'can parse any Gender value: %s returns %s',
        (inputGender, expectedGender) => {
          const parsed = mapEnum(Gender, inputGender);
          expect(parsed).toEqual(expectedGender);
        }
      );

      it.each([
        ...Object.values(CareModel).map((careModel) => [careModel, careModel]),
        ...Object.values(CareModel).map((careModel) => [
          careModel.toLowerCase(),
          careModel,
        ]),
      ])(
        'can parse any CareModel value: %s returns %s',
        (inputCareModel, expectedCareModel) => {
          const parsed = mapEnum(CareModel, inputCareModel);
          expect(parsed).toEqual(expectedCareModel);
        }
      );

      it.each([
        ...Object.values(AgeGroup).map((ageGroup) => [ageGroup, ageGroup]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.toLowerCase(),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, '-'),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, '/'),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, ''),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, ' '),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, '-').toLowerCase(),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, '/').toLowerCase(),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, '').toLowerCase(),
          ageGroup,
        ]),
        ...Object.values(AgeGroup).map((ageGroup) => [
          ageGroup.replace(/[\/\s]/, ' ').toLowerCase(),
          ageGroup,
        ]),
      ])(
        'can parse any AgeGroup value: %s returns %s',
        (inputAgeGroup, expectedAgeGroup) => {
          const parsed = mapEnum(AgeGroup, inputAgeGroup);
          expect(parsed).toEqual(expectedAgeGroup);
        }
      );

      it.each([
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource,
          fundingSource,
        ]),
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource.toLowerCase(),
          fundingSource,
        ]),
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource.split('-')[0],
          fundingSource,
        ]),
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource.split('-')[1],
          fundingSource,
        ]),
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource.split('-')[0].toLowerCase(),
          fundingSource,
        ]),
        ...Object.values(FundingSource).map((fundingSource) => [
          fundingSource.split('-')[1].toLowerCase(),
          fundingSource,
        ]),
      ])(
        'can parse any FundingSource value: %s returns %s',
        (inputFundingSource, expectedFundingSource) => {
          const parsed = mapEnum(FundingSource, inputFundingSource, {
            isFundingSource: true,
          });
          expect(parsed).toEqual(expectedFundingSource);
        }
      );
    });

    describe('mapFundingTime', () => {
      describe.each([
        ...Object.values(FundingSource).map((source) => [
          source,
          FUNDING_SOURCE_TIMES.find((fst) =>
            fst.fundingSources.includes(source)
          ),
        ]),
      ])(
        'for funding source %s',
        (source: FundingSource, fundingSourceTimes: FundingSourceTime) => {
          describe.each([
            ...fundingSourceTimes.fundingTimes.map((ft) => [
              ft.value,
              ft.formats,
            ]),
          ])(
            'for funding time time: %s',
            (time: FundingTime, formats: string[]) => {
              it.each(formats)('can parse format: %s', (format) => {
                const formatAsInt = parseInt(format);
                if (!isNaN(formatAsInt)) {
                  const parsedFromInt = mapFundingTime(formatAsInt, source);
                  expect(parsedFromInt).toEqual(time);
                }
                const parsed = mapFundingTime(format, source);
                expect(parsed).toEqual(time);
              });
            }
          );
        }
      );
    });

    describe('updateBirthCertificate', () => {
      const US_CERT = BirthCertificateType.US;
      const US_CERT_ID = '12345678901';
      const US_TOWN = 'town';
      const US_STATE = 'state';
      const UNKNOWN_CERT = BirthCertificateType.Unavailable;
      const NON_US_CERT = BirthCertificateType.NonUS;

      it("add birth certificate info if it doesn't exist", () => {
        const child = {
          birthCertificateType: UNKNOWN_CERT,
          tags: [],
        } as Child;
        const other = {
          birthCertificateType: US_CERT,
          birthCertificateId: US_CERT_ID,
          birthTown: US_TOWN,
          birthState: US_STATE,
        };
        updateBirthCertificate(
          {
            ...child,
            ...other,
          } as EnrollmentReportRow,
          child
        );

        expect(child.birthCertificateId).toBeTruthy();
        expect(child.birthCertificateType).toEqual(US_CERT);
        expect(child.birthState).toEqual(US_STATE);
        expect(child.birthTown).toEqual(US_TOWN);
        expect(child.birthCertificateId).toEqual(US_CERT_ID);
      });
      it('update US birth cert with information that was missing', () => {
        const child = {
          birthCertificateType: US_CERT,
          birthCertificateId: US_CERT_ID,
          birthState: US_STATE,
          tags: [],
        } as Child;
        const other = {
          birthCertificateType: US_CERT,
          birthCertificateId: US_CERT_ID,
          birthTown: US_TOWN,
          birthState: US_STATE,
        };
        updateBirthCertificate(
          {
            ...child,
            ...other,
          } as EnrollmentReportRow,
          child
        );

        expect(child.birthTown).toBeTruthy();
        expect(child.birthTown).toEqual(US_TOWN);
      });
      it("don't update birth cert info if it's already there", () => {
        const child = {
          birthCertificateType: NON_US_CERT,
        } as EnrollmentReportRow;
        const other = {
          birthCertificateType: US_CERT,
          birthCertificateId: US_CERT_ID,
          birthTown: US_TOWN,
          birthState: US_STATE,
          tags: [],
        } as Child;
        updateBirthCertificate(child, other);

        expect(child.birthCertificateId).toBeFalsy();
        expect(child.birthCertificateType).toEqual(NON_US_CERT);
      });
    });

    describe('rowHasNewDetermination', () => {
      const INCOME = 10000;
      const NUMBER_OF_PEOPLE = 3;
      const DETERMINATION_DATE = moment('10/21/2020');
      const NOT_DISCLOSED = true;
      const NEW_INCOME = 20000;
      const NEW_HOUSEHOLD_SIZE = 5;
      const NEW_DETERMINATION_DATE = moment('1/1/2021');
      const NEW_NOT_DISCLOSED = false;

      it('correctly identifies a row with a new income det', () => {
        const determination = {
          income: INCOME,
          numberOfPeople: NUMBER_OF_PEOPLE,
          determinationDate: DETERMINATION_DATE,
        } as IncomeDetermination;
        const other = {
          income: NEW_INCOME,
          numberOfPeople: NEW_HOUSEHOLD_SIZE,
          determinationDate: NEW_DETERMINATION_DATE,
        } as IncomeDetermination;
        const isNewDet = rowHasNewDetermination(other, determination);
        expect(isNewDet).toBeTruthy();
      });
      it('adds an income det to a record with income not disclosed', () => {
        const determination = {
          incomeNotDisclosed: NOT_DISCLOSED,
        } as IncomeDetermination;
        const other = {
          income: NEW_INCOME,
          numberOfPeople: NEW_HOUSEHOLD_SIZE,
          determinationDate: NEW_DETERMINATION_DATE,
          incomeNotDisclosed: NEW_NOT_DISCLOSED,
        } as IncomeDetermination;
        const isNewDet = rowHasNewDetermination(other, determination);
        expect(isNewDet).toBeTruthy();
      });
      it('correctly identifies rows that have no new income information', () => {
        const determination = {
          income: INCOME,
          numberOfPeople: NUMBER_OF_PEOPLE,
          determinationDate: DETERMINATION_DATE,
        } as IncomeDetermination;
        const other = {
          income: INCOME,
          numberOfPeople: NUMBER_OF_PEOPLE,
          determinationDate: DETERMINATION_DATE,
        } as IncomeDetermination;
        const isNewDet = rowHasNewDetermination(other, determination);
        expect(isNewDet).toBeFalsy();
      });
    });
    describe('batch update enrollments', () => {
      const SITE = { siteName: 'site1' } as Site;
      const NEW_SITE = { siteName: 'site2' } as Site;
      const MODEL = CareModel.InPerson;
      const AGE_GROUP = AgeGroup.InfantToddler;
      const ENTRY = moment('10/10/2020');
      const NEW_MODEL = CareModel.Distance;
      const NEW_AGE_GROUP = AgeGroup.Preschool;
      const NEW_ENTRY = moment('12/12/2020');

      describe('rowHasNewEnrollment', () => {
        it('identifies when a row has new enrollment information', () => {
          const enrollment = {
            site: SITE,
            model: MODEL,
            ageGroup: AGE_GROUP,
            entry: ENTRY,
          } as Enrollment;
          const other = {
            site: NEW_SITE,
            model: NEW_MODEL,
            ageGroup: NEW_AGE_GROUP,
            entry: NEW_ENTRY,
          } as Enrollment;
          const matchingEnrollment = getEnrollmentMatch(enrollment, [other]);
          expect(rowHasNewEnrollment(matchingEnrollment)).toBeTruthy();
        });
        it('does nothing if a row has an identical enrollment', () => {
          const enrollment = {
            site: SITE,
            model: MODEL,
            ageGroup: AGE_GROUP,
            entry: ENTRY,
          } as Enrollment;
          const other = {
            site: SITE,
            model: MODEL,
            ageGroup: AGE_GROUP,
            entry: ENTRY,
          } as Enrollment;
          const matchingEnrollment = getEnrollmentMatch(enrollment, [other]);
          expect(rowHasNewEnrollment(matchingEnrollment)).toBeFalsy();
        });
      });
    });

    describe('rowHasNewFunding', () => {
      const FUNDING_SPACE = {
        id: 1,
        source: FundingSource.CDC,
        time: FundingTime.FullTime,
      } as FundingSpace;
      const FIRST_PERIOD = {
        period: moment('10/20/2020'),
      } as ReportingPeriod;
      const NEW_FUNDING_SPACE = {
        id: 2,
        source: FundingSource.CSR,
        time: FundingTime.PartTime,
      } as FundingSpace;
      const NEW_FIRST_PERIOD = {
        period: moment('12/25/2020'),
      } as ReportingPeriod;

      it('creates a new funding if there is new information', () => {
        const funding = {
          fundingSpace: FUNDING_SPACE,
          firstReportingPeriod: FIRST_PERIOD,
        } as Funding;
        const other = {
          fundingSpace: NEW_FUNDING_SPACE,
          firstReportingPeriod: NEW_FIRST_PERIOD,
        } as Funding;
        const matchingFunding = getFundingMatch(funding, [other]);
        expect(rowHasNewFunding(matchingFunding)).toBeTruthy();
      });
      it('does nothing if the funding in a row is the same', () => {
        const funding = {
          fundingSpace: FUNDING_SPACE,
          firstReportingPeriod: FIRST_PERIOD,
        } as Funding;
        const other = {
          fundingSpace: FUNDING_SPACE,
          firstReportingPeriod: FIRST_PERIOD,
        } as Funding;
        const matchingFunding = getFundingMatch(funding, [other]);
        expect(rowHasNewFunding(matchingFunding)).toBeFalsy();
      });
    });
  });
});
