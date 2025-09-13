import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

import { EVENTS_CONNECTION_NAME } from 'src/modules/events/infrastructure/database/datasource';
import { EventStatus } from 'src/modules/events/domain/events/event-status';
import { Event } from 'src/modules/events/domain/events/event';
import { SearchEventsQuery } from './search-event.query';

interface EventResponse {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  startsAt: number;
  endsAt: number;
}

@QueryHandler(SearchEventsQuery)
export class SearchEventsQueryHandler
  implements IQueryHandler<SearchEventsQuery>
{
  constructor(
    @Inject(getDataSourceToken(EVENTS_CONNECTION_NAME))
    private readonly dataSource: DataSource,
  ) {}

  async execute({ props }: SearchEventsQuery) {
    const parameters = {
      status: EventStatus.Published,
      categoryId: props.categoryId ?? null,
      startsAt: props.startsAt ?? null,
      endsAt: props.endsAt ?? null,
      take: props.size,
      skip: (props.page - 1) * props.size,
    };

    const events = await this.getEvents(parameters);
    const totalCount = await this.countEvents(parameters);

    return {
      page: props.page,
      size: props.size,
      totalCount,
      records: events.map(
        (e) =>
          new Event(
            e.id,
            e.categoryId,
            e.title,
            e.description,
            e.location,
            EventStatus.Published,
            e.startsAt,
            e.endsAt,
            [],
          ),
      ),
    };
  }

  private async getEvents(parameters: {
    status: number;
    categoryId: string | null;
    startsAt: number | null;
    endsAt: number | null;
    take: number;
    skip: number;
  }): Promise<EventResponse[]> {
    const sql = `
      SELECT
        e.id AS "id",
        e.category_id AS "categoryId",
        e.title AS "title",
        e.description AS "description",
        e.location AS "location",
        e.starts_at AS "startsAt",
        e.ends_at AS "endsAt"
      FROM events.events e
      WHERE
        e.status = $1 AND
        ($2::uuid IS NULL OR e.category_id = $2) AND
        ($3::bigint IS NULL OR e.starts_at >= $3) AND
        ($4::bigint IS NULL OR e.ends_at <= $4)
      ORDER BY e.starts_at
      OFFSET $5
      LIMIT $6
    `;

    return this.dataSource.query<EventResponse[]>(sql, [
      parameters.status,
      parameters.categoryId,
      parameters.startsAt,
      parameters.endsAt,
      parameters.skip,
      parameters.take,
    ]);
  }

  private async countEvents(parameters: {
    status: number;
    categoryId: string | null;
    startsAt: number | null;
    endsAt: number | null;
  }): Promise<number> {
    const sql = `
      SELECT COUNT(e.id) AS count
      FROM events.events e
      WHERE
        e.status = $1 AND
        ($2::uuid IS NULL OR e.category_id = $2) AND
        ($3::bigint IS NULL OR e.starts_at >= $3) AND
        ($4::bigint IS NULL OR e.ends_at <= $4)
    `;

    const result = await this.dataSource.query<{ count: string }[]>(sql, [
      parameters.status,
      parameters.categoryId,
      parameters.startsAt,
      parameters.endsAt,
    ]);

    return parseInt(result[0].count, 10);
  }
}
