import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Family as FamilyInterface } from '../../client/src/shared/models';

import { Organization } from './Organization';
import { IncomeDetermination } from './IncomeDetermination';
import { Child } from './Child';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { IsNotEmpty, ValidateNested } from 'class-validator';

@Entity()
export class Family implements FamilyInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  streetAddress?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  town?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  state?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  zipCode?: string;

  @Column({ nullable: true, default: undefined })
  homelessness?: boolean;

  @OneToMany((type) => IncomeDetermination, (det) => det.family)
  @ValidateNested({ each: true })
  incomeDeterminations?: Array<IncomeDetermination>;

  @OneToMany((type) => Child, (child) => child.family)
  children?: Array<Child>;

  @ManyToOne((type) => Organization, { nullable: false })
  organization?: Organization;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
