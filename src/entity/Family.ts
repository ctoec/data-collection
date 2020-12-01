import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  AfterUpdate,
  getManager,
} from 'typeorm';

import { Family as FamilyInterface, UndefinableBoolean } from '../../client/src/shared/models';

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
import { enumTransformer } from './transformers';

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

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  homelessness?: UndefinableBoolean;

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

  @DeleteDateColumn()
  deletedDate: Date;

  @AfterUpdate()
  async cascadeDeleteDets() {
    if (this.deletedDate !== null) {
      await Promise.all(
        this.incomeDeterminations.map(
          async (d) => await getManager().softRemove(IncomeDetermination, d)
        )
      );
    }
  }
}
