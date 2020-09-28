import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestNewEnum1601326054302 implements MigrationInterface {
  name = 'TestNewEnum1601326054302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "CK__child__specialEd__451F3D2B"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" nvarchar(255) CHECK( specialEducationServicesType IN ('LEA','NonLEA') )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" simple-enum CHECK( specialEducationServicesType IN ('LEA','Non LEA') )`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "CK__child__specialEd__451F3D2B" CHECK (([specialEducationServicesType]='Non LEA' OR [specialEducationServicesType]='LEA'))`
    );
  }
}
