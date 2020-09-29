import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1601336488361 implements MigrationInterface {
  name = 'InitialMigration1601336488361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reporting_period" ("id" int NOT NULL IDENTITY(1,1), "type" varchar(20) NOT NULL, "period" date NOT NULL, "periodStart" date NOT NULL, "periodEnd" date NOT NULL, "dueAt" date NOT NULL, CONSTRAINT "UQ_Type_Period" UNIQUE ("type", "period"), CONSTRAINT "PK_273d2b68dc1854618ec53e144d0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "site" ("id" int NOT NULL IDENTITY(1,1), "siteName" nvarchar(255) NOT NULL, "titleI" bit NOT NULL, "region" varchar(20) NOT NULL, "facilityCode" int, "licenseNumber" int, "naeycId" int, "registryId" int, "organizationId" int NOT NULL, CONSTRAINT "UQ_4ca3fbc46d2dbf393ff4ebddbbd" UNIQUE ("siteName"), CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "community" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" int NOT NULL IDENTITY(1,1), "providerName" nvarchar(255) NOT NULL, "communityId" int, CONSTRAINT "UQ_b63ed17728f4f247b653d3ee9d7" UNIQUE ("providerName"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "funding_time_split" ("id" int NOT NULL IDENTITY(1,1), "fullTimeWeeks" int NOT NULL, "partTimeWeeks" int NOT NULL, "fundingSpaceId" int NOT NULL, CONSTRAINT "PK_b7e03c4f3dc577282ba66e70663" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_4c23c29a718e7ffda0223e5aeb" ON "funding_time_split" ("fundingSpaceId") WHERE "fundingSpaceId" IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE TABLE "funding_space" ("id" int NOT NULL IDENTITY(1,1), "capacity" int NOT NULL, "source" varchar(20) NOT NULL, "ageGroup" varchar(20) NOT NULL, "time" varchar(20) NOT NULL, "organizationId" int NOT NULL, CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("source", "ageGroup", "time", "organizationId"), CONSTRAINT "PK_0f92a2c9df81f7cecc05d28c99d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization_permission" ("id" int NOT NULL IDENTITY(1,1), "organizationId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("userId", "organizationId"), CONSTRAINT "PK_ff6561c44fcca6c8e16fe459157" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "site_permission" ("id" int NOT NULL IDENTITY(1,1), "siteId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_USER_SITE" UNIQUE ("userId", "siteId"), CONSTRAINT "PK_f6582185e1ced5a6aafc3143f51" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "community_permission" ("id" int NOT NULL IDENTITY(1,1), "communityId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_USER_COMMUNITY" UNIQUE ("userId", "communityId"), CONSTRAINT "PK_df854e201c33903ab4887129351" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "wingedKeysId" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "middleName" nvarchar(255), "suffix" nvarchar(255), CONSTRAINT "UQ_fa30f106d866b8fb78e9d645d4b" UNIQUE ("wingedKeysId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "funding" ("id" int NOT NULL IDENTITY(1,1), "enrollmentId" int NOT NULL, "fundingSpaceId" int NOT NULL, "firstReportingPeriodId" int, "lastReportingPeriodId" int, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_3208742513b8eeff356f9f43605" DEFAULT getdate(), CONSTRAINT "PK_096afc0d11a08deb52da61f039e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment" ("id" int NOT NULL IDENTITY(1,1), "childId" uniqueidentifier NOT NULL, "siteId" int NOT NULL, "model" varchar(20), "ageGroup" varchar(20), "entry" date, "exit" date, "exitReason" nvarchar(255), "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_3a787207f5857d5ebc444c2169c" DEFAULT getdate(), CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "income_determination" ("id" int NOT NULL IDENTITY(1,1), "numberOfPeople" int, "income" decimal(14,2), "determinationDate" date, "familyId" int NOT NULL, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_7a4beca2590fed0cdbbaee0b592" DEFAULT getdate(), CONSTRAINT "PK_bab8509559a5caf486bf1bdd99b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "family" ("id" int NOT NULL IDENTITY(1,1), "streetAddress" nvarchar(255), "town" nvarchar(255), "state" nvarchar(255), "zipCode" nvarchar(255), "homelessness" bit CONSTRAINT "DF_ff0d12e7344b70e7bf34b24f6f3" DEFAULT NULL, "organizationId" int NOT NULL, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_110ca99bec3c4f1d0dbda99be4d" DEFAULT getdate(), CONSTRAINT "PK_ba386a5a59c3de8593cda4e5626" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "child" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_4609b9b323ca37c6bc435ec4b6b" DEFAULT NEWSEQUENTIALID(), "sasid" nvarchar(255), "firstName" nvarchar(255), "middleName" nvarchar(255), "lastName" nvarchar(255), "suffix" nvarchar(255), "birthdate" date, "birthTown" nvarchar(255), "birthState" nvarchar(255), "birthCertificateId" nvarchar(255), "americanIndianOrAlaskaNative" bit, "asian" bit, "blackOrAfricanAmerican" bit, "nativeHawaiianOrPacificIslander" bit, "white" bit, "hispanicOrLatinxEthnicity" bit, "gender" varchar(20), "foster" bit NOT NULL CONSTRAINT "DF_4f4d36a381d8a984f1e0006f6e9" DEFAULT 0, "receivesC4K" bit NOT NULL CONSTRAINT "DF_cbdcc7e29761e5c4d143f90d571" DEFAULT 0, "receivesSpecialEducationServices" bit NOT NULL CONSTRAINT "DF_820b6edac45ec4ca39ee34fe0cf" DEFAULT 0, "specialEducationServicesType" varchar(20), "familyId" int, "organizationId" int NOT NULL, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_584ad2a7bdda2e07087016f7b1b" DEFAULT getdate(), CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment_report" ("id" int NOT NULL IDENTITY(1,1), "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_6057df381574fbd8e3cb6e39583" DEFAULT getdate(), CONSTRAINT "PK_2e40a5e41f8b10526d0d9bfff6d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment_report_children_child" ("enrollmentReportId" int NOT NULL, "childId" uniqueidentifier NOT NULL, CONSTRAINT "PK_5c9d2b4ffd81eae6d121d58caf3" PRIMARY KEY ("enrollmentReportId", "childId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b035b2da5f18805e351b38e1d8" ON "enrollment_report_children_child" ("enrollmentReportId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2296b9c3b30149ee24387947f8" ON "enrollment_report_children_child" ("childId") `
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_655feba01f929b0a13e7763b98d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" ADD CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "FK_8ee12fc9120493e5ebd83401bb7" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" ADD CONSTRAINT "FK_005aa04b3eb93b59b673ef77878" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_5ede40be71b1ee2adc0a929bebe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" ADD CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_b58dc6885cada3ecee6a7f1b54e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" ADD CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_ba7ba20faacb49e6578db48c654" FOREIGN KEY ("enrollmentId") REFERENCES "enrollment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_8b0c90027c72688977648e07d05" FOREIGN KEY ("firstReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_813982d9605de30735ef677f572" FOREIGN KEY ("lastReportingPeriodId") REFERENCES "reporting_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_817356665fbda51e379485c31dc" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_13c79002cb8beaefc7dd3718830" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_abc773907ba634123a2210c3146" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT "FK_f5232da44ef0322884f275f385b" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" ADD CONSTRAINT "FK_e762fcf6981e58b6286ce3c59d2" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "FK_0c99ff0ea285963a5912699025e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "FK_c21a67e17b469524e023afb69d2" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "FK_220db438ae35d31c6716de7feac" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "FK_061d51594e55a089e79f87af612" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "FK_fef8675d11ae1b1a6a42304893c" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment_report" ADD CONSTRAINT "FK_74c8d06c2abb69d01383536368b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment_report_children_child" ADD CONSTRAINT "FK_b035b2da5f18805e351b38e1d8e" FOREIGN KEY ("enrollmentReportId") REFERENCES "enrollment_report"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment_report_children_child" ADD CONSTRAINT "FK_2296b9c3b30149ee24387947f85" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment_report_children_child" DROP CONSTRAINT "FK_2296b9c3b30149ee24387947f85"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment_report_children_child" DROP CONSTRAINT "FK_b035b2da5f18805e351b38e1d8e"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment_report" DROP CONSTRAINT "FK_74c8d06c2abb69d01383536368b"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "FK_fef8675d11ae1b1a6a42304893c"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "FK_061d51594e55a089e79f87af612"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "FK_220db438ae35d31c6716de7feac"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "FK_c21a67e17b469524e023afb69d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "FK_0c99ff0ea285963a5912699025e"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP CONSTRAINT "FK_e762fcf6981e58b6286ce3c59d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "income_determination" DROP CONSTRAINT "FK_f5232da44ef0322884f275f385b"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_abc773907ba634123a2210c3146"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_13c79002cb8beaefc7dd3718830"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_817356665fbda51e379485c31dc"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_813982d9605de30735ef677f572"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_8b0c90027c72688977648e07d05"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_49f8c856ef16b047c2f22016cd9"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_ba7ba20faacb49e6578db48c654"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_1e147a5a144a2dba0337ee291fd"`
    );
    await queryRunner.query(
      `ALTER TABLE "community_permission" DROP CONSTRAINT "FK_b58dc6885cada3ecee6a7f1b54e"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_a5b57b05f00c5701b782ea2e93f"`
    );
    await queryRunner.query(
      `ALTER TABLE "site_permission" DROP CONSTRAINT "FK_5ede40be71b1ee2adc0a929bebe"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_005aa04b3eb93b59b673ef77878"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_permission" DROP CONSTRAINT "FK_b1ffd0e0c9731e4dc1745214f26"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "FK_8ee12fc9120493e5ebd83401bb7"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" DROP CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_cfb7e3bfaaf464bf80af3078126"`
    );
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_655feba01f929b0a13e7763b98d"`
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2296b9c3b30149ee24387947f8" ON "enrollment_report_children_child"`
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b035b2da5f18805e351b38e1d8" ON "enrollment_report_children_child"`
    );
    await queryRunner.query(`DROP TABLE "enrollment_report_children_child"`);
    await queryRunner.query(`DROP TABLE "enrollment_report"`);
    await queryRunner.query(`DROP TABLE "child"`);
    await queryRunner.query(`DROP TABLE "family"`);
    await queryRunner.query(`DROP TABLE "income_determination"`);
    await queryRunner.query(`DROP TABLE "enrollment"`);
    await queryRunner.query(`DROP TABLE "funding"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "community_permission"`);
    await queryRunner.query(`DROP TABLE "site_permission"`);
    await queryRunner.query(`DROP TABLE "organization_permission"`);
    await queryRunner.query(`DROP TABLE "funding_space"`);
    await queryRunner.query(
      `DROP INDEX "REL_4c23c29a718e7ffda0223e5aeb" ON "funding_time_split"`
    );
    await queryRunner.query(`DROP TABLE "funding_time_split"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "community"`);
    await queryRunner.query(`DROP TABLE "site"`);
    await queryRunner.query(`DROP TABLE "reporting_period"`);
  }
}
