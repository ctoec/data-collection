import { ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from '../User';
import { momentTransformer } from '../transformers';

export class UpdateMetaData {
  @UpdateDateColumn({ transformer: momentTransformer })
  updatedAt: Date;

  @ManyToOne((type) => User, { nullable: true, eager: true })
  author?: User;
}
