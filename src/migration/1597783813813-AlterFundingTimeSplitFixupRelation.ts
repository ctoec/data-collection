import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFundingTimeSplitFixupRelation1597783813813
  implements MigrationInterface {
  name = 'AlterFundingTimeSplitFixupRelation1597783813813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" DROP CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" ADD CONSTRAINT "UQ_4c23c29a718e7ffda0223e5aeb4" UNIQUE ("fundingSpaceId")`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" ADD CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" DROP CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" DROP CONSTRAINT "UQ_4c23c29a718e7ffda0223e5aeb4"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" ADD CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
