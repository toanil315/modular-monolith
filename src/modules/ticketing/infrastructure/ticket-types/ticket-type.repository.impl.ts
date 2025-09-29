import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeTypeOrmEntity } from './ticket-type.entity';
import {
  TICKET_TYPE_REPOSITORY_TOKEN,
  TicketTypeRepository,
} from '../../domain/ticket-types/ticket-type.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from 'src/modules/common/application/domain-event/domain-event.publisher';

@Injectable()
export class TicketTypeRepositoryImpl
  extends BaseRepository<TicketType, TicketTypeTypeOrmEntity>
  implements TicketTypeRepository
{
  constructor(
    @InjectRepository(TicketTypeTypeOrmEntity)
    ormRepo: Repository<TicketTypeTypeOrmEntity>,
    @Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getById(TicketTypeId: string): Promise<TicketType | null> {
    const TicketTypeEntity = await this.ormRepo.findOne({
      where: { id: TicketTypeId },
    });

    if (!TicketTypeEntity) {
      return null;
    }

    return new TicketType(
      TicketTypeEntity.id,
      TicketTypeEntity.eventId,
      TicketTypeEntity.name,
      TicketTypeEntity.price,
      TicketTypeEntity.currency,
      TicketTypeEntity.quantity,
      TicketTypeEntity.availableQuantity,
    );
  }

  async getWithLock(ticketTypeId: string): Promise<TicketType | null> {
    const TicketTypeEntity = await this.ormRepo.findOne({
      where: { id: ticketTypeId },
      lock: {
        mode: 'pessimistic_write',
        onLocked: 'nowait',
      },
    });

    if (!TicketTypeEntity) {
      return null;
    }

    return new TicketType(
      TicketTypeEntity.id,
      TicketTypeEntity.eventId,
      TicketTypeEntity.name,
      TicketTypeEntity.price,
      TicketTypeEntity.currency,
      TicketTypeEntity.quantity,
      TicketTypeEntity.availableQuantity,
    );
  }

  async save(TicketType: TicketType): Promise<void> {
    await this.persist(TicketType, {
      id: TicketType.id,
      currency: TicketType.currency,
      eventId: TicketType.eventId,
      name: TicketType.name,
      price: TicketType.price,
      quantity: TicketType.quantity,
      availableQuantity: TicketType.availableQuantity,
    });
  }
}

export const TicketTypeRepositoryProvider: Provider = {
  provide: TICKET_TYPE_REPOSITORY_TOKEN,
  useClass: TicketTypeRepositoryImpl,
};
