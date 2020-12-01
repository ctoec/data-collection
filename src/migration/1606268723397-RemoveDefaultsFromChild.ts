import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultsFromChild1606268723397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const dropDefaultConstraint = async (tableName, columnName) => {
            const _query = `(SELECT d.name FROM sys.default_constraints AS d INNER JOIN sys.columns AS c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id WHERE d.parent_object_id = OBJECT_ID(N'${tableName}', N'U') AND c.name = '${columnName}')`
            const columnConstraints = await queryRunner.query(_query);
            if (!columnConstraints?.length) return;
            const constraintName = columnConstraints[0].name
            await queryRunner.query(`ALTER TABLE "${tableName}" DROP constraint "${constraintName}";`);
        }

        const makeBooleansIntoVarChars = async (tableName, columnName) => {
            await queryRunner.query(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" varchar(20);`);
        }

        await dropDefaultConstraint('child', 'raceNotDisclosed');
        await makeBooleansIntoVarChars('child', 'raceNotDisclosed');

        await dropDefaultConstraint('child', 'hispanicOrLatinxEthnicity');
        await makeBooleansIntoVarChars('child', 'hispanicOrLatinxEthnicity');

        await dropDefaultConstraint('child', 'dualLanguageLearner');
        await makeBooleansIntoVarChars('child', 'dualLanguageLearner');

        await dropDefaultConstraint('child', 'foster');
        await makeBooleansIntoVarChars('child', 'foster');

        await dropDefaultConstraint('child', 'receivesDisabilityServices');
        await makeBooleansIntoVarChars('child', 'receivesDisabilityServices');

        await dropDefaultConstraint('family', 'homelessness');
        await makeBooleansIntoVarChars('family', 'homelessness');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "raceNotDisclosed";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "hispanicOrLatinxEthnicity";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "dualLanguageLearner";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "foster";ALTER TABLE "child" ADD CONSTRAINT null_default DEFAULT NULL FOR "receivesDisabilityServices";`);

        await queryRunner.query(`ALTER TABLE "family" ADD CONSTRAINT null_default DEFAULT NULL FOR "homelessness";`)
    }

}
