import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { IncomeDetermination as IncomeDeterminationInterface } from '../../shared/models';

import { Family } from './Family';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class IncomeDetermination implements IncomeDeterminationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 14, scale: 2 })
  income?: number;

  @Column({ nullable: true })
  determinationDate?: Date;

  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
