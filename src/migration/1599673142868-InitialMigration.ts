import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1599673142868 implements MigrationInterface {
  name = 'InitialMigration1599673142868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ReportingPeriod" ("Id" int NOT NULL IDENTITY(1,1), "Type" nvarchar(255) CHECK( Type IN ('CDC','CSR','PSR','SHS','SS') ) NOT NULL, "Period" date NOT NULL, "PeriodStart" date NOT NULL, "PeriodEnd" date NOT NULL, "DueAt" date NOT NULL, CONSTRAINT "UQ_Type_Period" UNIQUE ("Type", "Period"), CONSTRAINT "PK_21f72cb351d3f86f8398bb19dbb" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Site" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, "TitleI" bit NOT NULL, "Region" nvarchar(255) CHECK( Region IN ('East','NorthCentral','NorthWest','SouthCentral','SouthWest') ) NOT NULL, "FacilityCode" int, "LicenseNumber" int, "NaeycId" int, "RegistryId" int, "OrganizationId" int NOT NULL, CONSTRAINT "UQ_c2c6cc4e3ff1f5fc156f83a8459" UNIQUE ("Name"), CONSTRAINT "PK_312fecde1b0392374c33607a6c0" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Community" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, CONSTRAINT "PK_94cae3d511de825c35073692c18" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Organization" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, "CommunityId" int, CONSTRAINT "UQ_0543cf9984fc328b9fcc153dfd9" UNIQUE ("Name"), CONSTRAINT "PK_1a7da32ee48fd92c4bea7ae0f8d" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "FundingTimeSplit" ("Id" int NOT NULL IDENTITY(1,1), "FullTimeWeeks" int NOT NULL, "PartTimeWeeks" int NOT NULL, "FundingSpaceId" int NOT NULL, CONSTRAINT "PK_15d30451f23048ad46983d1d687" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_96d530e062d21fc09bce5ece40" ON "FundingTimeSplit" ("FundingSpaceId") WHERE "FundingSpaceId" IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE TABLE "FundingSpace" ("Id" int NOT NULL IDENTITY(1,1), "Capacity" int NOT NULL, "Source" nvarchar(255) CHECK( Source IN ('CDC','CSR','PSR','SHS','SS') ) NOT NULL, "AgeGroup" nvarchar(255) CHECK( AgeGroup IN ('Infant/toddler','Preschool','School aged') ) NOT NULL, "Time" nvarchar(255) CHECK( Time IN ('Full','Part','Split','ExtendedDay','ExtendedYear','School') ) NOT NULL, "OrganizationId" int NOT NULL, CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("Source", "AgeGroup", "Time", "OrganizationId"), CONSTRAINT "PK_a00aff23a67b89f94e902436500" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "OrganizationPermission" ("Id" int NOT NULL IDENTITY(1,1), "OrganizationId" int NOT NULL, "UserId" int NOT NULL, CONSTRAINT "UQ_USER_ORGANIZATION" UNIQUE ("UserId", "OrganizationId"), CONSTRAINT "PK_c8453d2fa50a20f9e085b2f28df" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "SitePermission" ("Id" int NOT NULL IDENTITY(1,1), "SiteId" int NOT NULL, "UserId" int NOT NULL, CONSTRAINT "UQ_USER_SITE" UNIQUE ("UserId", "SiteId"), CONSTRAINT "PK_da7d5fc9b973772058150c83cd9" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "CommunityPermission" ("Id" int NOT NULL IDENTITY(1,1), "CommunityId" int NOT NULL, "UserId" int NOT NULL, CONSTRAINT "UQ_USER_COMMUNITY" UNIQUE ("UserId", "CommunityId"), CONSTRAINT "PK_56c2fb29208221e9a2f3bd8dafd" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("Id" int NOT NULL IDENTITY(1,1), "WingedKeysId" nvarchar(255) NOT NULL, "FirstName" nvarchar(255) NOT NULL, "LastName" nvarchar(255) NOT NULL, "MiddleName" nvarchar(255), "Suffix" nvarchar(255), CONSTRAINT "UQ_14a0232397284aa86dc3a2d9536" UNIQUE ("WingedKeysId"), CONSTRAINT "PK_a2b5a287e6d9e8f01962cc3d630" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Funding" ("Id" int NOT NULL IDENTITY(1,1), "EnrollmentId" int NOT NULL, "FundingSpaceId" int NOT NULL, "FirstReportingPeriodId" int NOT NULL, "LastReportingPeriodId" int, "AuthorId" int, "UpdatedAt" datetime2 NOT NULL CONSTRAINT "DF_3e93fa3f925f4a647508819cc77" DEFAULT getdate(), CONSTRAINT "PK_9734e83805242ae08be151b7217" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Enrollment" ("Id" int NOT NULL IDENTITY(1,1), "ChildId" uniqueidentifier NOT NULL, "SiteId" int NOT NULL, "AgeGroup" nvarchar(255) CHECK( AgeGroup IN ('Infant/toddler','Preschool','School aged') ), "Entry" date, "Exit" date, "ExitReason" nvarchar(255), "AuthorId" int, "UpdatedAt" datetime2 NOT NULL CONSTRAINT "DF_bc9bb930feb20b4f868cd060189" DEFAULT getdate(), CONSTRAINT "PK_229a753ec8ea277304dc2ecb8f4" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "IncomeDetermination" ("Id" int NOT NULL IDENTITY(1,1), "NumberOfPeople" int, "Income" decimal(14,2), "DeterminationDate" date, "FamilyId" int NOT NULL, "AuthorId" int, "UpdatedAt" datetime2 NOT NULL CONSTRAINT "DF_f1b96e21f76fbedddbdab2c9ecd" DEFAULT getdate(), CONSTRAINT "PK_6ac250a478fdeb1cda6cdf00ba5" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Family" ("Id" int NOT NULL IDENTITY(1,1), "StreetAddress" nvarchar(255), "Town" nvarchar(255), "State" nvarchar(255), "Zip" nvarchar(255), "Homelessness" bit, "OrganizationId" int NOT NULL, "AuthorId" int, "UpdatedAt" datetime2 NOT NULL CONSTRAINT "DF_c53cf5601ac972459ea5ede8d6e" DEFAULT getdate(), CONSTRAINT "PK_b020d9e834687c16a2a3abb57c0" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Child" ("Id" uniqueidentifier NOT NULL CONSTRAINT "DF_9d277931762d2bab107b205769a" DEFAULT NEWSEQUENTIALID(), "Sasid" nvarchar(255), "FirstName" nvarchar(255) NOT NULL, "MiddleName" nvarchar(255), "LastName" nvarchar(255) NOT NULL, "Suffix" nvarchar(255), "Birthdate" date, "BirthTown" nvarchar(255), "BirthState" nvarchar(255), "BirthCertificateId" nvarchar(255), "AmericanIndianOrAlaskaNative" bit, "Asian" bit, "BlackOrAfricanAmerican" bit, "NativeHawaiianOrPacificIslander" bit, "White" bit, "HispanicOrLatinxEthnicity" bit, "Gender" nvarchar(255) CHECK( Gender IN ('Male','Female','Nonbinary','Unknown','Not Specified') ), "Foster" bit, "ReceivesC4K" bit NOT NULL CONSTRAINT "DF_25971726a4a598d73238dd61fae" DEFAULT 0, "ReceivesSpecialEducationServices" bit, "SpecialEducationServicesType" nvarchar(255) CHECK( SpecialEducationServicesType IN ('LEA','Non LEA') ), "FamilyId" int NOT NULL, "OrganizationId" int NOT NULL, "AuthorId" int, "UpdatedAt" datetime2 NOT NULL CONSTRAINT "DF_d241df9e73e337d9d7dbdc2ecb2" DEFAULT getdate(), CONSTRAINT "PK_9d277931762d2bab107b205769a" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "FlattenedEnrollment" ("Id" int NOT NULL IDENTITY(1,1), "ReportId" int NOT NULL, "Name" nvarchar(255), "Sasid" nvarchar(255), "DateOfBirth" date, "BirthCertificateId" nvarchar(255), "TownOfBirth" nvarchar(255), "StateOfBirth" nvarchar(255), "AmericanIndianOrAlaskaNative" bit, "Asian" bit, "BlackOrAfricanAmerican" bit, "NativeHawaiianOrPacificIslander" bit, "White" bit, "HispanicOrLatinxEthnicity" bit, "Gender" nvarchar(255), "DualLanguageLearner" bit, "ReceivingSpecialEducationServices" bit, "SpecialEducationServicesType" nvarchar(255), "StreetAddress" nvarchar(255), "Town" nvarchar(255), "State" nvarchar(255), "Zipcode" nvarchar(255), "LivesWithFosterFamily" bit, "ExperiencedHomelessnessOrHousingInsecurity" bit, "HouseholdSize" int, "AnnualHouseholdIncome" decimal(14,2), "IncomeDeterminationDate" date, "Provider" nvarchar(255), "Site" nvarchar(255), "Model" nvarchar(255), "AgeGroup" nvarchar(255), "EnrollmentStartDate" date, "EnrollmentEndDate" date, "EnrollmentExitReason" nvarchar(255), "FundingType" nvarchar(255), "SpaceType" nvarchar(255), "FirstFundingPeriod" date, "LastFundingPeriod" date, "ReceivingCareForKids" bit, CONSTRAINT "PK_8da39568b3fc9e7e768292f152c" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "EnrollmentReport" ("Id" int NOT NULL IDENTITY(1,1), CONSTRAINT "PK_7b86c62c17c9faf992c452d135f" PRIMARY KEY ("Id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Site" ADD CONSTRAINT "FK_ad9205deeda0d0a55ac3b708219" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Organization" ADD CONSTRAINT "FK_a2ce5b885a08cdb0a66ff1c267e" FOREIGN KEY ("CommunityId") REFERENCES "Community"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FundingTimeSplit" ADD CONSTRAINT "FK_96d530e062d21fc09bce5ece408" FOREIGN KEY ("FundingSpaceId") REFERENCES "FundingSpace"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FundingSpace" ADD CONSTRAINT "FK_34d768711db50b5bfa056a05454" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "OrganizationPermission" ADD CONSTRAINT "FK_8502c2082d6d85080280e7a2c9a" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "OrganizationPermission" ADD CONSTRAINT "FK_e200b497e3f8c633abb6bf94eb5" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "SitePermission" ADD CONSTRAINT "FK_44192de3af50389cd365ebd885f" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "SitePermission" ADD CONSTRAINT "FK_baa50a3f8f72408c4cdb5cfc674" FOREIGN KEY ("SiteId") REFERENCES "Site"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "CommunityPermission" ADD CONSTRAINT "FK_c77138b9afc6b2458238bc2217e" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "CommunityPermission" ADD CONSTRAINT "FK_94852ad8615b1121f5265616693" FOREIGN KEY ("CommunityId") REFERENCES "Community"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" ADD CONSTRAINT "FK_f3628ff02764bc2a84156513bd2" FOREIGN KEY ("EnrollmentId") REFERENCES "Enrollment"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" ADD CONSTRAINT "FK_f5e85c3150a09ef1ed298ff7ddf" FOREIGN KEY ("FundingSpaceId") REFERENCES "FundingSpace"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" ADD CONSTRAINT "FK_136ddadffe539dba418377f37b1" FOREIGN KEY ("FirstReportingPeriodId") REFERENCES "ReportingPeriod"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" ADD CONSTRAINT "FK_8c9feef26f50e842bbf730f51fa" FOREIGN KEY ("LastReportingPeriodId") REFERENCES "ReportingPeriod"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" ADD CONSTRAINT "FK_1af7d9d60cb6df638a2de29df6f" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_4b4f668d69c397918629aa6015e" FOREIGN KEY ("ChildId") REFERENCES "Child"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_e8355ebecb81faf4bc834c44e5f" FOREIGN KEY ("SiteId") REFERENCES "Site"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_83d974a386030311721fa1ca7e9" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "IncomeDetermination" ADD CONSTRAINT "FK_a4413ae2fdf0d008875212998ab" FOREIGN KEY ("FamilyId") REFERENCES "Family"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "IncomeDetermination" ADD CONSTRAINT "FK_864674e619d18b85ecfc7df258f" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Family" ADD CONSTRAINT "FK_a7cb16665092af34dbb0f9b66a4" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Family" ADD CONSTRAINT "FK_b9a37f538721c5a8d622661cebd" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" ADD CONSTRAINT "FK_4376361d4cf26778f792348a676" FOREIGN KEY ("FamilyId") REFERENCES "Family"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" ADD CONSTRAINT "FK_63a626a1f7d4cd21f7d5a757b99" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" ADD CONSTRAINT "FK_29852dfd589bb7b79eae2093f6a" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "FlattenedEnrollment" ADD CONSTRAINT "FK_4419c5328fbd6671edf6b926e71" FOREIGN KEY ("ReportId") REFERENCES "EnrollmentReport"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FlattenedEnrollment" DROP CONSTRAINT "FK_4419c5328fbd6671edf6b926e71"`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" DROP CONSTRAINT "FK_29852dfd589bb7b79eae2093f6a"`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" DROP CONSTRAINT "FK_63a626a1f7d4cd21f7d5a757b99"`
    );
    await queryRunner.query(
      `ALTER TABLE "Child" DROP CONSTRAINT "FK_4376361d4cf26778f792348a676"`
    );
    await queryRunner.query(
      `ALTER TABLE "Family" DROP CONSTRAINT "FK_b9a37f538721c5a8d622661cebd"`
    );
    await queryRunner.query(
      `ALTER TABLE "Family" DROP CONSTRAINT "FK_a7cb16665092af34dbb0f9b66a4"`
    );
    await queryRunner.query(
      `ALTER TABLE "IncomeDetermination" DROP CONSTRAINT "FK_864674e619d18b85ecfc7df258f"`
    );
    await queryRunner.query(
      `ALTER TABLE "IncomeDetermination" DROP CONSTRAINT "FK_a4413ae2fdf0d008875212998ab"`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_83d974a386030311721fa1ca7e9"`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_e8355ebecb81faf4bc834c44e5f"`
    );
    await queryRunner.query(
      `ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_4b4f668d69c397918629aa6015e"`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" DROP CONSTRAINT "FK_1af7d9d60cb6df638a2de29df6f"`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" DROP CONSTRAINT "FK_8c9feef26f50e842bbf730f51fa"`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" DROP CONSTRAINT "FK_136ddadffe539dba418377f37b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" DROP CONSTRAINT "FK_f5e85c3150a09ef1ed298ff7ddf"`
    );
    await queryRunner.query(
      `ALTER TABLE "Funding" DROP CONSTRAINT "FK_f3628ff02764bc2a84156513bd2"`
    );
    await queryRunner.query(
      `ALTER TABLE "CommunityPermission" DROP CONSTRAINT "FK_94852ad8615b1121f5265616693"`
    );
    await queryRunner.query(
      `ALTER TABLE "CommunityPermission" DROP CONSTRAINT "FK_c77138b9afc6b2458238bc2217e"`
    );
    await queryRunner.query(
      `ALTER TABLE "SitePermission" DROP CONSTRAINT "FK_baa50a3f8f72408c4cdb5cfc674"`
    );
    await queryRunner.query(
      `ALTER TABLE "SitePermission" DROP CONSTRAINT "FK_44192de3af50389cd365ebd885f"`
    );
    await queryRunner.query(
      `ALTER TABLE "OrganizationPermission" DROP CONSTRAINT "FK_e200b497e3f8c633abb6bf94eb5"`
    );
    await queryRunner.query(
      `ALTER TABLE "OrganizationPermission" DROP CONSTRAINT "FK_8502c2082d6d85080280e7a2c9a"`
    );
    await queryRunner.query(
      `ALTER TABLE "FundingSpace" DROP CONSTRAINT "FK_34d768711db50b5bfa056a05454"`
    );
    await queryRunner.query(
      `ALTER TABLE "FundingTimeSplit" DROP CONSTRAINT "FK_96d530e062d21fc09bce5ece408"`
    );
    await queryRunner.query(
      `ALTER TABLE "Organization" DROP CONSTRAINT "FK_a2ce5b885a08cdb0a66ff1c267e"`
    );
    await queryRunner.query(
      `ALTER TABLE "Site" DROP CONSTRAINT "FK_ad9205deeda0d0a55ac3b708219"`
    );
    await queryRunner.query(`DROP TABLE "EnrollmentReport"`);
    await queryRunner.query(`DROP TABLE "FlattenedEnrollment"`);
    await queryRunner.query(`DROP TABLE "Child"`);
    await queryRunner.query(`DROP TABLE "Family"`);
    await queryRunner.query(`DROP TABLE "IncomeDetermination"`);
    await queryRunner.query(`DROP TABLE "Enrollment"`);
    await queryRunner.query(`DROP TABLE "Funding"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "CommunityPermission"`);
    await queryRunner.query(`DROP TABLE "SitePermission"`);
    await queryRunner.query(`DROP TABLE "OrganizationPermission"`);
    await queryRunner.query(`DROP TABLE "FundingSpace"`);
    await queryRunner.query(
      `DROP INDEX "REL_96d530e062d21fc09bce5ece40" ON "FundingTimeSplit"`
    );
    await queryRunner.query(`DROP TABLE "FundingTimeSplit"`);
    await queryRunner.query(`DROP TABLE "Organization"`);
    await queryRunner.query(`DROP TABLE "Community"`);
    await queryRunner.query(`DROP TABLE "Site"`);
    await queryRunner.query(`DROP TABLE "ReportingPeriod"`);
  }
}
