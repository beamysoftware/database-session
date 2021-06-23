import { DatabaseSession } from './database-session';

export interface DatabaseSessionManager {
  getDatabaseSession(connectionName?: string): DatabaseSession;
}
