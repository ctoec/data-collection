import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrgDataSubmitted1609258608538 implements MigrationInterface {
  name = 'AddOrgDataSubmitted1609258608538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "submittedData" bit`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "submittedData"`
    );
  }
}
