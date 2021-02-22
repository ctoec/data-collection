import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailAndOECFlagToUser1614010449680
  implements MigrationInterface {
  name = 'AddEmailAndOECFlagToUser1614010449680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "DF_2d88b96a8ae45007d2ec1d40f32"`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "SysStartTime"`);
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "DF_719f67b4292ce8da9b43d559a8b"`
    );
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "SysEndTime"`);
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "DF_51f8196b8582a24035cb9e578e9"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "DF_1c25cf7852231b88319afade30b"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "DF_257fe0ec3a04713810eeaabec34"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP COLUMN "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "DF_a1650f09ca91e007e2fb15deef7"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP COLUMN "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_271bf0188eee466950a1e2a162c"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "SysStartTime"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_bf5d755744d24cb1158855b5dee"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "SysEndTime"`);
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "DF_b37c742d24c40fb60819d7494d6"`
    );
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "SysStartTime"`);
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "DF_5e2edb438e57eea0cf08d78db70"`
    );
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "SysEndTime"`);
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "DF_dc493408111820eb47fe864fabe"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "DF_3b81fd6d8c0247e1e18e5c04a41"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP CONSTRAINT "DF_a76e6aacaf82d497585788c5c1a"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP CONSTRAINT "DF_27a9e8942cd4954b7a1f055c3c7"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP COLUMN "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "DF_bb1fbfdd5986078f035ae015c10"`
    );
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "SysStartTime"`);
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "DF_37606d5a831697eeb8096d036ce"`
    );
    await queryRunner.query(`ALTER TABLE "family" DROP COLUMN "SysEndTime"`);
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "DF_e843ead0795364bb615ddd597c2"`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "SysStartTime"`);
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "DF_4147e09e68b779affbe457f80b9"`
    );
    await queryRunner.query(`ALTER TABLE "child" DROP COLUMN "SysEndTime"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "email" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isOECUser" bit NOT NULL CONSTRAINT "DF_def3bf62d0167f10fdc419d114e" DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "add_site_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "add_site_request" ADD "createdAt" datetime NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" ADD "createdAt" datetime NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "update_site_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "update_site_request" ADD "createdAt" datetime NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "update_site_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "update_site_request" ADD "createdAt" date NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "change_funding_space_request" ADD "createdAt" date NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "add_site_request" DROP COLUMN "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "add_site_request" ADD "createdAt" date NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "DF_def3bf62d0167f10fdc419d114e"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isOECUser"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "child" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "DF_4147e09e68b779affbe457f80b9" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "DF_e843ead0795364bb615ddd597c2" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "DF_37606d5a831697eeb8096d036ce" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "DF_bb1fbfdd5986078f035ae015c10" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT "DF_27a9e8942cd4954b7a1f055c3c7" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT "DF_a76e6aacaf82d497585788c5c1a" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "DF_3b81fd6d8c0247e1e18e5c04a41" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "DF_dc493408111820eb47fe864fabe" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "DF_5e2edb438e57eea0cf08d78db70" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "DF_b37c742d24c40fb60819d7494d6" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_bf5d755744d24cb1158855b5dee" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "DF_271bf0188eee466950a1e2a162c" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "DF_a1650f09ca91e007e2fb15deef7" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "DF_257fe0ec3a04713810eeaabec34" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "DF_1c25cf7852231b88319afade30b" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "DF_51f8196b8582a24035cb9e578e9" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD "SysEndTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "DF_719f67b4292ce8da9b43d559a8b" DEFAULT CONVERT([datetime2],'9999-12-31 23:59:59') FOR "SysEndTime"`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD "SysStartTime" datetime2(0) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "DF_2d88b96a8ae45007d2ec1d40f32" DEFAULT sysutcdatetime() FOR "SysStartTime"`
    );
  }
}
