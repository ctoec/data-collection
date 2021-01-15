import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AddSiteRequest as AddSiteRequestInterface } from '../../client/src/shared/models';

@Entity()
export class AddSiteRequest implements AddSiteRequestInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @Column()
  siteName: string;

  @Column({ nullable: true })
  licenseId?: string;

  @Column({ nullable: true })
  naeycId?: string;

  @Column({ nullable: true })
  registryId?: string;
}
