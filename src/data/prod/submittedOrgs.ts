import { WorkSheet, writeFile, utils } from 'xlsx';
import { getManager } from 'typeorm';
import { Site, Organization, OECReport, User, Enrollment } from '../../entity';

class ExportedOrgRow {
  orgName: string = '';
  hasSubmitted: string = '';
  hasLoggedIn: string = '';
  contact: string = '';
  sitesAndEnrollments: string[] = [];
}

const EXPORTED_ORG_ROW_PROPS = Object.keys(new ExportedOrgRow());

export const createSubmittedView = async () => {
  const allOrgs = await getManager().find(Organization);
  let orgExport: string[][] = [];
  for (const org of allOrgs) {
    // Determine which orgs submitted data
    const report = await getManager().findOne(OECReport, {
      where: { organizationId: org.id },
    });
    const orgIsSubmitted = !(report === null || report === undefined);

    // For orgs that haven't, find out if they've at least logged in
    let userLoggedIn = true;
    if (!orgIsSubmitted) {
      const allUsers = await getManager()
        .createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.orgPermissions', 'orgPerm')
        .where(':orgId IN user__orgPermissions', { orgId: org.id })
        .getMany();
      userLoggedIn = allUsers.some((u) => u.confidentialityAgreedDate !== null);
    }
    const someoneLoggedIn = userLoggedIn ? 'Yes' : 'No';

    // Now for each submitted org, collect the enrollments they have
    // at each of their affiliated sites
    let enrollmentsAtSites;
    if (orgIsSubmitted) {
      const allSites = await getManager().find(Site, {
        where: { organizationId: org.id },
      });
      enrollmentsAtSites = allSites.map(async (s) => {
        const numEnrollments = (
          await getManager().findAndCount(Enrollment, {
            where: { siteId: s.id },
          })
        )[1];
        return s.siteName + ': ' + numEnrollments;
      });
    }

    // Now built the structure that holds everything so we can write
    // TODO: What should we put in the contact field?
    const orgRow: string[] = [
      org.providerName,
      orgIsSubmitted ? 'Yes' : 'No',
      orgIsSubmitted ? 'Yes' : someoneLoggedIn,
      '',
      orgIsSubmitted ? enrollmentsAtSites : [],
    ];
    orgExport.push(orgRow);
  }
  return orgExport;
};

export function generateExcelWorkbook(rows?: string[][]) {
  const sheet: WorkSheet = utils.aoa_to_sheet([EXPORTED_ORG_ROW_PROPS]);
  if (rows) {
    utils.sheet_add_aoa(sheet, rows, { origin: -1 });
  }
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);
  writeFile(workbook, 'SubmittedOrgView.xlsx');
}
