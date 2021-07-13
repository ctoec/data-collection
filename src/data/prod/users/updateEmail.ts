import { Connection, getManager, In } from 'typeorm';
import { ConnectionPool } from 'mssql';
import { User } from '../../../entity';

import { Config, DBConnectionOpts } from '../types';
import { openFawkesDbConnection } from '../utils';
import commandLineArgs from 'command-line-args';

interface BasicWingedKeysUser {
  id: string;
  email: string;
}

interface WingedKeysUsersMap {
  [key: string]: BasicWingedKeysUser;
}

(async function updateEmail() {
  const optionDefns = [
    { name: 'config', type: String }
  ];
  const options = commandLineArgs(optionDefns);

  const configPath: string = options.config;

  if (!configPath || !configPath.startsWith('/')) {
    console.error(
      '--config option is required, and must be absolute path to config file'
    );
    process.exit(1);
  }
  const config: Config = require(configPath);

  try {
    await updateFawkesUsers(config.wingedKeys.db, config.app.db);
    process.exit(0);
  } catch (e) {
    console.error('Failed to update Fawkes user emails', e);
    process.exit(1);
  }
})();

///////////////////////////////////////////////////////////////

async function updateFawkesUsers(
  wingedkeysDbConnectionOpts: DBConnectionOpts,
  fawkesDbConnectionOpts: DBConnectionOpts
) {
  console.log('Starting update of Fawkes user emails...');
  let updatedCount = 0;

  console.log('Retrieving all WingedKeys users...');
  const wkUsersById: WingedKeysUsersMap = await getWingedKeysUsersById(
    wingedkeysDbConnectionOpts
  );

  console.log('Opening Fawkes database connection...');
  const connection: Connection = await openFawkesDbConnection(fawkesDbConnectionOpts);

  let usersToUpdate = await getManager('script').find(User, {
    where: { wingedKeysId: In(Object.keys(wkUsersById)) },
  });

  for (const user of usersToUpdate) {
    try {
      const wingedKeysUser: BasicWingedKeysUser = wkUsersById[user.wingedKeysId];
      if (!wingedKeysUser) {
        throw new Error('This is actually impossible');
      }

      if (!!wingedKeysUser.email && wingedKeysUser.email !== user.email) {
        await getManager('script').save(User, {
          ...user,
          email: wingedKeysUser.email
        });

        console.log(
          `\Updated email for ${user.firstName} ${user.lastName} with app id ${user.id}`
        );
        updatedCount += 1;
      } else {
        console.log(
          `\tUser ${wingedKeysUser.email} already has a fully up-to-date email.`
        );
      }
    } catch (err) {
      console.error(
        `\tError updating user ${user.email}`,
        err
      );
    }
  }

  console.log(`Successfully updated ${updatedCount} users emails!`);
  if (!!connection) {
    await connection.close();
  }
}

async function getWingedKeysUsersById(
  connectionOpts: DBConnectionOpts
): Promise<WingedKeysUsersMap> {
  let pool: ConnectionPool;

  try {
    pool = await new ConnectionPool({
      ...connectionOpts,
      database: 'wingedkeys',
    }).connect();

    const res = await pool.query(`SELECT id, email FROM AspNetUsers`);

    return res.recordset.reduce(
      (acc: WingedKeysUsersMap, user: BasicWingedKeysUser) => {
        acc[user.id] = user;
        return acc;
      },
      {}
    );
  } finally {
    if (!!pool?.close) pool.close();
  }
}
