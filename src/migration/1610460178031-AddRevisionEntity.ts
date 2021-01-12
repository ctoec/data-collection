import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRevisionEntity1610460178031 implements MigrationInterface {
  name = 'AddRevisionEntity1610460178031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "revision" ("id" int NOT NULL IDENTITY(1,1), "userId" int, "orgId" int, "siteNameChanges" ntext, "newSiteName" nvarchar(255), "newSiteLicense" nvarchar(255), "newSiteLicenseExempt" bit, "newSiteNaeycId" nvarchar(255), "newSiteIsHeadstart" bit, "newSiteNoNaeyc" bit, "newSiteRegistryId" nvarchar(255), "fundingSpaceTypes" ntext, CONSTRAINT "PK_f4767cdf0c0e78041514e5a94be" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "revision"`);
  }
}
