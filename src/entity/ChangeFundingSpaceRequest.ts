import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChangeFundingSpaceRequest as ChangeFundingSpaceRequestInterface } from '../../client/src/shared/models';

@Entity()
export class ChangeFundingSpaceRequest
  implements ChangeFundingSpaceRequestInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @Column()
  fundingSpace: string;

  @Column()
  shouldHave: boolean;
}
