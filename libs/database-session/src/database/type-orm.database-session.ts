import { DatabaseSession } from './database-session';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { TransactionAlreadyStartedException } from '../exceptions/transaction-already-started.exception';

export class TypeOrmDatabaseSession implements DatabaseSession {
  private isTransactionBegan: boolean;
  private readonly queryRunner: QueryRunner;

  constructor(private readonly dbConnection: Connection) {
    this.queryRunner = this.dbConnection.createQueryRunner();
  }

  async transactionStart(): Promise<void> {
    if (this.isTransactionBegan) {
      throw new TransactionAlreadyStartedException();
    }
    this.isTransactionBegan = true;
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async transactionCommit(): Promise<void> {
    try {
      await this.queryRunner.commitTransaction();
      this.isTransactionBegan = false;
    } catch (e) {
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  async transactionRollback(): Promise<void> {
    try {
      await this.queryRunner.rollbackTransaction();
      this.isTransactionBegan = false;
    } catch (e) {
      throw e;
    } finally {
      await this.queryRunner.release();
    }
  }

  getQueryRunner(): QueryRunner {
    return this.queryRunner;
  }

  getRepository<TEntity>(entity: EntityTarget<TEntity>): Repository<TEntity> {
    return this.getEntityManager().getRepository(entity);
  }

  private getEntityManager(): EntityManager {
    return this.isTransactionBegan
      ? this.queryRunner.manager
      : this.dbConnection.createEntityManager();
  }
}
