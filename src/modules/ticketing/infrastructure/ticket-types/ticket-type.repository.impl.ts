import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeTypeOrmEntity } from './ticket-type.entity';
import {
  TICKET_TYPE_REPOSITORY_TOKEN,
  TicketTypeRepository,
} from '../../domain/ticket-types/ticket-type.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
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

  async getById(TicketTypeId: string): Promise<TicketType | null> {
    const TicketTypeEntity = await this.manager.findOne(TicketTypeTypeOrmEntity, {
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
    const TicketTypeEntity = await this.manager.findOne(TicketTypeTypeOrmEntity, {
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

  async save(ticketType: TicketType): Promise<void> {
    await this.manager.transaction(async (manager) => {
      await this.manager.save(TicketTypeTypeOrmEntity, {
        id: ticketType.id,
        currency: ticketType.currency,
        eventId: ticketType.eventId,
        name: ticketType.name,
        price: ticketType.price,
        quantity: ticketType.quantity,
        availableQuantity: ticketType.availableQuantity,
      });
      await this.outboxPersistenceHandler.save(ticketType, manager);
    });
  }
}

export const TicketTypeRepositoryProvider: Provider = {
  provide: TICKET_TYPE_REPOSITORY_TOKEN,
  useClass: TicketTypeRepositoryImpl,
};
