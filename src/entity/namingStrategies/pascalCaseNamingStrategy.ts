import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

const camelToUpper = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
/**
 * Custom naming strategy to use PascalCase for all table and column names (SQL Server standards)
 * Ignores custom and embedded names; typeorm entities in this application should use only
 * class / property names to define db schema names.
 */
export class PascalCaseNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return camelToUpper(
      super.columnName(propertyName, customName, embeddedPrefixes)
    );
  }

  tableName(targetName: string): string {
    return camelToUpper(targetName);
  }

  relationName(propertyName: string): string {
    return camelToUpper(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return camelToUpper(
      super.joinColumnName(relationName, referencedColumnName)
    );
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string
  ): string {
    return camelToUpper(
      super.joinTableName(
        firstTableName,
        secondTableName,
        firstPropertyName,
        secondPropertyName
      )
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return camelToUpper(
      super.joinTableColumnName(tableName, propertyName, columnName)
    );
  }

  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return camelToUpper(
      super.joinTableInverseColumnName(tableName, propertyName, columnName)
    );
  }
}

module.exports = { PascalCaseNamingStrategy };
