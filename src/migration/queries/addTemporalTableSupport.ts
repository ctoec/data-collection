const HISTORY_SCHEMA = 'History';
const START_COLUMN = 'SysStartTime';
const END_COLUMN = 'SysEndTime';
const START_CONSTRAINT = (tableName: string) => `DF_${tableName}_SysStart`;
const END_CONSTRAINT = (tableName: string) => `DF_${tableName}_SysEnd`;

export const addHistorySchemaQuery = () => `
	CREATE SCHEMA ${HISTORY_SCHEMA}
`;
export const removeHistorySchemaQuery = () => `
	DROP SCHEMA ${HISTORY_SCHEMA}
`;

// from https://docs.microsoft.com/en-us/sql/relational-databases/tables/creating-a-system-versioned-temporal-table?view=sql-server-ver15#adding-versioning-to-non-temporal-tables
export const addSystemVersioningColumnsToTableQuery = (tableName: string) => `
	ALTER TABLE [${tableName}] ADD
		${START_COLUMN} DATETIME2(0) GENERATED ALWAYS AS ROW START HIDDEN
			CONSTRAINT ${START_CONSTRAINT(tableName)} DEFAULT SYSUTCDATETIME(),
		${END_COLUMN} DATETIME2(0) GENERATED ALWAYS AS ROW END HIDDEN
			CONSTRAINT ${END_CONSTRAINT(
        tableName
      )} DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59'),
		PERIOD FOR SYSTEM_TIME(SysStartTime, SysEndTime)`;

export const turnSystemVersioningOnForTableQuery = (tableName: string) => `
	ALTER TABLE [${tableName}]
		SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [${HISTORY_SCHEMA}].[${tableName}]))
`;

export const turnSystemVersioningOffForTableQuery = (tableName: string) => `
	ALTER TABLE [${tableName}]
		SET (SYSTEM_VERSIONING = OFF)
`;

export const removeSystemVersioningColumnsFromTableQuery = (
  tableName: string
) => `
	ALTER TABLE [${tableName}] DROP
		CONSTRAINT ${START_CONSTRAINT(tableName)},
		CONSTRAINT ${END_CONSTRAINT(tableName)},
		PERIOD FOR SYSTEM_TIME,
		COLUMN ${START_COLUMN},
		COLUMN ${END_COLUMN}
`;
