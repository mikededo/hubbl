import { DatabaseLogger } from './db.logger';
import * as log from 'npmlog';

describe('DatabaseLogger', () => {
  let logger: DatabaseLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    logger = new DatabaseLogger();
  });

  describe('#logQuery', () => {
    it('should log a query', () => {
      const infoSpy = jest.spyOn(log, 'info').mockImplementation();

      logger.logQuery('Query', ['Parameters']);

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith('Database[Query]', 'Query', [
        'Parameters'
      ]);
    });
  });

  describe('#logQueryError', () => {
    it('should log a query error', () => {
      const errorSpy = jest.spyOn(log, 'error').mockImplementation();

      logger.logQueryError('Error', 'Query', ['Parameters']);

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'Database[Query]',
        'Error',
        'Query',
        ['Parameters']
      );
    });
  });

  describe('#logQuerySlow', () => {
    it('should log a slow query', () => {
      const infoSpy = jest.spyOn(log, 'warn').mockImplementation();

      logger.logQuerySlow(1000, 'Query', ['Parameters']);

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith(
        'Database[Query]',
        `Slow query (${1000}ms)`,
        'Query',
        ['Parameters']
      );
    });
  });

  describe('#logSchemaBuild', () => {
    it('should log a schema build', () => {
      const infoSpy = jest.spyOn(log, 'info').mockImplementation();

      logger.logSchemaBuild('Schema');

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith('Database[Schema]', 'Schema');
    });
  });

  describe('#logMigration', () => {
    it('should log a migration', () => {
      const infoSpy = jest.spyOn(log, 'info').mockImplementation();

      logger.logMigration('Migration');

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith('Database[Migration]', 'Migration');
    });
  });

  describe('#log', () => {
    it('should log a query', () => {
      const infoSpy = jest.spyOn(log, 'log').mockImplementation();

      logger.log('Level' as any, 'Message');

      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledWith('Level', 'Database', 'Message');
    });
  });
});
