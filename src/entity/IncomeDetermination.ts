import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { IncomeDetermination as IncomeDeterminationInterface } from '../../client/shared/models';

import { Family } from './Family';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Moment } from 'moment';
import moment from 'moment';
import { momentTransformer } from './transformers/momentTransformer';

@Entity()
export class IncomeDetermination implements IncomeDeterminationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 14, scale: 2 })
  income?: number;

  @Column({ type: 'date', nullable: true, transformer: momentTransformer })
  determinationDate?: Moment;

  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @Column()
  familyId: number;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
