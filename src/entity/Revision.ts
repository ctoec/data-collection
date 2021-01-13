import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Revision as RevisionInterface } from '../../client/src/shared/models';

/**
 * Schema for a revision request entity. Users will submit these
 * requests via a form that allows them to request changes to
 * site names / funding space types. We'll store these requests
 * as rows in a special DB table until we act on them.
 */
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
