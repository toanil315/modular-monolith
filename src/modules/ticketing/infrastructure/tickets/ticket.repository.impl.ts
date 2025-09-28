import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { Ticket } from '../../domain/tickets/ticket';
import { TicketTypeOrmEntity } from './ticket.entity';
import { TICKET_REPOSITORY_TOKEN, TicketRepository } from '../../domain/tickets/ticket.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from 'src/modules/common/application/domain-event/domain-event.publisher';

@Injectable()
export class TicketRepositoryImpl
  extends BaseRepository<Ticket, TicketTypeOrmEntity>
  implements TicketRepository
{
  constructor(
    @InjectRepository(TicketTypeOrmEntity)
    ormRepo: Repository<TicketTypeOrmEntity>,
    @Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getByIdOrCode(identifier: string): Promise<Ticket | null> {
    const ticketEntity = await this.ormRepo.findOne({
      where: [{ id: identifier }, { code: identifier }],
    });

    if (!ticketEntity) {
      return null;
    }

    return new Ticket(
      ticketEntity.id,
      ticketEntity.customerId,
      ticketEntity.orderId,
      ticketEntity.eventId,
      ticketEntity.ticketTypeId,
      ticketEntity.code,
      ticketEntity.createdAt,
      ticketEntity.archived,
    );
  }

  async getForEvent(eventId: string): Promise<Ticket | null> {
    const ticketEntity = await this.ormRepo.findOne({
      where: { eventId },
    });

    if (!ticketEntity) {
      return null;
    }

    return new Ticket(
      ticketEntity.id,
      ticketEntity.customerId,
      ticketEntity.orderId,
      ticketEntity.eventId,
      ticketEntity.ticketTypeId,
      ticketEntity.code,
      ticketEntity.createdAt,
      ticketEntity.archived,
    );
  }

  async save(ticket: Ticket): Promise<void> {
    await this.persist(ticket, {
      id: ticket.id,
      archived: ticket.archived,
      code: ticket.code,
      createdAt: ticket.createdAt,
      customerId: ticket.customerId,
      eventId: ticket.eventId,
      orderId: ticket.orderId,
      ticketTypeId: ticket.ticketTypeId,
    });
  }
}

export const TicketRepositoryProvider: Provider = {
  provide: TICKET_REPOSITORY_TOKEN,
  useClass: TicketRepositoryImpl,
};
