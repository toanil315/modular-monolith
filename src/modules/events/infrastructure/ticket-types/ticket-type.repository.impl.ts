import { Injectable, Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeRepository } from '../../domain/ticket-types/ticket-type.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketTypeRepositoryImpl
  extends BaseRepository<TicketType, TicketTypeOrmEntity>
  implements TicketTypeRepository
{
  constructor(
    @InjectRepository(TicketTypeOrmEntity)
    ormRepo: Repository<TicketTypeOrmEntity>,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getById(ticketTypeId: string): Promise<TicketType | null> {
    const entity = await this.ormRepo.findOne({
      where: { id: ticketTypeId },
    });

    if (!entity) {
      return null;
    }

    return new TicketType(
      entity.id,
      entity.eventId,
      entity.name,
      entity.price,
      entity.currency,
      entity.quantity,
    );
  }

  async save(ticketType: TicketType): Promise<void> {
    await this.persist(ticketType, {
      id: ticketType.id,
      eventId: ticketType.eventId,
      name: ticketType.name,
      price: ticketType.price,
      currency: ticketType.currency,
      quantity: ticketType.quantity,
    });
  }
}

export const TICKET_TYPE_REPOSITORY_TOKEN = 'TICKET_TYPE_REPOSITORY_TOKEN';

export const TicketTypeRepositoryProvider: Provider = {
  provide: TICKET_TYPE_REPOSITORY_TOKEN,
  useClass: TicketTypeRepositoryImpl,
};
