import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Provider } from './Provider';
import { Organization as OrganizationInterface } from '../../client/src/shared/models';

@Entity()
export class Organization implements OrganizationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Provider, (provider) => provider.organization)
  providers?: Array<Provider>;
}
