import { Injectable, Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { Event } from '../../domain/events/event';
import { EventRepository } from '../../domain/events/event.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventRepositoryImpl
  extends BaseRepository<Event, EventTypeOrmEntity>
  implements EventRepository
{
  constructor(
    @InjectRepository(EventTypeOrmEntity)
    ormRepo: Repository<EventTypeOrmEntity>,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
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
  useClass: EventRepositoryImpl,
};
