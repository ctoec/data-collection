import { User } from "../../models/User";
import { users } from "../../data/users";

export class UsersService {
	public get(wingedKeysId: string): User {
		return users.find(user => user.wingedKeysId === wingedKeysId);
	}
}