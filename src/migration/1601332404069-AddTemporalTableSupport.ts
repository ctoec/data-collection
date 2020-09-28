import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  addHistorySchemaQuery,
  addSystemVersioningColumnsToTableQuery,
  turnSystemVersioningOnForTableQuery,
} from './queries/addTemporalTableSupport';

export class AddTemporalTableSupport1601332404069
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addHistorySchemaQuery());

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('funding'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('funding'));

    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('enrollment')
    );
    await queryRunner.query(turnSystemVersioningOnForTableQuery('enrollment'));

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('family'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('family'));

    await queryRunner.query(
      addSystemVersioningColumnsToTableQuery('income_determination')
    );
    await queryRunner.query(
      turnSystemVersioningOnForTableQuery('income_determination')
    );

    await queryRunner.query(addSystemVersioningColumnsToTableQuery('child'));
    await queryRunner.query(turnSystemVersioningOnForTableQuery('child'));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
