import { Inject, Injectable, Provider } from '@nestjs/common';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { TicketInventory } from '../../domain/ticket-inventory/ticket-inventory';
import { TicketInventoryTypeOrmEntity } from './ticket-inventory.entity';
import {
  TICKET_INVENTORY_REPOSITORY_TOKEN,
  TicketInventoryRepository,
} from '../../domain/ticket-inventory/ticket-inventory.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from 'src/modules/common/application/domain-event/domain-event.publisher';

@Injectable()
export class TicketInventoryRepositoryImpl
  extends BaseRepository<TicketInventory, TicketInventoryTypeOrmEntity>
  implements TicketInventoryRepository
{
  constructor(
    @InjectRepository(TicketInventoryTypeOrmEntity)
    ormRepo: Repository<TicketInventoryTypeOrmEntity>,
    @Inject(DOMAIN_EVENT_PUBLISHER_TOKEN)
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(ormRepo, domainEventPublisher);
  }

  async getById(ticketInventoryId: string): Promise<TicketInventory | null> {
    const ticketInventoryEntity = await this.ormRepo.findOne({
      where: { id: ticketInventoryId },
    });

    if (!ticketInventoryEntity) {
      return null;
    }

    return new TicketInventory(
      ticketInventoryEntity.id,
      ticketInventoryEntity.quantity,
      ticketInventoryEntity.availableQuantity,
    );
  }

  async save(ticketInventory: TicketInventory): Promise<void> {
    await this.persist(ticketInventory, {
      id: ticketInventory.id,
      quantity: ticketInventory.quantity,
      availableQuantity: ticketInventory.availableQuantity,
    });
  }
}

export const TicketInventoryRepositoryProvider: Provider = {
  provide: TICKET_INVENTORY_REPOSITORY_TOKEN,
  useClass: TicketInventoryRepositoryImpl,
};
