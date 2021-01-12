import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Revision as RevisionInterface } from '../../client/src/shared/models';

@Entity()
export class Revision implements RevisionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  orgId?: number;

  @Column('simple-array', { nullable: true })
  siteNameChanges?: string[];

  @Column({ nullable: true })
  newSiteName?: string;

  @Column({ nullable: true })
  newSiteLicense?: string;

  @Column({ nullable: true })
  newSiteLicenseExempt?: boolean;

  @Column({ nullable: true })
  newSiteNaeycId?: string;

  @Column({ nullable: true })
  newSiteIsHeadstart?: boolean;

  @Column({ nullable: true })
  newSiteNoNaeyc?: boolean;

  @Column({ nullable: true })
  newSiteRegistryId?: string;

  @Column('simple-array', { nullable: true })
  fundingSpaceTypes?: string[];
}
