import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  AfterUpdate,
  getManager,
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
import { FundingDoesNotOverlap } from './decorators/Enrollment/fundingOverlapValidation';
import { FundingAgeGroupMatchesEnrollment } from './decorators/Enrollment/fundingAgeGroupValidation';

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
  entry?: Moment;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  exit?: Moment;

  @Column({ nullable: true })
  @ValidateIf((c) => !!c.exit)
  @IsNotEmpty()
  exitReason?: string;

  @OneToMany(() => Funding, (funding) => funding.enrollment, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @ValidateNested({ each: true })
  @FundingDoesNotOverlap()
  @FundingAgeGroupMatchesEnrollment()
  @IsNotEmpty()
  fundings?: Array<Funding>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;

  @AfterUpdate()
  async cascadeDeleteFundings() {
    if (this.deletedDate !== null) {
      await Promise.all(
        this.fundings.map(
          async (f) => await getManager().softRemove(Funding, f)
        )
      );
    }
  }
}
