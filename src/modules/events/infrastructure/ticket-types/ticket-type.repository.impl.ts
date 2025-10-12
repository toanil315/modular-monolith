import { Inject, Injectable, Provider } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeRepository } from '../../domain/ticket-types/ticket-type.repository';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  OUTBOX_PERSISTENCE_HANDLER_TOKEN,
  OutboxPersistenceHandler,
} from 'src/modules/common/application/messagings/outbox-persistence.handler';

@Injectable()
export class TicketTypeRepositoryImpl extends BaseRepository implements TicketTypeRepository {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Inject(OUTBOX_PERSISTENCE_HANDLER_TOKEN)
    outboxPersistenceHandler: OutboxPersistenceHandler,
  ) {
    super(manager, outboxPersistenceHandler);
  }

  async getById(ticketTypeId: string): Promise<TicketType | null> {
    const entity = await this.manager.findOne(TicketTypeOrmEntity, {
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
    await this.manager.transaction(async (manager) => {
      await manager.save(TicketTypeOrmEntity, {
        id: ticketType.id,
        eventId: ticketType.eventId,
        name: ticketType.name,
        price: ticketType.price,
        currency: ticketType.currency,
        quantity: ticketType.quantity,
      });
      await this.outboxPersistenceHandler.save(ticketType, manager);
    });
  }
}

export const TICKET_TYPE_REPOSITORY_TOKEN = 'TICKET_TYPE_REPOSITORY_TOKEN';

export const TicketTypeRepositoryProvider: Provider = {
  provide: TICKET_TYPE_REPOSITORY_TOKEN,
  useClass: TicketTypeRepositoryImpl,
};
