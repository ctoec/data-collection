import { EnrollmentReportRow } from '../../../template';
import { Organization, Site, Enrollment, User } from '../../../entity';
import { BadRequestError } from '../../../middleware/error/errors';
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
import moment from 'moment';
import { EntityManager } from 'typeorm';
import {
  getRaceIndicated,
  lookUpOrganization,
  lookUpSite,
  mapEnum,
  mapFunding,
  mapFundingTime,
  MISSING_PROVIDER_ERROR,
} from './mapUtils';

describe('controllers', () => {
  describe('enrollmentReports', () => {
    describe('lookUpOrganization', () => {
      it('returns the organization if only one organization', () => {
        const inputOrg = { id: 1 } as Organization;
        const org = lookUpOrganization({} as EnrollmentReportRow, [inputOrg]);
        expect(org).toEqual(inputOrg);
      });
      it('throws an error if the source row does not have a provider name', () => {
        expect(() => lookUpOrganization({} as EnrollmentReportRow, [])).toThrow(
          new BadRequestError(MISSING_PROVIDER_ERROR)
        );
      });
      it.each([
        ['org1', 'org1'],
        ['org1000', undefined],
      ])(
        'returns the organization from the list that matches source provider name',
        (sourceProviderName, resultOrgName) => {
          const inputOrgs = [
            { providerName: 'org1' },
            { providerName: 'org2' },
          ] as Organization[];
          const source = {
            providerName: sourceProviderName,
          } as EnrollmentReportRow;

          const org = lookUpOrganization(source, inputOrgs);
          expect(org?.providerName).toEqual(resultOrgName);
        }
      );
    });

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
  });
});
