import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncStorageDatabaseSessionManager } from './database/async-storage-database-session.manager';
import { InjectDatabaseSessionManager } from './inject-decorators';
import { Request, Response } from 'express';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(
    @InjectDatabaseSessionManager()
    private readonly databaseSessionManager: AsyncStorageDatabaseSessionManager,
  ) {}

  use(req: Request, res: Response, next: () => void): any {
    this.databaseSessionManager.initDatabaseSession();
    next();
  }
}
