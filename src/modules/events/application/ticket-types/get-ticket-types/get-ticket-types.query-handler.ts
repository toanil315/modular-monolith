import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketTypesQuery } from './get-ticket-types.query';
import { Inject } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from 'src/modules/events/infrastructure/database/datasource';
import { DataSource } from 'typeorm';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';
import { Result } from 'src/modules/common/domain/result';

@QueryHandler(GetTicketTypesQuery)
export class GetTicketTypesQueryHandler
  implements IQueryHandler<GetTicketTypesQuery>
{
  constructor(
    @Inject(getDataSourceToken(EVENTS_CONNECTION_NAME))
    private readonly dataSource: DataSource,
  ) {}

  async execute({ props }: GetTicketTypesQuery) {
    const rawEntities = await this.dataSource.query<
      {
        id: string;
        eventId: string;
        name: string;
        price: number;
        currency: string;
        quantity: number;
      }[]
    >(
      `
            SELECT
                id,
                event_id AS "eventId",
                name,
                price,
                currency,
                quantity
            FROM events.ticket_types
            WHERE event_id = $1
        `,
      [props.eventId],
    );

    return Result.success(
      rawEntities.map(
        (record) =>
          new TicketType(
            record.id,
            record.eventId,
            record.name,
            record.price,
            record.currency,
            record.quantity,
          ),
      ),
    );
  }
}
