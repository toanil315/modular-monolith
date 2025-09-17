import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventQuery } from './get-event.query';
import { EventErrors } from 'src/modules/events/domain/events/event.exception';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from 'src/modules/events/infrastructure/database/datasource';
import { DataSource } from 'typeorm';
import { Event } from 'src/modules/events/domain/events/event';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

@QueryHandler(GetEventQuery)
export class GetEventQueryHandler implements IQueryHandler<GetEventQuery> {
  constructor(
    @Inject(getDataSourceToken(EVENTS_CONNECTION_NAME))
    private readonly dataSource: DataSource,
  ) {}

  async execute({ props }: GetEventQuery) {
    const rawEntities = await this.dataSource.query<
      {
        id: string;
        categoryId: string;
        title: string;
        description: string;
        status: number;
        location: string;
        startsAt: string;
        endsAt: string;
        ticketTypeId: string;
        name: string;
        price: string;
        currency: string;
        quantity: number;
      }[]
    >(
      `
          SELECT
            e.id,
            e.category_id AS "categoryId",
            e.title,
            e.description,
            e.status,
            e.location,
            e.starts_at AS "startsAt",
            e.ends_at AS "endsAt",
            tt.id AS "ticketTypeId",
            tt.name,
            tt.price,
            tt.currency,
            tt.quantity
        FROM events.events e
        LEFT JOIN events.ticket_types tt ON tt.event_id = e.id
        WHERE e.id = $1
      `,
      [props.eventId],
    );

    if (!rawEntities.length) {
      throw new EventErrors.EventNotFoundError(props.eventId);
    }

    const eventMap = new Map<string, Event>();
    rawEntities.forEach((entity) => {
      if (eventMap.has(entity.id)) {
        eventMap
          .get(entity.id)
          ?.ticketTypes.push(
            new TicketType(
              entity.ticketTypeId,
              entity.id,
              entity.name,
              parseFloat(entity.price),
              entity.currency,
              entity.quantity,
            ),
          );
      } else {
        eventMap.set(
          entity.id,
          new Event(
            entity.id,
            entity.categoryId,
            entity.title,
            entity.description,
            entity.location,
            entity.status,
            Number(entity.startsAt),
            Number(entity.endsAt),
            [
              new TicketType(
                entity.ticketTypeId,
                entity.id,
                entity.name,
                parseFloat(entity.price),
                entity.currency,
                entity.quantity,
              ),
            ],
          ),
        );
      }
    });

    return eventMap.get(props.eventId)!;
  }
}
