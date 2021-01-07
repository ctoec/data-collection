import { QueryRunner } from 'typeorm';

export const dropDefaultConstraint = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string
) => {
  const _query = `(SELECT d.name FROM sys.default_constraints AS d INNER JOIN sys.columns AS c ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id WHERE d.parent_object_id = OBJECT_ID(N'${tableName}', N'U') AND c.name = '${columnName}')`;
  const columnConstraints = await queryRunner.query(_query);
  if (!columnConstraints?.length) return;
  const constraintName = columnConstraints[0].name;
  await queryRunner.query(
    `ALTER TABLE "${tableName}" DROP constraint "${constraintName}";`
  );
};
