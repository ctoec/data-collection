import { MigrationInterface, QueryRunner } from 'typeorm';
import { addSystemVersioningColumnsToTableQuery } from './queries/addTemporalTableSupport';
import { dropDefaultConstraint } from './utils/dropDefaultConstraint';

export class AddTemporalTableSupportAppMetdata1610564061121
  implements MigrationInterface {
  name = 'AddTemporalTableSupportAppMetdata1610564061121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" DROP COLUMN "specialEducationServicesType"`
    );
    await dropDefaultConstraint(
      queryRunner,
      'income_determination',
      'incomeNotDisclosed'
    );

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('user'));
    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('organization')
    );
    await queryRunner.query(addSystemVersioningColumnsToTableQuery('site'));
    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('funding_space')
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" ADD "specialEducationServicesType" varchar(20)`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT DEFAULT 0 FOR "incomeNotDisclosed"`
    );
  }
}
