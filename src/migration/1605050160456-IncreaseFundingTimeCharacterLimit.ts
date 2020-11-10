import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseFundingTimeCharacterLimit1605050160456 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_space" ALTER COLUMN "time" varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_space" ALTER COLUMN "time" varchar(20) NOT NULL`);

    }

}
