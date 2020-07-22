<<<<<<< HEAD
import { User } from '../../models/user';
import { users } from '../../data/users';

export class UserService {
  public get(id: number): User {
    return users.find((user) => user.id === id);
  }

  public getByWingedKeysId(wingedKeysId: string): User {
    return users.find((user) => user.wingedKeysId === wingedKeysId);
  }
}
=======
import { User } from "../../models/user";
import { users } from "../../data/users";

export class UserService {
	public get(id: number): User {
		return users.find(user => user.id === id);
	}

	public getByWingedKeysId(wingedKeysId: string): User {
		return users.find(user => user.wingedKeysId === wingedKeysId);
	}
}
>>>>>>> Add TSOA, generate spec and client code (PR #68) (Issue #57)
