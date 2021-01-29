import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateSiteRequest as UpdateSiteRequestInterface } from '../../client/src/shared/models';

@Entity()
export class UpdateSiteRequest implements UpdateSiteRequestInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @Column()
  authorId: number;

  @Column()
  createdAt: Date;

  @Column()
  siteId: number;

  @Column({ nullable: true })
  newName?: string;

  @Column({ nullable: true })
  remove?: boolean;
}
