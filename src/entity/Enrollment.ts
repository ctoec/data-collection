import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  Enrollment as EnrollmentInterface,
  AgeGroup,
} from '../../shared/models';

import { Child } from './Child';
import { Funding } from './Funding';
import { Site } from './Site';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class Enrollment implements EnrollmentInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Child, { nullable: false })
  child: Child;

  @Column({ type: 'uuid' })
  childId: string;

  @ManyToOne(() => Site, { nullable: false })
  site: Site;

  @Column()
  siteId: number;

  @Column({ type: 'enum', enum: AgeGroup, nullable: true })
  ageGroup?: AgeGroup;

  @Column({ type: 'date', nullable: true })
  entry?: Date;

  @Column({ type: 'date', nullable: true })
  exit?: Date;

  @Column({ nullable: true })
  exitReason?: string;

  @OneToMany(() => Funding, (funding) => funding.enrollment)
  fundings?: Array<Funding>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
