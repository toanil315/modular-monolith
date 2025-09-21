import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { Event } from '../../domain/events/event';
import { EventRepository } from '../../domain/events/event.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';

@Injectable()
export class EventRepositoryImpl
  extends BaseRepository<Event, EventTypeOrmEntity>
  implements EventRepository
{
  constructor(
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(dataSource, EventTypeOrmEntity, domainEventPublisher);
  }

  async getById(eventId: string): Promise<Event | null> {
    const eventEntity = await this.ormRepo.findOne({
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
    await this.persist(event, {
      id: event.id,
      categoryId: event.categoryId,
      title: event.title,
      status: event.status,
      description: event.description,
      location: event.location,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
    });
  }
}

export const EVENT_REPOSITORY_TOKEN = 'EVENT_REPOSITORY_TOKEN';

export const EventRepositoryProvider: Provider = {
  provide: 'EVENT_REPOSITORY_TOKEN',
  useFactory: (
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ): EventRepository =>
    new EventRepositoryImpl(dataSource, domainEventPublisher),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME), DomainEventPublisher],
};
