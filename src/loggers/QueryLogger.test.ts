import { QueryLogger } from './QueryLogger';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

jest.mock('../utils/isProdLike');
import * as util from '../utils/isProdLike';
const utilMock = util as jest.Mocked<typeof util>;

jest.mock('typeorm/platform/PlatformTools');
import { PlatformTools } from 'typeorm/platform/PlatformTools';

describe('QueryLogger', () => {
  beforeAll(() => utilMock.isProdLike.mockReturnValue(true));
  it('redacts parameters in prod-like environments when logging queries', () => {
    const logger = new QueryLogger('all' as LoggerOptions);
    const params = [1, 2, 3];
    const redacted = logger.redactParams(params);

    let log;
    PlatformTools.highlightSql = (sql) => sql;
    PlatformTools.logInfo = (_, sql) => {
      log = sql;
    };
    logger.logQuery('query', params);
    expect(log).toContain(redacted.toString());
    expect(log).not.toContain(params.toString());
  });
  it('redacts parameters in prod-like environments when logging errors', () => {
    const logger = new QueryLogger('all' as LoggerOptions);
    const params = [1, 2, 3];
    const redacted = logger.redactParams(params);

    let log;
    PlatformTools.highlightSql = (sql) => sql;
    PlatformTools.logError = (prefix, sql) => {
      if (prefix.includes('query failed')) log = sql;
    };

    logger.logQueryError('error', 'query', params);
    expect(log).toContain(redacted.toString());
    expect(log).not.toContain(params.toString());
  });
  afterAll(() => jest.resetAllMocks());
});
