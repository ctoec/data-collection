import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFundingRemoveReportingPeriod1624998391756
  implements MigrationInterface {
  name = 'UpdateFundingRemoveReportingPeriod1624998391756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_8b0c90027c72688977648e07d05"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_813982d9605de30735ef677f572"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP COLUMN "firstReportingPeriodId"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP COLUMN "lastReportingPeriodId"`
    );

    await queryRunner.query(`DROP TABLE "reporting_period"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "lastReportingPeriodId" int`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "firstReportingPeriodId" int`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_813982d9605de30735ef677f572" FOREIGN KEY ("lastReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_8b0c90027c72688977648e07d05" FOREIGN KEY ("firstReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `CREATE TABLE "reporting_period" ("id" int NOT NULL IDENTITY(1,1), "type" varchar(20) NOT NULL, "period" date NOT NULL, "periodStart" date NOT NULL, "periodEnd" date NOT NULL, "dueAt" date NOT NULL, CONSTRAINT "UQ_Type_Period" UNIQUE ("type", "period"), CONSTRAINT "PK_273d2b68dc1854618ec53e144d0" PRIMARY KEY ("id"))`
    );
  }
}
