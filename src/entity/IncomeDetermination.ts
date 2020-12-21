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
import { IsNotEmpty } from 'class-validator';

@Entity()
export class IncomeDetermination implements IncomeDeterminationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  income?: number;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  @IsNotEmpty()
  determinationDate?: Moment;

  @ManyToOne((_) => Family, { nullable: false })
  family: Family;

  @Column()
  familyId: number;

  @Column((_) => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;
}
