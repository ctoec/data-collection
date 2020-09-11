const HISTORY_SCHEMA = 'History';

export const addHistorySchemaQuery = () => `
	CREATE SCHEMA ${HISTORY_SCHEMA}
`;

// from https://docs.microsoft.com/en-us/sql/relational-databases/tables/creating-a-system-versioned-temporal-table?view=sql-server-ver15#adding-versioning-to-non-temporal-tables
export const addSystemVersioningColumnsToTableQuery = (tableName: string) => `
	ALTER TABLE ${tableName} ADD
		SysStartTime DATETIME2(0) GENERATED ALWAYS AS ROW START HIDDEN
			CONSTRAINT DF_${tableName}_SysStart DEFAULT SYSUTCDATETIME(),
		SysEndTime DATETIME2(0) GENERATED ALWAYS AS ROW END HIDDEN
			CONSTRAINT DF_${tableName}_SysEnd DEFAULT CONVERT(DATETIME2, '9999-12-31 23:59:59'),
		PERIOD FOR SYSTEM_TIME(SysStartTime, SysEndTime)`;

export const turnSystemVersioningOnForTableQuery = (tableName: string) => `
	ALTER TABLE ${tableName}
		SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = ${HISTORY_SCHEMA}.${tableName}))
`;
