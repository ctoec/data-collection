import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConfidentialityToUsers1606165287113
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "confidentialityAgreedDate" date`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "confidentialityAgreedDate"`
    );
  }
}
