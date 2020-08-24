import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommunityPermissionToUser1598284521953
  implements MigrationInterface {
  name = 'AddCommunityPermissionToUser1598284521953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_005aa04b3eb93b59b673ef77878"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "UQ_USER_ORGANIZATION"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ALTER COLUMN "organizationId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "UQ_USER_SITE"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ALTER COLUMN "siteId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "UQ_USER_COMMUNITY"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ALTER COLUMN "communityId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("userId", "organizationId")`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "UQ_USER_SITE" UNIQUE ("userId", "siteId")`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "UQ_USER_COMMUNITY" UNIQUE ("userId", "communityId")`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_005aa04b3eb93b59b673ef77878" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_005aa04b3eb93b59b673ef77878"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "UQ_USER_COMMUNITY"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "UQ_USER_SITE"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "UQ_USER_ORGANIZATION"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ALTER COLUMN "communityId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "UQ_USER_COMMUNITY" UNIQUE ("userId", "communityId")`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ALTER COLUMN "siteId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "UQ_USER_SITE" UNIQUE ("userId", "siteId")`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ALTER COLUMN "organizationId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("userId", "organizationId")`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_005aa04b3eb93b59b673ef77878" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
