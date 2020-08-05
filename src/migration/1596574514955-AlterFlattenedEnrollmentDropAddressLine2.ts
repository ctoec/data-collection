import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFlattenedEnrollmentDropAddressLine21596574514955
  implements MigrationInterface {
  name = 'AlterFlattenedEnrollmentDropAddressLine21596574514955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "addressLine1"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "addressLine2"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "streetAddress" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "streetAddress"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "addressLine2" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "addressLine1" character varying`
    );
  }
}
