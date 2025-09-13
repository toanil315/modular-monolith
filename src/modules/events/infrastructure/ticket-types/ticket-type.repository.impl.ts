import { Injectable, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeRepository } from '../../domain/ticket-types/ticket-type.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';

@Injectable()
export class TicketTypeRepositoryImpl implements TicketTypeRepository {
  private readonly ormRepo: Repository<TicketTypeOrmEntity>;

  constructor(dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(TicketTypeOrmEntity);
  }

  async insert(ticketType: TicketType): Promise<void> {
    const newTicketType = this.ormRepo.create({
      id: ticketType.id,
      eventId: ticketType.eventId,
      name: ticketType.name,
      price: ticketType.price,
      currency: ticketType.currency,
      quantity: ticketType.quantity,
    });

    await this.ormRepo.save(newTicketType);
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
    await this.ormRepo.save({
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
  useFactory: (dataSource: DataSource): TicketTypeRepository =>
    new TicketTypeRepositoryImpl(dataSource),
  inject: [getDataSourceToken(EVENTS_CONNECTION_NAME)],
};
