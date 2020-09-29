import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Site as SiteInterface, Region } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { Provider } from './Provider';
import { enumTransformer } from './transformers';

@Entity()
export class Site implements SiteInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  siteName: string;

  @Column()
  titleI: boolean;

  @Column({ type: 'varchar', length: 20, transformer: enumTransformer(Region) })
  region: Region;

  @Column({ nullable: true })
  facilityCode?: number;

  @Column({ nullable: true })
  licenseNumber?: number;

  @Column({ nullable: true })
  naeycId?: number;

  @Column({ nullable: true })
  registryId?: number;

  @ManyToOne(() => Provider, { nullable: false })
  provider: Provider;

  @Column()
  providerId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.site)
  enrollments?: Array<Enrollment>;
}
