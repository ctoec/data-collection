import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultsFromChild1606268723397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "child" ("raceNotDisclosed" bit DEFAULT 1, "hispanicOrLatinxEthnicity" bit DEFAULT NULL, "gender" varchar(20), "dualLanguageLearner" bit DEFAULT NULL, "foster" bit CONSTRAINT "DF_4f4d36a381d8a984f1e0006f6e9" DEFAULT NULL, "receivesDisabilityServices" bit CONSTRAINT "DF_820b6edac45ec4ca39ee34fe0cf" DEFAULT NULL, "specialEducationServicesType" varchar(20), "familyId" int, "organizationId" int NOT NULL, "authorId" int, "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_584ad2a7bdda2e07087016f7b1b" DEFAULT getdate(), CONSTRAINT "PK_4609b9b323ca37c6bc435ec4b6b" PRIMARY KEY ("id"))`
        );
    }

}
