import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Family } from './Family';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class IncomeDetermination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 2, scale: 14 })
  income?: number;

  @Column({ nullable: true })
  determinationDate?: Date;

  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
