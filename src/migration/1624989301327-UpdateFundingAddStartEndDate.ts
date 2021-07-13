import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFundingAddStartEndDate1624989301327
  implements MigrationInterface {
  name = 'UpdateFundingAddStartEndDate1624989301327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funding" ADD "startDate" date`);
    await queryRunner.query(`ALTER TABLE "funding" ADD "endDate" date`);

    // populate values with enrollment start/end date for enrollments with a single funding, \
    // or with reporting period start/end dates for enrollments with multiple fundings
    await queryRunner.query(`
					UPDATE funding
					SET	
						funding.startDate = (
							CASE 
								WHEN isMultiple = 0 THEN entry else firstReportingPeriod.periodStart
							END
						),
						funding.endDate = (
							CASE
								WHEN isMultiple = 0 THEN [exit] else lastReportingPeriod.periodEnd
							END
						)
					FROM funding
					JOIN reporting_period lastReportingPeriod
					ON funding.lastReportingPeriodId = lastReportingPeriod.id
					JOIN reporting_period firstReportingPeriod
					ON funding.firstReportingPeriodId = firstReportingPeriod.id
					JOIN (
						SELECT
							enrollment.id,
							entry,
							[exit],
							CASE 
								WHEN count(*) > 1 THEN 1 ELSE 0 
							END as isMultiple
						FROM enrollment 
						JOIN funding 
						ON enrollment.id = funding.enrollmentid
						GROUP BY enrollment.id, enrollment.entry, enrollment.[exit]
					) AS computed
					ON computed.id = funding.enrollmentId
				`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "funding" DROP COLUMN "startDate"`);
  }
}
