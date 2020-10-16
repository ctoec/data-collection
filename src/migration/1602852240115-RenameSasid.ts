import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSasid1602852240115 implements MigrationInterface {
  name = 'RenameSasid1602852240115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "sasid"`);
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "uniqueIdentifier" nvarchar(255)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "uniqueIdentifier"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" varchar(20)`
    );
    await queryRunner.query(`ALTER TABLE "child" ADD "sasid" nvarchar(255)`);
  }
}
