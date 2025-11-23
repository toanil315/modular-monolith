import { Inject, Injectable } from '@nestjs/common';
import { Entity } from '../../domain/entity';
import { EntityManager } from 'typeorm';
import { OutboxMessageTypeOrmEntity } from './base-outbox-message.entity';
import { OutboxPersistenceHandler } from '../../application/messagings/outbox-persistence.handler';
import { OUTBOX_CONFIG_TOKEN, OutboxConfig } from './outbox.config';
import { context, propagation } from '@opentelemetry/api';

@Injectable()
export class OutboxPersistenceHandlerImpl implements OutboxPersistenceHandler {
  constructor(
    @Inject(OUTBOX_CONFIG_TOKEN)
    private readonly config: OutboxConfig,
  ) {}

  async save(entity: Entity, entityManager: EntityManager): Promise<void> {
    const otelContext = {};
    propagation.inject(context.active(), otelContext);

    const outboxMessages = entity.domainEvents.map<Partial<OutboxMessageTypeOrmEntity>>(
      (event) => ({
        id: event.id,
        content: JSON.stringify(event),
        type: event.type,
        createdAt: new Date(event.occurredOn),
        otelContext: JSON.stringify(otelContext),
      }),
    );

    await entityManager.save(this.config.entity, outboxMessages);
    entity.clear();
  }

  async saveBatch(entities: Entity[], entityManager: EntityManager): Promise<void> {
    const otelContext = {};
    propagation.inject(context.active(), otelContext);

    const outboxMessages = entities.flatMap((entity) => {
      return entity.domainEvents.map<Partial<OutboxMessageTypeOrmEntity>>((event) => ({
        id: event.id,
        content: JSON.stringify(event),
        type: event.type,
        createdAt: new Date(event.occurredOn),
        otelContext: JSON.stringify(otelContext),
      }));
    });

    entityManager.save(this.config.entity, outboxMessages);
    entities.forEach((entity) => {
      entity.clear();
    });
  }
}
