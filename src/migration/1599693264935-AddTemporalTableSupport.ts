import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  addHistorySchemaQuery,
  addSystemVersioningColumnsToTableQuery,
  turnSystemVersioningOnForTableQuery,
} from './queries/addTemporalTableSupport';

export class AddTemporalTableSupport1599693264935
  implements MigrationInterface {
  name = 'AddTemporalTableSupport1599693264935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addHistorySchemaQuery());

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('Funding'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('Funding'));

    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('Enrollment')
    );
    await queryRunner.query(turnSystemVersioningOnForTableQuery('Enrollment'));

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('Family'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('Family'));

    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('IncomeDetermination')
    );
    await queryRunner.query(
      turnSystemVersioningOnForTableQuery('IncomeDetermination')
    );

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('Child'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('Child'));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
