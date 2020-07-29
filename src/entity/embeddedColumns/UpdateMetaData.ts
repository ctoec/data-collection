import { ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from '../User';

export class UpdateMetaData {
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, { nullable: true, eager: true })
  author?: User;
}
