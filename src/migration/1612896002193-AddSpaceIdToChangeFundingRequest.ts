import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpaceIdToChangeFundingRequest1612896002193
  implements MigrationInterface {
  name = 'AddSpaceIdToChangeFundingRequest1612896002193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" ADD "fundingSpaceId" int`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" DROP COLUMN "fundingSpaceId"`
    );
  }
}
