import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Family } from './Family';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class IncomeDetermination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numberOfPeople?: number;

  @Column({ nullable: true })
  income?: number;

  @Column({ nullable: true })
  determinationDate?: Date;

  @ManyToOne((type) => Family)
  family: Family;

  @Column((type) => UpdateMetaData)
  updateMetaData: UpdateMetaData;
}
