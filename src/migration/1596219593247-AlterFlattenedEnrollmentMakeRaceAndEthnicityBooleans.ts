import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFlattenedEnrollmentMakeRaceAndEthnicityBooleans1596219593247
  implements MigrationInterface {
  name = 'AlterFlattenedEnrollmentMakeRaceAndEthnicityBooleans1596219593247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "ethnicity"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "hispanicOrLatinxEthnicity" boolean`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "americanIndianOrAlaskaNative"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "americanIndianOrAlaskaNative" boolean`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "asian"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "asian" boolean`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "blackOrAfricanAmerican"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "blackOrAfricanAmerican" boolean`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "nativeHawaiianOrPacificIslander"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "nativeHawaiianOrPacificIslander" boolean`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "white"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "white" boolean`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "white"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "white" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "nativeHawaiianOrPacificIslander"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "nativeHawaiianOrPacificIslander" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "blackOrAfricanAmerican"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "blackOrAfricanAmerican" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "asian"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "asian" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "americanIndianOrAlaskaNative"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "americanIndianOrAlaskaNative" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "hispanicOrLatinxEthnicity"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "ethnicity" character varying`
    );
  }
}
