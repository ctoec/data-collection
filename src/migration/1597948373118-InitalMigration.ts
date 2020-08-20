import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitalMigration1597948373118 implements MigrationInterface {
  name = 'InitalMigration1597948373118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "reporting_period_type_enum" AS ENUM('CDC', 'CSR', 'PSR', 'SHS', 'SS')`
    );
    await queryRunner.query(
      `CREATE TABLE "reporting_period" ("id" SERIAL NOT NULL, "type" "reporting_period_type_enum" NOT NULL, "period" date NOT NULL, "periodStart" date NOT NULL, "periodEnd" date NOT NULL, "dueAt" date NOT NULL, CONSTRAINT "UQ_Type_Period" UNIQUE ("type", "period"), CONSTRAINT "PK_273d2b68dc1854618ec53e144d0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "site_region_enum" AS ENUM('East', 'NorthCentral', 'NorthWest', 'SouthCentral', 'SouthWest')`
    );
    await queryRunner.query(
      `CREATE TABLE "site" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "titleI" boolean NOT NULL, "region" "site_region_enum" NOT NULL, "facilityCode" integer, "licenseNumber" integer, "naeycId" integer, "registryId" integer, "organizationId" integer NOT NULL, CONSTRAINT "UQ_9669a09fcc0eb6d2794a658f647" UNIQUE ("name"), CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "communityId" integer, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "funding_time_split" ("id" SERIAL NOT NULL, "fullTimeWeeks" integer NOT NULL, "partTimeWeeks" integer NOT NULL, "fundingSpaceId" integer NOT NULL, CONSTRAINT "REL_4c23c29a718e7ffda0223e5aeb" UNIQUE ("fundingSpaceId"), CONSTRAINT "PK_b7e03c4f3dc577282ba66e70663" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "funding_space_source_enum" AS ENUM('CDC', 'CSR', 'PSR', 'SHS', 'SS')`
    );
    await queryRunner.query(
      `CREATE TYPE "funding_space_agegroup_enum" AS ENUM('InfantToddler', 'Preschool', 'SchoolAge')`
    );
    await queryRunner.query(
      `CREATE TYPE "funding_space_time_enum" AS ENUM('Full', 'Part', 'Split', 'ExtendedDay', 'ExtendedYear', 'School')`
    );
    await queryRunner.query(
      `CREATE TABLE "funding_space" ("id" SERIAL NOT NULL, "capacity" integer NOT NULL, "source" "funding_space_source_enum" NOT NULL, "ageGroup" "funding_space_agegroup_enum" NOT NULL, "time" "funding_space_time_enum" NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "UQ_Source_AgeGroup_Time" UNIQUE ("source", "ageGroup", "time"), CONSTRAINT "PK_0f92a2c9df81f7cecc05d28c99d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "permission_type_enum" AS ENUM('1', '2')`
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "type" "permission_type_enum" NOT NULL, "userId" integer NOT NULL, "organizationId" integer, "siteId" integer, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_71bf2818fb2ad92e208d7aeadf" ON "permission" ("type") `
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "wingedKeysId" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying, "suffix" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "funding" ("id" SERIAL NOT NULL, "enrollmentId" integer NOT NULL, "fundingSpaceId" integer NOT NULL, "firstReportingPeriodId" integer, "lastReportingPeriodId" integer, "authorId" integer, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_096afc0d11a08deb52da61f039e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "enrollment_agegroup_enum" AS ENUM('InfantToddler', 'Preschool', 'SchoolAge')`
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment" ("id" SERIAL NOT NULL, "childId" uuid NOT NULL, "siteId" integer NOT NULL, "ageGroup" "enrollment_agegroup_enum", "entry" date, "exit" date, "exitReason" character varying, "authorId" integer, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "income_determination" ("id" SERIAL NOT NULL, "numberOfPeople" integer, "income" numeric(14,2), "determinationDate" TIMESTAMP, "familyId" integer NOT NULL, "authorId" integer, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bab8509559a5caf486bf1bdd99b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "family" ("id" SERIAL NOT NULL, "streetAddress" character varying, "town" character varying, "state" character varying, "zip" character varying, "homelessness" boolean, "organizationId" integer NOT NULL, "authorId" integer, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba386a5a59c3de8593cda4e5626" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "child_gender_enum" AS ENUM('Male', 'Female', 'Nonbinary', 'Unknown', 'Not Specified')`
    );
    await queryRunner.query(
      `CREATE TYPE "child_specialeducationservicestype_enum" AS ENUM('LEA', 'Non LEA')`
    );
    await queryRunner.query(
      `CREATE TABLE "child" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sasid" character varying, "firstName" character varying NOT NULL, "middleName" character varying, "lastName" character varying NOT NULL, "suffix" character varying, "birthdate" TIMESTAMP, "birthTown" character varying, "birthState" character varying, "birthCertificateId" character varying, "americanIndianOrAlaskaNative" boolean, "asian" boolean, "blackOrAfricanAmerican" boolean, "nativeHawaiianOrPacificIslander" boolean, "white" boolean, "hispanicOrLatinxEthnicity" boolean, "gender" "child_gender_enum", "foster" boolean, "recievesC4K" boolean NOT NULL DEFAULT false, "recievesSpecialEducationServices" boolean, "specialEducationServicesType" "child_specialeducationservicestype_enum", "familyId" integer NOT NULL, "organizationId" integer NOT NULL, "authorId" integer, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "community" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "flattened_enrollment" ("id" SERIAL NOT NULL, "name" character varying, "sasid" character varying, "dateOfBirth" TIMESTAMP, "birthCertificateId" character varying, "townOfBirth" character varying, "stateOfBirth" character varying, "americanIndianOrAlaskaNative" boolean, "asian" boolean, "blackOrAfricanAmerican" boolean, "nativeHawaiianOrPacificIslander" boolean, "white" boolean, "hispanicOrLatinxEthnicity" boolean, "gender" character varying, "dualLanguageLearner" boolean, "receivingSpecialEducationServices" boolean, "specialEducationServicesType" character varying, "streetAddress" character varying, "town" character varying, "state" character varying, "zipcode" character varying, "livesWithFosterFamily" boolean, "experiencedHomelessnessOrHousingInsecurity" boolean, "householdSize" integer, "annualHouseholdIncome" numeric(14,2), "incomeDeterminationDate" TIMESTAMP, "provider" character varying, "site" character varying, "model" character varying, "ageGroup" character varying, "enrollmentStartDate" TIMESTAMP, "enrollmentEndDate" TIMESTAMP, "enrollmentExitReason" character varying, "fundingType" character varying, "spaceType" character varying, "firstFundingPeriod" character varying, "lastFundingPeriod" character varying, "receivingCareForKids" boolean, "reportId" integer NOT NULL, CONSTRAINT "PK_ec816f97751eaf598f110e72340" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "enrollment_report" ("id" SERIAL NOT NULL, CONSTRAINT "PK_2e40a5e41f8b10526d0d9bfff6d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_655feba01f929b0a13e7763b98d" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" ADD CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4" FOREIGN KEY ("fundingSpaceId") REFERENCES "funding_space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "FK_8ee12fc9120493e5ebd83401bb7" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_c60570051d297d8269fcdd9bc47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_2102b10c8a5424189ac612ca8d9" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_2e2fe8d82096768938904a4ab88" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_ba7ba20faacb49e6578db48c654" FOREIGN KEY ("enrollmentId") REFERENCES "enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_cc0fd2c4a35f007073eef30a224" FOREIGN KEY ("childId") REFERENCES "child"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
      `ALTER TABLE "flattened_enrollment" ADD CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18" FOREIGN KEY ("reportId") REFERENCES "enrollment_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flattened_enrollment" DROP CONSTRAINT "FK_5697f722fce34f3025c4b5e0a18"`
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
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_2e2fe8d82096768938904a4ab88"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_2102b10c8a5424189ac612ca8d9"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_c60570051d297d8269fcdd9bc47"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "FK_8ee12fc9120493e5ebd83401bb7"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_time_split" DROP CONSTRAINT "FK_4c23c29a718e7ffda0223e5aeb4"`
    );
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_655feba01f929b0a13e7763b98d"`
    );
    await queryRunner.query(`DROP TABLE "enrollment_report"`);
    await queryRunner.query(`DROP TABLE "flattened_enrollment"`);
    await queryRunner.query(`DROP TABLE "community"`);
    await queryRunner.query(`DROP TABLE "child"`);
    await queryRunner.query(
      `DROP TYPE "child_specialeducationservicestype_enum"`
    );
    await queryRunner.query(`DROP TYPE "child_gender_enum"`);
    await queryRunner.query(`DROP TABLE "family"`);
    await queryRunner.query(`DROP TABLE "income_determination"`);
    await queryRunner.query(`DROP TABLE "enrollment"`);
    await queryRunner.query(`DROP TYPE "enrollment_agegroup_enum"`);
    await queryRunner.query(`DROP TABLE "funding"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "IDX_71bf2818fb2ad92e208d7aeadf"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TYPE "permission_type_enum"`);
    await queryRunner.query(`DROP TABLE "funding_space"`);
    await queryRunner.query(`DROP TYPE "funding_space_time_enum"`);
    await queryRunner.query(`DROP TYPE "funding_space_agegroup_enum"`);
    await queryRunner.query(`DROP TYPE "funding_space_source_enum"`);
    await queryRunner.query(`DROP TABLE "funding_time_split"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "site"`);
    await queryRunner.query(`DROP TYPE "site_region_enum"`);
    await queryRunner.query(`DROP TABLE "reporting_period"`);
    await queryRunner.query(`DROP TYPE "reporting_period_type_enum"`);
  }
}
