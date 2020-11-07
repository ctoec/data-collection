import { getConnectionOptions, getConnectionManager } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import commandLineArgs from 'command-line-args';
import readline from 'readline';
import {
  Organization,
  FundingSpace,
  Site,
  Enrollment,
  Funding,
  Family,
  Child,
  IncomeDetermination,
  FundingTimeSplit,
  Community,
  OrganizationPermission,
  SitePermission,
  User,
  CommunityPermission,
  ReportingPeriod,
} from '../../entity';
import { read } from './utils';
import { createOrganizationData } from './organizations';
import { createSiteData } from './sites';
import { createUserData } from './users';
import { createReportingPeriodData } from './reportingPeriods';

const optionDefns = [
  { name: 'dbhost', type: String },
  { name: 'dbuser', type: String },
  { name: 'dbpassword', type: String },
  { name: 'dbport', type: Number },
  { name: 'orgfile', type: String },
  { name: 'sitefile', type: String },
  { name: 'userfile', type: String },
  { name: 'reportingperiodfile', type: String },
];
const options = commandLineArgs(optionDefns);

const {
  dbhost,
  dbuser,
  dbpassword,
  dbport,
  orgfile,
  sitefile,
  userfile,
  reportingperiodfile,
} = options;

if (!orgfile && !sitefile && !userfile && !reportingperiodfile) {
  console.error('At least one file option must be supplied');
  process.exit(1);
}

(async () => {
  if (userfile) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer: string = await new Promise((resolve) =>
      rl.question(
        'Did you already create users in winged-keys in target env and add their UUIDs to user data? [Y/N]\n',
        resolve
      )
    );

    switch (answer.toLowerCase()) {
      case 'y':
        break;
      case 'n':
      default:
        console.error(
          'User data cannot be created without first creating users in winged-keys, and pulling their ids'
        );
        process.exit(1);
    }
  }

  try {
    const connectionOptions = (await getConnectionOptions()) as SqlServerConnectionOptions;
    const connection = getConnectionManager().create({
      ...connectionOptions,
      host: dbhost || connectionOptions.host,
      port: dbport || connectionOptions.port,
      username: dbuser || connectionOptions.username,
      password: dbpassword || connectionOptions.password,
      name: 'script',
      logging: false,
      migrationsRun: false,
      synchronize: false,
      entities: [
        Organization,
        Site,
        Enrollment,
        Funding,
        FundingSpace,
        Child,
        Family,
        IncomeDetermination,
        FundingTimeSplit,
        Community,
        OrganizationPermission,
        SitePermission,
        User,
        CommunityPermission,
        ReportingPeriod,
      ],
    });
    await connection.connect();

    if (orgfile) {
      const rawOrgs = read(orgfile);
      await createOrganizationData(rawOrgs);
    }

    if (sitefile) {
      const rawSites = read(sitefile);
      await createSiteData(rawSites);
    }

    if (userfile) {
      const rawUsers = read(userfile);
      await createUserData(rawUsers);
    }

    if (reportingperiodfile) {
      const rawReportingPeriods = read(reportingperiodfile);
      await createReportingPeriodData(rawReportingPeriods);
    }

    await connection.close();
    process.exit();
  } catch (err) {
    console.error('Failed to create data', err);
    process.exit(1);
  }
})();
