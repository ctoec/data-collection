import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFlattenedEnrollmentAddReportId1596461452783
  implements MigrationInterface {
  name = 'AlterFlattenedEnrollmentAddReportId1596461452783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ALTER COLUMN "reportId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18" FOREIGN KEY ("reportId") REFERENCES "enrollment_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18"`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ALTER COLUMN "reportId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" ADD CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18" FOREIGN KEY ("reportId") REFERENCES "enrollment_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
