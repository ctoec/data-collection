import { MigrationInterface, QueryRunner } from 'typeorm';
import { turnSystemVersioningOnForTableQuery } from './queries/addTemporalTableSupport';

export class TurnOnTemporalTableSupportAppMetadata1611189414214
  implements MigrationInterface {
  name = 'TurnOnTemporalTableSupportAppMetadata1611189414214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(turnSystemVersioningOnForTableQuery('user'));
    await queryRunner.query(
      turnSystemVersioningOnForTableQuery('organization')
    );
    await queryRunner.query(turnSystemVersioningOnForTableQuery('site'));
    await queryRunner.query(
      turnSystemVersioningOnForTableQuery('funding_space')
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
