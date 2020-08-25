import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Family as FamilyInterface } from '../../client/shared/models';

import { Organization } from './Organization';
import { IncomeDetermination } from './IncomeDetermination';
import { Child } from './Child';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class Family implements FamilyInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  streetAddress?: string;

  @Column({ nullable: true })
  town?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip?: string;

  @Column({ nullable: true })
  homelessness?: boolean;

  @OneToMany((type) => IncomeDetermination, (det) => det.family)
  incomeDeterminations?: Array<IncomeDetermination>;

  @OneToMany((type) => Child, (child) => child.family)
  children?: Array<Child>;

  @ManyToOne((type) => Organization, { nullable: false })
  organization?: Organization;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
