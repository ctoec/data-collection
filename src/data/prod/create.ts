import { Connection } from 'typeorm';
import commandLineArgs from 'command-line-args';
import { read, parse, openFawkesDbConnection } from './utils';
import { createOrganizationData } from './organizations';
import { createSiteData } from './sites';
import {
  createUserData,
  USER_ROW_PROPS,
  UserRow,
} from './users/create';
import { invite } from './invite';
import { Config, DBConnectionOpts, SiteConnectionOpts } from './types';

const optionDefns = [
  { name: 'config', type: String },
  { name: 'invite', type: Boolean },
];
const options = commandLineArgs(optionDefns);

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
  wingedKeys: { passwordFile },
} = config;

if (!orgFile && !siteFile && !userFile) {
  console.error('At least one file option must be supplied');
  process.exit(1);
}

const doInvite = options.invite as boolean;
if (doInvite && !userFile) {
  console.error(
    'If --invite flag is passed, userFile must be supplied in config'
  );
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
if (doInvite) {
  const userRows = parse<UserRow>(read(userFile), USER_ROW_PROPS);
  invite(userRows, wingedKeysSiteConnOpts);
} else {
  create();
}

async function create() {
  try {
    const connection: Connection = await openFawkesDbConnection(appDBConnOpts);

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
