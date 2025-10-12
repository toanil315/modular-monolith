import { EntityManager } from 'typeorm';
import { OutboxPersistenceHandler } from '../../application/messagings/outbox-persistence.handler';

export abstract class BaseRepository {
  constructor(
    protected readonly manager: EntityManager,
    protected readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {}

  /**
   * Creates a new instance of this repository bound to the given transaction manager.
   */
  withManager(manager: EntityManager): this {
    const ctor = this.constructor as new (
      manager: EntityManager,
      outboxPersistenceHandler: OutboxPersistenceHandler,
    ) => this;

    return new ctor(manager, this.outboxPersistenceHandler);
  }
}
