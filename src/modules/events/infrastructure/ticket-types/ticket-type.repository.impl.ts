import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeRepository } from '../../domain/ticket-types/ticket-type.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { BaseRepository } from 'src/modules/common/infrastructure/database/base-repository.impl';
import { DomainEventPublisher } from 'src/modules/common/infrastructure/domain-event/domain-event.publisher';

@Injectable()
export class TicketTypeRepositoryImpl
  extends BaseRepository<TicketType, TicketTypeOrmEntity>
  implements TicketTypeRepository
{
  constructor(
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ) {
    super(dataSource, TicketTypeOrmEntity, domainEventPublisher);
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
  useFactory: (
    dataSource: DataSource,
    domainEventPublisher: DomainEventPublisher,
  ): TicketTypeRepository =>
    new TicketTypeRepositoryImpl(dataSource, domainEventPublisher),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME), DomainEventPublisher],
};
