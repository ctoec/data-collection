import { getManager, In } from 'typeorm';
import { ConnectionPool } from 'mssql';
import { User } from '../../../entity';

import { DBConnectionOpts } from './config';

interface BasicWingedKeysUser {
  id: string;
  userName: string;
  email: string;
}

interface WingedKeysUsersMap {
  [key: string]: BasicWingedKeysUser;
}

export async function updateFawkesUsers(
  wingedkeysDbConnectionOpts: DBConnectionOpts
) {
  let updatedCount = 0;

  const wkUsersById: WingedKeysUsersMap = await getWingedKeysUsersById(
    wingedkeysDbConnectionOpts
  );

  let usersToUpdate = await getManager('script').find(User, {
    where: { wingedKeysId: In(Object.keys(wkUsersById)) },
  });

  for (const user of usersToUpdate) {
    try {
      const wingedKeysUser: BasicWingedKeysUser = wkUsersById[user.id];
      if (!wingedKeysUser) {
        throw new Error('This is actually impossible');
      }

      const [firstName, lastName] = wingedKeysUser.userName.split(' ');

      let updatedUser: Partial<User> = {};

      if (!!firstName && firstName !== user.firstName)
        updatedUser.firstName = firstName;
      if (!!lastName && lastName !== user.lastName)
        updatedUser.lastName = lastName;
      if (!!wingedKeysUser.email && wingedKeysUser.email !== user.email)
        updatedUser.email = wingedKeysUser.email;

      if (!!Object.keys(updatedUser).length) {
        await getManager('script').save(User, {
          ...updatedUser,
          wingedKeysId: wingedKeysUser.id,
        });

        console.log(
          `\Updated user for ${user.firstName} ${user.lastName} with app id ${user.id}`
        );
        updatedCount += 1;
      } else {
        console.log(
          `\tUser ${wingedKeysUser.userName} is already fully up-to-date.`
        );
      }
    } catch (err) {
      console.error(
        `\tError updating user ${user.firstName} ${user.lastName}`,
        err
      );
    }
  }

  console.log(`Successfully updated ${updatedCount} users!`);
}

//////////////////////////////////////////////////////////////////////

async function getWingedKeysUsersById(
  connectionOpts: DBConnectionOpts
): Promise<WingedKeysUsersMap> {
  let pool: ConnectionPool;

  try {
    pool = await new ConnectionPool({
      ...connectionOpts,
      database: 'wingedkeys',
    }).connect();

    const res = await pool.query(`SELECT id, email, username FROM AspNetUsers`);

    return res.recordset.reduce(
      (acc: WingedKeysUsersMap, user: BasicWingedKeysUser) => {
        acc[user.id] = user;
        return acc;
      },
      {}
    );
  } catch (err) {
    console.error('Error fetching users from wingedkeys', err);
  } finally {
    if (!!pool.close) pool.close();
  }
}
