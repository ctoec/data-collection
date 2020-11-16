import { getConnectionOptions, getConnectionManager } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import commandLineArgs from 'command-line-args';
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
import {
  createUserData,
  DBConnectionOpts,
  SiteConnectionOpts,
} from './users/create';
import { createReportingPeriodData } from './reportingPeriods';

const optionDefns = [{ name: 'config', type: String }];
const options = commandLineArgs(optionDefns);

type Config = {
  app: {
    db: {
      user: string;
      password: string;
      server: string;
      port: number;
    };
  };

  wingedKeys: {
    db: {
      user: string;
      password: string;
      server: string;
      port: number;
    };
    site: {
      url: string;
      user: string;
      password: string;
    };
    passwordFile?: string;
  };

  orgFile: string;
  siteFile: string;
  userFile: string;
  reportingPeriodFile: string;
};

const configPath = options.config as string;
if (!configPath || !configPath.startsWith('/')) {
  console.error(
    '--config option is required, and must be absolute path to config file'
  );
  process.exit(1);
}
const config: Config = require(configPath);

const {
  orgFile,
  siteFile,
  userFile,
  reportingPeriodFile,
  wingedKeys: { passwordFile },
} = config;

if (!orgFile && !siteFile && !userFile && !reportingPeriodFile) {
  console.error('At least one file option must be supplied');
  process.exit(1);
}

let wingedKeysDBConnOpts: DBConnectionOpts;
let wingedKeysSiteConnOpts: SiteConnectionOpts;

if (userFile) {
  wingedKeysDBConnOpts = config.wingedKeys.db;
  wingedKeysSiteConnOpts = config.wingedKeys.site;

  if (
    !wingedKeysDBConnOpts ||
    !Object.keys(wingedKeysDBConnOpts).length ||
    Object.values(wingedKeysDBConnOpts).some((val) => !val)
  ) {
    console.error('All wingedkeys db config values are required');
    process.exit(1);
  }

  if (
    !wingedKeysSiteConnOpts ||
    !Object.keys(wingedKeysSiteConnOpts).length ||
    Object.values(wingedKeysSiteConnOpts).some((val) => !val)
  ) {
    console.error('All wingedkeys site config values are required');
    process.exit(1);
  }
}

const appDBConnOpts = config.app.db;
create();

async function create() {
  try {
    const connectionOptions = (await getConnectionOptions()) as SqlServerConnectionOptions;
    const connection = getConnectionManager().create({
      ...connectionOptions,
      host: appDBConnOpts.server || connectionOptions.host,
      port: appDBConnOpts.port || connectionOptions.port,
      username: appDBConnOpts.user || connectionOptions.username,
      password: appDBConnOpts.password || connectionOptions.password,
      database: 'ece',
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

    if (reportingPeriodFile) {
      const rawReportingPeriods = read(reportingPeriodFile);
      await createReportingPeriodData(rawReportingPeriods);
    }

    if (orgFile) {
      const rawOrgs = read(orgFile);
      await createOrganizationData(rawOrgs);
    }

    if (siteFile) {
      const rawSites = read(siteFile);
      await createSiteData(rawSites);
    }

    if (userFile && wingedKeysSiteConnOpts && wingedKeysDBConnOpts) {
      const rawUsers = read(userFile);
      await createUserData(
        rawUsers,
        wingedKeysSiteConnOpts,
        wingedKeysDBConnOpts,
        passwordFile
      );
    }

    await connection.close();
    process.exit();
  } catch (err) {
    console.error('Failed to create data', err);
    process.exit(1);
  }
}
