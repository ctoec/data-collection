import { WorkSheet } from 'xlsx';
import { getManager } from 'typeorm';
import { Site, Organization, OECReport, User } from '../../entity';
import { Region } from '../../../client/src/shared/models';
import { parse } from './utils';

class ExportedOrgRow {
  orgName: string = '';
  hasSubmitted: boolean = false;
  hasLoggedIn: boolean = false;
  contact: string = '';
  sitesAndEnrollments: string[] = [];
}

const EXPORTED_ORG_ROW_PROPS = Object.keys(new ExportedOrgRow());

export const createSubmittedView = async () => {
  const allOrgs = await getManager().find(Organization);
  allOrgs.forEach(async (org) => {
    const report = await getManager().findOne(OECReport, {
      where: { organizationId: org.id },
    });
    const orgIsSubmitted = !(report === null || report === undefined);
    const allUsers = await getManager()
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.orgPermissions', 'orgPerm')
      .where(':orgId IN user__orgPermissions', { orgId: org.id })
      .getMany();
    const someoneLoggedIn = allUsers.some(
      (u) => u.confidentialityAgreedDate !== null
    );
  });
};
