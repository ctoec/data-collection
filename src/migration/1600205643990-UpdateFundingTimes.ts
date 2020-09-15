import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateFundingTimes1600205643990 implements MigrationInterface {
    name = 'UpdateFundingTimes1600205643990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP COLUMN "Time"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD "Time" nvarchar(255) CHECK( Time IN ('Full time','Part time','Split time','Full-day','Part-day','Extended-day','Extended-year','School-day/School-year') ) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP COLUMN "Time"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD "Time" nvarchar(255) CHECK( Time IN ('Full','Part','Split','ExtendedDay','ExtendedYear','School') ) NOT NULL`);
    }

}
