import { ConnectionManager } from 'typeorm';
import { DatabaseSession } from './database-session';
import { composeDatabaseSessionProviderName } from '../inject-decorators';
import { TypeOrmDatabaseSession } from './type-orm.database-session';
import { get, set } from '../storage/storage';
import { DatabaseSessionManager } from './database-session.manager';
import { ConnectionNotEstablishedException } from '../exceptions/connection-not-established.exception';

export class AsyncStorageDatabaseSessionManager
  implements DatabaseSessionManager {
  constructor(private readonly connectionManager: ConnectionManager) {}

  initDatabaseSession(): void {
    if (!this.connectionManager.connections.length) {
      throw new ConnectionNotEstablishedException();
    }

    this.connectionManager.connections.forEach((connection) => {
      set(
        composeDatabaseSessionProviderName(connection.name),
        new TypeOrmDatabaseSession(connection),
      );
    });
  }

  /**
   * Getting instance of DatabaseSession class with given database connection
   * If you do not provide a parameter, you will use the DatabaseSession instance for the "default" database connection
   * @param connectionName
   */
  getDatabaseSession(connectionName?: string): DatabaseSession {
    return get(composeDatabaseSessionProviderName(connectionName));
  }
}
