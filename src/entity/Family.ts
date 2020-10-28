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
import {
  ArrayMinSize,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

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

  @OneToMany(() => IncomeDetermination, (det) => det.family)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ValidateIf((family) => {
    // This value is set in child validation of family
    const childIsFoster = family.childIsFoster;
    delete family.childIsFoster;
    return !childIsFoster;
  })
  incomeDeterminations?: Array<IncomeDetermination>;

  @OneToMany(() => Child, (child) => child.family)
  children?: Array<Child>;

  @ManyToOne(() => Organization, { nullable: false })
  organization?: Organization;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
