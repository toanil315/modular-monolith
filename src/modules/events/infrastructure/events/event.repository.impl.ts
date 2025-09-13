import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { Event } from '../../domain/events/event';
import { EventRepository } from '../../domain/events/event.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  private readonly ormRepo: Repository<EventTypeOrmEntity>;

  constructor(dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(EventTypeOrmEntity);
  }

  async insert(event: Event): Promise<void> {
    const newEvent = this.ormRepo.create({
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      location: event.location,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
    });

    await this.ormRepo.save(newEvent);
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
      eventEntity.title,
      eventEntity.description,
      eventEntity.location,
      eventEntity.status,
      eventEntity.startsAt,
      eventEntity.endsAt,
    );
  }
}

export const EVENT_REPOSITORY_TOKEN = 'EVENT_REPOSITORY_TOKEN';

export const EventRepositoryProvider: Provider = {
  provide: 'EVENT_REPOSITORY_TOKEN',
  useFactory: (dataSource: DataSource): EventRepository =>
    new EventRepositoryImpl(dataSource),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME)],
};
