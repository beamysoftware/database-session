import { AsyncStorageDatabaseSessionManager } from './database/async-storage-database-session.manager';
import { Request, Response } from 'express';

export function TransactionMiddleware(
  databaseSessionManager: AsyncStorageDatabaseSessionManager,
): (req: Request, res: Response, next: () => void) => void {
  return (req: Request, res: Response, next: () => void) => {
    databaseSessionManager.initDatabaseSession();
    next();
  };
}
