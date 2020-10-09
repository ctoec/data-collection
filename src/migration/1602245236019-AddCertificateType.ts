import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCertificateType1602245236019 implements MigrationInterface {
  name = 'AddCertificateType1602245236019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" ADD "birthCertificateType" varchar(30) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "birthCertificateType"`
    );
  }
}
