import { MigrationInterface, QueryRunner } from 'typeorm';
import { dropDefaultConstraint } from './utils/dropDefaultConstraint';

export class AddIncomeNotDisclosedToFamily1608582587797
  implements MigrationInterface {
  name = 'AddIncomeNotDisclosedToFamily1608582587797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "incomeNotDisclosed" bit DEFAULT(0) WITH VALUES`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropDefaultConstraint(
      queryRunner,
      'income_determination',
      'incomeNotDisclosed'
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "incomeNotDisclosed"`
    );
  }
}
