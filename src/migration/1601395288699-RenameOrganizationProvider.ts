import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameOrganizationProvider1601395288699
  implements MigrationInterface {
  name = 'RenameOrganizationProvider1601395288699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_655feba01f929b0a13e7763b98d"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "FK_8ee12fc9120493e5ebd83401bb7"`
    );
    await queryRunner.query(
      `ALTER TABLE "family" DROP CONSTRAINT "FK_0c99ff0ea285963a5912699025e"`
    );
    await queryRunner.query(
      `ALTER TABLE "child" DROP CONSTRAINT "FK_061d51594e55a089e79f87af612"`
    );

    await queryRunner.query(
      `CREATE TABLE "provider" ("id" int NOT NULL IDENTITY(1,1), "providerName" nvarchar(255) NOT NULL, "communityId" int, CONSTRAINT "UQ_c3b120116ed0adb1b2e231204ee" UNIQUE ("providerName"), CONSTRAINT "PK_6ab2f66d8987bf1bfdd6136a2d5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "provider_permission" ("id" int NOT NULL IDENTITY(1,1), "providerId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_USER_PROVIDER" UNIQUE ("userId", "providerId"), CONSTRAINT "PK_2f631dc6c0288fce6c224f05aeb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "provider_permission" ADD CONSTRAINT "FK_fc83d060a19062df5a308ed024b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "provider_permission" ADD CONSTRAINT "FK_aa0bf62e810e2ab62e64a0a8740" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `INSERT INTO "provider" SELECT providerName, communityId from "organization"`
    );
    await queryRunner.query(`DROP TABLE "organization_permission"`);
    await queryRunner.query(`DROP TABLE "organization"`);

    await queryRunner.query(
      `EXEC sp_rename "site.organizationId", "providerId"`
    );
    await queryRunner.query(
      `EXEC sp_rename "family.organizationId", "providerId"`
    );
    await queryRunner.query(
      `EXEC sp_rename "child.organizationId", "providerId"`
    );
    await queryRunner.query(
      `EXEC sp_rename "funding_space.organizationId", "providerId"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" DROP CONSTRAINT "UQ_Source_AgeGroup_Time_Organization"`
    );
    await queryRunner.query(
      `ALtER TABLE "funding_space" ADD CONSTRAINT "UQ_Source_AgeGroup_Time_Provider" UNIQUE ("source", "ageGroup", "time", "providerId")`
    );

    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_3c085d72863f947f5bcea77096b" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "provider" ADD CONSTRAINT "FK_28df50ee36fe137e27a42b83261" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_space" ADD CONSTRAINT "FK_2cc158fecc6b65d7f6a627c906e" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT "FK_9fc1f470a8b258570983276f510" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT "FK_ff3e4de0e55c2f0085aefd50968" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
