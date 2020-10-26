import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEnrollmentMakeSiteNullable1603461371360
  implements MigrationInterface {
  name = 'UpdateEnrollmentMakeSiteNullable1603461371360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_13c79002cb8beaefc7dd3718830"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "siteId" int`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_13c79002cb8beaefc7dd3718830" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_13c79002cb8beaefc7dd3718830"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "siteId" int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_13c79002cb8beaefc7dd3718830" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
