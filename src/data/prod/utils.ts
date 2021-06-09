import { Organization, Site, Enrollment, Funding, FundingSpace, Child, Family, IncomeDetermination, FundingTimeSplit, Community, OrganizationPermission, SitePermission, User, CommunityPermission, ReportingPeriod } from '../../../src/entity';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { WorkSheet, utils, readFile } from 'xlsx';
import { DBConnectionOpts } from './types';

export function read(filename: string) {
  return Object.values(readFile(filename).Sheets)[0];
}

export function parse<T>(sheetData: WorkSheet, header: string[]) {
  return utils.sheet_to_json<T>(sheetData, {
    range: 1,
    raw: false,
    header,
  });
}

export async function openFawkesDbConnection(opts: DBConnectionOpts): Promise<Connection> {
  const defaultOpts: SqlServerConnectionOptions = await getConnectionOptions() as SqlServerConnectionOptions;

  return createConnection({
    ...defaultOpts,
    host: opts.server || defaultOpts.host,
    port: opts.port || defaultOpts.port,
    username: opts.user || defaultOpts.username,
    password: opts.password || defaultOpts.password,
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
}