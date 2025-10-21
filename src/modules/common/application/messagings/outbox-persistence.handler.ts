import { EntityManager } from 'typeorm';
import { Entity } from '../../domain/entity';

export const OUTBOX_PERSISTENCE_HANDLER_TOKEN = 'OUTBOX_PERSISTENCE_HANDLER_TOKEN';

export interface OutboxPersistenceHandler {
  save: (entity: Entity, entityManager: EntityManager) => Promise<void>;
  saveBatch(entities: Entity[], entityManager: EntityManager): Promise<void>;
}
