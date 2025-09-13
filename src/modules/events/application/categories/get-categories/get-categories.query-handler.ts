import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './get-categories.query';
import { Inject } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EVENTS_CONNECTION_NAME } from 'src/modules/events/infrastructure/database/datasource';
import { DataSource } from 'typeorm';
import { Category } from 'src/modules/events/domain/categories/category';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler
  implements IQueryHandler<GetCategoriesQuery>
{
  constructor(
    @Inject(getDataSourceToken(EVENTS_CONNECTION_NAME))
    private readonly dataSource: DataSource,
  ) {}

  async execute(query: GetCategoriesQuery): Promise<Category[]> {
    const rawEntities = await this.dataSource.query<
      { id: string; name: string; isArchived: boolean }[]
    >(`
        SELECT
            id,
            name,
            is_archived AS "isArchived"
        FROM events.categories
    `);

    return rawEntities.map(
      (record) => new Category(record.id, record.name, record.isArchived),
    );
  }
}
