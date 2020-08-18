import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Site as SiteInterface, Region } from '../../shared/models';

import { Enrollment } from './Enrollment';
import { Organization } from './Organization';

@Entity()
export class Site implements SiteInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  titleI: boolean;

  @Column({ type: 'enum', enum: Region })
  region: Region;

  @Column({ nullable: true })
  facilityCode?: number;

  @Column({ nullable: true })
  licenseNumber?: number;

  @Column({ nullable: true })
  naeycId?: number;

  @Column({ nullable: true })
  registryId?: number;

  @ManyToOne((type) => Organization, { nullable: false })
  organization: Organization;

  @OneToMany((type) => Enrollment, (enrollment) => enrollment.site)
  enrollments?: Array<Enrollment>;
}
