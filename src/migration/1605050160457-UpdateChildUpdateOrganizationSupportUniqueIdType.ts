import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChildUpdateOrganizationSupportUniqueIdType1605050160457
  implements MigrationInterface {
  name = 'UpdateChildUpdateOrganizationSupportUniqueIdType1605050160457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "uniqueIdType" varchar(10) NOT NULL DEFAULT 'OTHER'`
    );
    await queryRunner.query(`ALTER TABLE "child" ADD "uniqueId" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "uniqueId"`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "uniqueIdType"`);
  }
}
