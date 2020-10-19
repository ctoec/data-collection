import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBirthCertificateTypeNullable1602883642745
  implements MigrationInterface {
  name = 'MakeBirthCertificateTypeNullable1602883642745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" ALTER COLUMN "birthCertificateType" varchar(30)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" ALTER COLUMN "birthCertificateType" varchar(30) NOT NULL`
    );
  }
}
