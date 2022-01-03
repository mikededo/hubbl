import * as log from 'npmlog';
import { Logger } from 'typeorm';

export class DatabaseLogger implements Logger {
  logQuery(query: string, parameters?: any[]) {
    log.info('Database[Query]', query, parameters);
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    log.error('Database[Query]', error.toString(), query, parameters);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    log.warn('Database[Query]', `Slow query (${time}ms)`, query, parameters);
  }

  logSchemaBuild(message: string) {
    log.info('Database[Schema]', message);
  }

  logMigration(message: string) {
    log.info('Database[Migration]', message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    log.log(level, 'Database', message);
  }
}
