import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFundingSpaceFixUnqiueConstraint1598580605137
  implements MigrationInterface {
  name = 'AlterFundingSpaceFixUnqiueConstraint1598580605137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "UQ_Source_AgeGroup_Time"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_fa30f106d866b8fb78e9d645d4b" UNIQUE ("wingedKeysId")`
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
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_fa30f106d866b8fb78e9d645d4b"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "UQ_Source_AgeGroup_Time" UNIQUE ("source", "ageGroup", "time")`
    );
  }
}
