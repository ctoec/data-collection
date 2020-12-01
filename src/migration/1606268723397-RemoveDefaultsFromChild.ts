import { MigrationInterface, QueryRunner } from 'typeorm';
import { dropDefaultConstraint } from './utils/dropDefaultConstraint';

export class RemoveDefaultsFromChild1606268723397
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const makeBooleansIntoVarChars = async (tableName, columnName) => {
      await queryRunner.query(
        `ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" varchar(20);`
      );
    };

    await dropDefaultConstraint(queryRunner, 'child', 'raceNotDisclosed');

    await dropDefaultConstraint(
      queryRunner,
      'child',
      'hispanicOrLatinxEthnicity'
    );
    await makeBooleansIntoVarChars('child', 'hispanicOrLatinxEthnicity');

    await dropDefaultConstraint(queryRunner, 'child', 'dualLanguageLearner');
    await makeBooleansIntoVarChars('child', 'dualLanguageLearner');

    await dropDefaultConstraint(queryRunner, 'child', 'foster');
    await makeBooleansIntoVarChars('child', 'foster');

    await dropDefaultConstraint(
      queryRunner,
      'child',
      'receivesDisabilityServices'
    );
    await makeBooleansIntoVarChars('child', 'receivesDisabilityServices');

    await dropDefaultConstraint(queryRunner, 'family', 'homelessness');
    await makeBooleansIntoVarChars('family', 'homelessness');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "raceNotDisclosed";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "hispanicOrLatinxEthnicity";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "dualLanguageLearner";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "foster";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "receivesDisabilityServices";`
    );

    await queryRunner.query(
      `ALTER TABLE "family" ADD CONSTRAINT null_default DEFAULT NULL FOR "homelessness";`
    );
  }
}
