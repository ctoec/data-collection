import {
  Controller,
  Get,
	Request,
  Route,
	Security,
} from "tsoa";
import { User } from "../../models/user";
import { UserService } from "../../services/user/UserService";

@Route("users")
export class UserController extends Controller {

	@Security("jwt")
	@Get("current")
	public async getCurrentUser(
		@Request() req: Express.Request
	): Promise<User> {
		console.log(req);
		return new UserService().get(req.user.id);
	}
}
