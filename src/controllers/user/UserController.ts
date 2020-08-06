import { User } from '../../entity';
import { getManager } from 'typeorm';

export class UserController {
  public async getCurrentUser(req: Express.Request): Promise<User> {
    return getManager().findOne(User, req.user.id);
  }
}
