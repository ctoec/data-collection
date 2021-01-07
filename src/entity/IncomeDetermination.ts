import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

import { IncomeDetermination as IncomeDeterminationInterface } from '../../client/src/shared/models';

import { Family } from './Family';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Moment } from 'moment';
import { momentTransformer } from './transformers';
import { IsNotEmpty, ValidateIf } from 'class-validator';

@Entity()
export class IncomeDetermination implements IncomeDeterminationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ValidateIf((det) => !det.incomeNotDisclosed)
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  @ValidateIf((det) => !det.incomeNotDisclosed)
  income?: number;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  @IsNotEmpty()
  @ValidateIf((det) => !det.incomeNotDisclosed)
  determinationDate?: Moment;

  @Column({ nullable: true })
  @IsNotEmpty()
  incomeNotDisclosed?: boolean;

  @ManyToOne((_) => Family, { nullable: false })
  family: Family;

  @Column()
  familyId: number;

  @Column((_) => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;
}
