import { User } from '../../entity';
import { users } from '../../data/users';

export class UserService {
  public get(id: number): User {
    return users.find((user) => user.id === id);
  }

  public getByWingedKeysId(wingedKeysId: string): User {
    return users.find((user) => user.wingedKeysId === wingedKeysId);
  }
}
