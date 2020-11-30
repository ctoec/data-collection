import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultsFromChild1606268723397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "child" (
                "raceNotDisclosed" bit,
                "hispanicOrLatinxEthnicity" bit,
                "dualLanguageLearner" bit,
                "foster" bit CONSTRAINT "DF_4f4d36a381d8a984f1e0006f6e9", "receivesDisabilityServices" bit CONSTRAINT "DF_820b6edac45ec4ca39ee34fe0cf")`
        );
        await queryRunner.query(`ALTER TABLE "family" (
            "homelessness" bit CONSTRAINT "DF_ff0d12e7344b70e7bf34b24f6f3"
        )`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "child" (
                "raceNotDisclosed" bit DEFAULT 1,
                "hispanicOrLatinxEthnicity" bit DEFAULT NULL,
                "dualLanguageLearner" bit DEFAULT NULL,
                "foster" bit CONSTRAINT "DF_4f4d36a381d8a984f1e0006f6e9" DEFAULT NULL,
                "receivesDisabilityServices" bit CONSTRAINT "DF_820b6edac45ec4ca39ee34fe0cf" DEFAULT NULL)`
        );
        await queryRunner.query(`ALTER TABLE "family" (
            "homelessness" bit CONSTRAINT "DF_ff0d12e7344b70e7bf34b24f6f3" DEFAULT NULL
        )`)
    }

}
