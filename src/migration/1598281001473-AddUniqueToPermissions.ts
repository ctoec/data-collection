import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueToPermissions1598281001473 implements MigrationInterface {
  name = 'AddUniqueToPermissions1598281001473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("userId", "organizationId")`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "UQ_USER_SITE" UNIQUE ("userId", "siteId")`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "UQ_USER_COMMUNITY" UNIQUE ("userId", "communityId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "UQ_USER_COMMUNITY"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "UQ_USER_SITE"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "UQ_USER_ORGANIZATION"`
    );
  }
}
