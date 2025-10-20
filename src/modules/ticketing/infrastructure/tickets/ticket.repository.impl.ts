import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { Ticket } from '../../domain/tickets/ticket';
import { TicketTypeOrmEntity } from './ticket.entity';
import { TICKET_REPOSITORY_TOKEN, TicketRepository } from '../../domain/tickets/ticket.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class TicketRepositoryImpl extends BaseRepository implements TicketRepository {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    private readonly outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new TicketRepositoryImpl(manager, this.outboxPersistenceHandler) as this;
  }

  async getByIdOrCode(identifier: string): Promise<Ticket | null> {
    const ticketEntity = await this.manager.findOne(TicketTypeOrmEntity, {
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
    const ticketEntity = await this.manager.findOne(TicketTypeOrmEntity, {
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
    await this.manager.transaction(async (manager) => {
      await this.manager.save(TicketTypeOrmEntity, {
        id: ticket.id,
        archived: ticket.archived,
        code: ticket.code,
        createdAt: ticket.createdAt,
        customerId: ticket.customerId,
        eventId: ticket.eventId,
        orderId: ticket.orderId,
        ticketTypeId: ticket.ticketTypeId,
      });
      await this.outboxPersistenceHandler.save(ticket, manager);
    });
  }
}

export const TicketRepositoryProvider: Provider = {
  provide: TICKET_REPOSITORY_TOKEN,
  useClass: TicketRepositoryImpl,
};
