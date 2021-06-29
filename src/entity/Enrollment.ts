import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import {
  Enrollment as EnrollmentInterface,
  AgeGroup,
  CareModel,
} from '../../client/src/shared/models';

import { Child } from './Child';
import { Funding } from './Funding';
import { Site } from './Site';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Moment } from 'moment';
import { momentTransformer, enumTransformer } from './transformers';
import { FundingAgeGroupMatchesEnrollment } from './decorators/Enrollment/fundingsAgeGroupMatchesEnrollment';
import { ExitDateAfterEntry } from './decorators/Enrollment/exitDateAfterEntry';
import { MomentComparison } from './decorators/momentValidators';
import moment from 'moment';
import { FundingsDoNotOverlap } from './decorators/Enrollment/fundingsDoNotOverlap';

@Entity()
export class Enrollment implements EnrollmentInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Child, { nullable: false, onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'uuid' })
  childId: string;

  @ManyToOne(() => Site, { nullable: true })
  @IsNotEmpty()
  site?: Site;

  @Column({ nullable: true })
  siteId?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(CareModel),
  })
  @IsNotEmpty()
  model?: CareModel;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(AgeGroup),
  })
  @IsNotEmpty()
  ageGroup?: AgeGroup;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  @IsNotEmpty()
  @MomentComparison({
    compareFunc: (entry: Moment) => entry.isBefore(moment()),
    message: 'Entry cannot be in the future.',
  })
  entry?: Moment;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  @ValidateIf((c) => !!c.entry)
  @ExitDateAfterEntry()
  exit?: Moment;

  @Column({ nullable: true })
  @ValidateIf((c) => !!c.exit)
  @IsNotEmpty()
  exitReason?: string;

  @OneToMany(() => Funding, (funding) => funding.enrollment, {
    // We need to cascade updates so that if a user adds an enrollment in the create flow with a funding,
    // saves with errors, and needs to correct those errors, they can re-save and have the funding update too
    // but NOTE: this cascade does not work for creating the relations, since enrollment has an auto-incrementing PK
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  @ValidateNested({ each: true, context: {} })
  @FundingAgeGroupMatchesEnrollment()
	@FundingsDoNotOverlap()
  fundings?: Array<Funding>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;
}
