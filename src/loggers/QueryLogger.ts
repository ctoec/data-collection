import { AdvancedConsoleLogger, QueryRunner, Logger } from 'typeorm';
import { isProdLike } from '../utils/isProdLike';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export class QueryLogger extends AdvancedConsoleLogger implements Logger {
  constructor(options?: LoggerOptions) {
    super(options);
  }
  redactParams(parameters?: any[]) {
    return isProdLike() ? ['redacted'] : parameters;
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    super.logQuery(query, this.redactParams(parameters), queryRunner);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    super.logQueryError(
      error,
      query,
      this.redactParams(parameters),
      queryRunner
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    super.logQuerySlow(time, query, this.redactParams(parameters), queryRunner);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    super.logSchemaBuild(message, queryRunner);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    super.logMigration(message, queryRunner);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    super.log(level, message, queryRunner);
  }
}
