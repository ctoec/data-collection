import {
  Controller,
  Get,
	Path,
	Request,
  Route,
} from "tsoa";
import { User } from "../models/User";
import { UsersService } from "../services/user/UserService";

@Route("users")
export class UsersController extends Controller {

	@Get("current")
	public async getCurrentUser(
		@Request() req: Express.Request
	): Promise<User> {
		const wingedKeysId = req.sub;
		return new UsersService().get(wingedKeysId);
	}
}
