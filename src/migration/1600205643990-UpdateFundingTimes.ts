import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateFundingTimes1600205643990 implements MigrationInterface {
    name = 'UpdateFundingTimes1600205643990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP CONSTRAINT "UQ_Source_AgeGroup_Time_Organization"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP CONSTRAINT "CK__FundingSpa__Time__25A691D2"`);

        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP COLUMN "Time"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD "Time" nvarchar(255) CHECK( Time IN ('Full time','Part time','Split time','Full-day','Part-day','Extended-day','Extended-year','School-day/School-year') ) NOT NULL`);

        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD CONSTRAINT "CK__FundingSpa__Time__25A691D2" CHECK (([Time]='School-day/School-year' OR [Time]='Extended-year' OR [Time]='Extended-day' OR [Time]='Split time' OR [Time]='Part time' OR [Time]='Full time' OR [Time]='Full-day' OR [Time]='Part-day'))`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("Source", "AgeGroup", "Time", "OrganizationId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP CONSTRAINT "UQ_Source_AgeGroup_Time_Organization"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP CONSTRAINT "CK__FundingSpa__Time__25A691D2"`);

        await queryRunner.query(`ALTER TABLE "FundingSpace" DROP COLUMN "Time"`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD "Time" nvarchar(255) CHECK( Time IN ('Full','Part','Split','ExtendedDay','ExtendedYear','School') ) NOT NULL`);

        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD CONSTRAINT "CK__FundingSpa__Time__25A691D2" CHECK (([Time]='School' OR [Time]='ExtendedYear' OR [Time]='ExtendedDay' OR [Time]='Split' OR [Time]='Part' OR [Time]='Full'))`);
        await queryRunner.query(`ALTER TABLE "FundingSpace" ADD CONSTRAINT "UQ_Source_AgeGroup_Time_Organization" UNIQUE ("Source", "AgeGroup", "Time", "OrganizationId")`);
    }

}
