import { getManager } from 'typeorm';
import { User } from '../entity';

export class UserController {
  getCurrent(id: number) {
    return getManager().findOne(User, id);
  }
}
