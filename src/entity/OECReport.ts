import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { OECReport as OECReportInterface } from '../../client/src/shared/models';

import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Organization } from './Organization';

@Entity()
export class OECReport implements OECReportInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @Column()
  organizationId: number;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
