import {
  Child,
  Enrollment,
  FundingSpace,
  Organization,
  ReportingPeriod,
  Site,
  User,
} from '../../../entity';
import { EnrollmentReportRow } from '../../../template';
import { Brackets, EntityManager, In } from 'typeorm';
import { ApiError, BadRequestError } from '../../../middleware/error/errors';
import { getChildById } from '../../children';
import {
  BirthCertificateType,
  ChangeTag,
  ExitReason,
  FakeChildrenTypes,
} from '../../../../client/src/shared/models';
import {
  getExitReason,
  lookUpSite,
  mapChild,
  mapEnrollment,
  mapEnum,
  mapFamily,
  mapFunding,
  mapIncomeDetermination,
  reportingPeriodIncludesDate,
  rowEndsCurrentFunding,
  rowHasExitForCurrentEnrollment,
  rowHasNewAddress,
  rowHasNewDetermination,
  rowHasNewEnrollment,
  rowHasNewFunding,
} from '../map/mapUtils';
import { getLastIncomeDetermination } from '../../../utils/getLastIncomeDetermination';
import { getReadAccessibleOrgIds } from '../../../utils/getReadAccessibleOrgIds';
import { validate } from 'class-validator';

export const MISSING_PROVIDER_ERROR =
  'You uploaded a file with missing information.\nProvider name is required for every record in your upload. Make sure this column is not empty.';

export class MapController {
  private transaction: EntityManager;
  private user: User; // this shouldn't actually be necessary for but for now, need it to use getChildById
  private organizations: Organization[];
  private sites: Site[];
  private fundingSpaces: FundingSpace[];
  private reportingPeriods: ReportingPeriod[];

  private children: Child[];

  async initialize(transaction: EntityManager, user: User) {
    this.transaction = transaction;
    this.user = user;

    const readAccessibleOrgIds = await getReadAccessibleOrgIds(this.user);
    const [
      organizations,
      sites,
      fundingSpaces,
      reportingPeriods,
    ] = await Promise.all([
      this.transaction.findByIds(Organization, readAccessibleOrgIds),
      this.transaction.findByIds(Site, this.user.siteIds),
      this.transaction.find(FundingSpace, {
        where: { organizationId: In(readAccessibleOrgIds) },
      }),
      this.transaction.find(ReportingPeriod),
    ]);

    this.organizations = organizations;
    this.sites = sites;
    this.fundingSpaces = fundingSpaces;
    this.reportingPeriods = reportingPeriods;
    this.children = [];
  }

  /**
   * Maps parsed EnrollmentReportRows into DB entity model
   * graphs, with Child as the root node, and caugmented with
   * lass-validator validations
   */
  async mapRows(rows: EnrollmentReportRow[]) {
    for (const row of rows) {
      await this.mapRow(row);
    }

    return Promise.all(
      this.children.map(async (child) => ({
        ...child,
        validationErrors: await validate(child, {
          validationError: { target: false, value: false },
        }),
      }))
    );
  }

