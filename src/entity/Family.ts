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
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

@Entity()
export class Family implements FamilyInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ValidateIf((f) => !f.homelessness)
  streetAddress?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ValidateIf((f) => !f.homelessness)
  town?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ValidateIf((f) => !f.homelessness)
  state?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ValidateIf((f) => !f.homelessness)
  zipCode?: string;

  @Column({ nullable: true, default: null })
  homelessness?: boolean;

  // TODO: only validate if child is not a foster child
  @OneToMany(() => IncomeDetermination, (det) => det.family)
  @ValidateNested({ each: true })
  incomeDeterminations?: Array<IncomeDetermination>;

  @OneToMany(() => Child, (child) => child.family)
  children?: Array<Child>;

  @ManyToOne(() => Organization, { nullable: false })
  organization?: Organization;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
