import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeleteDateField1604668771411 implements MigrationInterface {
  name = 'AddDeleteDateField1604668771411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "deletedDate" datetime2`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "deletedDate" datetime2`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "deletedDate" datetime2`
    );
    await queryRunner.query(`ALTER TABLE "family" ADD "deletedDate" datetime2`);
    await queryRunner.query(`ALTER TABLE "child" ADD "deletedDate" datetime2`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "deletedDate"`);
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "deletedDate"`);
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "deletedDate"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "deletedDate"`
    );
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "deletedDate"`);
  }
}
