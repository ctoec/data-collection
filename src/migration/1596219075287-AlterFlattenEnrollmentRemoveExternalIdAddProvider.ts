import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFlattenEnrollmentRemoveExternalIdAddProvider1596219075287
  implements MigrationInterface {
  name = 'AlterFlattenEnrollmentRemoveExternalIdAddProvider1596219075287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" RENAME COLUMN "externalId" TO "provider"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" RENAME COLUMN "provider" TO "externalId"`
    );
  }
}
