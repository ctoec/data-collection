import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { EnrollmentReport as EnrollmentReportInterface } from '../../client/src/shared/models';

import { Child } from './Child';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class EnrollmentReport implements EnrollmentReportInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Child)
  @JoinTable()
  children: Child[];

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
