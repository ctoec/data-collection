/**
DO NOT EDIT THIS FILE!!!!!
IT IS COPIED FROM THE ROOT src/entity FOLDER
TO UPDATE ENTITY MODEL DEFINITIONS, MAKE CHANGES TO THE FILES IN src/entity,
AND THEN RUN ./copy-models-to-client.sh FROM ROOT DIR
**/
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { FundingSource } from './enums';

@Entity()
export class ReportingPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: FundingSource })
  type: FundingSource;

  @Column({ type: 'date' })
  period: Date;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'date' })
  dueAt: Date;
}
