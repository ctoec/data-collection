import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { Enrollment } from './Enrollment';
import { Organization } from './Organization';
import { Region } from './enums';

@Entity()
export class Site { 

		@PrimaryGeneratedColumn()
		id: number;
		
		@Column()
		name: string;
		
		@Column()
		titleI: boolean;

		@Column()
		region: Region;

		@Column({ nullable: true })
		facilityCode?: number;
		
		@Column({ nullable: true })
		licenseNumber?: number;
		
		@Column({ nullable: true })
		naeycId?: number;
		
		@Column({ nullable: true })
		registryId?: number;

		@ManyToOne(type => Organization)
    organization: Organization;

		@OneToMany(type => Enrollment, enrollment => enrollment.site)
    enrollments: Array<Enrollment>;
}
