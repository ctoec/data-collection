import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIncomeFieldsMakeDecimal1597328000967
  implements MigrationInterface {
  name = 'UpdateIncomeFieldsMakeDecimal1597328000967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "region"`);
    await queryRunner.query(
      `CREATE TYPE "site_region_enum" AS ENUM('East', 'NorthCentral', 'NorthWest', 'SouthCentral', 'SouthWest')`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD "region" "site_region_enum" NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "income"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "income" numeric(2,14)`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "gender"`);
    await queryRunner.query(
      `CREATE TYPE "child_gender_enum" AS ENUM('Male', 'Female', 'Nonbinary', 'Unknown', 'Unspecified')`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "gender" "child_gender_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "annualHouseholdIncome"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "annualHouseholdIncome" numeric(2,14)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP COLUMN "annualHouseholdIncome"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD "annualHouseholdIncome" integer`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "child_gender_enum"`);
    await queryRunner.query(
      `ALTER TABLE "child" ADD "gender" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "income"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "income" integer`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "region"`);
    await queryRunner.query(`DROP TYPE "site_region_enum"`);
    await queryRunner.query(
      `ALTER TABLE "site" ADD "region" character varying NOT NULL`
    );
  }
}
