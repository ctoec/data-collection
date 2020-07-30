import { Controller, Get, Request, Route, Security } from 'tsoa';
import { User } from '../../entity';
import { UserService } from '../../services/user/UserService';

@Route('users')
export class UserController extends Controller {
  @Security('jwt')
  @Get('current')
  public async getCurrentUser(@Request() req: Express.Request): Promise<User> {
    return new UserService().get(req.user.id);
  }
}