  private async mapRow(row: EnrollmentReportRow) {
    try {
      const organization = this.lookUpOrganization(row);
      const match = await this.getChildMatch(row, organization);

      if (match) {
        this.updateRecord(row, match);
      } else {
        this.createRecord(row, organization);
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error occured while parsing row: ', err);
    }
  }

  private updateRecord(row: EnrollmentReportRow, match: Child) {
    // birth cert
    this.updateBirthCertificateInfo(row, match);
    // family address
    this.updateFamilyAddress(row, match);
    // income determination
    this.updateIncomeDetermination(row, match);
    // enrollment
    this.updateEnrollmentFunding(row, match);
  }

  private updateBirthCertificateInfo(row: EnrollmentReportRow, match: Child) {
    if (
      !row.birthCertificateType ||
      row.birthCertificateType === BirthCertificateType.Unavailable
    )
      return;

    match.birthCertificateType = mapEnum(
      BirthCertificateType,
      row.birthCertificateType
    );
    match.birthCertificateId =
      row.birthCertificateId ?? match.birthCertificateId;
    match.birthTown = row.birthTown ?? match.birthTown;
    match.birthState = row.birthState ?? match.birthState;

    match.tags.push(ChangeTag.Edited);
  }

  private updateFamilyAddress(row: EnrollmentReportRow, match: Child) {
    if (rowHasNewAddress(row, match.family)) {
      match.family.streetAddress = row.streetAddress;
      match.family.town = row.town;
      match.family.state = row.state;
      match.family.zipCode = row.zipCode;

      match.tags.push(ChangeTag.Edited);
    }
  }

  private updateIncomeDetermination(row: EnrollmentReportRow, match: Child) {
    const currentDetermination = getLastIncomeDetermination(match.family);
    const newDetermination = mapIncomeDetermination(row, match.family);

    if (rowHasNewDetermination(newDetermination, currentDetermination)) {
      match.family.incomeDeterminations.push(newDetermination);
      match.tags.push(ChangeTag.IncomeDet);
    }
  }

  private updateEnrollmentFunding(row: EnrollmentReportRow, match: Child) {
    const currentEnrollment = match.enrollments?.find((e) => !e.exit);
    const site = lookUpSite(row, match.organization.id, this.sites);
    const newEnrollment = mapEnrollment(row, site, match);

    const currentFunding = currentEnrollment?.fundings?.find(
      (f) => !f.lastReportingPeriod
    );
    const newFunding = mapFunding(
      row,
      match.organization,
      newEnrollment.ageGroup,
      this.fundingSpaces,
      this.reportingPeriods
    );

    if (rowHasNewEnrollment(row, newEnrollment, currentEnrollment)) {
      newEnrollment.fundings = [newFunding];
      if (match.enrollments) match.enrollments.push(newEnrollment);
      else match.enrollments = [newEnrollment];

      if (currentEnrollment && !currentEnrollment.exit) {
        currentEnrollment.exit = newEnrollment.entry.clone().add(-1, 'day');
        currentEnrollment.exitReason = getExitReason(
          currentEnrollment,
          newEnrollment
        );
      }
      match.tags.push(
        currentEnrollment?.exitReason === ExitReason.AgedOut
          ? ChangeTag.AgedUp
          : ChangeTag.ChangedEnrollment
      );

      return;
    }

    if (rowHasExitForCurrentEnrollment(newEnrollment, currentEnrollment)) {
      currentEnrollment.exit = newEnrollment.exit;
      currentEnrollment.exitReason = newEnrollment.exitReason;
      if (currentFunding) {
        currentFunding.lastReportingPeriod = this.reportingPeriods.find(
          (rp) =>
            rp.type === currentFunding.fundingSpace.source &&
            reportingPeriodIncludesDate(rp, row.lastReportingPeriod)
        );
      }

      match.tags.push(ChangeTag.WithdrawnRecord);
      return;
    }

    if (rowHasNewFunding(newFunding, currentFunding)) {
      currentEnrollment.fundings.push(newFunding);
      if (currentFunding) {
        currentFunding.lastReportingPeriod = this.reportingPeriods.find(
          (rp) =>
            rp.type === newFunding.fundingSpace.source &&
            rp.period ===
              newFunding.firstReportingPeriod.period.add(-1, 'month')
        );
      }
      match.tags.push(ChangeTag.ChangedFunding);
      return;
    }

    if (rowEndsCurrentFunding(newFunding, currentFunding)) {
      currentFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
      match.tags.push(ChangeTag.ChangedFunding);
    }
  }

  private createRecord(row: EnrollmentReportRow, organization: Organization) {
    const family = mapFamily(row, organization);
    const incomeDetermination = mapIncomeDetermination(row, family);
    family.incomeDeterminations = [incomeDetermination];

    const child = mapChild(row, organization, family);
    child.family = family;

    const site = lookUpSite(row, organization.id, this.sites);
    const enrollment = mapEnrollment(row, site, child);
    const funding = mapFunding(
      row,
      organization,
      enrollment.ageGroup,
      this.fundingSpaces,
      this.reportingPeriods
    );

    enrollment.fundings = [funding];
    child.enrollments = [enrollment];

    this.children.push({ ...child, tags: [ChangeTag.NewRecord] });
  }

  private lookUpOrganization = (source: EnrollmentReportRow) => {
    if (this.organizations?.length === 1) return this.organizations[0];

    if (!source.providerName) throw new BadRequestError(MISSING_PROVIDER_ERROR);

    const organization = this.organizations.find(
      (organization) =>
        organization.providerName.toLowerCase() ===
        source.providerName.trim().toLowerCase()
    );

    if (!organization) {
      const organizationNames = this.organizations.map((o) => o.providerName);
      throw new BadRequestError(
        `You entered invalid provider names\nCheck that your spreadsheet provider column only contains ${organizationNames
          .slice(0, 1)
          .join(', ')} or ${organizationNames.slice(
          -1
        )} before uploading again.`
      );
    }

    return organization;
  };

  private async getChildMatch(
    row: EnrollmentReportRow,
    organization: Organization
  ) {
    const cacheMatch = this.getChildMatchFromCache(row, organization);
    if (cacheMatch) return cacheMatch;

    const dbMatch = await this.getChildMatchFromDB(row, organization);
    if (dbMatch) {
      const child = await getChildById(dbMatch.id, this.user);
      const childWithTags = { ...child, tags: [] };
      this.children.push(childWithTags);
      return childWithTags;
    }
  }

  private async getChildMatchFromDB(
    row: EnrollmentReportRow,
    organization: Organization
  ) {
    const dbMatchQuery = this.transaction
      .createQueryBuilder(Child, 'child')
      .where('organizationId = :organizationId', {
        organizationId: organization.id,
      })
      .andWhere('firstname = :firstname', { firstname: row.firstName })
      .andWhere('lastname = :lastmane', { lastname: row.lastName })
      .andWhere('birthdate = :birthdate', {
        birthdate: row.birthdate?.format('YYYY-MM-DD'),
      });

    if (row.sasidUniqueId) {
      dbMatchQuery.andWhere(
        new Brackets((qb) =>
          qb
            .where('sasid = :sasidUniqueId', {
              sasidUniqueId: row.sasidUniqueId,
            })
            .orWhere('uniqueId = :sasidUniqueId', {
              sasidUniqueId: row.sasidUniqueId,
            })
        )
      );
    }

    return dbMatchQuery.getOne();
  }

  private async getChildMatchFromCache(
    row: EnrollmentReportRow,
    organization: Organization
  ) {
    return this.children.find(
      (child) =>
        row.firstName === child.firstName &&
        row.lastName === child.lastName &&
        organization.id === child.organizationId &&
        row.birthdate.toISOString() === child.birthdate.toISOString() &&
        (row.sasidUniqueId
          ? row.sasidUniqueId === child.sasid ||
            row.sasidUniqueId === child.uniqueId
          : true)
    );
  }
}
