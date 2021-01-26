import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  addHistorySchemaQuery,
  addSystemVersioningColumnsToTableQuery,
  turnSystemVersioningOnForTableQuery,
  turnSystemVersioningOffForTableQuery,
  removeSystemVersioningColumnsFromTableQuery,
  removeHistorySchemaQuery,
} from './queries/addTemporalTableSupport';

export class AddTemporalTableSupport1601336508856
  implements MigrationInterface {
  name = 'AddTemporalTableSupport1601336508856';
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(turnSystemVersioningOffForTableQuery('child'));
    await queryRunner.query(
      removeSystemVersioningColumnsFromTableQuery('child')
    );

    await queryRunner.query(
      turnSystemVersioningOffForTableQuery('income_determination')
    );
    await queryRunner.query(
      removeSystemVersioningColumnsFromTableQuery('income_determination')
    );

    await queryRunner.query(turnSystemVersioningOffForTableQuery('family'));
    await queryRunner.query(
      removeSystemVersioningColumnsFromTableQuery('family')
    );

    await queryRunner.query(turnSystemVersioningOffForTableQuery('enrollment'));
    await queryRunner.query(
      removeSystemVersioningColumnsFromTableQuery('enrollment')
    );

    await queryRunner.query(turnSystemVersioningOffForTableQuery('funding'));
    await queryRunner.query(
      removeSystemVersioningColumnsFromTableQuery('funding')
    );

    await queryRunner.query(removeHistorySchemaQuery());
  }
}
