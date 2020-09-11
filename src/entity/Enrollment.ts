import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import {
  Enrollment as EnrollmentInterface,
  AgeGroup,
} from '../../client/src/shared/models';

import { Child } from './Child';
import { Funding } from './Funding';
import { Site } from './Site';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Moment } from 'moment';
import { momentTransformer } from './transformers/momentTransformer';
import { FundingDoesNotOverlap } from './decorators/fundingOverlapValidation';

@Entity()
export class Enrollment implements EnrollmentInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Child, { nullable: false, onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'uuid' })
  childId: string;

  @ManyToOne(() => Site, { nullable: false })
  site: Site;

  @Column()
  siteId: number;

  @Column({ type: 'simple-enum', enum: AgeGroup, nullable: true })
  @IsNotEmpty()
  ageGroup?: AgeGroup;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  @IsNotEmpty()
  entry?: Moment;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  exit?: Moment;

  @Column({ nullable: true })
  @ValidateIf(c => !!c.exit)
  @IsNotEmpty()
  exitReason?: string;

  @OneToMany(() => Funding, (funding) => funding.enrollment, {
    onDelete: 'CASCADE',
  })
  @ValidateNested({ each: true })
  @FundingDoesNotOverlap()
  fundings?: Array<Funding>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
