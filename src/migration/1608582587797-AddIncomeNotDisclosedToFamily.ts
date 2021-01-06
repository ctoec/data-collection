import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIncomeNotDisclosedToFamily1608582587797
  implements MigrationInterface {
  name = 'AddIncomeNotDisclosedToFamily1608582587797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "incomeNotDisclosed" bit`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "incomeNotDisclosed"`
    );
  }
}
