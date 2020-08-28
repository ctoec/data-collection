import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFundingMakeFirstReportingPeriodNotNull1598570621725
  implements MigrationInterface {
  name = 'AlterFundingMakeFirstReportingPeriodNotNull1598570621725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_8b0c90027c72688977648e07d05"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ALTER COLUMN "firstReportingPeriodId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_8b0c90027c72688977648e07d05" FOREIGN KEY ("firstReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_8b0c90027c72688977648e07d05"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ALTER COLUMN "firstReportingPeriodId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_8b0c90027c72688977648e07d05" FOREIGN KEY ("firstReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
