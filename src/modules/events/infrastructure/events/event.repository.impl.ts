import { Inject, Injectable, Provider } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Event } from '../../domain/events/event';
import { EventRepository } from '../../domain/events/event.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';
import { EventTypeOrmEntity } from './event.entity';

@Injectable()
export class EventRepositoryImpl extends BaseRepository implements EventRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new EventRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getById(eventId: string): Promise<Event | null> {
    const eventEntity = await this.manager.findOne(EventTypeOrmEntity, {
      where: { id: eventId },
    });

    if (!eventEntity) {
      return null;
    }

    return new Event(
      eventEntity.id,
      eventEntity.categoryId,
      eventEntity.title,
      eventEntity.description,
      eventEntity.location,
      eventEntity.status,
      eventEntity.startsAt,
      eventEntity.endsAt,
    );
  }

  async save(event: Event): Promise<void> {
    await this.manager.transaction(async (manager) => {
      await manager.save(EventTypeOrmEntity, {
        id: event.id,
        categoryId: event.categoryId,
        title: event.title,
        status: event.status,
        description: event.description,
        location: event.location,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
      });
      await this.outboxPersistenceHandler.save(event, manager);
    });
  }
}

export const EVENT_REPOSITORY_TOKEN = 'EVENT_REPOSITORY_TOKEN';

export const EventRepositoryProvider: Provider = {
  provide: 'EVENT_REPOSITORY_TOKEN',
  useClass: EventRepositoryImpl,
};
