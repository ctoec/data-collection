import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateOrganizationFixUniqueIdTypeDefault1605749736657 implements MigrationInterface {
    name = 'UpdateOrganizationFixUniqueIdTypeDefault1605749736657'

    public async up(queryRunner: QueryRunner): Promise<void> {
				const result = await queryRunner.query(`SELECT name FROM sysobjects WHERE name LIKE 'DF__organizat__uniqu%'`);
				const constraintName = (result[0] as { name: string}).name;
				await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "${constraintName}"`);
				await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "uniqueIdType"`);
				await queryRunner.query(`ALTER TABLE "organization" ADD "uniqueIdType" varchar(10) NOT NULL DEFAULT 'Other'`);
			
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
