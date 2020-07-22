import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

// import { Child } from '../models/child';
import { Organization } from './Organization';
import { IncomeDetermination } from './IncomeDetermination';
import { Child } from './Child';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  addressLine1?: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column({ nullable: true })
  town?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip?: string;

  @Column({ nullable: true })
  homelessness?: boolean;

  @OneToMany((type) => IncomeDetermination, (det) => det.family)
  incomeDeterminations: Array<IncomeDetermination>;

  @OneToMany((type) => Child, (child) => child.family)
  children: Array<Child>;

  @ManyToOne((type) => Organization)
  organization: Organization;
}
