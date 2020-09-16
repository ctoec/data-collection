import {MigrationInterface, QueryRunner} from "typeorm";

export class SplitNames1600191393417 implements MigrationInterface {
    name = 'SplitNames1600191393417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" DROP COLUMN "Name"`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" ADD "FirstName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" ADD "MiddleName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" ADD "LastName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" ADD "Suffix" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" DROP COLUMN "Suffix"`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" DROP COLUMN "LastName"`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" DROP COLUMN "MiddleName"`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" DROP COLUMN "FirstName"`);
        await queryRunner.query(`ALTER TABLE "FlattenedEnrollment" ADD "Name" nvarchar(255)`);
    }

}
