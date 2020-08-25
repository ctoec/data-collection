import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Site as SiteInterface, Region } from '../../client/src/shared/modelss';

import { Enrollment } from './Enrollment';
import { Organization } from './Organization';

@Entity()
export class Site implements SiteInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.site)
  enrollments?: Array<Enrollment>;
}
