import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AgeGroup } from './enums/AgeGroup';
import { Child } from './Child';
import { Funding } from './Funding';
import { Site } from './Site';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Child)
  child: Child;

  @ManyToOne((type) => Site)
  site: Site;

  @Column({ type: 'enum', enum: AgeGroup, nullable: true })
  ageGroup?: AgeGroup;

  @Column({ type: 'date', nullable: true })
  entry?: Date;

  @Column({ type: 'date', nullable: true })
  exit?: Date;

  @Column({ nullable: true })
  exitReason?: string;

  @OneToMany((type) => Funding, (funding) => funding.enrollment)
  fundings: Array<Funding>;
}
