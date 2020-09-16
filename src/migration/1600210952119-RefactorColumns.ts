import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorColumns1600210952119 implements MigrationInterface {
  name = 'RefactorColumns1600210952119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.DateOfBirth", "Birthdate"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.TownOfBirth", "BirthTown"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.StateOfBirth", "BirthState"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ReceivingSpecialEducationServices", "ReceivesSpecialEducationServices"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Zipcode", "Zip"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.LivesWithFosterFamily", "Foster"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ExperiencedHomelessnessOrHousingInsecurity", "Homelessness"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.HouseholdSize", "NumberOfPeople"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.AnnualHouseholdIncome", "Income"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.IncomeDeterminationDate", "DeterminationDate"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Provider", "ProviderName"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Site", "SiteName"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.EnrollmentStartDate", "Entry"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.EnrollmentEndDate", "Exit"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.EnrollmentExitReason", "ExitReason"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.FundingType", "Source"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.SpaceType", "Time"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ReceivingCareForKids", "ReceivesC4K"`
    );
    await queryRunner.query(`ALTER TABLE "Child" ADD "Name" nvarchar(255)`);
    await queryRunner.query(`EXEC sp_rename "Site.Name", "SiteName"`);
    await queryRunner.query(
      `EXEC sp_rename "Organization.Name", "ProviderName"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Birthdate", "DateOfBirth"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.BirthState", "TownOfBirth"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.BirthState", "StateOfBirth"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ReceivesSpecialEducationServices, "ReceivingSpecialEducationServices"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Zip", "Zipcode"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Foster", "LivesWithFosterFamily"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Homelessness", "ExperiencedHomelessnessOrHousingInsecurity"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.NumberOfPeople", "HouseholdSize"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Income", "AnnualHouseholdIncome"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.DeterminationDate", "IncomeDeterminationDate"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ProviderName", "Provider"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.SiteName", "Site"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Entry", "EnrollmentStartDate"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Exit", "EnrollmentEndDate"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ExitReason", "EnrollmentExitReason"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Source", "FundingType"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.Time", "SpaceType"`
    );
    await queryRunner.query(
      `EXEC sp_rename "FlattenedEnrollment.ReceivesC4K", "ReceivingCareForKids"`
    );
    await queryRunner.query(`ALTER TABLE "Child" DROP "Name"`);
    await queryRunner.query(`EXEC sp_rename "Site.SiteName", "Name"`);
    await queryRunner.query(
      `EXEC sp_rename "Organization.ProviderName", "Provider"`
    );
  }
}
