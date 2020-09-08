import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadingDelete1599593076571 implements MigrationInterface {
  name = 'CascadingDelete1599593076571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_ba7ba20faacb49e6578db48c654"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_ba7ba20faacb49e6578db48c654" FOREIGN KEY ("enrollmentId") REFERENCES "enrollment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_ba7ba20faacb49e6578db48c654"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_ba7ba20faacb49e6578db48c654" FOREIGN KEY ("enrollmentId") REFERENCES "enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
