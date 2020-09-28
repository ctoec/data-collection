import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEnumsVarchar1601335101413 implements MigrationInterface {
  name = 'MakeEnumsVarchar1601335101413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reporting_period" DROP CONSTRAINT "UQ_Type_Period"`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" DROP COLUMN "type"`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" ADD "type" varchar(20) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "region"`);
    await queryRunner.query(
      `ALTER TABLE "site" ADD "region" varchar(20) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "UQ_Source_AgeGroup_Time_Organization"`
    );
    await queryRunner.query(`ALTER TABLE "funding_space" DROP COLUMN "source"`);
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "source" varchar(20) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP COLUMN "ageGroup"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "ageGroup" varchar(20) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "funding_space" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "time" varchar(20) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "ageGroup"`);
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "ageGroup" nvarchar(255)`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "child" ADD "gender" varchar(20)`);
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" varchar(20)`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" ADD CONSTRAINT "UQ_Type_Period" UNIQUE ("type", "period")`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("source", "ageGroup", "time", "organizationId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "UQ_Source_AgeGroup_Time_Organization"`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" DROP CONSTRAINT "UQ_Type_Period"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" int`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "child" ADD "gender" int`);
    await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "ageGroup"`);
    await queryRunner.query(`ALTER TABLE "enrollment" ADD "ageGroup" int`);
    await queryRunner.query(`ALTER TABLE "funding_space" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "time" int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP COLUMN "ageGroup"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "ageGroup" int NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "funding_space" DROP COLUMN "source"`);
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "source" int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("ageGroup", "organizationId", "source", "time")`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "region"`);
    await queryRunner.query(`ALTER TABLE "site" ADD "region" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "reporting_period" DROP COLUMN "type"`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" ADD "type" int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "reporting_period" ADD CONSTRAINT "UQ_Type_Period" UNIQUE ("period", "type")`
    );
  }
}
