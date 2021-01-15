import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateRequests1610735799697 implements MigrationInterface {
  name = 'AddUpdateRequests1610735799697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "add_site_request" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "siteName" nvarchar(255) NOT NULL, "licenseId" nvarchar(255), "naeycId" nvarchar(255), "registryId" nvarchar(255), CONSTRAINT "PK_0759ac236cf975831467cac66d8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "change_funding_space_request" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "fundingSpace" nvarchar(255) NOT NULL, "shouldHave" bit NOT NULL, CONSTRAINT "PK_7526830b2371a8c09e7035c1254" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "update_site_request" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "siteId" int NOT NULL, "newName" nvarchar(255), "remove" bit, CONSTRAINT "PK_52c2116697fd4f3da5846905038" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "update_site_request"`);
    await queryRunner.query(`DROP TABLE "change_funding_space_request"`);
    await queryRunner.query(`DROP TABLE "add_site_request"`);
  }
}
