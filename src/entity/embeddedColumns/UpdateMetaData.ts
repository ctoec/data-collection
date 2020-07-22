import { Column, ManyToOne } from 'typeorm';
import { User } from '../User';

export class UpdateMetaData {
  @Column()
  updatedAt: Date;

  @ManyToOne((type) => User)
  author: User;
}
