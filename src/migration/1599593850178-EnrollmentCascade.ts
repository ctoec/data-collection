import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnrollmentCascade1599593850178 implements MigrationInterface {
  name = 'EnrollmentCascade1599593850178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
